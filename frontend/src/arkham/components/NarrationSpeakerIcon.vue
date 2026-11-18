<script lang="ts" setup>
/* Speaker / stop glyph for the narration buttons. Drawn as SVG rather than the 🔊 emoji,
 * which rendered tiny and washed out on the parchment panels. Takes the button's text colour. */
defineProps<{ playing: boolean }>()
</script>

<template>
  <svg v-if="playing" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
  </svg>
  <svg v-else viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 9h4l5-4v14l-5-4H3z" fill="currentColor" />
    <path
      d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"
      fill="none"
      stroke="currentColor"
      stroke-width="2.2"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped>
svg {
  width: 20px;
  height: 20px;
  display: block;
}
</style>
