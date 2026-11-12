<script lang="ts" setup>
import type { TokenTier } from '@/arkham/referenceTokenX'

/* What one chaos token does right now ("−3", "0", "Automatic failure"), in one quiet style shared by the
 * reference card on the mission strip and the drawn token in the skill test. Only two cases stand out:
 * 0 fades (it does nothing) and an automatic failure is red (it is the one to watch); an X the client could
 * not count has a dashed outline and keeps its "X". */
import { computed } from 'vue'

const props = defineProps<{ label: string; tier: TokenTier; hint?: string; flash?: boolean }>()

/* A word label ("Automatic failure") rather than a number wraps onto two short lines, so it does not
 * squeeze the effect text beside it into a narrow column. */
const wordy = computed(() => /\s/.test(props.label.trim()))
</script>

<template>
  <b class="badge" :class="[`badge--${tier}`, { 'badge--flash': flash, 'badge--wordy': wordy }]" :title="hint || undefined">{{ label }}</b>
</template>

<style scoped>
.badge {
  display: inline-block; min-width: 2.2em; padding: 0 6px; border-radius: 999px; text-align: center; white-space: nowrap;
  font-size: 0.74rem; font-weight: 700; font-variant-numeric: tabular-nums; line-height: 1.5;
  background: #00000040; border: 1px solid #c6a87366; color: var(--heading, #fff4df);
}
.badge--zero { border-color: #c6a87330; color: #9d978a; }
.badge--fail { background: #8e2a22; border-color: #e0786c66; color: #fff; }
.badge--unknown { background: transparent; border-style: dashed; color: #c9b893; }
/* Wide enough for "Tự động" / "Automatic" on one line, too narrow for the whole label: two lines. */
.badge--wordy { white-space: normal; max-width: 6em; padding: 2px 7px; border-radius: 8px; line-height: 1.2; }

.badge--flash { animation: badge-flash 0.9s ease-out; }
@keyframes badge-flash {
  0% { box-shadow: 0 0 0 0 #ffd27acc; transform: scale(1.25); }
  100% { box-shadow: 0 0 0 8px #ffd27a00; transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) { .badge--flash { animation: none; outline: 2px solid #ffd27a; } }
</style>
