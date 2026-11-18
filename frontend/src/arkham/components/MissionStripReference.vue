<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { Scenario } from '@/arkham/types/Scenario'
import { useCardInfo, useEnglishCardInfo } from '@/arkham/composables/useCardNames'
import { plainText, textWeight } from '@/arkham/composables/useMissionStripPanels'
import { replaceText } from '@/arkham/cardTextFormat'
import { REFERENCE_TEXT_VI } from '@/arkham/referenceCardTextVi'
import { localizedScenarioName } from '@/arkham/scenarioNames'
import ChaosTokenIcon from '@/arkham/components/ChaosTokenIcon.vue'
import MissionStripPanel from '@/arkham/components/MissionStripPanel.vue'
import { autoFailsNow, formatModifier, parseReferenceTokenLine, referenceXDetail, tokenBadge, type TokenBadge, type XDetail } from '@/arkham/referenceTokenX'
import TokenModifierBadge from '@/arkham/components/TokenModifierBadge.vue'
import { buildXContext } from '@/arkham/referenceTokenXContext'
import { useCardStore } from '@/stores/cards'

/* The scenario reference card on the mission strip: its chaos-token effects in the player's language,
 * the scenario's own counters, and (The Feast of Hemlock Vale) the day and time of day. */
const props = defineProps<{ game: Game; scenario: Scenario; referenceImage: string; playerId: string; compact?: boolean }>()

const { t, te, locale } = useI18n()
const cardInfo = useCardInfo()
const englishInfo = useEnglishCardInfo()
const cardStore = useCardStore()

/* The game state the X values on the card are counted from (see referenceTokenX.ts). */
const xContext = computed(() => buildXContext(props.game, props.scenario, props.playerId, cardStore.cards))

/* Hemlock Vale tracks a day and a time of day in the campaign meta (the source the campaign log reads). */
const dayTime = computed(() => {
  if (props.game.campaign?.id !== '10') return null
  const meta = props.game.campaign.meta as { day?: string; time?: string } | undefined
  const day = /^Day(\d+)$/.exec(meta?.day ?? '')?.[1]
  if (!day || !meta?.time) return null
  return { day, time: meta.time }
})

/* Counters the scenario keeps on its reference card (scraps, switches, targets ...), shown as chips. */
const counters = computed(() => [
  ...Object.entries(props.scenario.tokens ?? {}),
  ...Object.entries(props.scenario.counts ?? {}),
].filter(([, n]) => typeof n === 'number' && n > 0)
  .map(([name, n]) => ({ name, label: name.replace(/([a-z])([A-Z])/g, '$1 $2'), n: n as number })))

/* The image path ends in the card code, with a trailing `b` for the back / hard side; homebrew cards
 * live under homebrew/<set>/cards/<code>. */
const parsed = computed(() => {
  const hb = /homebrew\/([^/]+)\/cards\/([^/.]+?)(b?)\.[a-z0-9]+(?:\?.*)?$/i.exec(props.referenceImage)
  if (hb) return { code: `:${hb[1]}:${hb[2]}`, side: hb[3] }
  const m = /(\d{5})(b?)\.[a-z0-9]+(?:\?.*)?$/i.exec(props.referenceImage)
  return m ? { code: m[1], side: m[2] } : null
})

const cardCode = computed(() => parsed.value ? `${parsed.value.code}${parsed.value.side}` : props.scenario?.reference)

/* `short` is the printed leading modifier ("-X", "-2", "+1"). `badge` is what the token does right now:
 * the number with X filled in, or an automatic failure; `label` is that as text and `hint` says where it comes from. */
type TokenLine = {
  key: string; tokens: string[]; html: string; plain: string
  badge: TokenBadge; label: string; hint: string
}


function hintFor(x: XDetail | null, autoFail: boolean): string {
  if (autoFail) return t('locationMap.referenceX.poisoned')
  if (!x) return ''
  const value = t('locationMap.referenceX.value', { x: x.value })
  return x.raw !== x.value ? `${value} · ${t('locationMap.referenceX.capped', { raw: x.raw })}` : value
}
/* The token lines for the side that is showing. The Vietnamese card file still carries English for
 * these cards, so a bundled translation wins there. */
const info = computed<{ heading: string; lines: TokenLine[] } | null>(() => {
  if (!parsed.value) return null
  const { code, side } = parsed.value
  const key = side === 'b' ? 'back_text' : 'text'
  const own = cardInfo(code)?.[key] ?? ''
  const vi = locale.value === 'vi' && /^(Easy|Hard)/.test(own) ? REFERENCE_TEXT_VI[code]?.[key] : undefined
  const raw = (vi ?? own).split('\n').map((l) => l.trim()).filter(Boolean)
  if (!raw.length) return null
  /* X is read from the card's English text, token line by token line: a translated card file rewords the
   * sentence, so the English list is used whatever language is shown. */
  const englishText = englishInfo(code)?.[key] ?? own
  const english = englishText.split('\n').map((l) => parseReferenceTokenLine(l)?.effect).filter((l): l is string => l !== undefined)
  const lines: TokenLine[] = []
  let heading = ''
  for (const line of raw) {
    const tok = parseReferenceTokenLine(line)
    if (tok) {
      const plain = plainText(tok.effect)
      const short = /^([+\-−–]\s*(?:\d+|X))/i.exec(plain)?.[1].replace(/\s+/g, '').replace(/[−–]/, '-') ?? ''
      const englishLine = plainText(english[lines.length] ?? '')
      const x = referenceXDetail(englishLine, xContext.value)
      const autoFail = autoFailsNow(englishLine, xContext.value)
      const badge = tokenBadge(short, x, autoFail)
      const label = badge.tier === 'fail' ? t('locationMap.referenceX.autoFail')
        : badge.modifier !== null ? formatModifier(badge.modifier) : short
      /* The value column already shows the printed modifier ("-X.", "-2."), so the effect text starts after it. */
      const effect = short ? tok.effect.replace(/^\s*[+\-−–]\s*(?:\d+|X)\s*\.?\s*/i, '') : tok.effect
      lines.push({ key: `${code}-${lines.length}`, tokens: tok.tokens, html: replaceText(effect), plain, badge, label, hint: hintFor(x, autoFail) })
    }
    else if (!lines.length) heading = plainText(line)
  }
  if (locale.value === 'vi') {
    if (/^Easy\s*\/\s*Standard/i.test(heading)) heading = 'Dễ / Tiêu chuẩn'
    else if (/^Hard\s*\/\s*Expert/i.test(heading)) heading = 'Khó / Chuyên gia'
  }
  return { heading, lines }
})

/* A badge whose number just changed (a vengeance point scored, a location revealed) flashes once so the
 * change is noticed. The first render is quiet. */
const flashing = ref<Set<string>>(new Set())
const timers = new Map<string, ReturnType<typeof setTimeout>>()
watch(
  () => (info.value?.lines ?? []).map((l) => [l.key, l.label] as const),
  (now, before) => {
    if (!before) return
    const previous = new Map(before)
    for (const [key, label] of now) {
      if (!previous.has(key) || previous.get(key) === label) continue
      clearTimeout(timers.get(key))
      flashing.value = new Set([...flashing.value, key])
      timers.set(key, setTimeout(() => {
        flashing.value = new Set([...flashing.value].filter((k) => k !== key))
        timers.delete(key)
      }, 900))
    }
  },
)
onBeforeUnmount(() => timers.forEach((timer) => clearTimeout(timer)))

const weight = computed(() => textWeight(...(info.value?.lines.map((l) => l.html) ?? [])))

const eyebrow = computed(() => info.value?.heading ? `${t('locationMap.reference')} · ${info.value.heading}` : t('locationMap.reference'))

const cardTitle = computed(() => {
  const code = parsed.value?.code ?? props.scenario?.reference?.replace(/^c/, '')?.replace(/b$/, '')
  if (code) {
    const card = cardInfo(code)
    if (card?.name) return card.name
  }
  return localizedScenarioName(props.scenario.id, props.scenario.name?.title ?? '', t, te)
})
</script>

<template>
  <MissionStripPanel tone="reference" :eyebrow="eyebrow" :title="cardTitle" :image="referenceImage" :card-code="cardCode" portrait :compact="compact" :weight="weight">
    <template v-if="dayTime || counters.length || (compact && info?.lines.length)" #status>
      <span v-if="dayTime" class="chip chip--day" :title="t('locationMap.dayCount', { count: dayTime.day })">
        {{ dayTime.time === 'Night' ? '☾' : '☀' }} {{ t('locationMap.dayCount', { count: dayTime.day }) }} · <b>{{ t(`locationMap.timeOfDay.${dayTime.time}`) }}</b>
      </span>
      <span v-for="c in counters" :key="c.name" class="chip">{{ c.label }} <b>{{ c.n }}</b></span>
      <!-- Collapsed strip: one chip per effect, with all of its chaos tokens. -->
      <span v-for="l in compact ? info?.lines ?? [] : []" :key="l.key" class="token" tabindex="0" :aria-label="l.plain">
        <span class="token-icons"><ChaosTokenIcon v-for="token in l.tokens" :key="token" :token="token" /></span>
        <span v-if="l.badge.tier === 'fail'" class="token__fail"><ChaosTokenIcon token="auto_fail" /></span>
        <TokenModifierBadge v-else-if="l.label" class="token__mod" :label="l.label" :tier="l.badge.tier" :flash="flashing.has(l.key)" />
        <span class="token__pop" role="tooltip"><b v-if="l.hint" class="token__hint">{{ l.hint }}</b><span v-html="l.html"></span></span>
      </span>
    </template>
    <!-- Open strip: one row per effect — its token icons, value, and description.
         An automatic failure shows the auto-fail token itself instead of a word label. -->
    <ul v-if="info?.lines.length" class="tokens">
      <li v-for="l in info.lines" :key="l.key" :class="{ 'is-fail': l.badge.tier === 'fail' }">
        <span class="token-icons"><ChaosTokenIcon v-for="token in l.tokens" :key="token" :token="token" /></span>
        <span class="tokens__value" :class="[`tokens__value--${l.badge.tier}`, { 'tokens__value--flash': flashing.has(l.key) }]" :title="l.hint || undefined">
          <span v-if="l.badge.tier === 'fail'" class="tokens__fail-icon" :aria-label="l.label"><ChaosTokenIcon token="auto_fail" /></span>
          <template v-else>{{ l.label }}</template>
        </span>
        <span class="tokens__effect" v-html="l.html"></span>
      </li>
    </ul>
  </MissionStripPanel>
</template>

<style scoped>
.chip { display: inline-flex; align-items: center; gap: 5px; padding: 1px 9px; border-radius: 999px; font-size: 0.7rem; color: #f0d9a8; background: #0006; border: 1px solid var(--line-strong, #c6a87399); white-space: nowrap; }
.chip b { color: var(--heading, #fff4df); font-size: 0.82rem; }
/* Rows share columns so a group of tokens never pushes its modifier or text out of alignment. */
.tokens { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: max-content 2.2em minmax(0, 1fr); column-gap: 6px; font-size: 0.76rem; }
.tokens li { display: grid; grid-column: 1 / -1; grid-template-columns: subgrid; align-items: start; padding: 2px 0; line-height: 22px; }
.token-icons { flex: none; display: flex; gap: 2px; }
/* Open strip: tokens sharing one effect stack one under another, so the icon column stays one token wide
 * and the effect text keeps the width (it runs beside the stack). */
.tokens .token-icons { flex-direction: column; align-items: center; gap: 1px; }
/* A stack is a little smaller than a lone token, so three of them stay within three lines of text. As on
 * the printed card, a thin vertical rule down its right side ties the whole stack to the one effect beside it. */
.tokens .token-icons:has(> :nth-child(2)) { align-self: stretch; padding-right: 5px; border-right: 1px solid #c6a87399; }
.tokens .token-icons:has(> :nth-child(2)) :deep(.chaos-icon) { width: 19px; height: 19px; }
/* A faint rule between effects, so each one reads as its own row. */
.tokens li + li { border-top: 1px dashed #c6a87330; }
.token-icons :deep(.chaos-icon) { flex: none; width: 22px; height: 22px; }
.token .token-icons :deep(.chaos-icon) { width: 20px; height: 20px; }
.tokens__value { text-align: center; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--heading, #fff4df); }
.tokens__value--bad { color: #f0a090; }
.tokens__value--unknown { color: #c9b893; }
.tokens__value--flash { animation: value-flash 0.9s ease-out; }
@keyframes value-flash { 0% { color: #ffd27a; transform: scale(1.3); } 100% { transform: scale(1); } }
@media (prefers-reduced-motion: reduce) { .tokens__value--flash { animation: none; } }
.tokens__fail-icon { display: block; width: 22px; height: 22px; margin-inline: auto; }
.tokens__effect { min-width: 0; overflow-wrap: anywhere; text-align: left; color: var(--text, #e8e3d0); }
.tokens li.is-fail .tokens__effect { color: #f3c0b8; }
.token__fail { flex: none; width: 20px; height: 20px; }
/* A 0 is shown like any other number here, not faded. */
.token__mod.badge--zero { color: var(--heading, #fff4df); border-color: #c6a87366; }
/* Token chip with a popover holding the full effect text. */
.token { position: relative; display: inline-flex; align-items: center; gap: 3px; padding: 1px 6px 1px 2px; border-radius: 999px; background: #0006; border: 1px solid #c6a87355; cursor: help; outline: none; }
.token:focus-visible { box-shadow: 0 0 0 1px var(--accent-gold, #d9b878); }
.token__mod { font-size: 0.78rem; font-variant-numeric: tabular-nums; color: var(--heading, #fff4df); }
.token__hint { display: block; margin-bottom: 4px; color: var(--accent-gold, #d9b878); }
.token__pop {
  position: absolute; top: calc(100% + 6px); right: 0; z-index: 40; width: max-content; max-width: 280px;
  padding: 6px 9px; border-radius: 6px; font-size: 0.78rem; line-height: 1.35; font-weight: 400;
  background: var(--surface-2, #283a30); border: 1px solid var(--line-strong, #c6a87399); box-shadow: 0 8px 22px #000c; color: var(--text, #f2ecdc);
  opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 0.12s, visibility 0s 0.12s;
}
.token:hover .token__pop, .token:focus-visible .token__pop { opacity: 1; visibility: visible; transition: opacity 0.12s; }
</style>
