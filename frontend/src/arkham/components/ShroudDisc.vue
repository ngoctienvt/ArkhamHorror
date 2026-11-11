<script lang="ts" setup>
/* Shroud as printed on the location card: a black disc with a pale rim and a bold white serif number.
 * Shared by the map plate, the action panel, the info card and the map legend so shroud reads the same
 * everywhere. A modified value (current differs from printed) is tinted amber. Sized in em, so it
 * scales with the surrounding text. */
withDefaults(defineProps<{ value?: string | number; modified?: boolean }>(), { value: '', modified: false })
</script>

<template>
  <span class="shroud-disc" :class="{ modified }">{{ value }}</span>
</template>

<style scoped>
.shroud-disc {
  display: inline-grid;
  place-items: center;
  flex: none;
  box-sizing: border-box;
  width: 1.75em;
  height: 1.75em;
  padding: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #2a2a2a, #050505 70%);
  border: 1.5px solid #e9e1cc;
  box-shadow: 0 0 0 1px #000, 0 1px 3px #000a;
  color: #fff;
  font: 700 1em/1 var(--ui-serif, Georgia, serif);
  font-variant-numeric: tabular-nums;
  vertical-align: middle;
}

.shroud-disc.modified {
  color: #f5b26b;
  border-color: #f5b26b;
}
</style>
