<script lang="ts" setup>
/* The scene map's interface glyphs as one inline-SVG set with the same stroke, so buttons and lists look
 * alike on every system instead of mixing emoji (which each OS draws its own way) with text symbols.
 * Game tokens (clue, doom, health ...) stay GameIcon: those are the printed token art. */
type SceneGlyphName ='investigate' | 'move' | 'choose' | 'close' | 'card' | 'extra' | 'warn'
defineProps<{ name: SceneGlyphName }>()

const PATHS: Record<SceneGlyphName, string> = {
  investigate: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM15.2 15.2 20 20',
  move: 'M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4',
  choose: 'M12 3v4M12 17v4M3 12h4M17 12h4M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z',
  close: 'M6 6l12 12M18 6 6 18',
  card: 'M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5ZM8.5 8h7M8.5 11.5h7',
  extra: 'M12 3l1.8 6.2L20 12l-6.2 1.8L12 20l-1.8-6.2L4 12l6.2-2.8Z',
  warn: 'M12 4 21 19.5H3ZM12 10v4.5M12 17v.5',
}
</script>

<template>
  <svg class="scene-glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path :d="PATHS[name]" />
  </svg>
</template>

<style scoped>
.scene-glyph { display: inline-block; width: 1.1em; height: 1.1em; flex: none; vertical-align: -0.18em; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
</style>
