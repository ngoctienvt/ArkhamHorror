---
status: completed
created: 2026-11-12
scope: frontend only (no backend change)
---

# In Too Deep — barriers on the scene map

## Outcome
Barriers in In Too Deep are visible on the illustrated scene map, on the link between the two
locations they block, with their count. The "only shown on the card board" note no longer fires
because of barriers. Resource-token art is replaced by a dedicated barricade icon.

## Facts (verified)
- Backend already complete. State lives in `scenario.meta.barriers`:
  `{ "<locIdA>--<locIdB>": n }`, key = ids sorted (`SortedPair`, `backend/.../SortedPair.hs`).
  Movement blocking comes from the `Barricades` modifier (`InTooDeep.hs:66-76`).
- Card board draws them: `components/Scenario.vue:3285` (stack of `tokens/resource.png`,
  debug `x` button sends `ScenarioCountDecrementBy`). Key lookup uses `[a,b].sort().join('--')`.
- `boardOnlyContent` (`Scenario.vue:1527`) is true whenever `meta.barriers` exists → map shows the
  "Một phần của scenario này chỉ hiển thị trên bảng bài" note.
- Scene map links: `components/LocationMapCanvas.vue:145` `connectionArrows` — one badge per link
  at the midpoint (`key = a:b`, `x/y` in %, `rotation`, `move`). `LocationMap.vue` already has
  the `scenario` prop, so no new plumbing from `Scenario.vue` is needed.
- Removal/placement choices (location abilities, Tablet token) arrive as location targets, which
  the map already handles as targetable plates — no new click wiring.

## Design
Put the barrier ON the existing link badge rather than a second marker (no extra clutter, no
new drag offsets, follows when the player slides the arrow):
- Link with n > 0: badge becomes a "blocked" variant — barricade icon (crossed planks) instead
  of the arrow, red/rust rim, small count chip `n` at its corner. Dashed guide turns rust, solid.
- n = 0: unchanged arrow.
- Tooltip/aria: "N rào cản giữa A và B".
- Debug mode: clicking a blocked badge removes 1 barrier (same message as the card board).
- Icon: inline SVG (`BarrierIcon.vue` or a path constant) — themeable, scales crisply, no asset
  pipeline. Card board reuses the same icon instead of `resource.png` (one icon per barrier up
  to 4, which is the max in setup; rule text "using resource tokens" is just a physical proxy).
- Info card (`LocationInfoCard.vue` connections chips): append a small "▮×N" barrier marker on
  each chip whose link is blocked, so the count is readable when badges are small/zoomed out.

## Steps
1. `arkham/scenarioBarriers.ts` (new, small): `barrierKey(a,b)`, `barriersBetween(meta,a,b)`,
   `barriersAt(meta, id)`; replace the inline sort/join in `Scenario.vue`. Unit test with vitest
   (key ordering, missing meta, zero counts).
2. `BarrierIcon.vue` (inline SVG, currentColor).
3. `LocationMap.vue`: compute `barrierCounts = scenario.meta?.barriers ?? null`, pass to
   `LocationMapCanvas` and into `inspectedConnections` (`barriers: n`).
4. `LocationMapCanvas.vue`: add `barriers` to each `connectionArrows` entry; template renders
   blocked variant + count chip; CSS `.connection-arrow.blocked`, `.connection-guide.blocked`.
   A link can be both blocked and movable (Cultist token "move east ignoring barriers",
   `CanIgnoreBarriers` enemies) — keep `movable` styling precedence (green) so a legal move is
   never hidden, but the count chip still shows on a movable badge.
   Fallback: any non-zero barrier key with no arrow (link dropped because `locationLinkDirection`
   is null, `clipBetweenBoxes` fails, or an endpoint is missing) gets a standalone marker at the
   midpoint of the two positions — a barrier must never silently vanish once the board-only
   note is gone.
5. `LocationInfoCard.vue`: barrier marker on connection chips.
6. `Scenario.vue`: card board uses `BarrierIcon`; drop `Boolean(barriers.value)` from
   `boardOnlyContent`.
7. i18n: `locationMap.link.barriers` (en + vi, plural), info-card label.
8. Verify: vue-tsc + vitest; run a game in In Too Deep, check all 13 setup links show the
   right counts (2,1,3,1 / 1,2,2,2,1 / 1,3,1,4), debug-remove one, Tablet-token place one,
   location ability remove one; confirm every non-zero key has a badge or fallback marker
   (incl. unrevealed endpoints); check map at desktop + touch widths; card board still renders.

## Risks
- Badge with count chip on small/compact map: compact map has no arrows (`connectionArrows`
  returns [] when compact) — acceptable, info card covers it.
- `meta.barriers` key order: JS string sort vs Haskell `Ord LocationId` (UUID text) — same order,
  already relied on by the card board.

## Non-goals
- Room/scene view: In Too Deep has an illustrated board, so `showOverview` is always true
  (`LocationMap.vue:200`) and the room view never shows for it.
- No backend change, no new raster art, no barrier display for other scenarios (The Longest
  Night barriers are per-location, not per-link — separate work if wanted).

## Unresolved questions
- Want raster art (AI-generated barricade sprite matching the painted board) instead of the
  inline SVG icon? SVG is the recommendation; raster can swap in later via the same component.
