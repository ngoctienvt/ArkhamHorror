<script lang="ts" setup>
import { computed } from 'vue'
import type { Game } from '@/arkham/types/Game'
import type { Location } from '@/arkham/types/Location'
import type { Tokens } from '@/arkham/types/Token'
import TokenPool, { type TokenPoolItem } from '@/arkham/components/TokenPool.vue'
import Seal from '@/arkham/components/Seal.vue'
import SealedChaosTokens from '@/arkham/components/SealedChaosTokens.vue'

/* Everything lying on a location that the scene map would otherwise hide: every token other than clues and
 * doom (horror, damage, resources, civilians, locks, time, a custom set's own…), seals, breaches, a lit
 * brazier, the cards stacked underneath and chaos tokens sealed or placed here. It reads the same location
 * fields the card board (Location.vue) draws, so the map never shows less than the board. Clues and doom stay
 * with the caller, which already draws them in its own style. */
const props = defineProps<{ game: Game; playerId: string; location: Location }>()
const emit = defineEmits<{ (e: 'choose', index: number): void }>()

/* The Tillinghast Esoterica keeps artifact cards underneath, drawn with their own back. */
const TILLINGHAST_ESOTERICA = 'c11685'

const tokens = computed<Tokens>(() => {
  const { Clue: _clue, Doom: _doom, ...rest } = props.location.tokens
  return rest
})

const extraItems = computed<TokenPoolItem[]>(() => {
  const l = props.location
  const items: TokenPoolItem[] = []
  const breaches = l.breaches?.contents ?? 0
  if (breaches > 0) items.push({ key: 'Breach', type: 'resource', amount: breaches, tooltip: 'Breaches' })
  if (l.brazier === 'Lit') items.push({ key: 'Brazier', type: 'resource', amount: 1, tooltip: 'Brazier (lit)' })
  const under = l.cardsUnderneath
  if (l.cardCode === TILLINGHAST_ESOTERICA) {
    if (under.length) items.push({ key: 'Underneath', type: 'artifact_card', amount: under.length })
  } else {
    const encounter = under.filter((c) => c.tag === 'EncounterCard').length
    const player = under.filter((c) => c.tag === 'PlayerCard').length
    if (encounter) items.push({ key: 'EncounterUnderneath', type: 'card', amount: encounter, tooltip: 'Encounter cards underneath' })
    if (player) items.push({ key: 'PlayerUnderneath', type: 'player_card', amount: player, tooltip: 'Player cards underneath' })
  }
  return items
})

const chaosTokens = computed(() => [...props.location.sealedChaosTokens, ...(props.location.placedChaosTokens ?? [])])

const hasAny = computed(() =>
  Object.values(tokens.value).some((n) => (n ?? 0) > 0)
  || extraItems.value.length > 0
  || props.location.seals.length > 0
  || chaosTokens.value.length > 0)
</script>

<template>
  <div v-if="hasAny" class="location-token-strip">
    <TokenPool :tokens="tokens" :extraItems="extraItems" />
    <Seal v-for="seal in location.seals" :key="seal.sealKind" :seal="seal" />
    <SealedChaosTokens v-if="chaosTokens.length" :tokens="chaosTokens" :game="game" :playerId="playerId"
      @choose="emit('choose', $event)" />
  </div>
</template>

<style scoped>
/* Small enough to ride on a map plate; the parent can scale it with --strip-token. */
.location-token-strip {
  --pool-token-width: var(--strip-token, 1.75em); /* Same diameter as the plate's clue token and ShroudDisc. */
  --sealed-token-image-width: var(--strip-token, 1.75em);
  display: inline-flex; flex-wrap: wrap; align-items: center; gap: 3px; min-width: 0;
}
/* Count in the token's corner, sized off the token like the plate's clue count so it stays readable. */
.location-token-strip :deep(.poolItem) { font-size: inherit; }
.location-token-strip :deep(.poolItem span) { font-size: calc(var(--pool-token-width) * .62); line-height: 1; }
.location-token-strip :deep(.token-pool__wounds) { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 3px; }
.location-token-strip :deep(.seal) { width: var(--strip-token, 1.6em); height: auto; }
</style>
