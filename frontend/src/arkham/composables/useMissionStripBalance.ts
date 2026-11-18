import { onBeforeUnmount, watch, type Ref } from 'vue'

/* Shares the mission strip's row between its panels (agenda, act, reference) by how much room each one's
 * content really needs, so they end at the same height: no panel half empty while another scrolls.
 *
 * Each panel's height is a fixed part (header, the two-line flavor, padding) plus its wrapping content
 * (rules, abilities, token rows), whose area stays about the same at any width. For a common height H the
 * panel needs width  pad + area / (H − fixed);  H is searched so the widths fill the row. The result is
 * written as CSS variables that MissionStripPanel reads (`--balance-basis`, `--balance-grow`); without them
 * (folded strip, panels wrapped onto several rows, nothing measured yet) the text-length weight applies. */

const PANEL = ':scope > .mission:not(.mission--compact)'
const MIN_WIDTH = 320
/** Ignore changes smaller than this (px), so re-measuring after our own resize settles instead of looping. */
const SETTLE_PX = 6
/** Kept free at the end of the row so rounding never pushes the last panel onto a new line. */
const SLACK_PX = 2

type Measured = { el: HTMLElement; width: number; pad: number; fixed: number; area: number }

function measure(el: HTMLElement): Measured | null {
  const head = el.querySelector<HTMLElement>(':scope > .mission__head')
  const body = el.querySelector<HTMLElement>(':scope > .mission__body')
  const width = el.offsetWidth
  if (!head || !body || !width) return null
  const flavor = body.querySelector<HTMLElement>(':scope > .mission__flavor')
  const flavorH = flavor ? flavor.offsetHeight + 3 : 0
  const rest = Math.max(0, body.scrollHeight - flavorH)
  const bodyWidth = body.clientWidth
  /* Counted from the parts, not the panel's height: the row stretches every panel to the tallest one. */
  const cs = getComputedStyle(el)
  const px = (v: string) => parseFloat(v) || 0
  const frame = px(cs.paddingTop) + px(cs.paddingBottom) + px(cs.borderTopWidth) + px(cs.borderBottomWidth) + px(cs.rowGap)
  return {
    el, width,
    pad: width - bodyWidth,
    fixed: head.offsetHeight + frame + flavorH,
    area: rest * bodyWidth,
  }
}

/** No panel takes more than this share of the row, so one wordy card never dwarfs the others; past it
 * that panel is a little taller (and scrolls at the height cap) instead. Three or more panels → 40% each
 * at most (a third is 33%); two → 60%. */
const maxShare = (n: number) => (n <= 2 ? 0.6 : 0.4)

/** The widths that give every panel the same height and add up to `total`. */
function solve(panels: Measured[], total: number): number[] {
  const maxWidth = Math.max(MIN_WIDTH, total * maxShare(panels.length))
  const widthAt = (p: Measured, h: number) =>
    Math.min(maxWidth, Math.max(MIN_WIDTH, p.pad + p.area / Math.max(1, h - p.fixed)))
  let lo = Math.max(...panels.map((p) => p.fixed)) + 1
  let hi = lo + 4000
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    const sum = panels.reduce((s, p) => s + widthAt(p, mid), 0)
    if (sum > total) lo = mid
    else hi = mid
  }
  let widths = panels.map((p) => widthAt(p, hi))
  /* Spare room (a panel held at its maximum, or all fit at their minimum) goes to the panels below the
   * maximum in equal parts, so the narrow ones catch up, never lifting one past the maximum. */
  for (let pass = 0; pass < panels.length; pass++) {
    const spare = total - widths.reduce((s, w) => s + w, 0)
    const open = widths.filter((w) => w < maxWidth).length
    if (spare < 1 || !open) break
    widths = widths.map((w) => (w < maxWidth ? Math.min(maxWidth, w + spare / open) : w))
  }
  return widths
}

function clear(el: HTMLElement) {
  el.style.removeProperty('--balance-basis')
  el.style.removeProperty('--balance-grow')
}

export function useMissionStripBalance(strip: Ref<HTMLElement | null>) {
  let frame = 0
  let resize: ResizeObserver | null = null
  let mutate: MutationObserver | null = null

  let lastWidth = -1

  /* Always measured from the unbalanced (text-weight) layout, inside one task so nothing is painted in
   * between: the same strip and content give the same widths, so re-running can never swing back and forth. */
  function balance() {
    frame = 0
    const root = strip.value
    if (!root) return
    lastWidth = root.clientWidth
    const els = [...root.querySelectorAll<HTMLElement>(PANEL)]
    els.forEach(clear)
    const panels = els.map(measure).filter((p): p is Measured => p !== null)
    const oneRow = panels.length > 1 && panels.every((p) => p.el.offsetTop === panels[0].el.offsetTop)
    if (!oneRow || panels.length !== els.length) return
    const total = panels.reduce((s, p) => s + p.width, 0)
    /* Rounded down, with a little slack: a basis sum even a fraction over the line wraps the row. */
    const widths = solve(panels, total - SLACK_PX).map(Math.floor)
    if (panels.every((p, i) => Math.abs(p.width - widths[i]) < SETTLE_PX)) return
    panels.forEach((p, i) => {
      p.el.style.setProperty('--balance-basis', `${widths[i]}px`)
      p.el.style.setProperty('--balance-grow', '1')
    })
  }

  /* A timer, not requestAnimationFrame: rAF is paused in background / embedded views, and the strip still
   * has to be laid out when it comes back. */
  const schedule = () => { if (!frame) frame = window.setTimeout(balance, 16) }
  /* Our own widths change the strip's height; only a change of its width is worth re-balancing for. */
  const onResize = () => { if (strip.value && strip.value.clientWidth !== lastWidth) schedule() }

  function stop() {
    resize?.disconnect()
    mutate?.disconnect()
    resize = mutate = null
    if (frame) clearTimeout(frame)
    frame = 0
  }

  /* The strip is rendered conditionally, so follow its element rather than the component's mount. */
  watch(strip, (el) => {
    stop()
    if (!el) return
    lastWidth = -1
    resize = new ResizeObserver(onResize)
    resize.observe(el)
    /* Text changing inside a capped panel (it scrolls) does not resize anything, so watch the content too. */
    mutate = new MutationObserver(schedule)
    mutate.observe(el, { childList: true, subtree: true, characterData: true, attributeFilter: ['class'] })
    schedule()
  }, { immediate: true, flush: 'post' })
  onBeforeUnmount(stop)
}
