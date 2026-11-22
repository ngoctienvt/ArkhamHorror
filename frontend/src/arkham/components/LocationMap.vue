<script lang="ts" setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { Scenario } from '@/arkham/types/Scenario'
import type { Location } from '@/arkham/types/Location'
import { useGameChoices } from '@/arkham/composables/useGameChoices'
import { useCardNames } from '@/arkham/composables/useCardNames'
import { useElementSize, useEventListener, useResizeObserver, useStorage } from '@vueuse/core'
import { cardArt } from '@/arkham/cardImages'
import {
  extracurricularCommotion, HIGH_GEAR_ISLANDS, hemlockOverview, hemlockVillagePosition, spreadingFlamesFire,
} from '@/arkham/hemlock-overview'
import { essexTrainPosition, hiddenChamberPosition } from '@/arkham/scene-location-art'
import { dunwichCarcosaScene } from '@/arkham/scene-dunwich-carcosa'
import { stageOverview } from '@/arkham/scene-stage-overview'
import { gatheringBarrier } from '@/arkham/scene-gathering-barrier'
import { dunwichProps } from '@/arkham/scene-dunwich-props'
import { excelsiorProps } from '@/arkham/scene-excelsior-props'
import { scarletProps } from '@/arkham/scene-scarlet-props'
import { sceneSharedReference } from '@/arkham/scene-shared-reference'
import { asCardCode } from '@/arkham/types/Card'
import { hiddenSceneArt, revealedScenePositions } from '@/arkham/revealed-scene-positions'
import { readRoadLayout, roadPositions } from '@/arkham/high-gear-road-model'
import { isolatedLocationIds } from '@/arkham/offMapCards'
import { useSettings, type LocationView } from '@/stores/settings'
import {
  compactGridLayout, gridPositions, locationLinks, mapPositions, mineDescentPositions, shortestPath,
  type LocationGraph, type Point,
} from '@/arkham/locationGraph'
import { gridSlotIndex } from '@/arkham/locationChoices'
import LocationMapCanvas, { type ConcealedSpot, type MapMove } from '@/arkham/components/LocationMapCanvas.vue'
import { concealedAt, gridConcealedGroups, positionToGridArea } from '@/arkham/concealedCards'
import { scenePanelOnlyCount } from '@/arkham/sceneTargetFallback'
import { sceneHiddenCardChoices } from '@/arkham/sceneHiddenCardChoices'
import LocationActionPanel from '@/arkham/components/LocationActionPanel.vue'
import LocationHand from '@/arkham/components/LocationHand.vue'
import { ownInvestigator } from '@/arkham/ownInvestigator'
import LocationMissionStrip from '@/arkham/components/LocationMissionStrip.vue'
import LocationMapLegend from '@/arkham/components/LocationMapLegend.vue'
import MapDeckPanel from '@/arkham/components/MapDeckPanel.vue'
import { useMenu } from '@/composable/menu'
import { arrangeMode, hasMapOffsets, resetMapOffsets } from '@/arkham/composables/useMapDrag'
import { useMapViewport } from '@/arkham/composables/useMapViewport'
import { MAP_ZOOM_ENABLED } from '@/arkham/mapViewport'
import { useLocationInfo } from '@/arkham/composables/useLocationInfo'
import { barrierCounts, barriersBetween } from '@/arkham/scenarioBarriers'
import { useTouchMode } from '@/arkham/composables/useTouchMode'
import { barModeFor, isShortMap, widthClassFor, type WidthClass } from '@/arkham/touchLayout'
import { panelModeFor } from '@/arkham/location-panel-mode'
import { sceneActionPanelVisible, sceneActionSidebarKey } from '@/arkham/composables/useScenePanelState'
import { useGameStatusLines } from '@/arkham/composables/useGameStatusLines'
import { fitScreenOn } from '@/arkham/composables/useFitScreen'
import { isOffGrid } from '@/arkham/written-in-rock-caves'
import { dreamGridPositions, WEAVER_FOLDER, weaverEnemies, weaverEnemyIds } from '@/arkham/dream-eaters-scene-model'

const props = defineProps<{
  game: Game
  scenario: Scenario
  playerId: string
  view: Exclude<LocationView, 'cards'>
  /** The scenario shows things only the card board can draw (enemies standing as locations, grid stories, ...). */
  boardOnlyContent: boolean
  decksShown: boolean
  chaosBagShown: boolean
  /** The scenario reference card, shown next to the act and agenda. */
  referenceImage?: string
}>()
const emit = defineEmits<{ (e: 'choose', index: number): void; (e: 'toggleDecks'): void; (e: 'toggleChaosBag'): void }>()

const { t } = useI18n()
const nameOf = useCardNames()
const settings = useSettings()
// Finger or mouse, and the size class of the screen; CSS keys off the two data attributes on the root.
const { input: inputMode, layout: layoutClass, isTouch } = useTouchMode()
// Pinch-zoom and pan of the map; the Arrange button lets a finger drag plates, figures and arrows.
const viewport = useMapViewport()
const canZoom = computed(() => MAP_ZOOM_ENABLED && isTouch.value)
/* The room the map itself has, measured on its own box: the game log beside it and a narrow mouse-driven
 * window both take width the window size says nothing about. `data-width` / `data-height` on the root let
 * the CSS of every part of the scene map read the same answer. */
const root = ref<HTMLElement | null>(null)
const mapLayoutEl = ref<HTMLElement | null>(null)
const { width: mapWidth } = useElementSize(root)
const { height: mapAreaHeight } = useElementSize(mapLayoutEl)
const widthClass = ref<WidthClass>('wide')
let widthMeasured = false
watch(mapWidth, (width) => {
  if (width <= 0) return
  widthClass.value = widthClassFor(width, widthMeasured ? widthClass.value : undefined)
  widthMeasured = true
}, { immediate: true })
const shortMap = computed(() => isShortMap(mapAreaHeight.value))
const actionSidebar = inject(sceneActionSidebarKey, null)
const dockTarget = computed(() => actionSidebar?.target.value ?? null)
const panelVisible = computed(() => !actionSidebar?.pinned.value || !!dockTarget.value)
// On a phone the map keeps the whole width and the action list sits under it instead of over it.
const panelBelow = computed(() => layoutClass.value === 'phone')
// No width to spare beside the picture (a tablet held upright, a narrow window): the action panel is a bottom sheet.
const sheetLayout = computed(() => !dockTarget.value && !panelBelow.value && (layoutClass.value === 'tablet-portrait' || widthClass.value === 'narrow'))
const panelOverlay = computed(() => panelVisible.value && !dockTarget.value && !panelBelow.value)
const panelEl = ref<HTMLElement | null>(null)
const panelTarget = computed(() => dockTarget.value ?? panelEl.value)
const sheetExpanded = ref(false)
const moreOpen = ref(false)
// The "more" menu closes on Escape and on a click anywhere outside it.
useEventListener(window, 'keydown', (event: KeyboardEvent) => { if (event.key === 'Escape') moreOpen.value = false })
useEventListener(document, 'click', () => { moreOpen.value = false })
/* The Deck drop-down. Registered in the View menu as well, which gives it its keyboard shortcut
 * (Game.vue runs menu entries by their binding) and lists it in the shortcuts help. */
const deckPanelOpen = ref(false)
const { addEntry, removeEntry } = useMenu()
onMounted(() => addEntry({
  id: 'viewDecks', content: t('locationMap.deckPanel.title'), nested: 'view', section: 'panels',
  binding: 'viewDecks', action: () => { deckPanelOpen.value = !deckPanelOpen.value },
}))
onBeforeUnmount(() => removeEntry('viewDecks'))
/* The mission strip (agenda / act / reference) starts open; a player who folds it keeps it folded.
 * With little room (a map that is not wide, or a short one) it starts as a row of chips instead, and unfolding it
 * there lasts only until the room is back, so the wide layout keeps the player's own choice. */
const missionCollapsed = useStorage('arkham:mission-strip-collapsed', false)
const tightStrip = computed(() => widthClass.value !== 'wide' || shortMap.value)
const tightStripOpen = ref(false)
const stripFolded = computed(() => (tightStrip.value ? !tightStripOpen.value : missionCollapsed.value))
function toggleStrip() {
  if (tightStrip.value) tightStripOpen.value = !tightStripOpen.value
  else missionCollapsed.value = !missionCollapsed.value
}
// Team panel is hidden by default so the scene map gets the full width.
const teamHidden = useStorage('arkham:team-panel-hidden', true)
/* The controls move into the game bar once its slot is on the page (see Game.vue), except in
 * fit-to-screen, where the game bar is hidden and they would vanish with it. */
const gameBarSlot = ref(false)
/* How much of the game bar is free for the map's controls: its width less its other buttons. Measured on
 * the bar and not on the slot, whose own width is nothing while the controls are out of it. */
const gameBarEl = ref<HTMLElement | null>(null)
const gameBarRoom = ref(0)
function measureGameBar() {
  const bar = gameBarEl.value
  if (!bar) { gameBarRoom.value = 0; return }
  const others = [...bar.children].filter((child) => child.id !== 'game-bar-scene-slot')
  // A game bar that has wrapped onto several lines (a phone) has no row to share.
  const oneRow = others.every((child) => Math.abs(child.getBoundingClientRect().top - others[0].getBoundingClientRect().top) < 8)
  gameBarRoom.value = oneRow ? bar.clientWidth - others.reduce((sum, child) => sum + child.getBoundingClientRect().width, 0) : 0
}
onMounted(() => nextTick(() => {
  const slot = document.getElementById('game-bar-scene-slot')
  gameBarSlot.value = !!slot
  gameBarEl.value = slot?.parentElement ?? null
  measureGameBar()
}))
useResizeObserver(gameBarEl, measureGameBar)
watch(mapWidth, measureGameBar)
const barMode = computed(() => barModeFor(gameBarRoom.value, mapWidth.value))
const barInGameBar = computed(() => gameBarSlot.value && !fitScreenOn.value && barMode.value.inGameBar)
// The less-used buttons fold into the "more" menu whenever the row the bar is on cannot hold them all.
const collapsedBar = computed(() => barMode.value.collapsed)
/* The game log is the only place saying which phase it is and whose turn. While it is closed, the
 * bar carries that line instead; while it is open the bar leaves it out, so it is never said twice. */
const gameLogShown = inject<Ref<boolean>>('gameLogShown', ref(true))
const { phase: phaseLabel, turnOf } = useGameStatusLines(() => props.game, () => props.playerId)
const turnLine = computed(() => (gameLogShown.value ? '' : [phaseLabel.value, turnOf.value].filter(Boolean).join(' · ')))
// The team column only has someone to show when more than one investigator is in the game.
const hasTeam = computed(() => Object.keys(props.game.investigators).length > 1)
const choices = useGameChoices(() => props.game, () => props.playerId)

// The same set the card board draws: attached locations still sit on the map, only ones taken off it are left out.
const placedLocations = computed(() => Object.values(props.game.locations)
  .filter((l) => (l.placement === null || l.placement.tag === 'AttachedToLocation') && l.label !== 'cosmos'))
// Locations on no grid cell and with no connection (Holding Cells) lie in the off-map box beside the reference card.
const isolatedIds = computed(() => new Set(isolatedLocationIds(props.game.locations, props.scenario.locationLayout)))
const locations = computed(() => placedLocations.value.filter((l) => !isolatedIds.value.has(l.id)
  && !isOffGrid(props.scenario.id, props.scenario.locationLayout, l.label)))

const enemiesAt = (l: Location) => l.enemies.filter((id) => props.game.enemies[id]?.placement.tag === 'AtLocation')

// Enemies engaged with an investigator are in that investigator's threat area, not on the location: they still stand in the room.
const enemiesShownAt = (l: Location) => [...new Set([
  ...enemiesAt(l),
  ...l.investigators.flatMap((id) => props.game.investigators[id]?.engagedEnemies ?? []),
])].filter((id) => props.game.enemies[id])

const graph = computed<LocationGraph>(() => Object.fromEntries(locations.value.map((l) => [l.id, {
  id: l.id, label: l.label, connectedLocations: l.connectedLocations,
  investigators: l.investigators, enemies: enemiesAt(l),
}])))

const isStudyOnly = computed(() =>
  locations.value.length === 1 && cardArt(locations.value[0].cardCode) === '01111'
)

/* The Gathering's house, once more than the study is in play: an illustrated board like every other scene,
 * painted with the cutaway picture of the house. Each room's plate sits in that room (percent of the picture),
 * high enough that the people hanging under it stand on the room's floor. Plates drag and links draw as usual. */
const HOUSE_ROOMS: Record<string, Point> = {
  '01111': [52, 64],
  '01112': [56, 42],
  '01113': [47, 10],
  '01114': [42, 76],
  '01115': [84, 44],
}
const housePositions = computed<Record<string, Point> | null>(() => {
  const all = locations.value
  if (all.length < 2 || !all.every((l) => cardArt(l.cardCode) in HOUSE_ROOMS)) return null
  return Object.fromEntries(all.map((l) => [l.id, HOUSE_ROOMS[cardArt(l.cardCode)]]))
})

const isSpreadingFlames = computed(() => props.scenario.id.replace(/^c/, '') === '12105')
const spreadingFlamesState = computed(() => isSpreadingFlames.value
  ? spreadingFlamesFire(Object.values(props.game.agendas), placedLocations.value, props.game.treacheries) : 'none')
const isExtracurricular = computed(() => ['02041', '51012'].includes(props.scenario.id.replace(/^c/, '')))
const campusCommotion = computed(() => isExtracurricular.value
  && extracurricularCommotion(Object.values(props.game.acts), Object.values(props.game.agendas)))

if (import.meta.env.DEV) {
  watch(spreadingFlamesState, (fire) => {
    if (isSpreadingFlames.value) console.debug('[Scene Map] Spreading Flames fire state', { fire })
  }, { immediate: true })
  watch(campusCommotion, (active) => {
    if (isExtracurricular.value) console.debug('[Scene Map] Extracurricular Activity commotion', { active })
  }, { immediate: true })
}

const illustratedBoard = computed(() => {
  if (isStudyOnly.value) {
    return { image: 'img/scenes/night-of-the-zealot/study.webp', fixedPassages: false, village: true }
  }
  if (housePositions.value) {
    return gatheringBarrier(
      { image: 'img/scenes/night-of-the-zealot/house-cutaway.webp', fixedPassages: false, village: true },
      props.scenario.id, locations.value,
    )
  }
  const shared = sceneSharedReference(props.scenario.id)
  const board = hemlockOverview(
    shared ?? props.scenario.id, shared ?? props.scenario.reference, props.scenario.locationLayout,
    locations.value.map((l) => l.label),
    locations.value.map((l) => l.cardCode),
    props.game.campaign?.log ?? props.scenario.standaloneCampaignLog,
    spreadingFlamesState.value,
    shared ? false : campusCommotion.value,
    shared ? [] : Object.values(props.game.agendas),
  )
  const campaignBoard = shared ? board : dunwichCarcosaScene(board, {
    acts: Object.values(props.game.acts),
    agendas: Object.values(props.game.agendas),
    locations: locations.value,
    reminders: props.scenario.cardsNextToActDeck.map(asCardCode),
  })
  const stagedBoard = stageOverview(campaignBoard, {
    id: props.scenario.id, layout: props.scenario.locationLayout,
    locations: locations.value, acts: Object.values(props.game.acts),
    agendas: Object.values(props.game.agendas), enemies: Object.values(props.game.enemies),
    meta: props.scenario.meta, counts: props.scenario.counts, stories: Object.values(props.game.stories),
  })
  const withZealotAndDunwich = dunwichProps(gatheringBarrier(stagedBoard, props.scenario.id, locations.value), props.scenario.id, locations.value)
  return scarletProps(excelsiorProps(withZealotAndDunwich, props.scenario.id, locations.value), props.scenario.id, locations.value)
})

if (import.meta.env.DEV) {
  watch(() => {
    const board = illustratedBoard.value
    return board ? [board.image, ...(board.layers ?? []).map((layer) => layer.image),
      ...(board.figures ?? []).map((figure) => figure.image)].join('|') : undefined
  }, (artwork, previous) => {
    if (artwork && previous && artwork !== previous) {
      console.debug('[Scene Map] Artwork changed', { scenario: props.scenario.id, previous, artwork })
    }
  })
}

const weaverRing = computed(() => illustratedBoard.value?.image.endsWith('/weaver/bg-ring.webp') === true)
const hiddenLocationArt = computed(() => illustratedBoard.value?.islands || illustratedBoard.value?.stageArt
  ? undefined : hiddenSceneArt(props.scenario.id))
const dreamPositions = computed(() => dreamGridPositions(
  illustratedBoard.value?.islands, props.scenario.locationLayout ?? [], weaverRing.value,
))
const weaver = computed(() => illustratedBoard.value?.islands === WEAVER_FOLDER && weaverRing.value
  ? weaverEnemies(Object.values(props.game.enemies), locations.value) : undefined)
const mapEnemySet = computed(() => weaverEnemyIds(weaver.value))
const visibleEnemiesAt = (location: Location) => enemiesShownAt(location).filter((id) => !mapEnemySet.value.has(id))

// Horror in High Gear: tiles span several rows of a column, so the road has its own reader (not compactGridLayout).
const roadGrid = computed(() => illustratedBoard.value?.islands === HIGH_GEAR_ISLANDS
  ? readRoadLayout(props.scenario.locationLayout) : undefined)
const layout = computed(() => {
  if (roadGrid.value) return null
  const rows = props.scenario.usesGrid || props.scenario.locationLayout ? props.scenario.locationLayout : null
  // The Cosmos pads its grid with a ring of open cells; keep only what the card board shows, which is the
  // cards plus any cell a choice offers, so the map reads the same as the card board.
  if (!rows || !illustratedBoard.value?.islands) return rows
  const keep = new Set([
    ...locations.value.map((l) => l.label),
    ...rows.flatMap((row) => row.trim().split(/\s+/)).filter((label) => gridSlotIndex(choices.value, label) !== -1),
  ])
  return compactGridLayout(rows, keep)
})
const positions = computed<Record<string, Point>>(() => {
  if (isStudyOnly.value) {
    return { [locations.value[0].id]: [50, 75] }
  }
  if (housePositions.value) return housePositions.value
  const fallback = mapPositions(graph.value, layout.value)
  if (roadGrid.value) {
    const road = roadPositions(roadGrid.value)
    return Object.fromEntries(locations.value.map((l) => [l.id, road[l.label] ?? fallback[l.id]]))
  }
  if (dreamPositions.value) return Object.fromEntries(locations.value.map((l) => [
    l.id, dreamPositions.value?.[l.label] ?? fallback[l.id],
  ]))
  if (illustratedBoard.value?.fixedPassages) return mineDescentPositions(graph.value, fallback)
  const board = illustratedBoard.value
  if (board?.positions) return { ...fallback, ...board.positions }
  const revealed = !board?.islands && !board?.stageArt && revealedScenePositions(props.scenario.id, locations.value, fallback)
  if (revealed) return revealed
  if (!board?.village || board.islands) return fallback
  const art = board.layoutArt ?? board.image.slice('img/scenes/'.length, -'.webp'.length)
  const essex = art === 'the-dunwich-legacy/essex-county-rails'
  const placed = Object.fromEntries(locations.value.map((location) => [
    location.id,
    (essex ? essexTrainPosition(location.label) : hemlockVillagePosition(
      location.cardCode, board.anchors, location.label, board.revealRoomAnchors && location.revealed,
    )) ?? fallback[location.id],
  ]))
  if (art === 'the-dunwich-legacy/blood-on-the-altar') {
    const chamber = locations.value.find((location) => cardArt(location.cardCode) === '02214')
    const entrance = chamber?.connectedLocations.find((id) => placed[id])
    if (chamber && entrance) placed[chamber.id] = hiddenChamberPosition(placed[entrance])
  }
  return placed
})
// Holding Cells is reached only by being captured: the card data lets Lantern Room link to it, but no road leads there.
const NO_ROAD_CARDS = new Set(['c07252b'])
// Court of the Ancients: Unstable Foundations joins every room to the ones above and below it for the enemy phase and
// tags those joins "do not draw" (the card board honours that; they are not roads of the tower). Only this scenario
// hides tagged joins: elsewhere the tag also marks real roads (A Light in the Fog's row rails, the Western Wall).
const HIDE_TAGGED_LINKS = new Set(['11612'])
const hiddenLinkKeys = computed(() => {
  if (!HIDE_TAGGED_LINKS.has(props.scenario.id.replace(/^c/, ''))) return new Set<string>()
  return new Set(Object.values(props.game.locations).flatMap((l) => l.modifiers.flatMap((m) => {
    const type = (m as { type?: { tag?: string; contents?: unknown } }).type
    if (type?.tag !== 'DoNotDrawConnection' || !Array.isArray(type.contents)) return []
    const [a, b] = type.contents as [string, string]
    return [`${a}:${b}`, `${b}:${a}`]
  })))
})
const links = computed(() => locationLinks(graph.value).filter(([a, b]) =>
  !hiddenLinkKeys.value.has(`${a}:${b}`)
  && ![a, b].some((id) => NO_ROAD_CARDS.has(props.game.locations[id]?.cardCode ?? ''))))

// Empty grid slots a choice can fill (placing a location), drawn as dashed outlines.
const gridSpots = computed(() => {
  const rows = layout.value
  if (!rows || !props.scenario.usesGrid) return []
  const used = new Set(locations.value.map((l) => l.label))
  const spots = gridPositions(rows)
  const squeeze = locations.value.some((l) => !(l.label in spots)) && locations.value.some((l) => l.label in spots)
  return Object.entries(spots)
    .filter(([label]) => !used.has(label) && gridSlotIndex(choices.value, label) !== -1)
    .map(([label, [x, y]]) => {
      const anchor = illustratedBoard.value?.anchors?.[label]
      return { label, x: anchor?.[0] ?? x, y: anchor?.[1] ?? (squeeze ? y * 0.8 : y), index: gridSlotIndex(choices.value, label) }
    })
})

// Concealed mini-cards in grid positions (Without a Trace, Congress of the Keys), drawn where that cell
// sits on the map, the way gridSpots places an empty slot. One whose cell is not in the layout goes to
// the bottom edge rather than vanishing, since a choice may still need it.
const concealedSpots = computed<ConcealedSpot[]>(() => {
  const groups = gridConcealedGroups(props.game, props.scenario)
  if (groups.length === 0) return []
  const spots = gridPositions(layout.value ?? [])
  const squeeze = locations.value.some((l) => !(l.label in spots)) && locations.value.some((l) => l.label in spots)
  return groups.map((group, i) => {
    const label = positionToGridArea(group.position)
    const at = spots[label]
    const cards = [...group.unknown, ...group.known]
    if (!at) return { key: label, x: 8 + ((i * 12) % 84), y: 94, cards }
    return { key: label, x: at[0], y: squeeze ? at[1] * 0.8 : at[1], cards }
  })
})
const concealedOf = (l: Location) => concealedAt(props.game, l)
const mapLocationIds = computed(() => placedLocations.value.map((l) => l.id))
// Choices for cards the scene cannot draw as clickable need the action panel.
const panelOnlyCount = computed(() =>
  scenePanelOnlyCount(props.game, choices.value, new Set(mapLocationIds.value), me.value?.id ?? null, mapEnemySet.value)
  + sceneHiddenCardChoices(props.game, choices.value).length)

const canvasSize = computed(() => {
  const rows = layout.value?.map((r) => r.trim().split(/\s+/)) ?? []
  const n = locations.value.length
  const cols = rows.length ? Math.max(...rows.map((r) => r.length)) : Math.ceil(Math.sqrt(n * 1.6))
  const grid = gridPositions(layout.value ?? [])
  const stripRow = rows.length && locations.value.some((l) => !(l.label in grid)) ? 1 : 0
  const lines = (rows.length || Math.ceil(n / Math.max(cols, 1))) + stripRow
  return { width: Math.max(cols, 1) * 150, height: Math.max(lines, 2) * 120 }
})

// Moving weather on boards that have it (Devil Reef's storm); a player can still it.
const weather = useStorage('arkham-map-weather', true)

const me = computed(() => ownInvestigator(props.game, props.playerId))
const myLocation = computed(() => me.value?.location ?? null)
const selectedId = ref<string | null>(null)
const selected = computed(() => {
  const id = selectedId.value
  if (id && props.game.locations[id] && (graph.value[id] || isolatedIds.value.has(id))) return props.game.locations[id]
  const mine = myLocation.value
  if (mine && graph.value[mine]) return props.game.locations[mine]
  return locations.value[0] ?? null
})
// Following the investigator: once they move, the scene follows rather than staying on the room they left.
watch(myLocation, () => { selectedId.value = null })

const neighbours = computed(() => (selected.value?.connectedLocations ?? [])
  .map((id) => props.game.locations[id]).filter((l): l is Location => Boolean(l) && Boolean(graph.value[l.id])))

const buildInfo = useLocationInfo(() => props.game, () => props.playerId, () => choices.value, enemiesShownAt)
// Built once per update, so every plate, the scene and the card read the same snapshot.
const infos = computed(() => new Map(placedLocations.value.map((l) => [l.id, buildInfo(l)])))
const infoOf = (l: Location) => infos.value.get(l.id) ?? buildInfo(l)
// The action panel describes where you stand (or the selected location when you stand nowhere).
const panelLocation = computed<Location | null>(() => props.game.locations[myLocation.value ?? ''] ?? selected.value ?? null)

// --- looking at a location never sends a choice, picking one is a separate click. The action panel
// describes the location that was clicked until the player goes back to the actions where they stand. ---
const inspectedId = ref<string | null>(null)
const inspected = computed(() => {
  const id = inspectedId.value
  return id && props.game.locations[id] && (graph.value[id] || isolatedIds.value.has(id)) ? props.game.locations[id] : null
})
// Barriers on links (In Too Deep): drawn on the link badges and counted on the info card's connection chips.
const barriers = computed(() => barrierCounts(props.scenario.meta))
const inspectedConnections = computed(() => (inspected.value?.connectedLocations ?? [])
  .map((id) => props.game.locations[id]).filter((l): l is Location => Boolean(l) && Boolean(graph.value[l.id]))
  .map((l) => {
    const info = infoOf(l)
    return { id: l.id, name: info.face.name, revealed: info.revealed, barriers: barriersBetween(barriers.value, inspected.value!.id, l.id) }
  }))
watch(() => panelOnlyCount.value > 0, (needed) => {
  if (!needed) return
  if (actionSidebar?.pinned.value) actionSidebar.open()
  else sheetExpanded.value = true
}, { immediate: true })
// The investigator card leaves out its own End turn while this panel (which carries one) is showing.
watch(panelVisible, (visible) => { sceneActionPanelVisible.value = visible }, { immediate: true })
if (import.meta.env.DEV) {
  watch([panelVisible, dockTarget, panelBelow, sheetLayout], ([visible, dock, below, sheet]) => {
    console.debug('[Scene Map] Action panel layout', { visible, docked: !!dock, below, sheet })
  }, { immediate: true, flush: 'post' })
}
// Focus goes back to the plate that was clicked once the player is done looking.
const anchorEl = ref<HTMLElement | null>(null)
const viewing = computed(() => panelModeFor(inspected.value?.id ?? null, panelLocation.value?.id ?? null) === 'viewing')

function inspect(l: Location, anchor: HTMLElement | null) {
  selectedId.value = l.id
  // The location you stand on is what the panel describes anyway: clicking it only brings the panel up.
  inspectedId.value = l.id === panelLocation.value?.id ? null : l.id
  if (anchor) anchorEl.value = anchor
  if (actionSidebar?.pinned.value) actionSidebar.open()
  if (inspectedId.value && sheetLayout.value) sheetExpanded.value = true
  // On a phone the panel is below the map in the page: bring it into view.
  if (panelBelow.value) nextTick(() => panelEl.value?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))
}
function inspectById(id: string) {
  const l = props.game.locations[id]
  if (l) inspect(l, null)
}
function stopInspecting() {
  if (!inspectedId.value) return
  const back = anchorEl.value?.querySelector<HTMLElement>('button') ?? anchorEl.value
  inspectedId.value = null
  back?.focus()
}
useEventListener(window, 'keydown', (event: KeyboardEvent) => { if (event.key === 'Escape') stopInspecting() })
// The view is rebuilt from the live state; once its location leaves the map it ends.
watch(inspected, (l) => { if (!l) inspectedId.value = null })

// --- enemy movement: a dot travels along the links an enemy took since the last update ---
const moves = ref<MapMove[]>([])
let previousEnemyAt: Record<string, string> | null = null
let previousScenario = props.scenario.id
let clearTimer: ReturnType<typeof setTimeout> | null = null

const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

watch(graph, (g) => {
  const now: Record<string, string> = {}
  for (const l of Object.values(g)) for (const e of l.enemies) now[e] = l.id
  if (props.scenario.id !== previousScenario) previousEnemyAt = null
  previousScenario = props.scenario.id
  const before = previousEnemyAt
  previousEnemyAt = now
  if (!before || reducedMotion) { moves.value = []; return }
  moves.value = Object.entries(now).flatMap(([enemyId, to]) => {
    const from = before[enemyId]
    if (!from || from === to) return []
    const path = shortestPath(g, from, to)
    const points = path.map((id) => positions.value[id]).filter(Boolean)
    if (points.length < 2) return []
    const enemy = props.game.enemies[enemyId]
    return [{ id: enemyId, name: enemy ? nameOf(enemy.cardCode) : '', path: points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ') }]
  })
  if (clearTimer) clearTimeout(clearTimer)
  clearTimer = setTimeout(() => { moves.value = [] }, 1800)
}, { immediate: true })

onBeforeUnmount(() => { if (clearTimer) clearTimeout(clearTimer); arrangeMode.value = false; sceneActionPanelVisible.value = false })

const views: LocationView[] = ['map', 'cards']
</script>

<template>
  <section ref="root" class="location-map" :data-input="inputMode" :data-layout="layoutClass" :data-width="widthClass" :data-height="shortMap ? 'short' : 'tall'"
    :data-sheet="sheetLayout" :data-strip="tightStrip ? 'tight' : 'full'" :data-arrange="arrangeMode" :aria-label="t('locationMap.title')">
    <!-- The map's controls live in the game bar (beside Campaign / View ...) so the board has one toolbar.
         In fit-to-screen the game bar is hidden, so they stay here, above the mission strip.
         Left: what the main area shows (segmented) and the action panel. Right: tools, then the strip fold. -->
    <Teleport defer to="#game-bar-scene-slot" :disabled="!barInGameBar">
    <div class="map-bar" :class="{ 'map-bar--in-game-bar': barInGameBar }" :data-input="inputMode" :data-width="widthClass">
      <div class="bar-group">
        <span class="views" role="tablist">
          <button v-for="v in views" :key="v" class="view" :class="{ active: v === view }" role="tab"
            :aria-selected="v === view" @click="settings.setLocationView(v)">{{ t(`locationMap.view.${v}`) }}</button>
        </span>
        <span v-if="turnLine" class="turn-line" role="status">{{ turnLine }}</span>
        <span v-if="boardOnlyContent" class="board-note">{{ t('locationMap.boardOnly') }}</span>
      </div>
      <div class="bar-group bar-group--tools">
        <button v-if="collapsedBar" class="view more" :class="{ active: moreOpen }" :aria-expanded="moreOpen"
          :aria-label="t('locationMap.moreOptions')" @click.stop="moreOpen = !moreOpen">⋯</button>
        <!-- When the row cannot hold them all, the less-used buttons fold into the ⋯ menu so the bar stays on one line. -->
        <div class="bar-extras" :class="{ collapsed: collapsedBar, open: moreOpen }" @click.stop>
          <button v-if="isTouch" class="view view--tool arrange" :class="{ active: arrangeMode }" :aria-pressed="arrangeMode"
            @click="arrangeMode = !arrangeMode">{{ t('locationMap.arrange') }}</button>
          <button v-if="hasTeam" class="view view--tool" :class="{ active: !teamHidden }" :aria-pressed="!teamHidden"
            @click="teamHidden = !teamHidden">{{ t('locationMap.team') }}</button>
          <button v-if="illustratedBoard?.weather" class="view view--tool" :class="{ active: weather }" :aria-pressed="weather"
            @click="weather = !weather">{{ t('locationMap.weather') }}</button>
          <button v-if="hasMapOffsets(game.id)" class="view view--tool" @click="resetMapOffsets(game.id)">{{ t('locationMap.resetLayout') }}</button>
          <LocationMapLegend />
          <!-- Deck: a drop-down with every deck, its discard and the set-aside cards (shortcut in the View menu). -->
          <span class="deck-anchor">
            <button class="view view--tool decks deck-panel-toggle" :class="{ active: deckPanelOpen || decksShown }" :aria-expanded="deckPanelOpen"
              :title="t('locationMap.deckPanel.title')" @click="deckPanelOpen = !deckPanelOpen">{{ t('locationMap.decks') }}</button>
            <MapDeckPanel v-if="deckPanelOpen" :game="game" :scenario="scenario" :playerId="playerId"
              @choose="emit('choose', $event)" @close="deckPanelOpen = false" @openBoard="deckPanelOpen = false; emit('toggleDecks')" />
          </span>
        </div>
        <!-- The game log, out of the sidebar: opens in a floating window to read back or undo. -->
        <button v-if="actionSidebar?.pinned.value" class="view view--log" :class="{ active: actionSidebar.logOpen.value }"
          :aria-expanded="actionSidebar.logOpen.value" @click.stop="actionSidebar.toggleLog()">{{ t('locationMap.log') }}</button>
        <button class="view view--icon" :aria-expanded="!stripFolded"
          :title="stripFolded ? t('locationMap.expandStrip') : t('locationMap.collapseStrip')"
          :aria-label="stripFolded ? t('locationMap.expandStrip') : t('locationMap.collapseStrip')"
          @click="toggleStrip">{{ stripFolded ? '▾' : '▴' }}</button>
      </div>
    </div>
    </Teleport>
    <p v-if="arrangeMode" class="arrange-hint" role="status">{{ t('locationMap.arrangeHint') }}</p>
    <LocationMissionStrip :game="game" :scenario="scenario" :playerId="playerId" :referenceImage="referenceImage" :collapsed="stripFolded"
      :sprites="illustratedBoard?.islands ? { folder: illustratedBoard.islands, infoOf, enemiesAt: visibleEnemiesAt } : undefined"
      @choose="emit('choose', $event)" @inspect="inspect" />
    <div ref="mapLayoutEl" class="map-layout" :class="[view, { 'panel-open': panelOverlay, 'sheet-layout': sheetLayout }]" @click="inspectedId = null">
      <div id="scene-team-slot" class="team-slot" :class="{ 'team-slot--hidden': teamHidden }"></div>
      <LocationMapCanvas :illustrated-board="illustratedBoard" :game="game" :playerId="playerId" :locations="locations"
        :positions="positions" :links="links" :moves="moves" :gridSpots="gridSpots" :selectedId="selected?.id ?? null"
        :enemiesAt="visibleEnemiesAt" :concealedAt="concealedOf" :concealedSpots="concealedSpots" :infoOf="infoOf" :barriers="barriers" :width="canvasSize.width" :height="canvasSize.height" :viewport="viewport" :weather="weather" :weaver="weaver" :dreamPositions="dreamPositions" :roadGrid="roadGrid" :hiddenLocationArt="hiddenLocationArt"
        @inspect="inspect" @choose="emit('choose', $event)" />
      <div v-if="canZoom" class="zoom-controls" role="group" :aria-label="t('locationMap.zoomReset')">
        <button type="button" :aria-label="t('locationMap.zoomIn')" :disabled="!viewport.canZoomIn.value" @click.stop="viewport.zoomIn()">+</button>
        <button type="button" :aria-label="t('locationMap.zoomOut')" :disabled="!viewport.zoomed.value" @click.stop="viewport.zoomOut()">−</button>
        <button type="button" :aria-label="t('locationMap.zoomReset')" :disabled="!viewport.zoomed.value" @click.stop="viewport.reset()">⟲</button>
      </div>
      <Teleport v-if="panelVisible" :to="panelTarget" :disabled="!panelTarget">
        <LocationActionPanel
          :class="dockTarget ? 'action-docked' : panelBelow ? 'action-below' : 'action-overlay'"
          :data-input="inputMode" :game="game" :playerId="playerId"
          :location="panelLocation" :info="panelLocation ? infoOf(panelLocation) : null" :mapLocationIds="mapLocationIds" :mapEnemyIds="mapEnemySet"
          :sheet="sheetLayout" :expanded="sheetExpanded" :compact="!!dockTarget || (!panelBelow && shortMap)"
          :inspected="viewing ? inspected : null" :inspectedInfo="viewing && inspected ? infoOf(inspected) : null" :connections="inspectedConnections"
          @click.stop @toggleSheet="sheetExpanded = !sheetExpanded" @choose="emit('choose', $event)" @inspect="inspectById" @back="stopInspecting" />
      </Teleport>
    </div>
    <div v-if="panelBelow" ref="panelEl" class="action-below-wrap" />
    <LocationHand :game="game" :playerId="playerId" @choose="emit('choose', $event)" />
  </section>
</template>

<style scoped>
.location-map { display: flex; flex-direction: column; min-height: 380px; height: calc(100dvh - 60px - var(--hand-h, 0px)); flex: none; overflow: hidden; background: radial-gradient(ellipse at 50% 45%, #2c3a28, #0e1610 78%); }
/* Touch sizing tokens for everything inside the scene map. With a mouse --tap-min is 0, so rules that use it change nothing. */
.location-map { --tap-min: 0px; --tap-gap: 0px; --sheet-max: 56dvh; --sheet-peek: 28dvh; }
/* Shared scene palette: every panel on the map (mission strip, tab bar, action panel) reads these so
 * they stay one dark-and-brass theme instead of each hard-coding its own shades. */
.location-map, .map-bar, .action-docked {
  --surface-0: #16221b; --surface-1: #1f2d25; --surface-2: #283a30; --surface-3: #31463a;
  --line: #c6a87355; --line-strong: #c6a873aa;
  --text: #f2ecdc; --text-muted: #b6bfb0; --text-flavor: #cdd4c2; --heading: #fff6e4;
  --accent-gold: #d9b878; --accent-gold-soft: #c6a87326;
  --doom: #ff7a64; --doom-soft: #5a1a1466; --clue: #8fd0e4; --ready: #5fd88a; --ready-soft: #1f7a3d;
  --radius: 6px; --radius-lg: 8px; --shadow: 0 2px 10px #0009; --shadow-pop: 0 8px 24px #000b;
  /* Location states, read by the plates, the legend and the info card. */
  --state-here: #ffe9a0; --state-move: #8fd19a; --state-target: #f2d27a; --state-hidden: #9a9d98;
  --focus-ring: 2px solid #ffe9a0;
  /* Widths the map keeps clear for the floating columns: the action panel on the right, the team on the left. */
  --panel-w: 280px; --panel-gap: 12px; --team-w: 242px;
  /* How far the resting hand cards reach up over the bottom of the map (they stand taller than the room the
   * page leaves under the map). Whatever is pinned to the map's bottom edge stops above it. */
  --hand-overlap: max(0px, calc(var(--hand-cover, 0px) - var(--hand-h, 0px)));
}
/* A map of middling width keeps the action panel as a column, only slimmer. */
.location-map[data-width='medium'] { --panel-w: 240px; }
/* Tablets: the team becomes a strip across the top of the map instead of a column down the left, so the
 * map keeps its width; held upright, the action panel is a bottom sheet instead of a column on the right. */
.location-map[data-layout^='tablet'] .team-slot { top: 8px; bottom: auto; left: 12px; right: 12px; width: auto; flex-direction: row; flex-wrap: wrap; gap: 6px; }
.location-map[data-layout='tablet-landscape'] .map-layout.panel-open .team-slot { right: calc(var(--panel-w) + 2 * var(--panel-gap)); }
.location-map[data-layout^='tablet'] .team-slot:not(:empty):not(.team-slot--hidden) ~ .map-scroll { padding-left: 0; padding-top: 56px; }
/* No width beside the picture (a tablet held upright, a narrow window): the action panel is a bottom sheet. */
.location-map[data-sheet='true'] .map-layout.sheet-layout.panel-open > .map-scroll { padding-right: 0; padding-bottom: calc(var(--sheet-peek) + var(--hand-overlap)); }
.location-map[data-sheet='true'] .action-overlay { left: 0; right: 0; top: auto; bottom: var(--hand-overlap); width: auto; }
/* Arrange mode and the zoom buttons. */
.arrange-hint { margin: 0; padding: 4px 12px; background: #c6a87326; border-bottom: 1px solid #c6a87355; color: #f0dfb5; font-size: 0.8rem; text-align: center; }
.location-map[data-arrange='true'] :deep(.node.draggable), .location-map[data-arrange='true'] :deep(.connection-arrow.draggable), .location-map[data-arrange='true'] :deep(.fig) { outline: 2px dashed #e6c584; outline-offset: 2px; }
.zoom-controls { position: absolute; left: 12px; bottom: 12px; z-index: 56; display: grid; gap: var(--tap-gap, 8px); }
.location-map[data-sheet='true'] .map-layout.panel-open .zoom-controls { bottom: calc(12px + var(--sheet-peek) + var(--hand-overlap)); }
.zoom-controls button { width: var(--tap-min, 44px); height: var(--tap-min, 44px); display: grid; place-items: center; background: #101a14e6; border: 1px solid #c6a873aa; border-radius: 8px; color: #f0dfb5; font-size: 1.3rem; cursor: pointer; touch-action: manipulation; }
.zoom-controls button:disabled { opacity: 0.4; }
/* The ⋯ menu of a tablet held upright. */
.bar-extras { display: contents; }
.deck-anchor { position: relative; display: inline-flex; }
.bar-extras.collapsed { display: none; }
.bar-extras.collapsed.open { display: grid; gap: var(--tap-gap, 8px); position: absolute; right: 12px; top: calc(100% + 4px); z-index: 95; padding: 10px; background: #101a14; border: 1px solid #c6a873; border-radius: 8px; box-shadow: 0 10px 30px #000c; }
.location-map[data-input='touch'] { --tap-min: 44px; --tap-gap: 8px; }
/* Fingers: bigger buttons on the bar, no double-tap zoom or grey flash on buttons, and no text selection or
 * iOS callout when pressing plates and figures (the info card keeps selectable text). */
.location-map[data-input='touch'] .map-bar { flex-wrap: wrap; row-gap: var(--tap-gap); }
.location-map[data-input='touch'] .view { min-height: var(--tap-min); padding: 0 16px; font-size: 0.8rem; }
.location-map[data-input='touch'] .views { gap: var(--tap-gap); }
.location-map[data-input='touch'] :deep(button),
.location-map[data-input='touch'] :deep([role='button']) { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
.location-map[data-input='touch'] .map-bar,
.location-map[data-input='touch'] .map-layout { user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
.location-map[data-input='touch'] :deep(.panel .about) { user-select: text; -webkit-user-select: text; -webkit-touch-callout: default; }
.map-bar { position: relative; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 5px 12px; background: var(--surface-0); border-bottom: 1px solid var(--line); }
.bar-group { display: flex; align-items: center; gap: 8px; min-width: 0; }
.bar-group--tools { gap: 4px; }
/* The two views read as one segmented control: a shared frame, the chosen half filled brass. */
.views { display: inline-flex; padding: 2px; gap: 2px; border: 1px solid var(--line-strong); border-radius: 6px; background: #0006; }
.views .view { border-color: transparent; }
.view { white-space: nowrap; min-height: 24px; padding: 3px 12px; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; background: transparent; border: 1px solid #75836b55; border-radius: 4px; color: #b4bdab; cursor: pointer; transition: background 0.15s, border-color 0.15s, color 0.15s; }
.view:hover { border-color: var(--accent-gold); color: #e7dcc0; }
.view:focus-visible { outline: 1px solid var(--accent-gold); outline-offset: 2px; }
/* One active look for every toggle: brass fill, dark text. */
.view.active { background: var(--accent-gold); border-color: var(--accent-gold); color: #191c16; font-weight: 650; }
.view--tool { border-color: transparent; }
/* The log button stands out: solid gold, dark text; pressed in (darker gold) while the log is open. */
.view--log { background: var(--accent-gold, #d9b878); border-color: var(--accent-gold, #d9b878); color: #191c16; font-weight: 700; box-shadow: 0 0 8px #d9b87855; }
.view--log:hover { background: #e8c98a; border-color: #e8c98a; color: #191c16; }
.view--log.active { background: #b8955a; border-color: #b8955a; box-shadow: inset 0 1px 3px #0006; }
.view--icon { width: 28px; padding: 3px 0; font-size: 0.8rem; letter-spacing: 0; border-color: var(--line); }
/* A bar on its own row over a narrow map: Map / Card board / Actions share the width, the tools stay at the right end. */
.map-bar[data-width='narrow']:not(.map-bar--in-game-bar) { gap: 6px; padding: 5px 8px; }
.map-bar[data-width='narrow']:not(.map-bar--in-game-bar) .bar-group:first-child { flex: 1; gap: 6px; }
.map-bar[data-width='narrow']:not(.map-bar--in-game-bar) .view { padding-left: 8px; padding-right: 8px; letter-spacing: 0.03em; }
.map-bar[data-input='touch'][data-width='narrow'] .view--icon, .map-bar[data-input='touch'][data-width='narrow'] .more { width: var(--tap-min); padding: 0; }
/* Buttons folded into the "more" menu read as a list: left-aligned, one per line. */
.bar-extras.collapsed.open :deep(button) { justify-content: flex-start; text-align: left; }
/* Inside the game bar: no strip of its own, it fills the bar's free middle, tools pushed right with a divider. */
.map-bar--in-game-bar { flex: 1; min-width: 0; padding: 0 8px; background: transparent; border-bottom: 0; border-left: 1px solid #ffffff1a; }
.map-bar--in-game-bar .view { padding: 2px 10px; font-size: 0.7rem; }
.map-bar--in-game-bar .views { padding: 1px; }
.map-bar[data-input='touch'] { flex-wrap: wrap; row-gap: var(--tap-gap); }
.map-bar[data-input='touch'] .view { min-height: var(--tap-min); padding: 0 16px; font-size: 0.8rem; }
.map-bar[data-input='touch'] { --tap-min: 44px; --tap-gap: 8px; }
.bar-extras :deep(button) { min-height: 24px; font-size: 0.72rem; }
.board-note { font-size: 0.72rem; color: #d8b68c; }
.turn-line { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.74rem; color: var(--text-muted); }
.map-bar[data-width='narrow'] .turn-line { display: none; }
.map-layout { position: relative; display: flex; flex: 1 1 300px; min-height: 300px; }
.map-layout > .map-scroll { box-sizing: border-box; }
.map-layout.panel-open > .map-scroll { padding-right: calc(var(--panel-w) + 2 * var(--panel-gap)); }
.team-slot--hidden { display: none; }
.team-slot:not(:empty):not(.team-slot--hidden) ~ .map-scroll { padding-left: calc(var(--team-w) + var(--panel-gap)); }
/* The panel stops above the resting hand cards, so End turn at its foot is never under a card. */
.action-overlay { position: absolute; right: var(--panel-gap); top: var(--panel-gap); bottom: calc(var(--panel-gap) + var(--hand-overlap)); height: auto; z-index: 60; }
.mini-map { position: absolute; left: 12px; bottom: 12px; z-index: 50; width: clamp(240px, 24vw, 380px); aspect-ratio: 4 / 3; padding: 6px; background: #0b130ee6; border: 1px solid #c6a873aa; border-radius: 8px; box-shadow: 0 6px 20px #000a; }
.mini-map :deep(.map-scroll) { width: 100%; height: 100%; }
.map-layout > :not(.team-slot):not(.action-overlay):not(.mini-map):not(.zoom-controls) { flex: 1; min-width: 0; }
.team-slot { position: absolute; left: 12px; top: 84px; bottom: 12px; z-index: 55; width: var(--team-w); display: flex; flex-direction: column; pointer-events: none; }
@media (max-width: 800px) { .team-slot { width: calc(100% - 24px); bottom: auto; } }
/* Phone: the action list follows the map in the page, full width, clear of the hand fixed at the bottom. */
.location-map .action-below { position: static; flex: none; width: auto; max-height: none; margin: 8px 12px calc(12px + var(--hand-cover, 0px)); overflow: visible; }
.action-below-wrap { flex: none; }
/* The map gets about half the screen: enough for the plates to stand clear of each other, with the top
 * of the action list still in view under it. */
.location-map[data-layout='phone'] { height: auto; overflow: visible; }
.location-map[data-layout='phone'] .map-layout { flex: none; min-height: 0; height: clamp(300px, 52dvh, 560px); }
</style>
