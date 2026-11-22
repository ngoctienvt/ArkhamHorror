<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettings } from '@/stores/settings'
import {
  formatNarrationRate,
  NARRATION_RATE_MAX,
  NARRATION_RATE_MIN,
  stepNarrationRate,
} from '@/arkham/narration'

/* Slower / faster buttons for the narration reading speed, shown beside the
 * speaker button inside a reading panel. The speed is a per-browser setting
 * and changes the clip that is already playing. Clicking the label resets 1x. */
const { t } = useI18n()
const settings = useSettings()
const label = computed(() => formatNarrationRate(settings.narrationRate))
const step = (direction: 1 | -1) =>
  settings.setNarrationRate(stepNarrationRate(settings.narrationRate, direction))
</script>

<template>
  <div class="narration-rate" role="group" :aria-label="t('gameBar.settings.narration.speed')" @click.stop>
    <button
      type="button"
      class="narration-rate__step"
      :disabled="settings.narrationRate <= NARRATION_RATE_MIN"
      :title="t('gameBar.settings.narration.slower')"
      :aria-label="t('gameBar.settings.narration.slower')"
      @click="step(-1)"
    >−</button>
    <button
      type="button"
      class="narration-rate__value"
      :title="`${t('gameBar.settings.narration.speed')} — ${t('gameBar.settings.narration.resetSpeed')}`"
      :aria-label="t('gameBar.settings.narration.resetSpeed')"
      @click="settings.setNarrationRate(1)"
    >{{ label }}</button>
    <button
      type="button"
      class="narration-rate__step"
      :disabled="settings.narrationRate >= NARRATION_RATE_MAX"
      :title="t('gameBar.settings.narration.faster')"
      :aria-label="t('gameBar.settings.narration.faster')"
      @click="step(1)"
    >+</button>
  </div>
</template>

<style scoped>
/* Same dark-ink / gold-rim look as the speaker disc it sits beside. */
.narration-rate {
  display: inline-flex;
  align-items: center;
  height: 30px;
  border: 2px solid #c9a24a;
  border-radius: 15px;
  background: #2b2014;
  color: #f6eedb;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  font-family: var(--ui-sans, sans-serif);
}
.narration-rate button {
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  line-height: 1;
}
.narration-rate__step {
  width: 26px;
  font-size: 18px;
  font-weight: 700;
}
.narration-rate__value {
  min-width: 38px;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.narration-rate button:hover:not(:disabled) { background: #4a3820; }
.narration-rate button:disabled { opacity: 0.35; cursor: default; }
</style>
