<script lang="ts" setup>
// Reading box shown when an act or agenda advances. It holds the game until the
// player accepts, so the card and its (translated) text are actually read
// instead of flashing past while the engine carries on. Presentational: Game.vue
// decides when it opens and what accepting does.
//
// Two separate sections: the back of the card that was just completed (the part
// to read aloud), and the card that is now in play.
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { cardImg } from '@/arkham/helpers'
import { cardArt } from '@/arkham/cardImages'
import { replaceText } from '@/arkham/cardTextFormat'
import { useCardInfo } from '@/arkham/composables/useCardNames'
import type { AdvanceReading } from '@/arkham/advanceReading'

const props = defineProps<{ reading: AdvanceReading; remaining: number }>()
const emit = defineEmits<{ accept: [] }>()

const { t } = useI18n()

// Sequential: first read the back of the finished card, then move on to what comes next.
const index = ref(0)
watch(() => props.reading.key, () => { index.value = 0 })
const step = computed(() => props.reading.steps[index.value] ?? 'back')
const isLast = computed(() => index.value >= props.reading.steps.length - 1)
const onAccept = () => {
  if (isLast.value) emit('accept')
  else index.value += 1
}
const cardInfo = useCardInfo()

const from = computed(() => cardInfo(props.reading.fromCode))
const to = computed(() => (props.reading.toCode ? cardInfo(props.reading.toCode) : null))

// "Act 1b - Name": the kind, the stage and side printed on the card, and its name.
const kindLabel = computed(() => t(props.reading.kind === 'act' ? 'advanceReader.act' : 'advanceReader.agenda'))
const titleOf = (stage: number | undefined, side: 'a' | 'b', name: string | undefined) =>
  [`${kindLabel.value} ${stage ?? ''}${side}`.trim(), name].filter(Boolean).join(' - ')

type Face = { name: string; traits: string | null; flavorHtml: string | null; textHtml: string | null }

const faceOf = (
  name: string | undefined,
  traits: string | undefined,
  flavor: string | undefined,
  text: string | undefined,
): Face | null =>
  name || flavor || text
    ? {
        name: name ?? '',
        traits: traits ?? null,
        flavorHtml: flavor ? replaceText(flavor) : null,
        textHtml: text ? replaceText(text) : null,
      }
    : null

// The back of the card that was just completed. Most acts and agendas print it
// on the card itself (back_*); some are published as a separate `<code>b` record
// (a location, a story) whose own text is the back.
const backFace = computed<Face | null>(() => {
  const front = from.value
  if (front?.back_text || front?.back_flavor) {
    return faceOf(front.back_name ?? front.name, front.back_traits, front.back_flavor, front.back_text)
  }
  const separate = cardInfo(`${cardArt(props.reading.fromCode)}b`)
  if (separate && separate.code !== front?.code) {
    return faceOf(separate.name, separate.traits, separate.flavor, separate.text)
  }
  return null
})

// The card that is now in play.
const nextFace = computed<Face | null>(() => {
  const card = to.value
  return card ? faceOf(card.name, card.traits, card.flavor, card.text) : null
})

const backTitle = computed(() => titleOf(from.value?.stage, 'b', backFace.value?.name))
const nextTitle = computed(() => titleOf(to.value?.stage, 'a', nextFace.value?.name))

// Hovering the card enlarges it so the printed text is readable.
const zoomed = ref(false)
watch(step, () => { zoomed.value = false })

const fromImage = computed(() => cardImg(`${cardArt(props.reading.fromCode)}b`))
const toImage = computed(() => (props.reading.toCode ? cardImg(cardArt(props.reading.toCode)) : ''))
</script>

<template>
  <div class="advance-reader-backdrop">
    <div class="advance-reader" role="dialog" aria-modal="true" aria-labelledby="advance-reader-title">
      <div class="advance-reader__sections">
        <section v-if="step === 'back'" class="advance-reader__section">
          <h2 id="advance-reader-title" class="advance-reader__title">{{ backTitle }}</h2>
          <div class="advance-reader__row">
            <img class="advance-reader__card no-overlay" :src="fromImage" :alt="backTitle" @mouseenter="zoomed = true" @mouseleave="zoomed = false" />
            <div class="advance-reader__text-block">
              <p v-if="backFace?.flavorHtml" class="advance-reader__flavor" v-html="backFace.flavorHtml"></p>
              <p v-if="backFace?.textHtml" class="advance-reader__text" v-html="backFace.textHtml"></p>
            </div>
          </div>
        </section>
        <section v-else class="advance-reader__section">
          <h2 id="advance-reader-title" class="advance-reader__title">{{ nextTitle }}</h2>
          <div class="advance-reader__row">
            <img class="advance-reader__card no-overlay" :src="toImage" :alt="nextTitle" @mouseenter="zoomed = true" @mouseleave="zoomed = false" />
            <div class="advance-reader__text-block">
              <p v-if="nextFace?.flavorHtml" class="advance-reader__flavor" v-html="nextFace.flavorHtml"></p>
              <p v-if="nextFace?.textHtml" class="advance-reader__text" v-html="nextFace.textHtml"></p>
            </div>
          </div>
        </section>
      </div>
      <div class="advance-reader__actions">
        <span v-if="remaining > 0" class="advance-reader__more">{{ $t('advanceReader.more', { count: remaining }) }}</span>
        <button type="button" class="advance-reader__accept" @click="onAccept">{{ isLast ? $t('advanceReader.accept') : $t('advanceReader.continue') }}</button>
      </div>
    </div>
    <img v-if="zoomed" class="advance-reader__zoom no-overlay" :src="step === 'back' ? fromImage : toImage" alt="" />
  </div>
</template>

<style scoped>
.advance-reader-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-index-30000);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.72);
}

.advance-reader {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(760px, 100%);
  max-height: 100%;
  overflow: auto;
  padding: 18px;
  border: 1px solid rgba(216, 166, 87, 0.7);
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(28, 20, 12, 0.98), rgba(52, 36, 20, 0.98));
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.7), 0 0 28px rgba(216, 166, 87, 0.3);
  color: #f3e6cf;
  font-family: Arial, sans-serif;
  line-height: 1.45;
}

.advance-reader__title {
  margin: 0;
  font-family: Teutonic, var(--ui-serif);
  font-size: 1.8rem;
  color: #f1c97b;
}

.advance-reader__sections {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.advance-reader__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid rgba(216, 166, 87, 0.3);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.22);
}

.advance-reader__label {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #f1c97b;
}

.advance-reader__row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.advance-reader__card {
  width: min(240px, 30vw);
  flex-shrink: 0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55);
}

.advance-reader__text-block {
  min-width: 0;
  text-align: left;
}

.advance-reader__text-block h4 {
  margin: 0 0 6px;
  font-size: 1.1rem;
}

.advance-reader__text-block p {
  margin: 0 0 10px;
  white-space: pre-line;
}

.advance-reader__traits,
.advance-reader__flavor {
  font-style: italic;
}

.advance-reader__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.advance-reader__more {
  font-size: 0.85rem;
  opacity: 0.75;
}

.advance-reader__accept {
  padding: 8px 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  background: rgba(150, 100, 30, 0.95);
  color: white;
  cursor: pointer;
}

.advance-reader__card {
  cursor: zoom-in;
}

/* Large preview over the box; never takes the pointer, so leaving the thumbnail closes it. */
.advance-reader__zoom {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 94vw;
  max-height: 94vh;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.85);
  pointer-events: none;
}

@media (max-width: 900px) {
  .advance-reader__sections {
    grid-template-columns: 1fr;
  }

  .advance-reader__card {
    width: min(140px, 30vw);
  }
}
</style>
