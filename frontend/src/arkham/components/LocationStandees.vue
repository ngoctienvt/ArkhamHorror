<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MessageType } from '@/arkham/types/Message'
import { useGameChoices } from '@/arkham/composables/useGameChoices'
import { choicesFor } from '@/arkham/locationChoices'
import AbilityButton from '@/arkham/components/AbilityButton.vue'
import GameIcon from '@/arkham/components/GameIcon.vue'
import { useI18n } from 'vue-i18n'
import { assignIndex, isTriggerWindow } from '@/arkham/triggerWindow'
import type { Game } from '@/arkham/types/Game'
import type { Location } from '@/arkham/types/Location'
import { TokenType } from '@/arkham/types/Token'
import { cardArt, cardImage, investigatorCardArt, portraitImage } from '@/arkham/cardImages'
import { useCardNames } from '@/arkham/composables/useCardNames'
import { spriteFor } from '@/arkham/sceneSprites'
import { enemyStat } from '@/arkham/enemyStats'
import { ownInvestigator } from '@/arkham/ownInvestigator'
import { useCardStore } from '@/stores/cards'
import { investigatorMovementName } from '@/arkham/investigatorMovement'
import { beginDrag, offsetOf } from '@/arkham/composables/useMapDrag'
import { CARD_FLIGHT_ATTR, cardFlightStyle, useCardFlightState } from '@/arkham/cardFlight'

/* Everyone standing in a room of the cutaway house, investigators first, each with the numbers shown above
 * their head: health and sanity bars for investigators, health for enemies.
 *
 * The figures also carry the board's animation hooks, the same ones the card
 * board puts on its minis and enemy cards, so moving, spawning and vanishing
 * animate here too:
 * - `moveName`: the view-transition name Game.vue's movement transition looks
 *   for (`investigator-<id>`, `enemy-<id>`). An engaged enemy gets none: its
 *   card in the threat area owns that name, and two would abort the transition.
 * - `cardId` on an enemy's picture: where a revealed card lands (cardFlight.ts).
 *   On the picture rather than the figure, which already holds the movement name.
 * - `data-investigator-mini` + `.portrait`: the smoke puff's anchor. */
const props = defineProps<{ game: Game; playerId: string; location: Location; enemiesAt: (l: Location) => string[] }>()
const emit = defineEmits<{ (e: 'choose', index: number): void }>()

const nameOf = useCardNames()
const cardStore = useCardStore()
const flightState = useCardFlightState()

type Meter = { left: number; max: number }
type Fig = {
  id: string; kind: 'investigator' | 'enemy' | 'asset'; tone: string; name: string; src: string | null; art: string; you: boolean; exhausted: boolean; note: string | null
  moveName: string | undefined; cardId: string | undefined
  /* The whole card, for the card overlay on hover. */
  cardImage: string
  health: Meter | null; sanity: Meter | null
}
/* A room only has space for a few enemy figures; the rest are listed in a "+N" badge instead of vanishing. */
const MAX_ENEMY_FIGURES = 4
const meter = (max: number, taken: number): Meter => ({ max, left: Math.max(0, max - taken) })
const pct = (m: Meter) => (100 * m.left / Math.max(1, m.max)) + '%'

const figures = computed<Fig[]>(() => {
  const l = props.location
  const mine = ownInvestigator(props.game, props.playerId)?.id
  const people = l.investigators.flatMap((id): Fig[] => {
    const i = props.game.investigators[id]
    if (!i) return []
    const art = investigatorCardArt(i)
    const src = spriteFor(art) ?? (i.form.tag === 'RegularForm'
      ? spriteFor(i.art) ?? portraitImage(i.cardCode)
      : null)
    return [{
      id, kind: 'investigator', tone: (i.class ?? 'Neutral').toLowerCase(), name: nameOf(i.cardCode), src, art: cardImage(art), you: id === mine, exhausted: false, note: null,
      moveName: investigatorMovementName(i, l.id), cardId: undefined, cardImage: cardImage(art),
      health: meter(i.health, i.tokens[TokenType.Damage] ?? 0), sanity: meter(i.sanity, i.tokens[TokenType.Horror] ?? 0),
    }]
  })
  const monsters = props.enemiesAt(l).slice(0, MAX_ENEMY_FIGURES).flatMap((id): Fig[] => {
    const e = props.game.enemies[id]
    if (!e) return []
    const damage = (e.tokens[TokenType.Damage] ?? 0) + e.assignedDamage
    /* Health after modifiers, so a "+2 health" effect lengthens the bar. */
    const max = enemyStat(e, 'health', Object.keys(props.game.investigators).length)?.current ?? null
    const definition = cardStore.cards.find((card) => card.cardCode === e.cardCode)
    const art = cardArt(definition?.art ?? e.cardCode, e.flipped ? 'b' : '')
    return [{
      id, kind: 'enemy', tone: 'enemy', name: nameOf(e.cardCode), src: spriteFor(art), art: cardImage(art), you: false, exhausted: e.exhausted,
      moveName: e.placement.tag === 'AtLocation' ? `enemy-${id}` : undefined,
      cardId: e.placement.tag === 'AtLocation' ? e.cardId : undefined, cardImage: cardImage(art),
      note: max === null ? `${damage} dmg` : null,
      health: max === null ? null : meter(max, damage), sanity: null,
    }]
  })
  /* Character assets (residents, allies) standing at the location: anything with health or sanity printed. */
  const residents = l.assets.flatMap((id): Fig[] => {
    const a = props.game.assets[id]
    if (!a || (a.health === null && a.sanity === null)) return []
    const definition = cardStore.cards.find((card) => card.cardCode === a.cardCode)
    const art = cardArt(definition?.art ?? a.cardCode, a.flipped ? 'b' : '')
    return [{
      id, kind: 'asset', tone: 'asset', name: nameOf(a.cardCode), src: spriteFor(art), art: cardImage(art), you: false, exhausted: a.exhausted,
      moveName: undefined, cardId: a.cardId, cardImage: cardImage(art), note: null,
      health: a.health === null ? null : meter(a.health, (a.tokens[TokenType.Damage] ?? 0) + a.assignedHealthDamage),
      sanity: a.sanity === null ? null : meter(a.sanity, (a.tokens[TokenType.Horror] ?? 0) + a.assignedSanityDamage),
    }]
  })
  return [...people, ...residents, ...monsters]
})
/* Enemies past the figure limit: named in the badge's tooltip, each clickable from its menu. */
const extraEnemies = computed(() => props.enemiesAt(props.location).slice(MAX_ENEMY_FIGURES)
  .flatMap((id) => props.game.enemies[id] ? [{ id, name: nameOf(props.game.enemies[id].cardCode) }] : []))
// A figure can be dragged to a spot the player finds easier to follow; it still belongs to this location.
const figKey = (id: string) => `${props.game.id}:${props.location.id}:${id}`
const figShift = (id: string) => { const [x, y] = offsetOf(figKey(id)); return x || y ? `${x}px ${y}px` : undefined }
const startFigDrag = (id: string, event: PointerEvent) => {
  event.stopPropagation()
  beginDrag(event, figKey(id), 'px', null)
}

/* Clicking a figure acts on it. When the game asks to pick it (a target), the click picks it. Otherwise the
 * server's options for it (engage, fight, evade, its abilities) open in a small menu above the figure;
 * a figure with nothing offered does nothing. (After a drag the click is swallowed, see useMapDrag.) */
const choices = useGameChoices(() => props.game, () => props.playerId)
const targetIndex = (id: string) => choices.value.findIndex((c) => c.tag === MessageType.TARGET_LABEL && c.target.contents === id)
const optionsFor = (id: string) => choicesFor(choices.value, id)
const { t } = useI18n()
/* Damage / horror waiting to be assigned: an investigator or asset figure on the map takes it directly,
 * the same choice as clicking the health / sanity token on its card. */
type Assign = { damage: number; horror: number }
const assignFor = (f: Fig): Assign => f.kind === 'enemy'
  ? { damage: -1, horror: -1 }
  : { damage: assignIndex(choices.value, f.kind, f.id, 'DamageToken'), horror: assignIndex(choices.value, f.kind, f.id, 'HorrorToken') }
const assignable = (f: Fig) => { const a = assignFor(f); return a.damage !== -1 || a.horror !== -1 }
const actionable = (id: string) => targetIndex(id) !== -1 || optionsFor(id).length > 0
/* In a reaction window a figure with something to use now pulses orange, like a ready card in hand. */
const triggerWindow = computed(() => isTriggerWindow(choices.value))
const openMenu = ref<string | null>(null)
const MORE_MENU = '__more-enemies'
function clickFig(f: Fig) {
  const id = f.id
  const target = targetIndex(id)
  if (target !== -1) { openMenu.value = null; emit('choose', target); return }
  // Only one kind of assignment offered: the figure itself takes it. Both: use the buttons above its head.
  const a = assignFor(f)
  if ((a.damage === -1) !== (a.horror === -1)) { openMenu.value = null; emit('choose', a.damage !== -1 ? a.damage : a.horror); return }
  openMenu.value = openMenu.value === id || !optionsFor(id).length ? null : id
}
function pick(index: number) {
  openMenu.value = null
  emit('choose', index)
}
// The menu closes on any click outside it, and whenever the options change (a choice was made elsewhere).
const closeMenu = () => { openMenu.value = null }
watch(choices, closeMenu)
onMounted(() => window.addEventListener('click', closeMenu))
onBeforeUnmount(() => window.removeEventListener('click', closeMenu))
</script>

<template>
  <span class="standees">
    <span v-for="f in figures" :key="f.id" class="fig" :class="[f.kind, f.tone, { you: f.you, exhausted: f.exhausted, actionable: actionable(f.id) || assignable(f), assign: assignable(f), trigger: triggerWindow && actionable(f.id), open: openMenu === f.id }]"
      :style="{ viewTransitionName: f.moveName, translate: figShift(f.id) }" @pointerdown="startFigDrag(f.id, $event)" :data-investigator-mini="f.kind === 'investigator' ? f.id : undefined" :data-fx-target="`${f.kind}-${f.id}`"
      :data-image="openMenu === f.id ? undefined : f.cardImage" @click.stop="clickFig(f)">
      <span v-if="assignable(f)" class="assign-bar" data-no-card-overlay @click.stop @pointerdown.stop>
        <button v-if="assignFor(f).damage !== -1" type="button" class="assign-btn damage" :title="t('locationMap.assignDamage')" :aria-label="t('locationMap.assignDamage')" @click="pick(assignFor(f).damage)"><GameIcon type="health" /><b>+1</b></button>
        <button v-if="assignFor(f).horror !== -1" type="button" class="assign-btn horror" :title="t('locationMap.assignHorror')" :aria-label="t('locationMap.assignHorror')" @click="pick(assignFor(f).horror)"><GameIcon type="sanity" /><b>+1</b></button>
      </span>
      <span v-if="openMenu === f.id" class="fig-menu" role="menu" :aria-label="f.name" data-no-card-overlay @click.stop @pointerdown.stop>
        <b class="fig-menu__name">{{ f.name }}</b>
        <AbilityButton v-for="c in optionsFor(f.id)" :key="c.index" :game="game" :ability="c.contents" @choose="pick(c.index)" />
      </span>
      <span v-if="f.health || f.sanity" class="hud">
        <span v-if="f.health" class="meter hp"><GameIcon type="health" /><span class="track"><i :style="{ width: pct(f.health) }"></i></span><b>{{ f.health.left }}/{{ f.health.max }}</b></span>
        <span v-if="f.sanity" class="meter sanity"><GameIcon type="sanity" /><span class="track"><i :style="{ width: pct(f.sanity) }"></i></span><b>{{ f.sanity.left }}/{{ f.sanity.max }}</b></span>
      </span>
      <span v-else-if="f.note" class="hud"><span class="meter hp"><GameIcon type="damage" /> {{ f.note }}</span></span>
      <img v-if="f.src" class="figure portrait" :src="f.src" :alt="f.name" draggable="false"
        :[CARD_FLIGHT_ATTR]="f.cardId" :style="cardFlightStyle(flightState, f.cardId)" />
      <span v-else class="crop portrait" role="img" :aria-label="f.name"
        :[CARD_FLIGHT_ATTR]="f.cardId" :style="[{ backgroundImage: `url(${f.art})` }, cardFlightStyle(flightState, f.cardId)]"></span>
    </span>
    <span v-if="extraEnemies.length" class="more-enemies" :class="{ open: openMenu === MORE_MENU, actionable: extraEnemies.some((e) => actionable(e.id)), trigger: triggerWindow && extraEnemies.some((e) => actionable(e.id)) }" data-no-card-overlay
      :title="extraEnemies.map((e) => e.name).join(', ')" @click.stop="openMenu = openMenu === MORE_MENU ? null : MORE_MENU" @pointerdown.stop>
      +{{ extraEnemies.length }}
      <span v-if="openMenu === MORE_MENU" class="fig-menu" role="menu" @click.stop>
        <template v-for="e in extraEnemies" :key="e.id">
          <b class="fig-menu__name">{{ e.name }}</b>
          <button v-if="targetIndex(e.id) !== -1" type="button" @click="pick(targetIndex(e.id))">{{ t('locationMap.info.chooseThis') }}</button>
          <AbilityButton v-for="c in optionsFor(e.id)" :key="c.index" :game="game" :ability="c.contents" @choose="pick(c.index)" />
        </template>
      </span>
    </span>
  </span>
</template>

<style scoped>
.standees { display: flex; align-items: flex-end; gap: 6px; flex-wrap: nowrap; filter: drop-shadow(2px 4px 3px #000c); pointer-events: none; }
/* The row lets clicks through to the room; the figures themselves take the pointer so hovering one opens its card. */
.fig { display: grid; justify-items: center; gap: 2px; pointer-events: auto; cursor: grab; touch-action: manipulation; position: relative; z-index: 1; }
/* A finger only drags a figure in arrange mode; otherwise it scrolls and taps. */
.location-map[data-arrange='true'] .fig { touch-action: none; }
.figure { width: auto; height: clamp(46px, 11cqh, 110px); object-fit: contain; object-position: bottom; }
/* Each figure gets a crisp outline instead of a glow: an investigator's in their class colour (Guardian blue,
 * Seeker orange, ...), enemies' in red. Four hard, unblurred shadows trace the sprite's silhouette. */
.fig { --outline: #d6c48a; }
.fig.enemy { --outline: #ff6a1f; }
.fig.asset { --outline: #7fb08a; }
.fig.guardian { --outline: var(--guardian, #2f7fd8); }
.fig.seeker { --outline: var(--seeker, #ec8a24); }
.fig.rogue { --outline: var(--rogue, #2fa05a); }
.fig.mystic { --outline: var(--mystic, #8a52c9); }
.fig.survivor { --outline: #a3141f; }
.fig.neutral { --outline: var(--neutral, #9aa0a6); }
.fig .figure {
  filter: drop-shadow(2px 0 0 var(--outline)) drop-shadow(-2px 0 0 var(--outline)) drop-shadow(0 2px 0 var(--outline)) drop-shadow(0 -2px 0 var(--outline));
}
.fig.you .figure { filter: drop-shadow(2px 0 0 var(--outline)) drop-shadow(-2px 0 0 var(--outline)) drop-shadow(0 2px 0 var(--outline)) drop-shadow(0 -2px 0 var(--outline)) drop-shadow(0 0 5px #fff8); }
.fig .crop { border-color: var(--outline); border-width: 3px; }
.fig.exhausted .figure { opacity: 0.65; rotate: 7deg; }
/* A figure the player can act on gets a pointer and a soft gold halo under its outline. */
.fig.actionable { cursor: pointer; }
.fig.actionable .figure { filter: drop-shadow(2px 0 0 var(--outline)) drop-shadow(-2px 0 0 var(--outline)) drop-shadow(0 2px 0 var(--outline)) drop-shadow(0 -2px 0 var(--outline)) drop-shadow(0 0 6px #ffd76a); }
.fig.open { z-index: 30; }
/* Damage / horror can go here: a hard red pulse on the figure and +1 buttons above it. */
.fig.assign { z-index: 20; }
.fig.assign .figure, .fig.assign .crop { animation: fig-assign-pulse 0.7s ease-in-out infinite alternate; }
@keyframes fig-assign-pulse {
  from { filter: drop-shadow(2px 0 0 #ff3d5a) drop-shadow(-2px 0 0 #ff3d5a) drop-shadow(0 2px 0 #ff3d5a) drop-shadow(0 -2px 0 #ff3d5a) drop-shadow(0 0 6px #ff3d5a); }
  to { filter: drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff) drop-shadow(0 0 18px #ff3d5a) brightness(1.2); }
}
.assign-bar { display: flex; gap: 4px; justify-content: center; filter: none; }
.assign-btn {
  display: inline-flex; align-items: center; gap: 2px; padding: 3px 7px; border-radius: 999px; cursor: pointer;
  font: 700 12px/1 system-ui, sans-serif; color: #fff; border: 2px solid #fff3c4; box-shadow: 0 0 10px currentColor, 0 2px 4px #000a;
  animation: assign-btn-bounce 0.7s ease-in-out infinite alternate;
}
.assign-btn b { color: #fff; }
.assign-btn.damage { background: #b3122b; color: #ff5a72; }
.assign-btn.horror { background: #1d4f8a; color: #6fb6ff; }
.assign-btn:hover { filter: brightness(1.25); }
@keyframes assign-btn-bounce { from { transform: translateY(0); } to { transform: translateY(-3px); } }
/* Something usable in a reaction window: orange pulse instead of the soft gold halo. */
.fig.trigger:not(.assign) .figure, .fig.trigger:not(.assign) .crop { animation: fig-trigger-pulse 0.75s ease-in-out infinite alternate; }
@keyframes fig-trigger-pulse {
  from { filter: drop-shadow(2px 0 0 #ff7a1a) drop-shadow(-2px 0 0 #ff7a1a) drop-shadow(0 2px 0 #ff7a1a) drop-shadow(0 -2px 0 #ff7a1a) drop-shadow(0 0 6px #ff7a1a); }
  to { filter: drop-shadow(3px 0 0 #fff3c4) drop-shadow(-3px 0 0 #fff3c4) drop-shadow(0 3px 0 #fff3c4) drop-shadow(0 -3px 0 #fff3c4) drop-shadow(0 0 18px #ff7a1a) brightness(1.15); }
}
@media (prefers-reduced-motion: reduce) {
  .fig.assign .figure, .fig.assign .crop, .fig.trigger .figure, .fig.trigger .crop, .assign-btn { animation: none; }
}
.fig-menu {
  position: absolute; bottom: calc(100% + 6px); left: 50%; translate: -50% 0; z-index: 30;
  display: grid; gap: 4px; min-width: 150px; padding: 6px; border-radius: 6px;
  background: #111815f5; border: 1px solid #e6c584aa; box-shadow: 0 6px 18px #000c;
  cursor: default; white-space: nowrap; filter: none;
}
.more-enemies {
  position: relative; align-self: center; pointer-events: auto; cursor: pointer; filter: none;
  display: inline-grid; place-items: center; min-width: 28px; height: 28px; padding: 0 6px; border-radius: 999px;
  background: #2a0f0bee; border: 2px solid #ff6a1f; color: #ffd9c8; font: 700 12px/1 system-ui, sans-serif;
}
.more-enemies:hover, .more-enemies.open { background: #4a1a12; }
/* A hidden enemy that can be picked or acted on lights the badge, so a required pick never hides behind it. */
.more-enemies.actionable { border-color: #f2d27a; box-shadow: 0 0 8px 2px #f2d27a; }
.more-enemies.trigger { border-color: #f39a4a; box-shadow: 0 0 8px 2px #f39a4a; }
.more-enemies .fig-menu { cursor: default; }
.fig-menu__name { font: 600 0.78rem var(--ui-serif, serif); color: #f0d9a8; text-align: center; }
.fig-menu :deep(button) { width: 100%; }
.crop { display: block; width: clamp(40px, 8cqh, 72px); aspect-ratio: 1; border-radius: 50%; border: 2px solid #d99e8e; background: #1a2620 no-repeat 50% 17% / 165% auto; }
.hud { display: grid; gap: 2px; min-width: 56px; padding: 3px 5px; background: #111815ef; border: 1px solid #9f8d605c; border-radius: 4px; font: 600 10px/1.15 system-ui, sans-serif; white-space: nowrap; text-shadow: none; }
.hud .meter { display: flex; align-items: center; gap: 3px; font-variant-numeric: tabular-nums; }
.hud .meter.hp { color: #ff9b87; }
.hud .meter.sanity { color: #9fceee; }
.hud .track { width: 22px; height: 4px; background: #67645d; border-radius: 3px; overflow: hidden; }
.hud .track i { display: block; height: 100%; background: currentColor; }
.hud .meter b { margin-left: auto; color: #fff4df; }
</style>
