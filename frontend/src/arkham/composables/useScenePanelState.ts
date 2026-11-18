import { ref, type InjectionKey, type Ref } from 'vue'

export const sceneActionSidebarKey: InjectionKey<{
  pinned: Readonly<Ref<boolean>>
  target: Readonly<Ref<HTMLElement | null>>
  open: () => void
  /** The game log's floating window, opened from the map bar while the actions are docked. */
  logOpen: Readonly<Ref<boolean>>
  toggleLog: () => void
}> = Symbol('sceneActionSidebar')

/**
 * Whether the scene map's action panel is on screen right now. The panel carries End turn, so while it
 * shows, the investigator card leaves its own End turn button out; once the panel is closed (or the
 * card board is showing) that button is back, so the turn can always be ended from somewhere.
 */
export const sceneActionPanelVisible = ref(false)
