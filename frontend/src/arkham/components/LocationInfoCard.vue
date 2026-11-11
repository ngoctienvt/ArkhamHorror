<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { Location } from '@/arkham/types/Location'
import { cardImage } from '@/arkham/cardImages'
import { replaceText } from '@/arkham/cardTextFormat'
import { useCardNames } from '@/arkham/composables/useCardNames'
import { ownInvestigator } from '@/arkham/ownInvestigator'
import { computeStat, formatStat } from '@/arkham/statModel'
import type { MapLocationInfo } from '@/arkham/composables/useLocationInfo'
import AbilityButton from '@/arkham/components/AbilityButton.vue'
import ShroudDisc from '@/arkham/components/ShroudDisc.vue'

/* One location's face-up side in a corner of the map, out of the way of the figures: its numbers, text and
 * flavour, what is attached to it, where it leads, and the actions the server offers for it right now (only
 * when there are any). Every button sends the index its choice already had; looking never sends anything. */
const props = defineProps<{
  game: Game
  playerId: string
  location: Location
  info: MapLocationInfo
  /** The connected locations, by the name their face-up side shows. */
  connections: { id: string; name: string; revealed: boolean }[]
  /** The actions panel is open on the right: the card sits to its left. */
  besidePanel: boolean
}>()
const emit = defineEmits<{ (e: 'choose', index: number): void; (e: 'inspect', id: string): void; (e: 'close'): void }>()

const { t } = useI18n()
const nameOf = useCardNames()
const card = ref<HTMLElement | null>(null)

const me = computed(() => ownInvestigator(props.game, props.playerId))
// Your intellect with lasting modifiers applied (a Death XIII in play), shown as `5(4+1)` when changed.
const myIntellect = computed(() => {
  if (!me.value) return null
  const stat = computeStat('intellect', me.value.intellect, me.value.modifiers)
  return { value: stat.current, label: formatStat(stat.current, stat.printed) }
})
const textHtml = computed(() => props.info.face.text ? replaceText(props.info.face.text) : null)
const flavorHtml = computed(() => props.info.face.flavor ? replaceText(props.info.face.flavor) : null)

const named = (ids: string[], pool: Record<string, { cardCode: string }>) =>
  ids.flatMap((id) => pool[id] ? [{ id, name: nameOf(pool[id].cardCode) }] : [])
// Investigators and enemies stand on the map already; only what lies on the location itself is listed.
const attached = computed(() => [
  ...named(props.location.treacheries, props.game.treacheries),
  ...named(props.location.assets, props.game.assets),
  ...named(props.location.events, props.game.events),
])
const extraLabel = (x: string) => t(`locationMap.info.extra.${x.split(':')[0]}`, { value: x.split(':')[1] ?? '' })
const hasAction = computed(() => Boolean(props.info.actions.move || props.info.actions.investigate || props.info.actions.other.length || props.info.actions.selectIndex !== -1))

function choose(index: number) {
  emit('choose', index)
  emit('close')
}

const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') emit('close') }
onMounted(() => { window.addEventListener('keydown', onKey); card.value?.focus() })
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
import GameIcon from '@/arkham/components/GameIcon.vue'
import SceneGlyph from '@/arkham/components/SceneGlyph.vue'
</script>

<template>
  <aside ref="card" class="info-card" :class="{ unrevealed: !info.revealed, 'beside-panel': besidePanel }"
    role="dialog" :aria-label="info.face.name" tabindex="-1" @click.stop>
    <header>
      <img class="thumb" :src="cardImage(location.cardCode, info.revealed ? '' : 'b')" alt="" loading="lazy" />
      <div class="title">
        <h3><span class="state" :title="info.revealed ? t('locationMap.marker.revealed') : t('locationMap.marker.unrevealed')">{{ info.revealed ? '●' : '?' }}</span>{{ info.face.name }}</h3>
        <p v-if="info.face.traits" class="traits">{{ info.face.traits }}</p>
      </div>
      <button class="close" type="button" :aria-label="t('locationMap.close')" @click="emit('close')"><SceneGlyph name="close" /></button>
    </header>

    <section v-if="info.shroud || info.revealed" class="stats">
      <span v-if="info.shroud" :class="{ modified: info.shroud.current !== info.shroud.printed }"
        :title="t('locationMap.marker.shroud') + (info.shroud.current !== info.shroud.printed ? ' · ' + t('locationMap.marker.printed', { n: info.shroud.printed }) : '')">
        <ShroudDisc :value="info.shroud.x ? 'X' : info.shroud.current" :modified="info.shroud.current !== info.shroud.printed" /><small class="lbl">{{ t('locationMap.marker.shroud') }}<template v-if="info.shroud.current !== info.shroud.printed"> · {{ t('locationMap.marker.printed', { n: info.shroud.printed }) }}</template></small></span>
      <span :title="t('locationMap.clues')"><GameIcon type="clue" /> <b>{{ info.clues.left }}<template v-if="info.clues.printed !== null">/{{ info.clues.printed }}</template></b><small class="lbl">{{ t('locationMap.clues') }}</small></span>
      <span v-if="info.doom" class="doom" :title="t('locationMap.doom')"><GameIcon type="doom" /> <b>{{ info.doom }}</b><small class="lbl">{{ t('locationMap.doom') }}</small></span>
      <span v-if="info.victory" :title="t('locationMap.info.victory')">VP <b>{{ info.victory }}</b></span>
      <span v-if="info.shroud && !info.shroud.x && me" class="compare" :title="t('locationMap.info.investigateCompare', { intellect: myIntellect?.value, shroud: info.shroud.current })">
        <span class="intellect-icon" aria-hidden="true"></span> {{ myIntellect?.label }} vs {{ info.shroud.current }}</span>
    </section>

    <!-- Card text comes from the bundled ArkhamDB card list, formatted the way the card overlay formats it. -->
    <p v-if="textHtml" class="text" v-html="textHtml"></p>
    <p v-if="flavorHtml" class="flavor" v-html="flavorHtml"></p>

    <ul v-if="attached.length || info.extras.length" class="attached">
      <li v-for="a in attached" :key="a.id"><SceneGlyph name="card" /> {{ a.name }}</li>
      <li v-for="x in info.extras" :key="x"><SceneGlyph name="extra" /> {{ extraLabel(x) }}</li>
    </ul>

    <div v-if="connections.length" class="link-row" :aria-label="t('locationMap.info.connections')">
      <span class="arrow"><SceneGlyph name="move" /></span>
      <button v-for="c in connections" :key="c.id" type="button" class="link-chip" :class="{ hidden: !c.revealed }" @click="emit('inspect', c.id)">
        {{ c.revealed ? '●' : '?' }} {{ c.name }}</button>
    </div>

    <section v-if="hasAction" class="actions">
      <button v-if="info.actions.selectIndex !== -1" type="button" class="act primary" @click="choose(info.actions.selectIndex)"><SceneGlyph name="choose" /> {{ t('locationMap.info.chooseThis') }}</button>
      <button v-if="info.actions.move" type="button" class="act move" @click="choose(info.actions.move.index)"><SceneGlyph name="move" /> {{ t('locationMap.marker.moveHere') }}</button>
      <button v-if="info.actions.investigate" type="button" class="act investigate" @click="choose(info.actions.investigate.index)"><SceneGlyph name="investigate" /> {{ t('locationMap.info.investigate') }}</button>
      <AbilityButton v-for="c in info.actions.other" :key="c.index" :game="game" :ability="c.contents" @choose="choose(c.index)" />
    </section>
  </aside>
</template>

<style scoped>
.info-card { position: absolute; z-index: 70; top: 12px; right: var(--panel-gap, 12px); width: 290px; max-height: calc(100% - 24px); overflow-y: auto; display: grid; gap: 8px; align-content: start; padding: 10px; background: var(--surface-0); border: 1px solid var(--line-strong); border-radius: var(--radius-lg); box-shadow: var(--shadow-pop); color: var(--text); font-size: 0.8rem; scrollbar-width: thin; scrollbar-color: var(--line) transparent; }
.info-card.unrevealed { border-style: dashed; }
.info-card.beside-panel { right: calc(var(--panel-w, 280px) + 2 * var(--panel-gap, 12px)); }
.info-card:focus { outline: none; }
header { display: grid; grid-template-columns: 44px 1fr auto; gap: 8px; align-items: start; }
.thumb { width: 44px; aspect-ratio: 5 / 7; object-fit: cover; border-radius: 3px; border: 1px solid #ffffff22; }
h3 { margin: 0; display: flex; gap: 6px; align-items: baseline; font: 600 1.05rem/1.15 var(--ui-serif); font-variant: small-caps; color: var(--heading); }
.state { color: var(--accent-gold); font-size: 0.8rem; }
.unrevealed .state { color: #d8c79f; }
.traits { margin: 2px 0 0; font-style: italic; color: var(--text-flavor); }
.close { display: grid; place-items: center; background: none; border: 0; border-radius: var(--radius); color: var(--text-muted); font-size: 1rem; cursor: pointer; padding: 3px; }
.close:hover { color: var(--heading); background: var(--surface-2); }
.stats { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; padding: 5px 8px; background: var(--surface-1); border-radius: var(--radius); font-variant-numeric: tabular-nums; }
.stats b { color: var(--heading); }
.stats .modified b { color: #f5b26b; }
.stats .doom b { color: var(--doom); }
.stats .compare { margin-left: auto; color: var(--clue); }
.text { margin: 0; line-height: 1.4; white-space: pre-line; }
.flavor { margin: 0; white-space: pre-line; font-style: italic; color: var(--text-flavor); line-height: 1.4; }
.attached { margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 4px 10px; color: var(--accent-gold); }
.attached li { display: inline-flex; align-items: center; gap: 4px; }
.link-row { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
.arrow { display: inline-grid; color: var(--accent-gold); }
.link-chip { padding: 1px 8px; border: 1px solid var(--line-strong); border-radius: 999px; background: transparent; color: var(--text); font: inherit; cursor: pointer; }
.link-chip.hidden { border-style: dashed; color: var(--text-muted); }
.link-chip:hover { border-color: var(--state-here); }
.actions { display: grid; gap: 5px; }
.act { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface-1); color: var(--text); font: inherit; font-weight: 600; text-align: left; cursor: pointer; }
.act:hover { border-color: var(--accent-gold); background: var(--surface-2); }
.act.primary { background: var(--accent-gold); border-color: var(--accent-gold); color: #191c16; }
.act.move { border-color: var(--state-move); }
.act.investigate { border-color: var(--clue); }
button:focus-visible { outline: var(--focus-ring); outline-offset: 2px; }
/* A tablet held upright: the card is a bottom sheet above the hand, as on a phone. */
.location-map[data-layout='tablet-portrait'] .info-card { position: fixed; top: auto; left: 0; right: 0; bottom: var(--hand-h, 0px); width: auto; max-height: var(--sheet-max, 56dvh); border-radius: 12px 12px 0 0; z-index: 200; }
/* No hover on a finger, so the words a tooltip would show are written next to the numbers. */
.lbl { display: none; margin-left: 4px; color: var(--text-flavor); font-size: 0.78em; }
.location-map[data-input='touch'] .lbl { display: inline; }
/* Fingers: every button reaches 44px and the card text grows a little. */
.location-map[data-input='touch'] .info-card { font-size: 0.92rem; }
.location-map[data-input='touch'] .close { min-width: var(--tap-min); min-height: var(--tap-min); font-size: 1.2rem; }
.location-map[data-input='touch'] .link-row { gap: var(--tap-gap); }
.location-map[data-input='touch'] .link-chip { min-height: var(--tap-min); padding: 0 14px; border-radius: 22px; }
.location-map[data-input='touch'] .actions { gap: var(--tap-gap); }
.location-map[data-input='touch'] .act { min-height: var(--tap-min); }
@media (max-width: 800px) {
  /* Phone: a dimmed modal in the middle of the screen, above the hand, so it can be read in full. */
  .info-card, .info-card.beside-panel { position: fixed; top: 50%; left: 12px; right: 12px; bottom: auto; width: auto; transform: translateY(-50%); max-height: 82dvh; border-radius: 12px; z-index: 1000; font-size: 1rem; padding: 14px; background: #101913; box-shadow: 0 0 0 100vmax #000a, 0 8px 32px #000; }
  header { grid-template-columns: 64px 1fr auto; }
  .thumb { width: 64px; }
  h3 { font-size: 1.25rem; }
  .text, .flavor { line-height: 1.5; }
}
</style>
