# Game motion and board effects

How the LCG board (`frontend/`) animates state changes, and how to hook a new
component into it.

## One gate: `motionLevel`

`useSettings().motionLevel` (`stores/settings.ts`, logic in
`arkham/motion/motionTokens.ts`) is the only switch effects should read:

| Level | When | Allowed |
|---|---|---|
| `full` | default | everything |
| `reduced` | "extra animations" off | cards/tokens travel; no shakes or lunges |
| `static` | OS `prefers-reduced-motion` | nothing moves; numbers fade in place, anchors glow briefly |
| `off` | animation speed set to Off | no effects at all |

`combatFx` ("Effect animations") still turns the FX layer off on its own.
The speed setting (Normal / Fast / Off) sets `--motion-scale` on `<html>`.

## Durations

Use the tokens, never raw numbers: CSS `--motion-fast | base | travel | linger`
and `--ease-out | in-out | land` (`styles/tokens.css`); timers use `MOTION_MS`
and `scaledMs()` from `motionTokens.ts`. Both follow the speed setting.

## What happens on a game update

1. `Game.vue` `applyGameUpdate` diffs card zones (`cardMoves` in
   `arkham/gameDeltaFx.ts`). Cards whose start is on screen go in the flight
   set, then the new state is applied inside **one** view transition, together
   with investigator/enemy movement. The state is always applied immediately;
   only the picture is animated.
2. All view transitions go through `runViewTransition`
   (`arkham/motion/viewTransitionGuard.ts`). A second request while one runs is
   applied without animating instead of cancelling the first.
3. `FxLayer.vue` waits until no overlay holds `uiLock` and no transition is
   running, then diffs its baseline snapshot against the current game and plays
   the events in beats: token transfers → enemy lunge → hits → marks (doom,
   uses, unpaired clues/resources). Updates that arrive while a timeline plays
   collapse into the next diff, so there is never a queue. `fxBusy` holds the
   autopilot for the whole timeline.

## Transfers

`diffSnapshots` pairs a token loss with a gain only when it is unambiguous:
a location losing N clues with exactly one investigator there gaining N; one
loss and one gain of equal size anywhere; investigators' clues vanishing with a
single act on the board (spent to advance). Anything else stays separate
floating numbers. Tests: `frontend/tests/gameDeltaFx.test.mjs`.

## Hooking up a component

- Something tokens or numbers can come from/go to: add
  `data-fx-target="<entity>-<id>"` (`investigator`, `enemy`, `location`, `act`,
  `agenda`, `asset`). The first laid-out copy wins; `data-fx-fallback` is a
  lower-priority anchor.
- Something a card can land on or leave from: bind `CARD_FLIGHT_ATTR` and
  `useCardFlight` (`arkham/cardFlight.ts`); a pile showing only its top card uses
  `CARD_FLIGHT_PILE_ATTR` + `cardFlightPileStyle` (player deck and discard: `Draw.vue`;
  a drawn card flies out of the deck into its hand slot).
- A list with its own enter/leave animation must skip items in the flight set
  (see `flyingElsewhere` in `Player.vue`), or the duplicate transition name
  cancels the flight.

## Other moments

- Click feedback: `arkham/motion/pendingChoice.ts` marks the pressed option
  (`.choice-pending`) from the player's own answer until the next update.
- Chaos tokens rise and turn face up (`ChaosBag.vue`); the skill test verdict
  lands with a beat (`SkillTest.vue`); `PhaseBanner.vue` announces each phase
  (own toggle in Settings).

## Verification

Delta model and pairing rules are unit-tested. Visual timing is checked by eye
in the browser; there are no visual tests.
