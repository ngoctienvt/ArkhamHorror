<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import type { Scenario } from '@/arkham/types/Scenario'
import type { Card, CardContents } from '@/arkham/types/Card'
import { cardImage, toCardContents } from '@/arkham/types/Card'
import { imgsrc } from '@/arkham/helpers'
import { scenarioDeckImage, scenarioDeckName } from '@/arkham/scenarioDeckImage'
import CardRow from '@/arkham/components/CardRow.vue'
import { useCardStore } from '@/stores/cards'

/* The map's Deck panel: every deck in the scenario (encounter deck, extra encounter decks such as
 * the Spectral deck, and scenario decks such as Exploration, Tekeli-li, Cosmos ...) with how many
 * cards are left and its discard pile, then the cards set aside. Built from the scenario data, so
 * every campaign gets its own decks without a list here. A discard or the set-aside cards open in
 * the same card viewer the card board uses. */
const props = defineProps<{ game: Game; scenario: Scenario; playerId: string }>()
const emit = defineEmits<{ (e: 'choose', index: number): void; (e: 'close'): void; (e: 'openBoard'): void }>()

const { t } = useI18n()

type AnyCard = Card | CardContents
type DeckRow = { key: string; name: string; back: string; count: number; discard: AnyCard[] }

const decks = computed<DeckRow[]>(() => {
  const s = props.scenario
  const rows: DeckRow[] = []
  // The Fate of the Vale has no encounter deck of its own (its Abyss deck stands in for it).
  if (s.hasEncounterDeck && s.id !== 'c10651') {
    rows.push({ key: 'EncounterDeck', name: 'Encounter', back: imgsrc('backs/back_encounter.jpg'), count: s.encounterDeck.length, discard: s.discard })
  }
  for (const [key, [deck, discard]] of Object.entries(s.encounterDecks ?? {})) {
    if (/^Regular/.test(key)) continue
    rows.push({ key, name: scenarioDeckName(key.replace(/EncounterDeck$/, '')), back: imgsrc('backs/back_encounter.jpg'), count: deck.length, discard })
  }
  for (const [key, cards] of s.decks ?? []) {
    const discard = s.deckDiscards?.find(([k]) => k === key)?.[1] ?? []
    rows.push({ key, name: scenarioDeckName(key), back: scenarioDeckImage(key, cards), count: cards.length, discard })
  }
  return rows
})

const setAside = computed<Card[]>(() => props.scenario.setAsideCards ?? [])

/* The victory display, and the vengeance it holds: each card's printed vengeance, plus one for a card
 * that was added as vengeance. Mirrors the engine's tally, which cards such as Serpent from Yoth read. */
const cardStore = useCardStore()
const victoryDisplay = computed<Card[]>(() => props.scenario.victoryDisplay ?? [])
const vengeance = computed<number>(() => victoryDisplay.value.reduce((sum, card) => {
  const code = toCardContents(card).cardCode
  const printed = cardStore.cards.find((def) => def.cardCode === code)?.vengeancePoints ?? 0
  return sum + printed + (card.tag === 'VengeanceCard' ? 1 : 0)
}, 0))
const showVictoryDisplay = () => { viewer.value = { title: t('locationMap.deckPanel.victoryDisplay'), cards: victoryDisplay.value, discards: false } }

const imageOf = (card: AnyCard) => imgsrc(cardImage(card))
const codeOf = (card: AnyCard) => toCardContents(card).cardCode
const keyOf = (card: AnyCard, i: number) => `${toCardContents(card).id ?? codeOf(card)}-${i}`

/* The card viewer (CardRow) over the board: a deck's discard pile or the set-aside cards. */
const viewer = ref<{ title: string; cards: AnyCard[]; discards: boolean } | null>(null)
const showDiscard = (d: DeckRow) => { viewer.value = { title: `${d.name} · ${t('locationMap.deckPanel.discard')}`, cards: d.discard, discards: true } }
const showSetAside = () => { viewer.value = { title: t('locationMap.deckPanel.setAside'), cards: setAside.value, discards: false } }

/* Close on Escape or a click outside the panel; clicks inside the card viewer do not count. */
const root = ref<HTMLElement | null>(null)
function onPointerDown(e: PointerEvent) {
  const target = e.target as Element | null
  if (!target || root.value?.contains(target)) return
  if (target.closest('.deck-panel-toggle, .card-row, .draggable')) return
  if (!viewer.value) emit('close')
}
function onKeyDown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  if (viewer.value) viewer.value = null
  else emit('close')
}
onMounted(() => { document.addEventListener('pointerdown', onPointerDown, true); document.addEventListener('keydown', onKeyDown) })
onBeforeUnmount(() => { document.removeEventListener('pointerdown', onPointerDown, true); document.removeEventListener('keydown', onKeyDown) })
</script>

<template>
  <div ref="root" class="deck-panel" role="dialog" :aria-label="t('locationMap.decks')">
    <section class="deck-panel__section">
      <h4 class="deck-panel__heading">{{ t('locationMap.deckPanel.decks') }}</h4>
      <p v-if="!decks.length" class="deck-panel__empty">{{ t('locationMap.deckPanel.noDecks') }}</p>
      <div v-for="d in decks" :key="d.key" class="deck-row">
        <img class="deck-row__back" :src="d.back" alt="" loading="lazy" />
        <div class="deck-row__info">
          <span class="deck-row__name">{{ d.name }}</span>
          <span class="deck-row__count">{{ t('locationMap.deckPanel.cardsLeft', { n: d.count }) }}</span>
        </div>
        <button
          type="button" class="deck-row__discard" :disabled="!d.discard.length"
          :title="d.discard.length ? t('locationMap.deckPanel.viewDiscard') : t('locationMap.deckPanel.emptyDiscard')"
          @click="showDiscard(d)"
        >
          <img v-if="d.discard[0]" :src="imageOf(d.discard[0])" :data-image="imageOf(d.discard[0])" :data-card-code="codeOf(d.discard[0])" alt="" loading="lazy" />
          <span v-else class="deck-row__discard-empty" aria-hidden="true"></span>
          <span>{{ t('locationMap.deckPanel.discard') }} <b>{{ d.discard.length }}</b></span>
        </button>
      </div>
    </section>

    <section class="deck-panel__section">
      <h4 class="deck-panel__heading">
        {{ t('locationMap.deckPanel.setAside') }} <b>{{ setAside.length }}</b>
        <button v-if="setAside.length" type="button" class="deck-panel__link" @click="showSetAside">{{ t('locationMap.deckPanel.viewLarge') }}</button>
      </h4>
      <p v-if="!setAside.length" class="deck-panel__empty">{{ t('locationMap.deckPanel.noSetAside') }}</p>
      <div v-else class="set-aside">
        <img
          v-for="(c, i) in setAside" :key="keyOf(c, i)"
          :src="imageOf(c)" :data-image="imageOf(c)" :data-card-code="codeOf(c)" alt="" loading="lazy"
        />
      </div>
    </section>

    <section class="deck-panel__section">
      <h4 class="deck-panel__heading">
        {{ t('locationMap.deckPanel.victoryDisplay') }} <b>{{ victoryDisplay.length }}</b>
        <span v-if="vengeance > 0" class="deck-panel__vengeance">{{ t('locationMap.deckPanel.vengeance', { n: vengeance }) }}</span>
        <button v-if="victoryDisplay.length" type="button" class="deck-panel__link" @click="showVictoryDisplay">{{ t('locationMap.deckPanel.viewLarge') }}</button>
      </h4>
      <p v-if="!victoryDisplay.length" class="deck-panel__empty">{{ t('locationMap.deckPanel.noVictory') }}</p>
      <div v-else class="set-aside">
        <img
          v-for="(c, i) in victoryDisplay" :key="keyOf(c, i)"
          :src="imageOf(c)" :data-image="imageOf(c)" :data-card-code="codeOf(c)" alt="" loading="lazy"
        />
      </div>
    </section>

    <footer class="deck-panel__foot">
      <button type="button" class="deck-panel__link" @click="emit('openBoard')">{{ t('locationMap.deckPanel.openBoard') }}</button>
      <span class="deck-panel__hint">{{ t('locationMap.deckPanel.hint') }}</span>
    </footer>

    <Teleport to="body">
      <CardRow
        v-if="viewer && viewer.cards.length"
        :game="game" :playerId="playerId" :cards="viewer.cards" :title="viewer.title" :isDiscards="viewer.discards"
        @choose="emit('choose', $event)" @close="viewer = null"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.deck-panel {
  position: absolute; top: calc(100% + 6px); right: 0; z-index: 60; width: 340px; max-width: calc(100vw - 20px);
  max-height: min(70vh, 560px); overflow-y: auto; scrollbar-width: thin; scrollbar-color: #c6a87366 transparent;
  display: flex; flex-direction: column; gap: 10px; padding: 10px 12px; text-align: left;
  background: var(--surface-1, #1f2d25); border: 1px solid var(--line-strong, #c6a873aa); border-radius: 8px;
  box-shadow: 0 12px 30px #000d; color: var(--text, #f2ecdc); font-size: 0.8rem; text-transform: none; letter-spacing: normal;
}
.deck-panel__section { display: flex; flex-direction: column; gap: 6px; }
.deck-panel__heading {
  display: flex; align-items: center; gap: 6px; margin: 0; font-size: 0.66rem; font-weight: 700;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-gold, #d9b878);
}
.deck-panel__heading b { color: var(--heading, #fff6e4); letter-spacing: 0; }
.deck-panel__vengeance {
  padding: 1px 6px; border-radius: 999px; background: #7a1f1a; color: #fff; letter-spacing: 0.04em;
}
.deck-panel__empty { margin: 0; font-style: italic; color: var(--text-muted, #b6bfb0); }

.deck-row { display: flex; align-items: center; gap: 9px; padding: 5px 6px; border-radius: 6px; background: #ffffff08; border: 1px solid #ffffff12; }
.deck-row__back { flex: none; width: 34px; height: 48px; object-fit: cover; border-radius: 3px; box-shadow: 0 2px 5px #0009; }
.deck-row__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.deck-row__name { font-weight: 600; color: var(--heading, #fff6e4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.deck-row__count { font-size: 0.74rem; color: var(--text-muted, #b6bfb0); }
.deck-row__discard {
  flex: none; display: flex; align-items: center; gap: 6px; padding: 3px 8px 3px 4px; border-radius: 6px; cursor: pointer;
  font: inherit; font-size: 0.74rem; color: var(--text, #f2ecdc); background: #0000004d; border: 1px solid var(--line, #c6a87355);
}
.deck-row__discard:hover:not(:disabled) { border-color: var(--accent-gold, #d9b878); background: #00000080; }
.deck-row__discard:disabled { cursor: default; opacity: 0.55; }
.deck-row__discard img, .deck-row__discard-empty { width: 26px; height: 37px; border-radius: 2px; object-fit: cover; }
.deck-row__discard-empty { display: block; border: 1px dashed #ffffff33; box-sizing: border-box; }
.deck-row__discard b { color: var(--heading, #fff6e4); }

.set-aside { display: grid; grid-template-columns: repeat(auto-fill, minmax(52px, 1fr)); gap: 5px; }
.set-aside img { width: 100%; aspect-ratio: 5 / 7; object-fit: cover; border-radius: 3px; box-shadow: 0 2px 5px #0009; cursor: zoom-in; transition: transform 0.12s; }
.set-aside img:hover { transform: translateY(-2px) scale(1.04); }

.deck-panel__link { all: unset; margin-left: auto; cursor: pointer; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.04em; text-transform: none; color: var(--clue, #8fd0e4); }
.deck-panel__link:hover, .deck-panel__link:focus-visible { text-decoration: underline; }
.deck-panel__foot { display: flex; align-items: center; gap: 8px; padding-top: 8px; border-top: 1px solid #ffffff14; }
.deck-panel__foot .deck-panel__link { margin-left: 0; }
.deck-panel__hint { margin-left: auto; font-size: 0.68rem; color: var(--text-muted, #b6bfb0); }
</style>
