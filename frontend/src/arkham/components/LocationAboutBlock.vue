<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { Location } from '@/arkham/types/Location'
import type { MapLocationInfo } from '@/arkham/composables/useLocationInfo'
import { replaceText } from '@/arkham/cardTextFormat'
import { iconClasses } from '@/arkham/icons'
import { LINE_KIND, type AbilityKind } from '@/arkham/locationChoices'
import { useCardNames } from '@/arkham/composables/useCardNames'
import { attachmentsOf, effectLabel } from '@/arkham/attachments'
import { cardImage } from '@/arkham/cardImages'
import GameIcon from '@/arkham/components/GameIcon.vue'
import ShroudDisc from '@/arkham/components/ShroudDisc.vue'
import SceneGlyph from '@/arkham/components/SceneGlyph.vue'

/* The top of the action panel: what this location is and what it does to you, read before choosing an
 * action. Its face-up traits, numbers, every printed line tagged by kind (forced, action, reaction, fast,
 * objective, or always-on), the flavour, and what lies on it (treacheries first: those are what bite).
 * Display only; nothing here sends a choice. */
const props = defineProps<{ game: Game; location: Location; info: MapLocationInfo }>()

const { t } = useI18n()
const nameOf = useCardNames()

type LineKind = AbilityKind | 'constant'
const lines = computed(() => {
  const text = props.info.face.text
  if (!text) return []
  return text.split(/\n|<br\s*\/?>/i).map((l) => l.trim()).filter(Boolean).map((line) => {
    const kind: LineKind = LINE_KIND.find(([re]) => re.test(line))?.[1] ?? 'constant'
    // The kind badge already carries the action / fast / reaction icon, so drop the leading one from the text.
    const html = replaceText(line).replace(/^\s*(<b>)?\s*<span class="[\w-]+-icon"><\/span>\s*(<\/b>)?\s*:?\s*/, '')
    return { kind, html }
  })
})
const flavorHtml = computed(() => props.info.face.flavor ? replaceText(props.info.face.flavor) : null)

// Each attached card is a row: art thumbnail (hover shows the full card), name, and what it does here.
const attached = computed(() => attachmentsOf(props.game, 'location', props.location.id).map((a) => ({
  ...a,
  name: nameOf(a.cardCode),
  image: cardImage(a.cardCode),
  effectLines: a.effects.map((e) => effectLabel(e, t)),
})))
const extraLabel = (x: string) => {
  const [kind, value = ''] = x.split(':')
  // Flood levels arrive as enum names (FullyFlooded…); show them translated.
  return t(`locationMap.info.extra.${kind}`, { value: kind === 'flood' ? t(`locationMap.info.floodLevels.${value}`) : value })
}

const iconOf = (kind: LineKind) => (kind === 'action' || kind === 'fast' || kind === 'reaction') ? iconClasses[kind] : null
</script>

<template>
  <section class="about" :aria-label="t('locationMap.about.title')">
    <p v-if="info.face.traits" class="traits">{{ info.face.traits }}</p>

    <div v-if="info.shroud || info.revealed" class="stats">
      <ShroudDisc v-if="info.shroud" :value="info.shroud.x ? 'X' : info.shroud.current"
        :modified="info.shroud.current !== info.shroud.printed" :title="t('locationMap.marker.shroud')" />
      <span :title="t('locationMap.clues')"><GameIcon type="clue" /> <b>{{ info.clues.left }}<template v-if="info.clues.printed !== null">/{{ info.clues.printed }}</template></b></span>
      <span v-if="info.doom" class="doom" :title="t('locationMap.doom')"><GameIcon type="doom" /> <b>{{ info.doom }}</b></span>
      <span v-if="info.victory" :title="t('locationMap.info.victory')">VP <b>{{ info.victory }}</b></span>
    </div>

    <ul v-if="lines.length" class="lines">
      <li v-for="(l, i) in lines" :key="i" :class="['line', l.kind]">
        <span class="badge"><span v-if="iconOf(l.kind)" :class="iconOf(l.kind)!" aria-hidden="true" />{{ t(`locationMap.about.kind.${l.kind}`) }}</span>
        <span class="body" v-html="l.html" />
      </li>
    </ul>
    <p v-else-if="info.face.known" class="none">{{ t('locationMap.about.noText') }}</p>

    <p v-if="flavorHtml" class="flavor" v-html="flavorHtml"></p>

    <div v-if="attached.length || info.extras.length" class="attached">
      <h5>{{ t('locationMap.about.attached') }}</h5>
      <ul>
        <li v-for="a in attached" :key="a.id" class="card-row" :class="{ threat: a.tone === 'harm' }" tabindex="0"
          :data-image="a.image" :data-card-code="a.cardCode">
          <span class="thumb" :style="{ backgroundImage: `url(${a.image})` }" aria-hidden="true"></span>
          <span class="meta">
            <b class="nm"><SceneGlyph :name="a.tone === 'harm' ? 'warn' : 'card'" /> {{ a.name }}</b>
            <span v-for="(line, i) in a.effectLines" :key="i" class="fx">{{ line }}</span>
          </span>
        </li>
        <li v-for="x in info.extras" :key="x" class="extra"><SceneGlyph name="extra" /> {{ extraLabel(x) }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.about { display: flex; flex-direction: column; gap: 6px; font-size: 0.78rem; line-height: 1.4; }
.traits { margin: 0; font-style: italic; color: var(--text-flavor, #c9bf9f); }
.stats { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; padding: 4px 8px; background: var(--surface-2, #ffffff0d); border-radius: var(--radius, 6px); font-variant-numeric: tabular-nums; }
.stats b { color: var(--heading, #fff3cf); }
.stats .modified b { color: #f5b26b; }
.stats .doom b { color: var(--doom, #e0a595); }
.lines { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 4px; }
.line { display: flex; flex-direction: column; gap: 2px; padding: 5px 8px; border-left: 3px solid #75836b; background: #ffffff08; border-radius: 0 4px 4px 0; }
.badge { display: inline-flex; gap: 4px; align-items: center; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #c6d6b4; }
.line.forced { border-color: #d0654f; background: #d0654f14; }
.line.forced .badge { color: #f0a090; }
.line.action { border-color: #e6c584; }
.line.action .badge { color: #e6c584; }
.line.reaction, .line.fast { border-color: #9fd3e6; }
.line.reaction .badge, .line.fast .badge { color: #9fd3e6; }
.line.objective { border-color: #b59be0; }
.line.objective .badge { color: #cdb8f0; }
.body :deep(img) { height: 1.1em; vertical-align: -0.15em; }
.none { margin: 0; color: var(--text-muted, #98a38f); font-style: italic; }
.flavor { margin: 0; white-space: pre-line; font-style: italic; color: var(--text-flavor, #c9bf9f); }
.attached h5 { margin: 0 0 2px; font-size: 0.7rem; color: #c6d6b4; font-weight: 600; }
.attached ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 4px; color: #d8c79f; }
.card-row { display: flex; gap: 8px; align-items: center; padding: 4px 6px; border: 1px solid var(--line, #c6a87344); border-radius: var(--radius, 6px); background: #ffffff08; cursor: help; }
.card-row:hover, .card-row:focus-visible { background: #ffffff14; border-color: #c6a873; outline: none; }
.card-row.threat { border-color: #d0654f66; background: #d0654f12; }
.thumb { flex: none; width: 34px; height: 34px; border-radius: 50%; border: 2px solid #c6a873; background-size: 240% auto; background-position: 50% 22%; background-repeat: no-repeat; }
.threat .thumb { border-color: #d9695b; }
.meta { display: flex; flex-direction: column; min-width: 0; }
.nm { display: inline-flex; align-items: center; gap: 4px; color: var(--text, #e9e2c6); font-weight: 600; }
.threat .nm { color: #f0a090; }
.fx { color: #f5d9a0; font-size: 0.72rem; }
.extra { padding-left: 2px; }
</style>
