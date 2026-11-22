<script lang="ts" setup>
// The inside of a link badge whose far end cannot be entered yet (see blockedEntryHint.ts):
// a padlock where the move arrow would be, and on hover a caption with the place's own words on why.
defineProps<{ name: string; reason: string | null }>()
</script>

<template>
  <svg class="locked-path__icon" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="10.5" width="14" height="10" rx="2" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    <path d="M12 14.5v2.5" />
  </svg>
  <span class="locked-path__caption">
    <strong>{{ $t('locationMap.link.locked', { name }) }}</strong>
    <span v-if="reason">{{ reason }}</span>
  </span>
</template>

<style scoped>
.locked-path__icon { width: 100%; height: 100%; fill: none; stroke: #f1c08f; stroke-width: 2; }
.locked-path__caption {
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  translate: -50% 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: max-content;
  max-width: 220px;
  padding: 5px 9px 6px;
  border: 1px solid #d9774f99;
  border-radius: 6px;
  background: #1a0e08e6;
  box-shadow: 0 2px 8px #000c;
  color: #f3e2c4;
  font: 12px/1.3 system-ui, sans-serif;
  text-align: center;
  text-shadow: none;
  pointer-events: none;
}
.locked-path__caption strong { color: #f1c08f; font-weight: 700; }
/* Only the padlock sits on the board; the caption shows while the badge is hovered or focused
 * (LocationMapCanvas.vue reveals it). */
.locked-path__caption { opacity: 0; visibility: hidden; transition: opacity 0.15s, visibility 0.15s; }
</style>
