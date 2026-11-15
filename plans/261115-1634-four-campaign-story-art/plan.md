# Story illustrations for four Arkham Horror campaigns

Scope covers narrative introductions and resolutions for Edge of the Earth, The Scarlet Keys, The Feast of Hemlock Vale, and The Drowned City. Share an image only when the illustrated moment occurs in each passage. Leave rules, choices about which passage to read, and Campaign Log checks in text.

Read the EN and VI scenario locales and trace passage scopes in `backend/arkham-api/library/Arkham/Scenario/Scenarios` and `backend/arkham-api/library/Arkham/Campaign/Campaigns`. The campaign IDs are 08, 09, 10, and 11 in that order. The corresponding campaign names in the runtime locale are the `prefix` values in the [passage map](../../frontend/src/arkham/lateCampaignStoryArt.ts).

Use the Innsmouth [lighthouse illustration](../../frontend/src/assets/innsmouth-story/fog-lighthouse-cliffs.webp) for the visual treatment. Use the local Scene Maps for location structure, alongside actor references by card code whenever an identifiable character is central.

1. Identify the discovery, decision, or consequence for each narrative passage.
2. Generate a single composition per moment, inspect it at story width, and export as a 1536 × 1024 WebP.
3. Add the finished image and its passage keys to the shared story panel lookup.
4. Test availability and passage selection in English and Vietnamese. Run frontend typecheck. The player checks the rendered story panels in game.

## Initial compositions

| Campaign | Passage | Moment and references |
| --- | --- | --- |
| Edge of the Earth | `prologue1.body` | Dyer warns against the Antarctic expedition while Danforth paces. Dyer 08714 and Danforth 08715. |
| Edge of the Earth | `iceAndDeath.part1.intro4.body` | A survivor is pulled from the burning crashed plane. Ice and Death I Scene Map. |
| Edge of the Earth | `iceAndDeath.part1.resolutions.resolution1.body` | The expedition sets up shelter in grim silence after seeing the creatures. Ice and Death I Scene Map. |
| Edge of the Earth | `iceAndDeath.part2.intro.body` | The search for the missing team members begins from camp. Ice and Death II Scene Map. |
| Edge of the Earth | `iceAndDeath.part3.intro.body` | One survivor passes the binoculars and points out the threat beyond camp. Ice and Death III Scene Map. |
| The Scarlet Keys | `riddlesAndRain.intro.intro2`, `intro3` | Flint joins one investigator in the empty cinema. His appearance follows the description in both passages. |
| The Scarlet Keys | `riddlesAndRain.resolutions.resolution1.body` | The investigator compares the recovered ruby marble to the eye socket. |
| The Scarlet Keys | `riddlesAndRain.resolutions.resolution2.body` | The Red-Gloved Man directs the investigator to the coffin during an uneasy parley. |
| The Feast of Hemlock Vale | `prelude1.intro.intro1` | The survey team reaches the fishing village of Akwan via the exposed causeway. |
| The Feast of Hemlock Vale | `fateOfTheVale.resolutions.resolution3.body` | The rescued group shelters in the lighthouse while dawn reveals the white ash and surviving ancient tree. Marquez 10702. |
| The Feast of Hemlock Vale | `fateOfTheVale.resolutions.resolution4.body` | A gray dawn reveals the island stripped bare by the blaze. Marquez 10702. |
| The Drowned City | `prologue.body` | An April street quarrel escalates on a cold Arkham corner near Miskatonic University. |
