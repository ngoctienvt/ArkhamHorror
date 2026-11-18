# Dunwich / Carcosa scene audit

Outcome — audit all 16 scenarios and both Return to variants against backend location lifecycle, card text, current images and anchors. Correct geography and add environmental state images where supported by story and live game state.

Constraints — share original / Return to art when geography agrees. Preserve other work in the shared workspace. Keep locations, tokens and connections driven by current game state.

Acceptance — every scenario reviewed, complete location coverage including late additions and alternate cards. New imagery has checked anchors. State transitions support reload and undo. Focused scene tests and TypeScript pass.

## Work

- [x] Inspect overview mappings and all 16 current panoramas with anchor overlays.
- [x] Check scenario / card definitions and late location placement.
- [x] Correct geography and add state imagery.
- [x] Integrate snapshot selection with branch-specific state.
- [x] Verify anchors, regression cases and typecheck.
- [x] Record scenario-by-scenario results and source evidence.

## Initial findings

- Extracurricular Activity already updated in the preceding task.
- House Always Wins needs damaged entrance / lounge after Agenda 2B.
- Museum has complete room slots, needs progressive shadows.
- Essex uses live train sprites. Portal growth can vary without painting removed cars.
- Blood on the Altar needs sunset / night distinction. Hidden Chamber already follows its actual entrance.
- Undimensioned and Unseen needs storm after Agenda 2B.
- Where Doom Awaits has separate pre-gate, altered landscape and open gate states.
- Lost in Time and Space uses card art for placed locations. Inspect rift lifecycle.
- Curtain Call uses branch-specific effects masked to locations with horror.
- Last King has an empty mansion and a later madness variant.
- Echoes has Return to basement and hidden library. Check room anchors.
- Unspeakable Oath uses an updated cutaway and alarm state.
- Phantom of Truth includes Return to aliases and dawn on agenda backs.
- Pallid Mask retains its dynamic grid and adds a collapse background on the escape branch.
- Black Stars Rise has abbey interiors and independent flood / vortex states.
- Dim Carcosa starts with a theatrical illusion and transitions to its city.

## Reviewed scenarios

All entries include the base and Return to scenario IDs. The scenario setup and location definitions in `backend/arkham-api/library/Arkham/Scenario/Scenarios/` and `Location/CardDefs/` were checked along with relevant Act and Agenda implementations and card flavor in `frontend/public/cards.json`.

| Scenario | Result |
| --- | --- |
| Extracurricular Activity | Campus and Science Building commotion completed earlier. |
| The House Always Wins | Damaged lounge variant. |
| The Miskatonic Museum | Progressive shadows, exhibit placement retained. |
| The Essex County Express | Larger rift, live train-car placement retained. |
| Blood on the Altar | Brook anchor corrected, nighttime variant, Hidden Chamber remains connected to its actual entrance. |
| Undimensioned and Unseen | Terrain and ruins corrected, storm variant. |
| Where Doom Awaits | Quiet, altered and open-gate states. Random paths retain their live card art. |
| Lost in Time and Space | Late locations and repeated cards retain live labels and card art. |
| Curtain Call | Five location-specific hazard effects, including Return to effects. The sound-only branch has no visual overlay. |
| The Last King | Removed baked-in people, added madness variant. |
| Echoes of the Past | Hidden Library and Return to basement already have reveal-aware points. |
| The Unspeakable Oath | Rearranged basement rooms and added alarm variant. |
| A Phantom of Truth | Return to aliases and dawn state. |
| The Pallid Mask | Live grid retained, collapse background for The Way Out. |
| Black Stars Rise | Corrected abbey layout and independent flood / vortex variants. |
| Dim Carcosa | Theatre illusion before the city is revealed, extra Return to locations retained. |

Image prompts used the built-in ImageGen tool. Replacements requested period Lovecraftian painted scenes with recognizable locations; variants requested the same camera and landmarks with changes limited to the relevant event. Curtain Call requested individual fire, ooze, flood, mist and vine treatments for masking to affected rooms.

Visual checks used labeled anchor overlays. No running local game was available for a browser check.
