<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { Location } from '@/arkham/types/Location'
import { cardImage, portraitImage } from '@/arkham/cardImages'
import { useCardNames } from '@/arkham/composables/useCardNames'
import { ownInvestigator } from '@/arkham/ownInvestigator'
import type { MapLocationInfo } from '@/arkham/composables/useLocationInfo'
import type { HemlockOverview } from '@/arkham/hemlock-overview'
import { islandAspect, islandImage, islandRails, islandSpotImage, islandWaterImage, vehicleSprite } from '@/arkham/scene-island-sprites'
import { riders, sceneVehicles } from '@/arkham/scene-vehicle-model'
import { roadAdvanced, roadSlides, type RoadGrid } from '@/arkham/high-gear-road-model'
import SceneVehicle from '@/arkham/components/SceneVehicle.vue'
import SceneWeather from '@/arkham/components/SceneWeather.vue'
import SceneAtlachNacha from '@/arkham/components/SceneAtlachNacha.vue'
import { STAIRS_FOLDER, stairsRotation, type weaverEnemies } from '@/arkham/dream-eaters-scene-model'
import { foldRowLinks, locationLinkDirection, mineDescentPassage, type Point } from '@/arkham/locationGraph'
import LocationMarkerPlate from '@/arkham/components/LocationMarkerPlate.vue'
import LocationStandees from '@/arkham/components/LocationStandees.vue'
import LocationConcealedStack from '@/arkham/components/LocationConcealedStack.vue'
import LocationEnemyChips from '@/arkham/components/LocationEnemyChips.vue'
import type { ConcealedCard } from '@/arkham/types/ConcealedCard'
import { investigatorMovementName } from '@/arkham/investigatorMovement'
import { arrangeMode, beginDrag, offsetOf } from '@/arkham/composables/useMapDrag'
import { clipBetweenBoxes, useMapPlateBoxes, type PlateBox } from '@/arkham/composables/useMapPlateBoxes'
import type { MapViewport } from '@/arkham/composables/useMapViewport'
import { MAP_ZOOM_ENABLED } from '@/arkham/mapViewport'
import { CARD_FLIGHT_ATTR, cardFlightStyle, useCardFlightState } from '@/arkham/cardFlight'
import { barrierKey, barriersBetween, blockedLinks, type BarrierCounts } from '@/arkham/scenarioBarriers'
import { useDebug } from '@/arkham/debug'
import BarrierIcon from '@/arkham/components/BarrierIcon.vue'

export type MapMove = { id: string; name: string; path: string }
export type GridSpot = { label: string; x: number; y: number; index: number }
/** Concealed mini-cards lying in a grid position rather than at a location, and where that position is drawn. */
export type ConcealedSpot = { key: string; x: number; y: number; cards: ConcealedCard[] }
/** A room's name plate on a picture: its top-left corner and width, in percent of the picture. */
export type RoomPlateSpot = { x: number; y: number; width: number }

const props = defineProps<{
  game: Game
  playerId: string
  locations: Location[]
  positions: Record<string, Point>
  links: [string, string][]
  moves: MapMove[]
  gridSpots: GridSpot[]
  selectedId: string | null
  enemiesAt: (l: Location) => string[]
  /** The concealed mini-cards lying at a location (The Scarlet Keys). */
  concealedAt?: (l: Location) => ConcealedCard[]
  /** Concealed mini-cards in grid positions of their own. */
  concealedSpots?: ConcealedSpot[]
  /** What each location's plate shows; built once by the parent from the live game. */
  infoOf: (l: Location) => MapLocationInfo
  /** Where each location stands on the cutaway picture (percent); when set the map is drawn over that picture. */
  cutaway?: Record<string, Point> | null
  /** Where each room's plate goes on the cutaway picture, apart from its figures. */
  roomPlates?: Record<string, RoomPlateSpot> | null
  /** Whether the room plates show the card text and flavour. */
  plateText?: boolean
  illustratedBoard?: HemlockOverview
  dreamPositions?: Record<string, Point>
  /** Horror in High Gear: the road's columns and rows; tiles fill one column and two rows each, side by side. */
  roadGrid?: RoadGrid
  weaver?: ReturnType<typeof weaverEnemies>
  /** Small version for the side column next to the scene. */
  compact?: boolean
  width?: number
  height?: number
  /** Pinch-zoom and pan of the stage; never on the house cutaway or the compact map. */
  viewport?: MapViewport
  /** Barriers standing on links (In Too Deep), keyed by the two sorted location ids. */
  barriers?: BarrierCounts | null
  /** Whether the player wants the board's moving weather (rain, swell, fog) when it has one. */
  weather?: boolean
}>()
const emit = defineEmits<{
  (e: 'inspect', location: Location, anchor: HTMLElement): void
  (e: 'choose', index: number): void
}>()

const { t } = useI18n()
const nameOf = useCardNames()
const basePos = (id: string): Point => {
  const at = props.cutaway?.[id] ?? props.positions[id]
  return at ? spreadPoint(at) : at
}
const offsetKey = (id: string) => `${props.game.id}:${id}`
// Where a plate is drawn: its scenario spot plus any shift the player dragged it by (never in the house cutaway).
const pos = (id: string): Point => {
  const [x, y] = basePos(id)
  if (!canDrag.value) return [x, y]
  const [dx, dy] = offsetOf(offsetKey(id))
  return [x + dx, y + dy]
}
const arrowKey = (key: string) => `${props.game.id}:arrow:${key}`
// Plates and move buttons can be dragged aside on every full-size board. On a sprite board (Cosmos, Devil Reef)
// only the plate moves: the grid reflows as cards arrive, slide and leave, so the sprites, water and vehicles stay
// in their cells (`cellPos`) and the layout never changes; the offset is relative to the location's own cell.
const canDrag = computed(() => !props.cutaway && !props.compact)
/** The grid cell a location's sprite fills on a sprite board, ignoring any plate drag. */
const cellPos = (id: string): Point => basePos(id)
/** The standees under a dragged plate stay on the sprite: undo the plate's shift, in pixels of the stage. */
const floorStyle = (l: Location): Record<string, string> | undefined => {
  if (!props.illustratedBoard?.islands || !canDrag.value) return undefined
  const [dx, dy] = offsetOf(offsetKey(l.id))
  if (!dx && !dy) return undefined
  return { translate: `${(-dx * stageWidth.value) / 100}px ${(-dy * stageHeight.value) / 100}px` }
}
const startNodeDrag = (l: Location, event: PointerEvent) => {
  if (canDrag.value) beginDrag(event, offsetKey(l.id), 'pct', stage.value)
}
const stage = ref<HTMLElement | null>(null)
const scroller = ref<HTMLElement | null>(null)
const zoomable = computed(() => MAP_ZOOM_ENABLED && !props.cutaway && !props.compact && !!props.viewport)
let unbindViewport: (() => void) | null = null
onMounted(() => {
  if (props.viewport && scroller.value && stage.value) {
    unbindViewport = props.viewport.bind(scroller.value, stage.value, { enabled: () => zoomable.value, arranging: () => arrangeMode.value })
  }
})
onBeforeUnmount(() => unbindViewport?.())
const { width: stageWidth, height: stageHeight } = useElementSize(stage)
const dreamBoard = computed(() => props.illustratedBoard?.image.startsWith('img/scenes/the-dream-eaters/') === true)
const spreadWeaver = computed(() => !!props.weaver && stageWidth.value > 0 && stageWidth.value <= 600)
const spreadPoint = ([x, y]: Point): Point => spreadWeaver.value ? [50 + (x - 50) * 1.48, y] : [x, y]
const dreamDisplayPositions = computed(() => props.dreamPositions && (spreadWeaver.value
  ? Object.fromEntries(Object.entries(props.dreamPositions).map(([label, point]) => [label, spreadPoint(point)]))
  : props.dreamPositions))
// A new picture starts whole; a resized frame (rotation) must not keep an offset that now shows an empty border.
watch(() => props.illustratedBoard?.image, () => props.viewport?.reset())
watch([stageWidth, stageHeight], () => props.viewport?.refit())
watch(zoomable, (ok) => { if (!ok) props.viewport?.reset() })
// One finger scrolls the page until the map is zoomed or plates are being arranged; then the map takes the touch.
const stageStyle = computed(() => {
  if (props.cutaway) return { backgroundImage: 'url(img/scenes/night-of-the-zealot/house-cutaway.webp)', backgroundSize: '100% 100%' }
  if (!zoomable.value || !props.viewport) return undefined
  return {
    transform: props.viewport.transform.value,
    transformOrigin: '0 0',
    touchAction: props.viewport.zoomed.value || arrangeMode.value ? 'none' : 'pan-x pan-y',
  }
})
const descent = computed(() => !!props.illustratedBoard?.fixedPassages)
const canvasStyle = computed(() => {
  if (props.compact) return undefined
  const width = props.width ?? 450
  if (!props.illustratedBoard) return { minWidth: `${Math.min(width, 900)}px` }
  // An illustrated board is a picture: it always fits the available area, so it never needs scrolling.
  if (descent.value || props.illustratedBoard.village || props.illustratedBoard.house) return undefined
  const columns = Math.max(1, width / 150)
  return { '--location-width': `${87 / columns}%` }
})
/* Before the Black Throne pads its grid with a ring of open cells, so a cell is small and wide. Islands and
 * placement spots are sized to one cell, so neither covers a neighbouring cell and a click lands where it looks. */
const cosmosCell = computed(() => {
  if (!props.illustratedBoard?.islands || !stageWidth.value || !stageHeight.value) return null
  if (props.roadGrid) {
    // A road tile is as wide as its column and two of the six rows high; neighbours touch, so the road is one strip.
    return { width: stageWidth.value / props.roadGrid.columns, height: (stageHeight.value * 2) / props.roadGrid.rows }
  }
  if (props.dreamPositions) {
    const stairs = props.illustratedBoard.islands === STAIRS_FOLDER
    return { width: stageWidth.value * 0.18, height: stageHeight.value * (stairs ? 0.17 : 0.20) }
  }
  if (!props.width || !props.height) return null
  const width = (stageWidth.value / props.width) * 150 * 0.92
  const height = (stageHeight.value / props.height) * 120 * 0.92
  return { width, height }
})
/* A revealed location's 3:2 scene fills the cell's width up to 1.5x its height; the square rock keeps the
 * small overhang its transparent margin allows. Either way the sprite stays inside its own cell. */
/* The location's plate (its buttons) sits on the top edge of the cell, never over the middle of the picture; the
 * sprite fills the rest of the cell below it, where the standees hanging under the plate stand on it. */
const PLATE_ROOM = 34
/** Road tiles are drawn a touch wider than their column so the soft edges overlap into one road. */
const ROAD_OVERLAP = 1.04
/* On a small map the plate may overlap the sprite's top edge rather than squeeze the picture away. */
const plateRoom = (cellHeight: number) => Math.min(PLATE_ROOM, cellHeight * (props.dreamPositions && stageWidth.value <= 600 ? 0.47 : 0.35))
const islandWidth = (l: Location): number => {
  const cell = cosmosCell.value
  if (!cell) return 0
  if (props.roadGrid) return cell.width * ROAD_OVERLAP
  const room = Math.max(0, cell.height - plateRoom(cell.height))
  return aspectOf(l) > 1
    ? Math.min(cell.width, room * 1.5)
    : Math.min(cell.width, room * 1.2)
}
/** Where a sprite (and its water) is drawn: centred across the cell, its top just under the plate. */
const spriteStyle = (l: Location): Record<string, string | number> => {
  const cell = cosmosCell.value
  const [x, y] = cellPos(l.id)
  const width = islandWidth(l)
  const centre = cell && !props.roadGrid ? -cell.height / 2 + plateRoom(cell.height) + width / aspectOf(l) / 2 : 0
  return { left: `${x}%`, top: `calc(${y}% + ${centre}px)`, width: `${width}px`, aspectRatio: aspectOf(l) }
}
/* The painted part of a sprite stops a little inside its picture (soft, transparent edges), so a link is
 * clipped to this share of the box to reach the land itself. */
const SPRITE_EDGE = 0.8
/** A sprite's box relative to its cell, in stage percent: on a sprite board links run sprite to sprite, not
 * between the plates (which hang at the top of the cell and can be dragged aside). */
const spriteBox = (l: Location): PlateBox | undefined => {
  const cell = cosmosCell.value
  if (!cell || !stageWidth.value || !stageHeight.value) return undefined
  const width = islandWidth(l)
  const height = width / aspectOf(l)
  const centre = props.roadGrid ? 0 : -cell.height / 2 + plateRoom(cell.height) + height / 2
  return {
    dx: 0,
    dy: (centre / stageHeight.value) * 100,
    hw: ((width / 2) * SPRITE_EDGE / stageWidth.value) * 100,
    hh: ((height / 2) * SPRITE_EDGE / stageHeight.value) * 100,
  }
}
/** The board's storm is drawn (it has one, the player has it on, and this is the full-size map). */
const stormy = computed(() => !!props.illustratedBoard?.weather && !!props.weather && !props.compact && stageWidth.value > 0)
/** On a sprite board the plate hangs from the top of its cell instead of being centred on it. */
const nodeStyle = (l: Location): Record<string, string | number | undefined> => {
  const [x, y] = pos(l.id)
  const cell = cosmosCell.value
  if (cell && props.roadGrid) {
    // The plate sits on the top edge of its road tile.
    return { left: `${x}%`, top: `calc(${y}% - ${islandWidth(l) / aspectOf(l) / 2}px)`, translate: '-50% 0' }
  }
  if (cell && props.illustratedBoard?.islands) {
    return { left: `${x}%`, top: `calc(${y}% - ${cell.height / 2}px)`, translate: '-50% 0' }
  }
  return { left: `${x}%`, top: `${y}%`, zIndex: props.cutaway ? Math.round(y) : undefined }
}
const islandsFolder = computed(() => props.illustratedBoard?.islands ?? '')
const aspectOf = (l: Location) => islandAspect(islandsFolder.value, l.cardCode, l.revealed)

/* Horror in High Gear: driving on adds a column on the right and drops the ones behind. The new tiles slide in
 * from the right, the tiles left behind fade out to the left (a ghost of each, since the card is already gone),
 * the rest move to their new place, and the backdrop drifts a little with them. Reduced motion: it just jumps. */
type RoadGhost = { id: string; src: string; x: number; y: number; width: number }
const roadGhosts = ref<RoadGhost[]>([])
const roadFrame = computed(() => {
  if (!props.roadGrid) return { points: {} as Record<string, Point>, sprites: {} as Record<string, { src: string; width: number }> }
  const points: Record<string, Point> = {}
  const sprites: Record<string, { src: string; width: number }> = {}
  for (const l of props.locations) {
    points[l.id] = cellPos(l.id)
    sprites[l.id] = { src: islandImage(islandsFolder.value, l.cardCode, l.revealed), width: islandWidth(l) }
  }
  return { points, sprites }
})
const ROAD_SLIDE_MS = 500
let roadAnimations: Animation[] = []
let ghostTimer: ReturnType<typeof setTimeout> | null = null
watch(roadFrame, (after, before) => {
  roadAnimations.forEach((animation) => animation.cancel())
  roadAnimations = []
  if (!props.roadGrid || !stage.value || !stageWidth.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { roadGhosts.value = []; return }
  const slides = roadSlides(before.points, after.points)
  const px = (dx: number, dy: number) => `translate(${(dx * stageWidth.value) / 100}px, ${(dy * stageHeight.value) / 100}px)`
  const tiles = (id: string) => [...stage.value!.querySelectorAll<HTMLElement>(`[data-road-tile="${id}"]`)]
  const options = { duration: ROAD_SLIDE_MS, easing: 'ease-in-out' }
  for (const { id, dx, dy } of slides.shifting) {
    for (const element of tiles(id)) roadAnimations.push(element.animate([{ transform: px(dx, dy) }, { transform: 'none' }], options))
  }
  const column = 100 / props.roadGrid.columns
  for (const id of slides.entering) {
    for (const element of tiles(id)) {
      roadAnimations.push(element.animate([{ transform: px(column, 0), opacity: 0 }, { transform: 'none', opacity: 1 }], options))
    }
  }
  if (roadAdvanced(slides)) {
    const art = stage.value.querySelector<HTMLElement>('.board-art')
    art?.animate([{ transform: px(column * 0.5, 0) }, { transform: 'none' }], { ...options, duration: ROAD_SLIDE_MS * 1.6 })
  }
  roadGhosts.value = slides.leaving.flatMap((id) => {
    const sprite = before.sprites[id]
    const [x, y] = before.points[id]
    return sprite ? [{ id, src: sprite.src, x, y, width: sprite.width }] : []
  })
  if (ghostTimer) clearTimeout(ghostTimer)
  if (roadGhosts.value.length) ghostTimer = setTimeout(() => { roadGhosts.value = [] }, ROAD_SLIDE_MS)
}, { flush: 'post' })
onBeforeUnmount(() => { roadAnimations.forEach((animation) => animation.cancel()); if (ghostTimer) clearTimeout(ghostTimer) })

const stairSlots = computed(() => islandsFolder.value === STAIRS_FOLDER
  ? props.locations.filter((l) => /^mysteriousStairs[1-5]$/.test(l.label))
    .map(({ id, label, revealed }) => ({ id, label, revealed })) : [])
let stairAnimations: Animation[] = []
watch(stairSlots, (after, before) => {
  stairAnimations.forEach((animation) => animation.cancel())
  stairAnimations = []
  const wrapped = stairsRotation(before, after)
  const slots = props.dreamPositions
  if (!wrapped || !slots || !stage.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const previous = new Map(before.map((l) => [l.id, l]))
  const current = new Map(after.map((l) => [l.id, l]))
  for (const element of stage.value.querySelectorAll<HTMLElement>('[data-stair-tile]')) {
    const id = element.dataset.stairTile ?? ''
    const from = previous.get(id)
    const to = current.get(id)
    if (!from || !to || from.label === to.label) continue
    if (id !== wrapped && Number(to.label.at(-1)) !== Number(from.label.at(-1)) - 1) continue
    const [x0, y0] = slots[from.label]
    const [x1, y1] = slots[to.label]
    const shift = `translate(${(x0 - x1) * stageWidth.value / 100}px, ${(y0 - y1) * stageHeight.value / 100}px)`
    const frames = id === wrapped
      ? [{ transform: shift, opacity: 1 }, { transform: shift, opacity: 0, offset: 0.40 },
        { transform: 'none', opacity: 0, offset: 0.41 }, { transform: 'none', opacity: 1 }]
      : [{ transform: shift }, { transform: 'none' }]
    stairAnimations.push(element.animate(frames, { duration: 500, easing: 'ease-in-out' }))
  }
}, { flush: 'post' })
onBeforeUnmount(() => stairAnimations.forEach((animation) => animation.cancel()))
/* Vehicles sailing between the cells (Devil Reef's Fishing Vessel), drawn below-right of their cell's centre so
 * the plate stays readable. Whoever rides one stands on its deck instead of on the ground. */
const vehicles = computed(() => {
  if (!islandsFolder.value || !cosmosCell.value) return []
  const here = new Set(props.locations.map((l) => l.id))
  return sceneVehicles(props.game, (code) => vehicleSprite(islandsFolder.value, code)).filter((v) => here.has(v.locationId))
})
/** Vehicles sharing a location (both of High Gear's cars start on the same tile) are spread side by side. */
const vehicleSlots = computed(() => {
  const seen = new Map<string, number>()
  const total = new Map<string, number>()
  for (const v of vehicles.value) total.set(v.locationId, (total.get(v.locationId) ?? 0) + 1)
  return new Map(vehicles.value.map((v) => {
    const index = seen.get(v.locationId) ?? 0
    seen.set(v.locationId, index + 1)
    return [v.id, { index, count: total.get(v.locationId) ?? 1 }] as const
  }))
})
const aboard = computed(() => riders(vehicles.value))
const vehicleWidth = computed(() => {
  const cell = cosmosCell.value
  if (cell && props.roadGrid) return cell.width * 0.4
  return cell ? Math.min(cell.width, cell.height * 1.5) * 0.7 : 0
})
const vehiclePos = (locationId: string, vehicleId = ''): Point => {
  const cell = cosmosCell.value
  const [x, y] = cellPos(locationId)
  if (!cell || !stageWidth.value || !stageHeight.value) return [x, y]
  if (props.roadGrid) {
    const slot = vehicleSlots.value.get(vehicleId) ?? { index: 0, count: 1 }
    const along = (slot.index - (slot.count - 1) / 2) * cell.width * 0.34
    return [x + (along / stageWidth.value) * 100, y + ((cell.height * 0.12) / stageHeight.value) * 100]
  }
  return [x + ((cell.width * 0.2) / stageWidth.value) * 100, y + ((cell.height * 0.22) / stageHeight.value) * 100]
}
/** The location as drawn on the ground: without the investigators riding a vehicle there. */
const onGround = (l: Location): Location =>
  aboard.value.size && l.investigators.some((id) => aboard.value.has(id))
    ? { ...l, investigators: l.investigators.filter((id) => !aboard.value.has(id)) }
    : l
// Match the card board, including enemy cards that also serve as locations.
const locationImage = (l: Location) => cardImage(l.cardCode, l.revealed || l.enemyLocation ? '' : 'b')

function hideFailedArt(event: Event, code: string) {
  const image = event.currentTarget as HTMLImageElement
  image.hidden = true
  if (import.meta.env.DEV) console.warn('[Arkham map] Unable to load art', code)
}

// Each plate's real box, so a link runs from plate edge to plate edge. On a painted board the plate is the
// target; on the plain board the whole tile is.
const plateBoxes = useMapPlateBoxes(stage, () => (props.illustratedBoard ? '.plate' : null), [
  () => props.locations.map((l) => l.id),
  () => props.illustratedBoard?.image,
  () => props.compact,
])

/* The move button sits on the link it travels along. A link carries one when you stand at one end and the
 * other end offers a move; that move then leaves the destination's plate (see `movesOnLinks`). */
function linkMove(a: string, b: string): { index: number; to: string } | null {
  const infoA = props.infoOf(props.locations.find((l) => l.id === a)!)
  const infoB = props.infoOf(props.locations.find((l) => l.id === b)!)
  if (infoA.here && infoB.actions.move) return { index: infoB.actions.move.index, to: b }
  if (infoB.here && infoA.actions.move) return { index: infoA.actions.move.index, to: a }
  return null
}

/* A row whose locations all connect to each other draws one link per gap plus a rail along the row, instead of
 * every pair (whose long links would stack on the short ones and drop their badges onto the middle locations).
 * Only two-way links without barriers fold, and only while the locations really sit in a line. */
const rowLinks = computed(() => {
  const byId = new Map(props.locations.map((location) => [location.id, location]))
  const at = (id: string): Point | undefined => {
    if (!props.positions[id] && !props.cutaway?.[id]) return undefined
    return cosmosCell.value ? cellPos(id) : pos(id)
  }
  const foldable = (a: string, b: string) => {
    const from = byId.get(a)
    const to = byId.get(b)
    return !!from && !!to && locationLinkDirection(from, to) === 'both' && barriersBetween(props.barriers ?? null, a, b) === 0
  }
  return foldRowLinks(props.links, at, foldable)
})
/* Inside a row the rail is the whole picture: its gaps get no dashed guide or arrow badge. A gap holding barriers
 * keeps its badge so the barricade still shows; moving along the row uses each plate's own move button. */
const drawnLinks = computed(() => {
  const lanes = rowLinks.value.lanes.map((lane) => new Set(lane.members))
  return rowLinks.value.links.filter(([a, b]) =>
    !lanes.some((lane) => lane.has(a) && lane.has(b)) || barriersBetween(props.barriers ?? null, a, b) > 0)
})
/** One rail per row of mutually connected locations, centre to centre (the sprites and plates cover its ends). */
const laneRails = computed(() => {
  if (props.cutaway || props.compact) return []
  return rowLinks.value.lanes.map(({ ends: [a, b], members }) => {
    const [x1, y1] = cosmosCell.value ? cellPos(a) : pos(a)
    const [x2, y2] = cosmosCell.value ? cellPos(b) : pos(b)
    return { key: members.join('|'), d: `M${x1} ${y1}L${x2} ${y2}` }
  })
})

const connectionArrows = computed(() => {
  if (props.cutaway || props.compact) return []
  const locations = new Map(props.locations.map((location) => [location.id, location]))
  return drawnLinks.value.flatMap(([a, b]) => {
    const from = locations.get(a)
    const to = locations.get(b)
    if (!from || !to) return []
    const direction = locationLinkDirection(from, to)
    if (!direction) return []
    const clipped = cosmosCell.value
      ? clipBetweenBoxes(cellPos(a), spriteBox(from), cellPos(b), spriteBox(to))
      : clipBetweenBoxes(pos(a), plateBoxes.value[a], pos(b), plateBoxes.value[b])
    if (!clipped) return []
    const [x1, y1] = clipped.from
    const [x2, y2] = clipped.to
    // Work in pixels so the angle matches what is drawn on a stage that is not square.
    const w = stageWidth.value || 1
    const h = stageHeight.value || 1
    const vx = ((x2 - x1) * w) / 100
    const vy = ((y2 - y1) * h) / 100
    const length = Math.hypot(vx, vy) || 1
    const [ux, uy] = [vx / length, vy / length]
    const angle = Math.atan2(vy, vx)
    const moved = [a, b].some((id) => offsetOf(offsetKey(id)).some((v) => v !== 0))
    const passage = descent.value && !moved ? mineDescentPassage(from.label, to.label) : undefined
    const [x, y] = passage ?? [(x1 + x2) / 2, (y1 + y2) / 2]
    const key = `${a}:${b}`
    // The player can slide an arrow along the line between the two plates (if it covers something), but never
    // off it, so it always sits between them and points straight from one to the other. Any sideways part of a
    // drag (or of an offset saved before this rule) is dropped, and it stays within the middle 60% of the line.
    const [dx, dy] = canDrag.value ? offsetOf(arrowKey(key)) : [0, 0]
    const along = Math.max(-0.3 * length, Math.min(0.3 * length, (dx * w * ux + dy * h * uy) / 100))
    const ax = x + (along * ux * 100) / w
    const ay = y + (along * uy * 100) / h
    const move = linkMove(a, b)
    // A one-way arrow points the way the passage runs; a two-way one lies along the line.
    const rotation = angle + (direction === 'backward' ? Math.PI : 0)
    const barriers = barriersBetween(props.barriers ?? null, a, b)
    const barrierLabel = barriers > 0
      ? t('locationMap.link.barriers', { n: barriers, a: props.infoOf(from).face.name, b: props.infoOf(to).face.name }, barriers)
      : null
    const linkLabel = move
      ? t('locationMap.link.moveTo', { name: props.infoOf(locations.get(move.to)!).face.name })
      : t(direction === 'both' ? 'locationMap.link.twoWay' : 'locationMap.link.oneWay')
    return [{
      key,
      pair: [a, b] as [string, string],
      barriers,
      x: ax,
      y: ay,
      // A faint guide from plate edge to plate edge through the badge, so it is clear which two rooms it joins.
      guide: `M${x1} ${y1}L${ax} ${ay}L${x2} ${y2}`,
      rotation,
      both: direction === 'both',
      move,
      label: barrierLabel ? `${linkLabel} · ${barrierLabel}` : linkLabel,
    }]
  })
})

/* A barrier must never vanish from the map: a blocked pair whose link badge was not drawn (no link direction,
 * plates that do not clip, ...) still gets a marker halfway between the two locations. */
const strayBarriers = computed(() => {
  if (props.cutaway || props.compact) return []
  const drawn = new Set(connectionArrows.value.map((arrow) => barrierKey(...arrow.pair)))
  const byId = new Map(props.locations.map((location) => [location.id, location]))
  return blockedLinks(props.barriers ?? null).flatMap(({ a, b, key, count }) => {
    const from = byId.get(a)
    const to = byId.get(b)
    if (drawn.has(key) || !from || !to || !props.positions[a] || !props.positions[b]) return []
    const [x1, y1] = pos(a)
    const [x2, y2] = pos(b)
    return [{
      key, pair: [a, b] as [string, string], count, x: (x1 + x2) / 2, y: (y1 + y2) / 2,
      label: t('locationMap.link.barriers', { n: count, a: props.infoOf(from).face.name, b: props.infoOf(to).face.name }, count),
    }]
  })
})

const debug = useDebug()
/** In debug mode a click on a barricade takes one barrier away, as the card board's x button does. */
function removeBarrier(pair: [string, string]) {
  debug.send(props.game.id, { tag: 'ScenarioCountDecrementBy', contents: [{ tag: 'Barriers', contents: [...pair].sort() }, 1] })
}

/** Locations whose move button now sits on a link, so their plate drops its own. */
const movesOnLinks = computed(() => new Set(connectionArrows.value.flatMap((arrow) => (arrow.move ? [arrow.move.to] : []))))

function arrowClick(arrow: { move: { index: number } | null; barriers: number; pair: [string, string] }) {
  if (arrow.move) emit('choose', arrow.move.index)
  else if (debug.active && arrow.barriers > 0) removeBarrier(arrow.pair)
}
const ownId = () => ownInvestigator(props.game, props.playerId)?.id

/* Animation hooks, as on the card board (see LocationStandees.vue). This canvas
 * is either the overview or the scene's mini-map, never both at once, so the
 * names below have one owner. In the scene the room view is the smoke puff's
 * anchor, so the mini-map leaves that to it. */
const flightState = useCardFlightState()
const moveNameOf = (id: string, l: Location) => {
  const investigator = props.game.investigators[id]
  return investigator ? investigatorMovementName(investigator, l.id) : undefined
}
const investigatorName = (id: string) => {
  const investigator = props.game.investigators[id]
  return investigator ? nameOf(investigator.cardCode) : id
}

// A click on the tile itself (outside its plate) does what a click on the plate's name does.
function tileClick(l: Location, event: MouseEvent) {
  const info = props.infoOf(l)
  if (info.actions.selectIndex !== -1) emit('choose', info.actions.selectIndex)
  else emit('inspect', l, event.currentTarget as HTMLElement)
}
</script>

<template>
  <div ref="scroller" class="map-scroll" :class="{ compact }">
    <div class="map-canvas" :class="{ 'has-cutaway': cutaway, 'has-illustrated-board': illustratedBoard, 'has-dream-board': dreamBoard }" :style="canvasStyle">
      <div ref="stage" class="map-stage" :class="{ cutaway, illustrated: illustratedBoard, descent, village: illustratedBoard?.village, house: illustratedBoard?.house, 'dream-grid': dreamPositions, 'dream-static': dreamBoard && !dreamPositions }"
        :style="stageStyle">
      <img v-if="illustratedBoard" :key="illustratedBoard.image" class="board-art" :src="illustratedBoard.image"
        alt="" @error="hideFailedArt($event, illustratedBoard.image)" />
      <SceneWeather v-if="stormy" :width="stageWidth" :height="stageHeight" />
      <svg v-if="!cutaway" class="map-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <template v-if="!illustratedBoard">
          <line v-for="[a, b] in drawnLinks" :key="a + b"
            :x1="pos(a)[0]" :y1="pos(a)[1]" :x2="pos(b)[0]" :y2="pos(b)[1]" />
        </template>
        <path v-for="rail in laneRails" :key="'lane' + rail.key" class="lane-rail" :d="rail.d" />
        <template v-if="illustratedBoard">
          <path v-for="arrow in connectionArrows" :key="'guide' + arrow.key" class="connection-guide" :class="{ movable: !!arrow.move, blocked: arrow.barriers > 0 }" :d="arrow.guide" />
        </template>
        <circle v-for="m in moves" :key="m.id" class="moving-enemy" r="1.4">
          <title>{{ m.name }}</title>
          <animateMotion dur="1.4s" :path="m.path" fill="freeze" />
        </circle>
      </svg>
      <!-- Every link wears a badge saying which way it runs: a double arrow for two-way, a single one for one-way.
           When you can travel along it, the badge is the move button. -->
      <!-- A link holding barriers shows a barricade instead of the arrow, with the count in the corner. A link
           you can still travel (ignoring barriers) keeps the green move arrow, and still shows the count. -->
      <button v-for="arrow in connectionArrows" :key="arrow.key" type="button" class="connection-arrow"
        :class="{ draggable: canDrag, movable: !!arrow.move, 'two-way': arrow.both, blocked: arrow.barriers > 0 }"
        :style="{ left: arrow.x + '%', top: arrow.y + '%' }"
        :aria-label="arrow.label" :title="arrow.barriers > 0 ? arrow.label : undefined"
        :tabindex="arrow.move ? 0 : -1" :aria-disabled="!arrow.move || undefined"
        :data-game-actionable="arrow.move ? true : undefined"
        @pointerdown="canDrag && beginDrag($event, arrowKey(arrow.key), 'pct', stage)"
        @click.stop="arrowClick(arrow)">
        <BarrierIcon v-if="arrow.barriers > 0 && !arrow.move" class="barricade" />
        <svg v-else viewBox="0 0 40 16" aria-hidden="true" :style="{ rotate: arrow.rotation + 'rad' }">
          <path d="M4 8h32m-5-5 5 5-5 5" />
          <path v-if="arrow.both" d="m9 3-5 5 5 5" />
        </svg>
        <span v-if="arrow.barriers > 0" class="barrier-count" aria-hidden="true">{{ arrow.barriers }}</span>
      </button>
      <button v-for="stray in strayBarriers" :key="'barrier-' + stray.key" type="button" class="connection-arrow blocked stray"
        :style="{ left: stray.x + '%', top: stray.y + '%' }" :aria-label="stray.label" :title="stray.label" tabindex="-1"
        @click.stop="debug.active && removeBarrier(stray.pair)">
        <BarrierIcon class="barricade" />
        <span class="barrier-count" aria-hidden="true">{{ stray.count }}</span>
      </button>
      <template v-if="illustratedBoard?.islands && cosmosCell">
        <!-- In a storm, surf breaks on every island: its own outline, turned to white foam and blurred, washes in
             onto the shore and drains away, twice out of step. Drawn under the island, so only the rim shows. -->
        <template v-if="stormy">
          <template v-for="l in locations" :key="'surf-' + l.id">
            <img v-for="n in 2" :key="n" class="surf" :class="'surf-' + n" :src="islandImage(illustratedBoard.islands, l.cardCode, l.revealed)"
              :style="spriteStyle(l)" alt="" aria-hidden="true" draggable="false" />
          </template>
        </template>
        <img v-for="l in locations" :key="'island-' + l.id" class="island" :class="{ targetable: infoOf(l).targetable }"
          :src="islandImage(illustratedBoard.islands, l.cardCode, l.revealed)"
          :style="spriteStyle(l)" :data-stair-tile="islandsFolder === STAIRS_FOLDER ? l.id : undefined"
          :data-road-tile="roadGrid ? l.id : undefined" alt="" aria-hidden="true" draggable="false" />
        <!-- Road tiles that were left behind fade away to the left while the road slides on. -->
        <img v-for="g in roadGhosts" :key="'ghost-' + g.id" class="island road-ghost" :src="g.src"
          :style="{ left: g.x + '%', top: g.y + '%', width: g.width + 'px', aspectRatio: 1.5, '--drift': -(stageWidth / (roadGrid?.columns ?? 1)) + 'px' }"
          alt="" aria-hidden="true" draggable="false" />
        <!-- Mine rails: one arm per track printed on a revealed rail tile, turned to its side, over the sprite. -->
        <template v-for="l in locations" :key="'rails-' + l.id">
          <template v-if="islandRails(illustratedBoard.islands, l.cardCode, l.revealed)">
            <img v-for="turn in islandRails(illustratedBoard.islands, l.cardCode, l.revealed)?.turns" :key="turn" class="island rail-arm"
              :src="islandRails(illustratedBoard.islands, l.cardCode, l.revealed)?.src"
              :style="{ ...spriteStyle(l), aspectRatio: 1, width: islandWidth(l) * 0.5 + 'px', rotate: turn + 'deg' }"
              alt="" aria-hidden="true" draggable="false" />
          </template>
        </template>
        <!-- A flooded location's water rises over its sprite, in the same frame. -->
        <template v-for="l in locations" :key="'water-' + l.id">
          <img v-if="islandWaterImage(illustratedBoard.islands, l.cardCode, l.revealed, l.floodLevel)" class="island water"
            :src="islandWaterImage(illustratedBoard.islands, l.cardCode, l.revealed, l.floodLevel)"
            :style="spriteStyle(l)"
            alt="" aria-hidden="true" draggable="false" />
        </template>
        <!-- The card board's flood effect: a slowly turning body of water rising halfway up (partially flooded)
             or over the whole place (fully flooded), cut to the shape of the location's sprite. -->
        <template v-for="l in locations" :key="'flood-' + l.id">
          <div v-if="l.floodLevel && l.floodLevel !== 'Unflooded'" class="flood-mask"
            :style="{ ...spriteStyle(l),
              '--sprite': `url(${islandImage(illustratedBoard.islands, l.cardCode, l.revealed)})` }"
            aria-hidden="true">
            <div class="wave" :class="l.floodLevel"></div>
            <div class="wave swell" :class="l.floodLevel"></div>
          </div>
        </template>
        <SceneVehicle v-for="v in vehicles" :key="'vehicle-' + v.id" :game="game" :playerId="playerId" :vehicle="v"
          :x="vehiclePos(v.locationId, v.id)[0]" :y="vehiclePos(v.locationId, v.id)[1]" :width="vehicleWidth" :faceRight="!!roadGrid"
          @choose="emit('choose', $event)" />
      </template>
      <SceneAtlachNacha v-if="weaver && dreamDisplayPositions && stageWidth && stageHeight" :game="game" :playerId="playerId"
        :spider="weaver" :positions="dreamDisplayPositions" :width="stageWidth" :height="stageHeight" @choose="emit('choose', $event)" />
      <button v-for="spot in gridSpots" :key="spot.label" class="spot" :class="{ 'cosmos-spot': cosmosCell }"
        :style="cosmosCell
          ? { left: spot.x + '%', top: spot.y + '%', width: cosmosCell.width + 'px', height: cosmosCell.height + 'px',
            backgroundImage: `url(${islandSpotImage(islandsFolder)})` }
          : { left: spot.x + '%', top: spot.y + '%' }"
        :aria-label="t('locationMap.placeHere')" @click="emit('choose', spot.index)">+</button>
      <LocationConcealedStack v-for="spot in concealedSpots ?? []" :key="'concealed-' + spot.key" class="concealed-spot"
        :style="{ left: spot.x + '%', top: spot.y + '%' }" :game="game" :playerId="playerId" :cards="spot.cards"
        :size="compact ? 'compact' : 'full'" @choose="emit('choose', $event)" />
      <div v-for="l in locations" :key="l.id" class="node"
        :class="{ draggable: canDrag, 'stair-node': islandsFolder === STAIRS_FOLDER,
          here: infoOf(l).here, selected: l.id === selectedId,
          hidden: !l.revealed, targetable: infoOf(l).targetable,
        }"
        :style="nodeStyle(l)"
        :data-id="l.id" :data-stair-tile="islandsFolder === STAIRS_FOLDER ? l.id : undefined" :data-road-tile="roadGrid ? l.id : undefined"
        @pointerdown="startNodeDrag(l, $event)" @click.stop="cutaway ? undefined : tileClick(l, $event)">
        <img v-if="!cutaway && !illustratedBoard" class="art" :src="locationImage(l)" alt="" loading="lazy" />
        <LocationStandees v-if="cutaway" :game="game" :playerId="playerId" :location="l" :enemiesAt="enemiesAt" @choose="emit('choose', $event)" />
        <LocationMarkerPlate v-if="!roomPlates?.[l.id]" :info="infoOf(l)" :size="compact ? 'compact' : 'full'" :game="game" :playerId="playerId" :locationId="l.id"
          :hideMove="movesOnLinks.has(l.id)"
          :data-fx-target="`location-${l.id}`"
          :[CARD_FLIGHT_ATTR]="l.cardId" :style="cardFlightStyle(flightState, l.cardId)"
          :data-image="locationImage(l)" :data-card-code="l.cardCode"
          @inspect="emit('inspect', l, $event)" @choose="emit('choose', $event)" />
        <LocationConcealedStack v-if="concealedAt" class="node-concealed" :game="game" :playerId="playerId" :cards="concealedAt(l)"
          :size="compact ? 'compact' : 'full'" @choose="emit('choose', $event)" />
        <div v-if="illustratedBoard" class="location-floor" :style="floorStyle(l)">
          <LocationStandees :game="game" :playerId="playerId" :location="onGround(l)" :enemiesAt="enemiesAt" @choose="emit('choose', $event)" />
        </div>
        <span v-else-if="!cutaway" class="occupants">
          <img v-for="id in onGround(l).investigators" :key="id" class="figure" :class="{ you: id === ownId(), portrait: !compact }"
            :src="portraitImage(game.investigators[id]?.cardCode ?? '')" :alt="investigatorName(id)"
            :style="{ viewTransitionName: moveNameOf(id, l) }" :data-investigator-mini="compact ? undefined : id"
            :data-image="cardImage(game.investigators[id]?.cardCode ?? '')" />
          <LocationEnemyChips :game="game" :playerId="playerId" :location="l" :enemiesAt="enemiesAt" :compact="compact" @choose="emit('choose', $event)" />
        </span>
      </div>
      <template v-for="l in locations" :key="'plate-' + l.id">
        <div v-if="roomPlates?.[l.id]" class="room-plate" :class="{ selected: l.id === selectedId }" :data-id="l.id"
          :style="{ left: roomPlates[l.id].x + '%', top: roomPlates[l.id].y + '%', width: roomPlates[l.id].width + '%' }">
          <LocationMarkerPlate :info="infoOf(l)" size="room" :showText="plateText" :game="game" :playerId="playerId" :locationId="l.id"
            :data-fx-target="`location-${l.id}`"
            :[CARD_FLIGHT_ATTR]="l.cardId" :style="cardFlightStyle(flightState, l.cardId)"
            :data-image="locationImage(l)" :data-card-code="l.cardCode" @inspect="emit('inspect', l, $event)" @choose="emit('choose', $event)" />
        </div>
      </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-scroll { overflow: auto; min-width: 0; min-height: 0; display: flex; }
.map-canvas { position: relative; width: 100%; flex: 1; min-height: 240px; }
.compact .map-canvas { height: 100%; min-height: 180px; aspect-ratio: 4 / 3; }
.map-stage { position: absolute; inset: 0; }
.has-illustrated-board { min-height: 0; }
.map-scroll:has(.has-illustrated-board) { overflow: hidden; }
.board-art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill; pointer-events: none; }
.has-cutaway { container-type: size; }
.has-dream-board { container-type: size; }
.map-stage.dream-grid { inset: auto; left: 50%; top: 50%; translate: -50% -50%; width: min(100cqw, 177.777cqh); aspect-ratio: 16 / 9; }
@container (max-width: 600px) {
  .map-stage.dream-grid { width: min(100cqw, 133.333cqh); aspect-ratio: 4 / 3; }
}
.map-stage.cutaway { inset: auto; left: 50%; top: 50%; translate: -50% -50%; width: min(100cqw, 177.7cqh); aspect-ratio: 1672 / 941; border-radius: 6px; box-shadow: 0 0 40px #000a; }
/* On the house the room is the picture: the people stand on its floor, its plate sits in a corner of it. */
.cutaway .node { translate: -50% -100%; width: auto; height: auto; min-height: 0; padding: 0; background: transparent; border: 0; overflow: visible; align-items: center; justify-content: flex-end; gap: 3px; cursor: default; pointer-events: none; }
.cutaway .node::after { display: none; }
.room-plate { position: absolute; z-index: 110; }
.room-plate.selected :deep(.plate) { outline: 2px solid #e6c584; outline-offset: 2px; }
.map-links { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.map-links line { stroke: #b2996399; stroke-width: 1.2; vector-effect: non-scaling-stroke; }
/* Dark under-stroke first (via drop-shadow) so the pale dashes read on light and dark parts of the painting. */
/* A row of locations that all connect to each other: one gold rail under the whole row. */
.lane-rail { fill: none; stroke: #e9c46a99; stroke-width: 6; stroke-linecap: round; vector-effect: non-scaling-stroke; filter: drop-shadow(0 0 3px #000); }
.connection-guide { fill: none; stroke: #f6dc9cb3; stroke-width: 1.8; stroke-dasharray: 5 6; stroke-linecap: round; vector-effect: non-scaling-stroke; filter: drop-shadow(0 0 1.5px #000); }
.moving-enemy { fill: #eeab78; filter: drop-shadow(0 0 2px #f37045); }
.node { position: absolute; translate: -50% -50%; width: clamp(140px, 19%, 240px); height: auto; min-height: clamp(96px, 27%, 170px); padding: 5px; border: 1px solid #7c8d6277; border-radius: 6px; background: #1e2b20; color: #e5e2d4; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; text-align: left; cursor: pointer; }
.node:hover { border-color: #e6c584; }
.node.draggable { touch-action: manipulation; }
/* A finger only drags a plate or an arrow in arrange mode; otherwise it scrolls and taps. */
.location-map[data-arrange='true'] .node.draggable, .location-map[data-arrange='true'] .connection-arrow.draggable { touch-action: none; }
.node.draggable :deep(.plate) { cursor: grab; }
.node.hidden { border-style: dashed; }
.node.here { border-color: #afbe89; box-shadow: 0 0 0 2px #9bb98440; }
.node.selected { outline: 2px solid #e6c584; outline-offset: 2px; }
.node.targetable { box-shadow: 0 0 10px 2px #f2d27a; }
.map-stage:not(.cutaway) .node :deep(.plate) { max-width: 100%; }
.art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 28%; opacity: 0.75; z-index: 0; }
.node::after { content: ''; position: absolute; inset: 0; background: linear-gradient(transparent 45%, #07100bc0); z-index: 0; pointer-events: none; }
.node > :not(.art) { position: relative; z-index: 1; }
.occupants { display: flex; gap: 4px; flex-wrap: wrap; font-size: 0.85rem; font-weight: 700; text-shadow: 0 1px 3px #000; }
.figure { width: clamp(26px, 3vw, 40px); aspect-ratio: 1; border-radius: 50%; object-fit: cover; object-position: 50% 20%; border: 2px solid #c9dab1; background: #09100c; }
.figure.you { border-color: #ffe9a0; box-shadow: 0 0 8px #ffe9a0; }
/* Concealed mini-cards: in a location's tile under its plate, or on their own in an empty grid position. */
.node-concealed { margin: 3px 0; }
.concealed-spot { position: absolute; translate: -50% -50%; z-index: 5; padding: 4px; border: 1px dashed #c6a87388; border-radius: 6px; background: #0b130ecc; }
.spot { position: absolute; translate: -50% -50%; width: clamp(140px, 19%, 240px); height: clamp(96px, 27%, 170px); border: 2px dashed #e6c584aa; border-radius: 6px; background: transparent; color: #e6c584; font-size: 1.6rem; cursor: pointer; }
.compact .node, .compact .spot { width: 64px; height: 42px; min-height: 0; padding: 2px; }
.compact .figure { width: 14px; border-width: 1px; }
.compact .occupants { font-size: 0.55rem; gap: 2px; }
@media (max-width: 800px) {
  .node { width: 128px; min-height: 96px; }
  .spot { width: 128px; height: 96px; }
  .compact .node, .compact .spot { width: 64px; height: 42px; min-height: 0; }
}
.illustrated .node, .illustrated .spot { width: min(var(--location-width, 20%), 310px); min-height: 0; box-sizing: border-box; }
.illustrated .node { overflow: visible; padding: 0; background: #101912d9; }
.illustrated .node::after { display: none; }
/* Cosmos sprites: a layer under the plates, centred on their cell; width and aspect ratio are set inline. */
.island {
  position: absolute; height: auto; translate: -50% -50%; max-width: none; object-fit: contain;
  pointer-events: none; user-select: none; filter: drop-shadow(0 8px 14px #0009);
}
/* A cell the game asks you to pick (where to sail the boat, which island to explore) glows as a whole. */
.island.road-ghost { animation: road-leave 500ms ease-in forwards; }
@keyframes road-leave { from { opacity: 1; } to { opacity: 0; transform: translateX(var(--drift)); } }
@media (prefers-reduced-motion: reduce) { .island.road-ghost { display: none; } }
.island.targetable { filter: drop-shadow(0 0 10px #f2d27a) drop-shadow(0 8px 14px #0009); }
.island.rail-arm { filter: none; opacity: 0.9; }
.island.water { filter: none; transition: opacity 800ms ease-in-out; }
@starting-style { .island.water { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .island.water { transition: none; } }
/* Surf on the shore: the island's own silhouette as white foam, a little larger than the island and only along
 * its lower rim (where it meets the sea; the top of the picture is the land seen from above). It rolls in from
 * out at sea (larger, faint), reaches the rock, then drains away; the second wave follows half a beat later and
 * slightly downwind, so the shore is never wrapped in one even ring. */
.surf {
  position: absolute; height: auto; translate: -50% -50%; max-width: none; object-fit: contain;
  pointer-events: none; user-select: none; opacity: 0;
  filter: brightness(0) invert(1) blur(2px);
  -webkit-mask: linear-gradient(to bottom, transparent 38%, #000 72%);
  mask: linear-gradient(to bottom, transparent 38%, #000 72%);
  animation: surf-wash 5.2s ease-in-out infinite;
}
.surf-2 { animation-delay: -2.6s; animation-duration: 6.1s; margin-left: 3px; }
@keyframes surf-wash {
  0% { transform: scale(1.14, 1.2); opacity: 0; }
  45% { transform: scale(1.05, 1.08); opacity: 0.32; }
  62% { transform: scale(1.03, 1.05); opacity: 0.42; }
  100% { transform: scale(1.06, 1.1); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .surf { display: none; } }
/* Same water as a flooded card on the card board (Location.vue), masked to the sprite so it never spills
 * onto the sea around the place. */
.flood-mask {
  position: absolute; translate: -50% -50%; overflow: hidden; pointer-events: none;
  -webkit-mask: var(--sprite) center / contain no-repeat; mask: var(--sprite) center / contain no-repeat;
}
/* The card's water is a wide rounded block; turned on a wide 3:2 sprite its corners would sweep over the whole
 * picture, so here it is a near-circle much wider than the sprite: turning, its top edge only ripples a little
 * around the water line. `top` is that water line: below the picture (dry), half way, or just under the top
 * edge when fully flooded, so the surface stays in view. A second, lighter swell turns the other way and the
 * surface bobs up and down, so the water visibly moves at both levels. */
.flood-mask .wave {
  position: absolute; left: -100%; top: 110%; width: 300%; aspect-ratio: 1; border-radius: 45%;
  background-color: #3f68c5; opacity: 0.4;
  animation: flood-wave 30s linear infinite, flood-bob 4s ease-in-out infinite alternate;
  transition: top 10s ease-out;
}
.flood-mask .wave.swell {
  border-radius: 42%; background-color: #6f97e6; opacity: 0.3; margin-top: -1.5%;
  animation: flood-wave 18s linear infinite reverse, flood-bob 3s ease-in-out -1.5s infinite alternate;
}
.flood-mask .wave.PartiallyFlooded {
  top: 50%;
  @starting-style { top: 110%; }
}
.flood-mask .wave.FullyFlooded {
  top: 7%;
  @starting-style { top: 110%; }
}
@keyframes flood-wave { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
/* The wave is 3× the sprite's width, so 1% of its own size is a few percent of the picture. */
@keyframes flood-bob { from { translate: 0 0; } to { translate: 0 1.2%; } }
@media (prefers-reduced-motion: reduce) { .flood-mask .wave { animation: none; transition: none; } }
/* An open Cosmos cell a card can go into: a faint island exactly the size of its cell. */
.illustrated .spot.cosmos-spot {
  min-width: 0; min-height: 0; background: center / contain no-repeat; background-color: #e6c58412;
  text-shadow: 0 0 6px #000; opacity: 0.85;
}
.illustrated .spot.cosmos-spot:hover { opacity: 1; background-color: #e6c58430; border-style: solid; }
.illustrated .node :deep(.plate) { min-width: 0; }
.illustrated .node :deep(.plate .name) { white-space: normal; overflow-wrap: anywhere; }
.illustrated .spot { height: 100px; }
.location-floor { position: absolute; top: 100%; left: 0; width: 100%; isolation: isolate; }
.location-illustration {
  display: block; position: relative; overflow: hidden; aspect-ratio: 1.9;
  max-height: 128px; border-radius: 0 0 6px 6px;
}
.location-illustration img { position: absolute; top: 0; left: 0; width: 100%; translate: 0 -12%; }
.location-floor :deep(.standees) {
  /* In flow, so the floor grows to hold everyone with their bars; the floor hangs below the plate, never over it. */
  position: relative; justify-content: center; flex-wrap: wrap; gap: 2px 4px; padding-top: 4px;
}
/* Health, sanity, resources and clues stay over every head on the illustrated boards too, just tighter. */
.location-floor :deep(.hud) { min-width: 0; padding: 2px 3px; font-size: 10px; }
.location-floor :deep(.hud .track) { width: 16px; }
.location-floor :deep(.standees) { z-index: 2; }
.location-floor :deep(.figure) { height: calc(64px * var(--figure-scale, 1)); max-width: none; image-rendering: auto; }
.location-floor :deep(.crop) { width: calc(48px * var(--figure-scale, 1)); }
.connection-arrow.draggable { pointer-events: auto; cursor: grab; touch-action: manipulation; }
.connection-arrow {
  position: absolute;
  z-index: 3;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  width: 34px;
  height: 34px;
  padding: 5px;
  translate: -50% -50%;
  pointer-events: none;
  cursor: default;
  font: inherit;
  /* A light, see-through badge: the arrow stays readable without competing with the room plates.
     Hovering brings back the full dark badge with a bright rim. */
  background: #140f0999;
  border: 1px solid #f6dc9c88;
  border-radius: 999px;
  box-shadow: 0 1px 4px #0008;
  fill: none;
  stroke: #ffe9a8e6;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
}
.connection-arrow svg { width: 100%; height: auto; overflow: visible; }
.connection-arrow:hover {
  background: #140f09e6;
  border-color: #f6dc9c;
  box-shadow: 0 0 0 1px #000a, 0 2px 8px #000c, 0 0 10px #f2d27a66;
  stroke: #ffe9a8;
}
/* A link you can travel now is the move button: the green of the old plate button, clickable, and its
 * dashed guide brightens to show the route. */
.connection-arrow.movable {
  pointer-events: auto;
  cursor: pointer;
  background: #1d3324e6;
  border-color: #8fd19a;
  stroke: #d7ecd2;
  box-shadow: 0 0 0 1px #000a, 0 0 8px #5fd88a66;
}
.connection-arrow.movable:hover, .connection-arrow.movable:focus-visible {
  background: #2f5a3a;
  border-color: #b8f0c0;
  stroke: #fff;
  box-shadow: 0 0 0 1px #000a, 0 0 12px #5fd88aaa;
  outline: none;
}
.connection-guide.movable { stroke: #a8e6b2d9; }
/* Barricaded link: a rust badge with a wooden barricade, a solid rust guide, and the number of barriers in a
 * chip on the badge's corner. It takes the pointer so its tooltip (who it blocks, how many) shows on hover. */
.connection-guide.blocked { stroke: #d9774fcc; stroke-dasharray: none; stroke-width: 2.4; }
.connection-guide.blocked.movable { stroke: #a8e6b2d9; stroke-dasharray: 5 6; }
.connection-arrow.blocked {
  pointer-events: auto;
  background: #2a130be6;
  border-color: #d9774f;
  color: #f1c08f;
  box-shadow: 0 0 0 1px #000a, 0 1px 6px #000c, 0 0 8px #d9774f55;
}
.connection-arrow.blocked.movable { background: #1d3324e6; border-color: #8fd19a; }
.connection-arrow .barricade { width: 100%; height: 100%; }
.connection-arrow .barrier-count {
  position: absolute;
  top: -7px;
  right: -7px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  box-sizing: border-box;
  border-radius: 999px;
  background: #b4462a;
  border: 1px solid #ffd8b5;
  color: #fff;
  font: 700 11px/15px system-ui, sans-serif;
  text-align: center;
  box-shadow: 0 1px 3px #000c;
  pointer-events: none;
}
.connection-arrow.stray { cursor: default; }
.location-map[data-input='touch'] .connection-arrow.movable { width: var(--tap-min, 44px); height: var(--tap-min, 44px); }
.descent .node {
  width: min(25%, 240px);
  height: auto;
  min-height: 0;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
  box-shadow: none;
  cursor: default;
  pointer-events: none;
}
.descent .node::after { display: none; }
.descent .node.selected { outline: none; }
.descent .node.selected :deep(.plate) { outline: 2px solid #e6c584; outline-offset: 2px; }
.descent .node :deep(.plate) { box-sizing: border-box; width: 100%; min-width: 0; }
.descent .node :deep(.plate .name) { white-space: normal; overflow-wrap: anywhere; }
.descent .location-floor { width: 100%; }
.village .node {
  width: min(20%, 195px); background: transparent; border: 0; box-shadow: none;
  pointer-events: none;
}
.village .node.selected { outline: none; }
.village .node.selected :deep(.plate) { outline: 2px solid #e6c584; outline-offset: 2px; }
.house .node, .house .spot { width: min(22%, 180px); }
/* Player-chosen sizes (Settings): location buttons/plates and character figures. */
.node, .spot, .room-plate { scale: var(--location-scale, 1); }
.room-plate { transform-origin: 0 0; }
.cutaway .node { scale: 1; transform-origin: 50% 100%; }
.cutaway .node :deep(.standees) { scale: var(--figure-scale, 1); transform-origin: 50% 100%; }
.figure { zoom: var(--figure-scale, 1); }
.house .location-illustration { max-height: 75px; }
/* Fingers: readable health and sanity bars, and a bigger reach for the empty-slot buttons. */
.location-map[data-input='touch'] .location-floor :deep(.hud) { font-size: 11px; }
.location-map[data-input='touch'] .spot { min-height: var(--tap-min); min-width: var(--tap-min); }
/* On painted boards a plate is only as wide as its name and stats need, so it covers as little of the picture as possible.
 * The name stays on one line (one slim row hides less of the painting than two); past 280px it is cut with an ellipsis
 * and the full name is on the location card shown on hover. */
.illustrated .node, .village .node, .descent .node, .house .node { width: max-content; max-width: 280px; }
.illustrated .node :deep(.plate .name), .village .node :deep(.plate .name), .descent .node :deep(.plate .name), .house .node :deep(.plate .name) { white-space: nowrap; overflow-wrap: normal; }
.illustrated .node :deep(.plate), .village .node :deep(.plate), .descent .node :deep(.plate), .house .node :deep(.plate) { min-width: 0; padding: 2px 5px; gap: 2px; }
.illustrated .node :deep(.plate .main), .village .node :deep(.plate .main), .descent .node :deep(.plate .main), .house .node :deep(.plate .main) { min-height: 18px; gap: 4px; }
.illustrated .node :deep(.plate .name), .village .node :deep(.plate .name), .descent .node :deep(.plate .name), .house .node :deep(.plate .name) { font-size: 0.76rem; }
.dream-grid .node { max-width: min(24%, 180px); z-index: 5; }
.dream-static .node { max-width: min(19%, 180px); }
.dream-grid .node :deep(.plate .name), .dream-static .node :deep(.plate .name) { white-space: normal; overflow-wrap: anywhere; }
@container (max-width: 600px) {
  .dream-grid .node { max-width: 21%; }
  .dream-grid .stair-node { max-width: 45%; }
  .dream-grid .node :deep(.plate .name), .dream-static .node :deep(.plate .name) { font-size: 0.65rem; }
  .dream-grid .stair-node :deep(.plate .name) { white-space: nowrap; }
}
</style>
