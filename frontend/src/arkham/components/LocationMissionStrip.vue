<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { Scenario } from '@/arkham/types/Scenario'
import type { Tokens } from '@/arkham/types/Token'
import { useCardInfo } from '@/arkham/composables/useCardNames'
import { textWeight, useMissionStripPanels, type MissionPanel } from '@/arkham/composables/useMissionStripPanels'
import AbilityButton from '@/arkham/components/AbilityButton.vue'
import GameIcon from '@/arkham/components/GameIcon.vue'
import MissionStripPanel from '@/arkham/components/MissionStripPanel.vue'
import MissionStripMeter from '@/arkham/components/MissionStripMeter.vue'
import MissionStripReference from '@/arkham/components/MissionStripReference.vue'
import MissionStripAttachedThumb from '@/arkham/components/MissionStripAttachedThumb.vue'
import MissionStripOffMap from '@/arkham/components/MissionStripOffMap.vue'
import { missionAwaitingSetup } from '@/arkham/missionStripSetup'
import type { Location } from '@/arkham/types/Location'
import type { MapLocationInfo } from '@/arkham/composables/useLocationInfo'

/* The current agenda(s), act(s) and the scenario reference card as one row of panels above the map.
 * Each panel's header line holds "ACT 1 / 3 · Title", the status (doom track / clue track + advance)
 * and a small card thumbnail; below it the scrolling card text with its usable abilities.
 * `collapsed` keeps only the header line. */
const props = defineProps<{
  game: Game; scenario: Scenario; playerId: string; referenceImage?: string; collapsed?: boolean
  /** Lets the off-map box draw an isolated location as its sprite (see MissionStripOffMap). */
  sprites?: { folder: string; infoOf: (l: Location) => MapLocationInfo; enemiesAt: (l: Location) => string[] }
}>()
const emit = defineEmits<{ (e: 'choose', index: number): void; (e: 'inspect', location: Location, anchor: HTMLElement | null): void }>()

const { t } = useI18n()
const { panels, totalDoom, doomLeft, changes } = useMissionStripPanels(() => props.game, () => props.scenario, () => props.playerId)

/* Investigator setup runs before the scenario places its act and agenda: say they are on the way. */
const awaitingSetup = computed(() => missionAwaitingSetup(props.game))
const eyebrow = (p: MissionPanel) => `${t(`locationMap.${p.kind}`)} ${p.step} / ${p.total}`
/* Who holds the group's spendable clues, in seat order. Any remainder of the total (clues on assets
 * or other cards that count as spendable) is shown as one "other sources" line, so the list always
 * adds up to the number on the track. */
const clueHolders = computed(() => {
  const g = props.game
  const order = g.playerOrder?.length ? g.playerOrder : Object.keys(g.investigators)
  const rows = order
    .map((id) => g.investigators[id])
    .filter((inv): inv is NonNullable<typeof inv> => !!inv)
    .map((inv) => ({ id: inv.id, name: inv.name?.title ?? inv.id, n: inv.tokens?.Clue ?? 0, me: inv.playerId === props.playerId }))
  const held = rows.reduce((sum, r) => sum + r.n, 0)
  return { rows, other: Math.max(0, (g.totalClues ?? 0) - held) }
})
/* Every card in play that holds doom, so hovering the agenda track shows where the count comes from
 * (doom on an enemy, a location, a treachery in someone's threat area ...). The server's total can
 * differ from the plain sum (doom that subtracts, ignored doom), so any gap shows as one "other" line. */
type DoomSourceKind = 'agenda' | 'enemy' | 'location' | 'asset' | 'treachery' | 'event' | 'investigator'
type DoomSource = { key: string; kind: DoomSourceKind; name: string; n: number }
const cardInfo = useCardInfo()
const doomSources = computed(() => {
  const g = props.game
  const named = (code: string) => cardInfo(code)?.name ?? code
  const fromTokens = (kind: DoomSourceKind, items: Record<string, { id: string; cardCode: string; tokens: Tokens }>) =>
    Object.values(items ?? {}).map((e): DoomSource => ({ key: `${kind}-${e.id}`, kind, name: named(e.cardCode), n: e.tokens?.Doom ?? 0 }))
  const rows: DoomSource[] = [
    ...Object.values(g.agendas ?? {}).map((a): DoomSource => ({ key: `agenda-${a.id}`, kind: 'agenda', name: named(a.id), n: a.doom ?? 0 })),
    ...fromTokens('enemy', g.enemies),
    ...fromTokens('location', g.locations),
    ...fromTokens('asset', g.assets),
    ...fromTokens('treachery', g.treacheries),
    ...fromTokens('event', g.events),
    ...Object.values(g.investigators ?? {}).map((i): DoomSource => ({ key: `investigator-${i.id}`, kind: 'investigator', name: i.name?.title ?? i.id, n: i.tokens?.Doom ?? 0 })),
  ].filter((r) => r.n > 0)
  const counted = rows.reduce((sum, r) => sum + r.n, 0)
  return { rows, other: (g.totalDoom ?? 0) - counted }
})
/* Doom warning, only near the threshold (the track already shows the count): amber one step out,
 * red when the threshold is reached. */
function doomState(p: MissionPanel): { level: 'warn' | 'critical'; text: string } | null {
  const left = doomLeft(p)
  if (left === null || left > 1) return null
  return left <= 0
    ? { level: 'critical', text: t('locationMap.doomAdvancing') }
    : { level: 'warn', text: t('locationMap.doomImminent') }
}
</script>

<template>
  <div v-if="panels.length || referenceImage || awaitingSetup" class="mission-strip" :class="{ 'mission-strip--collapsed': collapsed }">
    <article v-for="kind in (awaitingSetup ? ['agenda', 'act'] as const : [])" :key="`pending-${kind}`"
      class="pending" :class="`pending--${kind}`" role="status">
      <span class="pending__eyebrow">{{ t(`locationMap.${kind}`) }}</span>
      <span class="pending__text">{{ t('locationMap.missionAwaitingSetup') }}</span>
    </article>
    <MissionStripPanel
      v-for="p in panels"
      :key="p.key"
      :tone="p.kind"
      :eyebrow="eyebrow(p)"
      :title="p.title"
      :image="p.image"
      :card-code="p.code"
      :flavor="p.flavor"
      :compact="collapsed"
      :weight="textWeight(p.flavor, p.textHtml, ...p.actions.map((a) => a.html))"
    >
      <!-- Agenda: the doom track fills to all doom in play; the dashed pips are doom off the agenda card. -->
      <template v-if="p.kind === 'agenda' && p.doom !== null" #status>
        <div class="status-main">
          <!-- Hover / focus the track to see which cards hold that doom. -->
          <span class="clue-hover" tabindex="0" :aria-label="t('locationMap.doomSources')">
            <MissionStripMeter
              v-if="p.doomMax"
              variant="doom" :value="totalDoom" :on-card="p.doom" :max="p.doomMax" :change="changes[p.key]"
              :label="t('locationMap.doomCount', { count: totalDoom, max: p.doomMax })" no-tooltip
            />
            <span v-else class="chip chip--doom"><GameIcon type="doom" /> {{ t('locationMap.doomCount', { count: p.doom, max: '?' }) }}</span>
            <span class="clue-pop clue-pop--doom" role="tooltip">
              <span class="clue-pop__head">
                {{ t('locationMap.doomSources') }}
                <b><GameIcon type="doom" /> {{ p.doomMax ? `${totalDoom} / ${p.doomMax}` : totalDoom }}</b>
              </span>
              <span v-for="r in doomSources.rows" :key="r.key" class="clue-pop__row">
                <span class="clue-pop__name"><small class="clue-pop__kind">{{ t(`locationMap.doomSource.${r.kind}`) }}</small> {{ r.name }}</span><b>{{ r.n }}</b>
              </span>
              <span v-if="doomSources.other" class="clue-pop__row">
                <span class="clue-pop__name">{{ t('locationMap.clueHoldersOther') }}</span><b>{{ doomSources.other > 0 ? doomSources.other : `−${-doomSources.other}` }}</b>
              </span>
              <span v-if="!totalDoom" class="clue-pop__empty">{{ t('locationMap.doomSourcesNone') }}</span>
            </span>
          </span>
        </div>
        <span v-if="doomState(p)" class="state" :class="`state--${doomState(p)!.level}`" role="status">{{ doomState(p)!.text }}</span>
      </template>

      <!-- Act: the group's clues against the advance cost, and the advance button once it can be paid. -->
      <template v-else-if="p.kind === 'act'" #status>
        <div class="status-main">
          <!-- Hover / focus the track to see which investigator holds how many of those clues. -->
          <span class="clue-hover" tabindex="0" :aria-label="t('locationMap.clueHolders')">
            <MissionStripMeter
              v-if="p.clueMax"
              variant="clue" :value="p.clues ?? 0" :max="p.clueMax" :change="changes[p.key]"
              :label="t('locationMap.clueCount', { count: p.clues, max: p.clueMax })" no-tooltip
            />
            <span v-else class="chip chip--clue"><GameIcon type="clue" /> {{ t('locationMap.clueTotal', { count: p.clues ?? 0 }) }}</span>
            <span class="clue-pop" role="tooltip">
              <span class="clue-pop__head">
                {{ t('locationMap.clueHolders') }}
                <b><GameIcon type="clue" /> {{ p.clueMax ? `${p.clues ?? 0} / ${p.clueMax}` : (p.clues ?? 0) }}</b>
              </span>
              <span v-for="r in clueHolders.rows" :key="r.id" class="clue-pop__row" :class="{ 'clue-pop__row--me': r.me, 'clue-pop__row--zero': !r.n }">
                <span class="clue-pop__name">{{ r.name }}</span><b>{{ r.n }}</b>
              </span>
              <span v-if="clueHolders.other" class="clue-pop__row">
                <span class="clue-pop__name">{{ t('locationMap.clueHoldersOther') }}</span><b>{{ clueHolders.other }}</b>
              </span>
              <span v-if="!(p.clues ?? 0)" class="clue-pop__empty">{{ t('locationMap.clueHoldersNone') }}</span>
            </span>
          </span>
        </div>
        <button
          type="button"
          class="advance"
          :class="{ 'advance--ready': p.advanceIndex !== null }"
          :disabled="p.advanceIndex === null"
          :title="p.advanceIndex !== null ? t('locationMap.advanceAct') : t('locationMap.actionUnavailable')"
          @click="p.advanceIndex !== null && emit('choose', p.advanceIndex)"
        >{{ t('locationMap.advanceAct') }}</button>
      </template>

      <template v-if="p.attached.length" #attached>
        <MissionStripAttachedThumb v-for="a in p.attached" :key="a.key" :game="game" :playerId="playerId" :card="a" @choose="emit('choose', $event)" />
      </template>

      <p v-if="p.textHtml" class="rules" v-html="p.textHtml"></p>
      <div v-for="a in p.actions" :key="a.key" class="ability" :class="a.choice ? 'ability--usable' : 'ability--disabled'">
        <!-- the printed line already starts with the action icon, so the button is just the text -->
        <button v-if="a.choice && a.html" type="button" class="ability__use" @click="emit('choose', a.choice.index)">
          <span class="ability__text" v-html="a.html"></span>
        </button>
        <AbilityButton v-else-if="a.choice" :game="game" :ability="a.choice.contents" @choose="emit('choose', a.choice.index)" />
        <span v-else-if="a.html" class="ability__text" :title="t('locationMap.actionUnavailable')" v-html="a.html"></span>
      </div>
      <AbilityButton v-for="c in p.choices" :key="c.index" :game="game" :ability="c.contents" @choose="emit('choose', c.index)" />
    </MissionStripPanel>
    <MissionStripReference v-if="referenceImage" :game="game" :scenario="scenario" :reference-image="referenceImage" :player-id="playerId" :compact="collapsed" />
    <MissionStripOffMap :game="game" :scenario="scenario" :playerId="playerId" :compact="collapsed" :sprites="sprites"
      @choose="emit('choose', $event)" @inspect="(l, anchor) => emit('inspect', l, anchor)" />
  </div>
</template>

<style scoped>
/* Panels share the row by how much text each has (MissionStripPanel `weight`), so their heights even out.
 * A panel never gets narrower than its min-width; below that the strip wraps, and phones stack them. */
.mission-strip {
  display: flex; flex-wrap: wrap; gap: 8px; align-items: stretch;
  padding: 6px 10px; background: var(--surface-0, #0d1611); border-bottom: 1px solid var(--line, #c6a87340);
}

/* Act / agenda not placed yet: a slim muted card in the panel's place, same top edge colour. */
.pending {
  flex: 1 1 0; min-width: min(220px, 100%); display: flex; flex-direction: column; justify-content: center; gap: 2px;
  padding: 6px 10px; border-radius: var(--radius, 6px); border: 1px dashed var(--line, #c6a87355);
  border-top: 2px solid var(--tone); background: var(--surface-1, #1f2d25); color: var(--text-muted, #b6bfb0);
}
.pending--agenda { --tone: #d6907f; }
.pending--act { --tone: #86c0d2; }
.pending__eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.68rem; font-weight: 600; color: var(--tone); }
.pending__text { font-size: 0.78rem; font-style: italic; }
.status-main { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 0; }
.chip { display: inline-flex; align-items: center; gap: 5px; padding: 1px 9px; border-radius: 999px; font-size: 0.7rem; background: #0006; white-space: nowrap; }
.chip :deep(.game-icon) { width: 13px; height: 13px; }
.chip--doom { color: #e8a08d; border: 1px solid #c9684f88; }
.chip--clue { color: var(--clue, #8fd0e4); border: 1px solid #5fa8c488; }
/* Clue breakdown popover: opens under the clue track on hover or keyboard focus. */
.clue-hover { position: relative; display: inline-flex; align-items: center; border-radius: 6px; cursor: help; outline: none; }
.clue-hover:focus-visible { box-shadow: 0 0 0 1px var(--accent-gold, #d9b878); }
.clue-pop {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 40; min-width: 190px; max-width: 280px;
  display: flex; flex-direction: column; gap: 2px; padding: 7px 10px 8px; border-radius: 6px;
  background: var(--surface-2, #283a30); border: 1px solid #5fa8c4aa; box-shadow: 0 8px 22px #000c;
  color: var(--text, #f2ecdc); font-size: 0.78rem; line-height: 1.3;
  opacity: 0; visibility: hidden; transform: translateY(-3px); transition: opacity 0.12s, transform 0.12s, visibility 0s 0.12s;
  pointer-events: none;
}
.clue-hover:hover .clue-pop, .clue-hover:focus-visible .clue-pop { opacity: 1; visibility: visible; transform: none; transition: opacity 0.12s, transform 0.12s; }
.clue-pop__head { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding-bottom: 4px; margin-bottom: 2px; border-bottom: 1px solid #ffffff1a; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--clue, #8fd0e4); }
.clue-pop__head b { display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; letter-spacing: 0; color: var(--heading, #fff6e4); }
.clue-pop__head :deep(.game-icon) { width: 13px; height: 13px; }
.clue-pop__row { display: flex; justify-content: space-between; gap: 12px; white-space: nowrap; }
.clue-pop__name { overflow: hidden; text-overflow: ellipsis; }
.clue-pop__row b { color: var(--clue, #8fd0e4); font-variant-numeric: tabular-nums; }
.clue-pop__row--me .clue-pop__name { color: var(--accent-gold, #d9b878); font-weight: 600; }
.clue-pop__row--zero { color: var(--text-muted, #b6bfb0); }
.clue-pop__row--zero b { color: inherit; font-weight: 400; }
.clue-pop--doom { border-color: #c9684faa; }
.clue-pop--doom .clue-pop__head { color: #e8a08d; }
.clue-pop--doom .clue-pop__row b { color: #ff9b86; }
.clue-pop__kind { font-size: 0.66rem; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-muted, #b6bfb0); }
.clue-pop__empty { font-style: italic; color: var(--text-muted, #b6bfb0); }
.note { font-size: 0.7rem; color: var(--text-muted, #9aa597); white-space: nowrap; }

.state { font-size: 0.72rem; font-weight: 600; padding: 1px 9px; border-radius: 999px; white-space: nowrap; }
.state--warn { color: #ffc9a0; background: #6b3a1a66; border: 1px solid #e0915a88; }
.state--critical { color: #ffe3dc; background: var(--doom-soft, #5a1a1466); border: 1px solid #ff5a4acc; animation: doom-pulse 1.2s ease-in-out infinite; }
@keyframes doom-pulse { 50% { box-shadow: 0 0 10px 1px #ff5a4acc; } }

/* Advance: a quiet ghost while the act cannot advance, a glowing green button once it can. */
.advance { flex: none; padding: 2px 11px; border-radius: 999px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.03em; border: 1px dashed #ffffff33; background: transparent; color: #8f9a93; cursor: not-allowed; transition: background 0.15s, transform 0.1s, box-shadow 0.15s; }
.advance--ready { cursor: pointer; border: 1px solid #7ef0a8; background: linear-gradient(180deg, #279a4c, #1b6e35); color: #f4fff7; box-shadow: 0 0 8px #3ddc7a88; animation: advance-pulse 1.5s ease-in-out infinite; }
.advance--ready:hover { background: linear-gradient(180deg, #2fb359, #218340); transform: translateY(-1px); }
@keyframes advance-pulse { 50% { box-shadow: 0 0 12px 2px #5fd88acc; } }

.rules { color: var(--text, #e8e3d0); white-space: pre-line; }
/* One row per printed ability: a coloured edge says whether it can be used right now. */
.ability { padding: 3px 8px; border-radius: 5px; border: 1px solid #ffffff18; border-left: 3px solid #6a716b; background: #ffffff08; }
.ability__text { display: block; font-size: 0.76rem; line-height: 1.35; text-align: left; }
/* Usable: warm gold call-to-action so it never blends into the green act/agenda panel. */
.ability--usable {
  border: 1px solid #e8b860cc; border-left: 4px solid #ffc857;
  background: linear-gradient(180deg, #5a3f12cc, #3d2a0bcc); color: #fff3d6; cursor: pointer;
  box-shadow: 0 0 8px #ffb84455; animation: ability-glow 1.8s ease-in-out infinite;
}
.ability--usable:hover { background: linear-gradient(180deg, #7a5618, #54390f); box-shadow: 0 0 12px #ffc857aa; }
@keyframes ability-glow { 50% { box-shadow: 0 0 12px 1px #ffc85788; } }
.ability--usable .ability__text :deep(b), .ability--usable .ability__text :deep(strong) { color: #ffd98a; }
.ability__use { all: unset; display: block; width: 100%; cursor: pointer; }
.ability__use:focus-visible { outline: 1px solid #ffc857; outline-offset: 2px; }
.ability--usable :deep(button) { background: transparent; border: 0; padding: 0; min-height: 0; color: inherit; cursor: pointer; }
.ability--disabled { color: #a9b0aa; }
.ability--disabled .ability__text :deep(img) { opacity: 0.5; filter: grayscale(1); }


@media (prefers-reduced-motion: reduce) { .state--critical, .advance--ready { animation: none; } }
</style>
