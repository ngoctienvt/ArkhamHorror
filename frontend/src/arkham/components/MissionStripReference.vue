<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { Scenario } from '@/arkham/types/Scenario'
import { useCardInfo } from '@/arkham/composables/useCardNames'
import { plainText, textWeight } from '@/arkham/composables/useMissionStripPanels'
import { replaceText } from '@/arkham/cardTextFormat'
import { REFERENCE_TEXT_VI } from '@/arkham/referenceCardTextVi'
import { localizedScenarioName } from '@/arkham/scenarioNames'
import ChaosTokenIcon from '@/arkham/components/ChaosTokenIcon.vue'
import MissionStripPanel from '@/arkham/components/MissionStripPanel.vue'

/* The scenario reference card on the mission strip: its chaos-token effects (one chip each, full text on hover) in the player's language,
 * the scenario's own counters, and (The Feast of Hemlock Vale) the day and time of day. */
const props = defineProps<{ game: Game; scenario: Scenario; referenceImage: string; compact?: boolean }>()

const { t, te, locale } = useI18n()
const cardInfo = useCardInfo()

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

/* `short` is the leading modifier ("-X", "-2", "+1") shown on the chip; the full effect is in a popover. */
type TokenLine = { key: string; token: string; html: string; plain: string; short: string }
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
  const lines: TokenLine[] = []
  let heading = ''
  for (const line of raw) {
    const tok = /^\[(skull|cultist|tablet|elder_thing|auto_fail|elder_sign)\]:?\s*(.*)$/.exec(line)
    if (tok) {
      const plain = plainText(tok[2])
      const short = /^([+\-−–]\s*(?:\d+|X))/i.exec(plain)?.[1].replace(/\s+/g, '').replace(/[−–]/, '-') ?? ''
      lines.push({ key: `${code}-${lines.length}`, token: tok[1], html: replaceText(tok[2]), plain, short })
    }
    else if (!lines.length) heading = plainText(line)
  }
  if (locale.value === 'vi') {
    if (/^Easy\s*\/\s*Standard/i.test(heading)) heading = 'Dễ / Tiêu chuẩn'
    else if (/^Hard\s*\/\s*Expert/i.test(heading)) heading = 'Khó / Chuyên gia'
  }
  return { heading, lines }
})

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
      <!-- Collapsed strip: one chip per chaos token (icon + modifier); hover / focus shows the full effect. -->
      <span v-for="l in compact ? info?.lines ?? [] : []" :key="l.key" class="token" tabindex="0" :aria-label="l.plain">
        <span class="token__icon"><ChaosTokenIcon :token="l.token" /></span>
        <b v-if="l.short" class="token__mod">{{ l.short }}</b>
        <span class="token__pop" role="tooltip" v-html="l.html"></span>
      </span>
    </template>
    <!-- Open strip: the full effects, in as many columns as the panel's width allows. -->
    <ul v-if="info?.lines.length" class="tokens">
      <li v-for="l in info.lines" :key="l.key">
        <span class="tokens__icon"><ChaosTokenIcon :token="l.token" /></span>
        <span class="tokens__effect" v-html="l.html"></span>
      </li>
    </ul>
  </MissionStripPanel>
</template>

<style scoped>
.chip { display: inline-flex; align-items: center; gap: 5px; padding: 1px 9px; border-radius: 999px; font-size: 0.7rem; color: #f0d9a8; background: #0006; border: 1px solid var(--line-strong, #c6a87399); white-space: nowrap; }
.chip b { color: var(--heading, #fff4df); font-size: 0.82rem; }
.tokens { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); column-gap: 12px; }
.tokens li { display: flex; align-items: flex-start; gap: 6px; padding: 2px 0; font-size: 0.76rem; line-height: 1.35; }
.tokens__icon { flex: none; width: 20px; height: 20px; }
.tokens__effect { flex: 1; min-width: 0; text-align: justify; color: var(--text, #e8e3d0); }
/* Token chip with a popover holding the full effect text. */
.token { position: relative; display: inline-flex; align-items: center; gap: 3px; padding: 1px 6px 1px 2px; border-radius: 999px; background: #0006; border: 1px solid #c6a87355; cursor: help; outline: none; }
.token:focus-visible { box-shadow: 0 0 0 1px var(--accent-gold, #d9b878); }
.token__icon { flex: none; width: 18px; height: 18px; }
.token__mod { font-size: 0.78rem; font-variant-numeric: tabular-nums; color: var(--heading, #fff4df); }
.token__pop {
  position: absolute; top: calc(100% + 6px); right: 0; z-index: 40; width: max-content; max-width: 280px;
  padding: 6px 9px; border-radius: 6px; font-size: 0.78rem; line-height: 1.35; font-weight: 400;
  background: var(--surface-2, #283a30); border: 1px solid var(--line-strong, #c6a87399); box-shadow: 0 8px 22px #000c; color: var(--text, #f2ecdc);
  opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 0.12s, visibility 0s 0.12s;
}
.token:hover .token__pop, .token:focus-visible .token__pop { opacity: 1; visibility: visible; transition: opacity 0.12s; }
</style>
