<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { ConcealedCard } from '@/arkham/types/ConcealedCard'
import { splitConcealed } from '@/arkham/concealedCards'
import ConcealedCardView from '@/arkham/components/ConcealedCard.vue'

/* The concealed mini-cards lying in one spot of the scene map (a location, or a grid position): the
 * unknown ones as a single stack with a count, the known ones side by side, as on the card board.
 * Each mini-card is the board's own ConcealedCard, so clicking it sends the same target choice or opens
 * the same Fight / Evade menu. */
const props = defineProps<{ game: Game; playerId: string; cards: ConcealedCard[]; size?: 'full' | 'compact' }>()
const emit = defineEmits<{ (e: 'choose', index: number): void }>()

const { t } = useI18n()
const split = computed(() => splitConcealed(props.cards))
</script>

<template>
  <div v-if="cards.length > 0" class="concealed-stack" :class="size ?? 'full'" :aria-label="t('locationMap.concealed', { count: cards.length })"
    @click.stop @pointerdown.stop>
    <div v-if="split.unknown.length > 0" class="pile">
      <ConcealedCardView :card="split.unknown[0]" :game="game" :playerId="playerId" @choose="emit('choose', $event)" />
      <span v-if="split.unknown.length > 1" class="count">{{ split.unknown.length }}</span>
    </div>
    <ConcealedCardView v-for="card in split.known" :key="card.id" :card="card" :game="game" :playerId="playerId" @choose="emit('choose', $event)" />
  </div>
</template>

<style scoped>
.concealed-stack { display: flex; flex-wrap: wrap; gap: 3px; align-items: flex-start; pointer-events: auto; }
.concealed-stack :deep(img.concealed-card) { display: block; width: 34px; border-radius: 3px; box-shadow: 0 1px 4px #000c; }
.concealed-stack.compact :deep(img.concealed-card) { width: 16px; }
/* Something to click: the same gold ring the scene uses for targetable plates. */
.concealed-stack :deep(img.concealed-card--can-interact) { outline: 2px solid #f2d27a; outline-offset: 1px; box-shadow: 0 0 10px 2px #f2d27a; }
.pile { position: relative; }
.count { position: absolute; top: -6px; right: -6px; min-width: 16px; height: 16px; padding: 0 3px; display: grid; place-items: center;
  border-radius: 8px; background: #101a14; border: 1px solid #c6a873; color: #f0dfb5; font-size: 0.65rem; font-weight: 700; pointer-events: none; }
.compact .count { display: none; }
</style>
