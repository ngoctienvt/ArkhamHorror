import { computed, type ComputedRef } from 'vue'
import { useCardStore } from '@/stores/cards'
import * as CardT from '@/arkham/types/Card'
import { toCardContents } from '@/arkham/types/Card'

// Hand order: assets, then events, then skills, then anything else (weaknesses);
// within each type, highest cost first. Cards with no static cost sort last in
// their type. Array.sort is stable, so ties keep their drawn order.
const HAND_TYPE_ORDER: Record<string, number> = { AssetType: 0, EventType: 1, SkillType: 2 }

export function useSortedHand(cards: () => CardT.Card[]): ComputedRef<CardT.Card[]> {
  const cardStore = useCardStore()
  const defs = computed(() => new Map(cardStore.cards.map(def => [def.cardCode, def])))

  const sortKey = (card: CardT.Card): [number, number] => {
    const def = defs.value.get(toCardContents(card).cardCode)
    const type = HAND_TYPE_ORDER[def?.cardType ?? ''] ?? 3
    const cost = def?.cost?.tag === 'StaticCost' ? def.cost.contents : -1
    return [type, cost]
  }

  return computed(() =>
    cards()
      .map(card => ({ card, key: sortKey(card) }))
      .sort((a, b) => a.key[0] - b.key[0] || b.key[1] - a.key[1])
      .map(({ card }) => card)
  )
}
