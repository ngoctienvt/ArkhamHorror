<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNarrationControls } from '@/arkham/composables/useNarration'
import NarrationSpeakerIcon from '@/arkham/components/NarrationSpeakerIcon.vue'
import NarrationRateControl from '@/arkham/components/NarrationRateControl.vue'

/* Reading speed plus replay / stop for the spoken story narration, pinned to the
 * corner of the story panel it sits in (the parent must be position: relative). */
const { t } = useI18n()
const { playing, blocked, hasTracks, replay, stop } = useNarrationControls()
const label = computed(() =>
  playing.value ? t('gameBar.settings.narration.stop') : t('gameBar.settings.narration.play'),
)
</script>

<template>
  <div v-if="hasTracks" class="narration-controls">
    <NarrationRateControl />
    <button
      type="button"
      class="narration-toggle"
      :class="{ blocked }"
      :title="label"
      :aria-label="label"
      @click="playing ? stop() : replay()"
    ><NarrationSpeakerIcon :playing="playing" /></button>
  </div>
</template>

<style scoped>
/* Solid dark-ink disc with a gold rim and a light icon, so it reads clearly over the
 * parchment and the corner ornament it sits on. */
.narration-controls {
  position: absolute;
  top: 6px;
  right: 8px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
}
.narration-toggle {
  width: 34px;
  height: 34px;
  padding: 0;
  border: 2px solid #c9a24a;
  border-radius: 50%;
  background: #2b2014;
  color: #f6eedb;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}
.narration-toggle:hover { background: #4a3820; transform: scale(1.08); }
/* The browser refused autoplay: draw the eye to the button that starts it. */
.narration-toggle.blocked { animation: narration-pulse 1.2s ease-in-out infinite; }

@keyframes narration-pulse {
  50% { box-shadow: 0 0 0 6px rgba(255, 200, 80, 0.55); }
}
</style>
