<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Draggable from '@/components/Draggable.vue'
import { imgsrc } from '@/arkham/helpers'
import { chaosTokenImage } from '@/arkham/types/ChaosToken'
import { skillTestOutcome, withoutCosts, type SkillTestSummary, type SummaryLine } from '@/arkham/skillTestSummary'
import LogPart from '@/arkham/components/LogPart.vue'
import { useSkillTestSummary } from '@/arkham/composables/useSkillTestSummary'
import { useCardNames } from '@/arkham/composables/useCardNames'

/* Where the test panel was, once the test is over: how it went and what it
 * changed, held until the player confirms. */
const props = defineProps<{ summary: SkillTestSummary }>()
const emit = defineEmits<{ confirm: [] }>()
const { t } = useI18n()
const nameOf = useCardNames()
/* Everything the server logged inside the test (a treachery discarded, doom
 * placed, a card drawn...), drawn with the log's own parts so it reads exactly
 * like the log column. */
const { log } = useSkillTestSummary()

const SKILL_CLASS: Record<string, string> = {
  SkillWillpower: 'willpower',
  SkillIntellect: 'intellect',
  SkillCombat: 'combat',
  SkillAgility: 'agility',
}

const skills = computed(() => props.summary.skills.map((skill) => SKILL_CLASS[skill] ?? skill))

interface LineView {
  key: string
  icon: string | null
  text: string
  good: boolean
}

/* Gaining clues, resources or cards and hurting the enemy are good news; taking
 * damage or horror, or losing what you had, is not. */
function lineView(line: SummaryLine): LineView {
  const n = Math.abs(line.amount)
  const up = line.amount > 0
  switch (line.kind) {
    case 'clues':
      return { key: line.kind, icon: imgsrc('tokens/clue.png'), text: t(up ? 'skillTest.summaryCluesGained' : 'skillTest.summaryCluesLost', { n }), good: up }
    case 'resources':
      return { key: line.kind, icon: imgsrc('tokens/resource.png'), text: t(up ? 'skillTest.summaryResourcesGained' : 'skillTest.summaryResourcesLost', { n }), good: up }
    case 'damage':
      return { key: line.kind, icon: imgsrc('damage.png'), text: t(up ? 'skillTest.summaryDamageTaken' : 'skillTest.summaryDamageHealed', { n }), good: !up }
    case 'horror':
      return { key: line.kind, icon: imgsrc('horror.png'), text: t(up ? 'skillTest.summaryHorrorTaken' : 'skillTest.summaryHorrorHealed', { n }), good: !up }
    case 'cardsDrawn':
      return { key: line.kind, icon: null, text: t('skillTest.summaryCardsDrawn', { n }), good: true }
    case 'enemyDamage':
      return { key: line.kind, icon: imgsrc('damage.png'), text: t('skillTest.summaryEnemyDamage', { n }), good: true }
    case 'enemyDefeated':
      return { key: line.kind, icon: null, text: t('skillTest.summaryEnemyDefeated'), good: true }
    case 'enemyEvaded':
      return { key: line.kind, icon: null, text: t('skillTest.summaryEnemyEvaded'), good: true }
    case 'threatArea':
      return { key: `${line.kind}:${line.cardCode}`, icon: null, text: t('skillTest.summaryThreatArea', { card: line.cardCode ? nameOf(line.cardCode) : '' }), good: false }
  }
}

/* Only what the test did: costs paid and the play-by-play are filtered out. */
const outcome = computed(() => skillTestOutcome(log.value, props.summary.investigatorId))
const events = computed(() => outcome.value.events)
const lines = computed(() => withoutCosts(props.summary.lines, outcome.value.resourcesSpent).map(lineView))

const confirmButton = ref<HTMLButtonElement | null>(null)

/* Enter or Escape confirms too, so a keyboard player is not sent to the mouse. */
function onKey(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== 'Escape') return
  const target = event.target as HTMLElement | null
  if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
  event.preventDefault()
  emit('confirm')
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  confirmButton.value?.focus({ preventScroll: true })
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Draggable width="min(420px, calc(100vw - 32px))">
    <template #handle>
      <h2 class="summary-title">{{ $t('skillTest.summaryTitle') }}</h2>
    </template>
    <div class="summary" role="dialog" :aria-label="$t('skillTest.summaryTitle')">
      <div class="summary__head">
        <div v-if="skills.length > 0" class="summary__skills">
          <span v-for="(skill, i) in skills" :key="i" :class="`${skill}-icon ${skill}-skill`" />
        </div>
        <div class="summary__tokens">
          <img v-for="(face, i) in summary.tokenFaces" :key="i" :src="chaosTokenImage(face)" alt="" />
        </div>
      </div>

      <div class="summary__verdict" :class="summary.success ? 'success' : 'failure'">
        {{ summary.success ? $t('succeededBy', { amount: summary.margin }) : $t('failedBy', { amount: summary.margin }) }}
      </div>

      <ul v-if="lines.length > 0" class="summary__lines">
        <li v-for="line in lines" :key="line.key" :class="line.good ? 'good' : 'bad'">
          <img v-if="line.icon" :src="line.icon" alt="" />
          <span v-else class="summary__dot" />
          <span>{{ line.text }}</span>
        </li>
      </ul>
      <section v-if="events.length > 0" class="summary__events">
        <h3>{{ $t('skillTest.summaryEvents') }}</h3>
        <ul>
          <li v-for="entry in events" :key="entry.seq" :class="entry.tone === 'Good' ? 'good' : entry.tone === 'Bad' ? 'bad' : ''">
            <LogPart v-for="(part, i) in entry.body" :key="i" :part="part" />
            <ul v-if="entry.children.length > 0" class="summary__event-children">
              <li v-for="(child, j) in entry.children" :key="j">
                <LogPart v-for="(part, k) in child.body" :key="k" :part="part" />
              </li>
            </ul>
          </li>
        </ul>
      </section>
      <p v-if="lines.length === 0 && events.length === 0" class="summary__nothing">{{ $t('skillTest.summaryNothing') }}</p>

      <button ref="confirmButton" type="button" class="summary__confirm" @click="emit('confirm')">
        {{ $t('skillTest.summaryConfirm') }}
      </button>
    </div>
  </Draggable>
</template>

<style scoped>
/* The log's own lines for this test, below the headline numbers. */
.summary__events h3 {
  margin: 0 0 4px;
  font-size: 0.75em;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.summary__events ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary__events > ul > li {
  padding: 5px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9em;
  line-height: 1.35;
}

.summary__events > ul > li.good { border-left-color: #2ec46b; }
.summary__events > ul > li.bad { border-left-color: #e0393b; }

.summary__event-children {
  margin-top: 3px !important;
  padding-left: 10px !important;
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.7);
}

.summary-title {
  margin: 0;
}

.summary {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #eee;
  text-align: center;
  animation: summary-in var(--motion-base) var(--ease-out) both;
}

@keyframes summary-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .summary { animation: none; }
}

.summary__head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.summary__skills {
  display: flex;
  gap: 4px;
  font-size: 1.6em;
}

.summary__tokens {
  display: flex;
  gap: 6px;

  img {
    width: min(56px, 14vw);
    height: auto;
    border-radius: 50%;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.6);
  }
}

.summary__verdict {
  padding: 8px 10px;
  font-size: 1.25em;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.5);

  &.success {
    background: rgba(40, 160, 80, 0.3);
    border: 1px solid rgba(110, 210, 140, 0.55);
    color: #c9f2d5;
  }
  &.failure {
    background: rgba(170, 40, 40, 0.3);
    border: 1px solid rgba(230, 110, 110, 0.55);
    color: #f6cdcd;
  }
}

.summary__lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: left;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 10px;
    background: rgba(255, 255, 255, 0.06);
    border-left: 3px solid transparent;
  }
  li.good { border-left-color: rgba(110, 210, 140, 0.8); }
  li.bad { border-left-color: rgba(230, 110, 110, 0.8); }

  img {
    width: 24px;
    height: auto;
    flex: none;
  }
}

.summary__dot {
  width: 10px;
  height: 10px;
  margin: 0 7px;
  flex: none;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
}

.summary__nothing {
  margin: 0;
  opacity: 0.7;
}

.summary__confirm {
  width: 100%;
  min-height: 44px;
  border: 0;
  text-transform: uppercase;
  background-color: var(--button-2);
  color: #eee;
  cursor: pointer;
  transition: filter var(--motion-fast) var(--ease-out);

  &:hover { filter: brightness(1.15); }
}
</style>
