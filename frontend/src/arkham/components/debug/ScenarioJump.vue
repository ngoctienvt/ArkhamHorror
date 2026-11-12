<script lang="ts" setup>
/* Debug picker: end the current scenario and start any scenario of this
 * campaign next. See debugScenarioJump.ts for the engine messages used. */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebug } from '@/arkham/debug'
import { useEscape } from '@/composable/escape'
import { localizedScenarioName } from '@/arkham/scenarioNames'
import scenarioJSON from '@/arkham/data/scenarios'
import campaignJSON from '@/arkham/data/campaigns.json'
import {
  scenarioJumpId,
  scenarioJumpMessage,
  scenarioJumpTargets,
  type CampaignJumpEntry,
  type ScenarioJumpEntry,
  type ScenarioJumpTarget,
} from '@/arkham/debugScenarioJump'
import type { Game } from '@/arkham/types/Game'

const props = defineProps<{ game: Game }>()
const emit = defineEmits<{ close: [] }>()

useEscape(() => emit('close'))

const { t, te } = useI18n()
const debug = useDebug()

const showHidden = ref(false)
const pending = ref<string | null>(null)
const sending = ref(false)
const failed = ref(false)

const currentScenarioId = computed(() => props.game.scenario?.id ?? null)

const targets = computed(() => {
  const campaignId = props.game.campaign?.id
  if (!campaignId) return []
  return scenarioJumpTargets(
    campaignId,
    scenarioJSON as ScenarioJumpEntry[],
    campaignJSON as CampaignJumpEntry[],
  )
})

const visibleTargets = computed(() =>
  showHidden.value ? targets.value : targets.value.filter((s) => !s.hidden),
)
const hasHidden = computed(() => targets.value.some((s) => s.hidden))

const isCurrent = (s: ScenarioJumpTarget) => scenarioJumpId(s.code) === currentScenarioId.value
const label = (s: ScenarioJumpTarget) => localizedScenarioName(s.code, s.name, t, te)

// One click jumps: the list is a debug tool, so there is no separate confirm.
async function jump(target: ScenarioJumpTarget) {
  if (sending.value) return
  sending.value = true
  pending.value = target.code
  failed.value = false
  try {
    await debug.send(props.game.id, scenarioJumpMessage(target.code))
    emit('close')
  } catch (cause) {
    console.error('[Arkham debug] Could not jump to scenario', { code: target.code, cause })
    failed.value = true
  } finally {
    sending.value = false
    pending.value = null
  }
}
</script>

<template>
  <div class="scenario-jump-overlay" @click.self="emit('close')">
    <div class="scenario-jump" role="dialog" aria-modal="true" aria-labelledby="scenario-jump-title">
      <header class="scenario-jump-header">
        <h2 id="scenario-jump-title">{{ $t('gameBar.debugJumpScenarioTitle') }}</h2>
        <button type="button" :aria-label="$t('gameBar.debugJumpScenarioClose')" @click="emit('close')">×</button>
      </header>

      <div class="scenario-jump-body">
        <p class="scenario-jump-hint">{{ $t('gameBar.debugJumpScenarioHint') }}</p>

        <p v-if="targets.length === 0" class="scenario-jump-empty">
          {{ $t('gameBar.debugJumpScenarioNone') }}
        </p>

        <ul v-else class="scenario-jump-list">
          <li v-for="(s, i) in visibleTargets" :key="s.code">
            <button
              type="button"
              :class="{ selected: pending === s.code, current: isCurrent(s) }"
              :disabled="sending"
              @click="jump(s)"
            >
              <span class="index">{{ i + 1 }}</span>
              <span class="name">{{ label(s) }}</span>
              <span class="code">{{ s.code }}</span>
              <span v-if="isCurrent(s)" class="badge">{{ $t('gameBar.debugJumpScenarioCurrent') }}</span>
            </button>
          </li>
        </ul>

        <label v-if="hasHidden" class="scenario-jump-hidden">
          <input v-model="showHidden" type="checkbox" />
          {{ $t('gameBar.debugJumpScenarioShowHidden') }}
        </label>

        <p v-if="failed" class="scenario-jump-error">{{ $t('gameBar.debugJumpScenarioFailed') }}</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.scenario-jump-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal-overlay, 10000);
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.scenario-jump {
  width: min(560px, 100%);
  max-height: 90dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  background: var(--background);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
  color: var(--text);
}

.scenario-jump-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: white;
  padding: 16px 20px;
  border-bottom: 1px solid var(--box-border);
}

.scenario-jump-header h2 {
  margin: 0;
  font-family: teutonic, sans-serif;
  font-size: 1.3rem;
  font-weight: normal;
  letter-spacing: .04em;
}

.scenario-jump-header button {
  border: 0;
  background: transparent;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
}

.scenario-jump-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
  overflow-y: auto;
  min-height: 0;
  font-size: .85rem;
}

.scenario-jump-hint {
  margin: 0;
  opacity: .8;
  line-height: 1.4;
}

.scenario-jump-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.scenario-jump-list button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  background: var(--background-dark);
  color: var(--text);
  padding: 8px 10px;
  cursor: pointer;
}

.scenario-jump-list button:hover {
  border-color: rgba(255, 255, 255, 0.4);
}

.scenario-jump-list button:disabled {
  cursor: wait;
}

.scenario-jump-list button.selected {
  border-color: var(--spooky-green, #6e8640);
  background: rgba(110, 134, 64, 0.25);
}

.scenario-jump-list .index {
  min-width: 1.5em;
  opacity: .6;
}

.scenario-jump-list .name {
  flex: 1;
  min-width: 0;
}

.scenario-jump-list .code {
  font-family: monospace;
  opacity: .5;
}

.scenario-jump-list .badge {
  font-size: .7rem;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
}

.scenario-jump-hidden {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.scenario-jump-error {
  margin: 0;
  color: #e57373;
}


</style>
