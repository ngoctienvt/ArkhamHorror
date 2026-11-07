<script lang="ts" setup>
import { computed } from 'vue'
import { iconClasses } from '@/arkham/icons'
import type { AbilityKind } from '@/arkham/locationChoices'

/* One ability as a single line: its kind icon (action / fast / reaction) right
 * beside the card's printed text, the whole line clickable. Used where an
 * ability already has its printed line, so the icon and the words read as one
 * sentence instead of a wide button with the text floating away from it. */
const props = defineProps<{ kind: AbilityKind | null; html: string }>()
defineEmits<{ (e: 'choose'): void }>()

const iconClass = computed(() => {
  if (props.kind === 'action' || props.kind === 'fast' || props.kind === 'reaction') return iconClasses[props.kind]
  return null
})
</script>

<template>
  <button type="button" class="ability-text-row" data-game-actionable="true" @click="$emit('choose')">
    <span v-if="iconClass" class="ability-text-row__icon"><span :class="iconClass" /></span>
    <span class="ability-text-row__text" v-html="html" />
  </button>
</template>

<style scoped>
.ability-text-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  text-transform: none;
  cursor: pointer;
}

.ability-text-row__icon {
  flex-shrink: 0;
  font-size: 1.15em;
  line-height: 1;
  color: #f3ead6;
}

.ability-text-row__text {
  flex: 1;
  min-width: 0;
  line-height: 1.4;

  :deep(img) {
    height: 1.1em;
    vertical-align: -0.15em;
  }
}
</style>
