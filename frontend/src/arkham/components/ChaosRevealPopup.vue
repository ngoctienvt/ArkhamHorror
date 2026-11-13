<script lang="ts" setup>
import { onBeforeUnmount, watch } from 'vue'
import { chaosTokenImage } from '@/arkham/types/ChaosToken'
import type { ChaosReveal } from '@/arkham/chaosRevealLog'

/* Shows the token a Forced ability or scenario effect revealed, which never sits on the table
 * long enough to be seen. Click to close; it also goes away by itself. */
const props = defineProps<{ reveal: ChaosReveal | null }>()
const emit = defineEmits<{ close: [] }>()
const SHOW_MS = 3500
let timer: ReturnType<typeof setTimeout> | null = null
const stop = () => { if (timer !== null) clearTimeout(timer); timer = null }
watch(() => props.reveal, (reveal) => {
  stop()
  if (reveal) timer = setTimeout(() => emit('close'), SHOW_MS)
}, { immediate: true })
onBeforeUnmount(stop)
</script>

<template>
  <Transition name="chaos-reveal-popup">
    <button v-if="reveal" type="button" class="chaos-reveal-popup" :key="reveal.seq" @click="emit('close')">
      <span v-if="reveal.investigator" class="who">{{ reveal.investigator }}</span>
      <span class="faces">
        <img v-for="(face, i) in reveal.faces" :key="i" :src="chaosTokenImage(face)" alt="" draggable="false" />
      </span>
    </button>
  </Transition>
</template>

<style scoped>
.chaos-reveal-popup {
  position: fixed; left: 50%; top: 32%; translate: -50% -50%; z-index: 300;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 16px 26px; border-radius: 12px; cursor: pointer;
  background: rgba(23, 21, 33, 0.94); border: 1px solid #c8aa69; color: #f6e6c0;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
}
.who { font-weight: 700; }
.faces { display: flex; gap: 12px; }
.faces img { width: clamp(72px, 9vw, 120px); height: auto; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)); }
.chaos-reveal-popup-enter-active { animation: chaos-reveal-popup-in 400ms var(--ease-land, ease-out) both; }
.chaos-reveal-popup-leave-active { transition: opacity 250ms; }
.chaos-reveal-popup-leave-to { opacity: 0; }
@keyframes chaos-reveal-popup-in { from { opacity: 0; transform: scale(0.6) rotateY(180deg); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .chaos-reveal-popup-enter-active { animation: none; } }
</style>
