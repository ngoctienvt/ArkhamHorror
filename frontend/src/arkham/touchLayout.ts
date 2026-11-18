/* How the scene map should lay itself out for the screen it is on. Import-free on purpose so the
 * tests can load it without the Vue toolchain; the reactive wrapper is composables/useTouchMode.ts. */

export type LayoutClass = 'phone' | 'tablet-portrait' | 'tablet-landscape' | 'desktop'
export type InputMode = 'touch' | 'mouse'

/** Below this width the screen is a phone. */
export const PHONE_MAX_WIDTH = 743
/** Tablets held upright (iPad mini 744 up to iPad Pro 12.9 at 1024 minus one). */
export const TABLET_PORTRAIT_MAX_WIDTH = 1023
/** Tablets held sideways, up to the iPad Pro 12.9 (1366). Wider touch screens count as desktop. */
export const TABLET_LANDSCAPE_MAX_WIDTH = 1366

/**
 * Pick the layout for a viewport width. Only a touch screen (`coarse` pointer) gets the tablet
 * layouts; a narrow mouse-driven window keeps the desktop layout, and a phone is a phone either way.
 */
export function layoutClassFor(width: number, coarse: boolean): LayoutClass {
  if (width <= PHONE_MAX_WIDTH) return 'phone'
  if (!coarse) return 'desktop'
  if (width <= TABLET_PORTRAIT_MAX_WIDTH) return 'tablet-portrait'
  if (width <= TABLET_LANDSCAPE_MAX_WIDTH) return 'tablet-landscape'
  return 'desktop'
}

/** A finger drives the screen when the primary pointer is coarse; a hover-capable mouse wins otherwise. */
export function inputModeFor(coarse: boolean, canHover: boolean): InputMode {
  return coarse && !canHover ? 'touch' : 'mouse'
}

/* ---- The room the scene map itself has ----
 * The window width says little about the map: the game log beside it takes a few hundred pixels, and a
 * mouse-driven window can be as narrow as a tablet. These read the map's own measured box instead. */

export type WidthClass = 'wide' | 'medium' | 'narrow'

/** Below this map width the side columns no longer fit beside the picture: the action panel becomes a bottom sheet. */
export const MAP_NARROW_BELOW = 700
/** From this map width up the full-size action panel and an unfolded mission strip fit beside the picture. */
export const MAP_WIDE_FROM = 1100
/** How far past a threshold the width must go before the class changes back, so a resize never flickers. */
export const WIDTH_HYSTERESIS = 16

const plainWidthClass = (width: number): WidthClass =>
  width < MAP_NARROW_BELOW ? 'narrow' : width < MAP_WIDE_FROM ? 'medium' : 'wide'

/**
 * The size class for a map of this width. Pass the class it had before to keep it steady around a
 * threshold: it only changes once the width is clearly on the other side.
 */
export function widthClassFor(width: number, previous?: WidthClass): WidthClass {
  const next = plainWidthClass(width)
  if (!previous || next === previous) return next
  const steady = [width - WIDTH_HYSTERESIS, width + WIDTH_HYSTERESIS].some((w) => plainWidthClass(w) === previous)
  return steady ? previous : next
}

/** Below this height of the map area the action panel folds its "about this location" block so the actions show. */
export const MAP_SHORT_BELOW = 420
export const isShortMap = (height: number) => height > 0 && height < MAP_SHORT_BELOW

/** Room the bar needs for Map / Card board / Actions, the "more" menu and the strip fold. */
export const BAR_CORE_WIDTH = 300
/** Room the bar needs to show every tool button without the "more" menu. */
export const BAR_FULL_WIDTH = 600

/**
 * Where the map's controls go. They ride in the game bar while its free middle fits at least the core
 * buttons; otherwise they take a row of their own above the map. Either way the tool buttons fold into
 * the "more" menu when the row they are on cannot hold them all.
 */
export function barModeFor(gameBarRoom: number, mapWidth: number): { inGameBar: boolean; collapsed: boolean } {
  const inGameBar = gameBarRoom >= BAR_CORE_WIDTH
  return { inGameBar, collapsed: (inGameBar ? gameBarRoom : mapWidth) < BAR_FULL_WIDTH }
}
