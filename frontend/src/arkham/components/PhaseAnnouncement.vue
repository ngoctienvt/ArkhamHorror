<script lang="ts" setup>
/* The one look every phase change is announced with: a band across the top of
 * the screen in the phase's colour, its name sliding through. Game.vue shows it
 * for the server's PhaseChanged events; PhaseBanner.vue shows the same band when
 * those account-level announcements are off. Presentational and click-through. */
import { computed } from 'vue'
import type { Phase } from '@/arkham/types/Phase'

const props = defineProps<{ phase: Phase | null }>()

const PHASE_COLOR: Partial<Record<Phase, string>> = {
  MythosPhase: '#7b4b91',
  InvestigationPhase: '#a87532',
  EnemyPhase: '#9f2929',
  UpkeepPhase: '#315b70',
  CampaignPhase: '#5b5b5b',
}
const color = computed(() => PHASE_COLOR[props.phase ?? 'CampaignPhase'] ?? '#5b5b5b')
</script>

<template>
  <Transition name="phase-announcement">
    <!-- Keyed on the band, not just the name: back-to-back phases (Enemy, then
         Upkeep in the same tick the Enemy band clears) would otherwise reuse a
         band whose one-shot fade has already ended at opacity 0, and the next
         phase would play inside an invisible band. -->
    <div v-if="phase" :key="phase" class="phase-announcement" :style="{ '--phase-color': color }" role="status" aria-live="polite">
      <span class="phase-announcement__name">{{ $t(`phaseTransition.${phase}`) }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.phase-announcement {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: clamp(4.5rem, 9vw, 7rem);
  display: grid;
  place-items: center;
  pointer-events: none;
  overflow: hidden;
  background: color-mix(in srgb, var(--phase-color) 54%, rgba(8, 11, 13, 0.88));
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.42);
  animation: phase-announcement-bloom 1.2s ease-out both;
}

.phase-announcement__name {
  color: rgba(242, 232, 207, 0.94);
  font-family: Teutonic, serif;
  font-size: clamp(1.8rem, 4vw, 3.8rem);
  font-weight: 400;
  letter-spacing: 0.08em;
  line-height: 1;
  text-align: center;
  text-shadow: 0 0 35px color-mix(in srgb, var(--phase-color) 80%, transparent), 0 5px 26px rgba(0, 0, 0, 0.8);
  animation: phase-announcement-title 1.2s ease-out both;
}

@keyframes phase-announcement-bloom {
  0% { opacity: 0; }
  14%, 78% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes phase-announcement-title {
  0% { opacity: 0; transform: translateX(-110%); filter: blur(8px); }
  22% { opacity: 1; transform: translateX(0); filter: blur(0); }
  72% { opacity: 1; transform: translateX(0); filter: blur(0); }
  100% { opacity: 0; transform: translateX(110%); filter: blur(8px); }
}

.phase-announcement-enter-active,
.phase-announcement-leave-active { transition: opacity 0.35s ease; }
.phase-announcement-enter-from,
.phase-announcement-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .phase-announcement, .phase-announcement__name { animation: none; }
}
</style>
