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
