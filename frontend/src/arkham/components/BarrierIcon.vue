<script lang="ts" setup>
/* A wooden barricade: two posts and two crossed planks, drawn in the current colour so the map badge and the
 * card board can tint it. Stands in for the resource tokens the rules use as barriers (In Too Deep). */
</script>

<template>
  <svg class="barrier-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path class="posts" d="M5 4v17M19 4v17" />
    <path class="planks" d="M3 8.5h18M3 15.5h18" />
    <path class="cross" d="M6 9.5l12 5M6 14.5l12-5" />
  </svg>
</template>

<style scoped>
.barrier-icon {
  display: block;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.posts { stroke-width: 2.6; }
.planks { stroke-width: 3.2; }
.cross { stroke-width: 1.6; opacity: 0.85; }
</style>
