<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import GameIcon from '@/arkham/components/GameIcon.vue'
import ShroudDisc from '@/arkham/components/ShroudDisc.vue'

/* What the location plates on the map look like in each state, drawn with the same edges the plates use
 * (LocationMarkerPlate): a plate's state is its border, not a symbol. Open the first time, then remembered. */
const { t } = useI18n()
const open = useStorage('arkham-map-legend', true)

type Entry = { key: string; swatch?: 'revealed' | 'unrevealed' | 'here' | 'movable' | 'targetable'; icon?: 'clue' | 'doom' | 'shroud'; glyph?: string }
const ENTRIES: Entry[] = [
  { key: 'revealed', swatch: 'revealed' },
  { key: 'unrevealed', swatch: 'unrevealed' },
  { key: 'here', swatch: 'here' },
  { key: 'movable', swatch: 'movable' },
  { key: 'targetable', swatch: 'targetable' },
  { key: 'move', glyph: '↔' },
  { key: 'onEnter', glyph: '⚠' },
  { key: 'shroud', icon: 'shroud' },
  { key: 'clues', icon: 'clue' },
  { key: 'doom', icon: 'doom' },
  { key: 'details' },
]
</script>

<template>
  <span class="legend">
    <button class="view" type="button" :class="{ active: open }" :aria-expanded="open" @click.stop="open = !open">? {{ t('locationMap.legend.title') }}</button>
    <span v-if="open" class="panel" role="note" @click.stop>
      <span v-for="e in ENTRIES" :key="e.key" class="row">
        <b aria-hidden="true">
          <i v-if="e.swatch" class="swatch" :class="`swatch--${e.swatch}`"></i>
          <ShroudDisc v-else-if="e.icon === 'shroud'" value="2" class="legend-shroud" />
          <GameIcon v-else-if="e.icon" :type="e.icon" />
          <template v-else-if="e.glyph">{{ e.glyph }}</template>
        </b>{{ t(`locationMap.legend.${e.key}`) }}
      </span>
    </span>
  </span>
</template>

<style scoped>
.legend { position: relative; }
/* Same look as the other tool buttons on the map bar (LocationMap .view--tool). */
.view { white-space: nowrap; padding: 2px 10px; font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; background: transparent; border: 1px solid transparent; border-radius: 4px; color: var(--text-muted, #b4bdab); cursor: pointer; transition: border-color 0.15s, color 0.15s; }
.view:hover { border-color: var(--accent-gold, #d9b878); color: var(--text, #e7dcc0); }
.view.active { border-color: var(--line-strong, #c6a87399); color: var(--accent-gold, #f0dfb5); }
.panel { position: absolute; top: calc(100% + 6px); right: 0; z-index: 90; width: 300px; display: grid; gap: 5px; padding: 10px 12px; background: var(--surface-0, #101913); border: 1px solid var(--line-strong, #c6a873); border-radius: 8px; box-shadow: 0 10px 30px #000c; font-size: 0.78rem; line-height: 1.3; color: var(--text, #e9e3d0); }
.row { display: flex; gap: 8px; align-items: center; }
.row b { flex: none; width: 26px; display: grid; place-items: center; color: var(--accent-gold, #e6c584); }
.row b :deep(.game-icon) { width: 16px; height: 16px; }
/* A miniature plate edge for each state; colours match LocationMarkerPlate. */
.swatch { display: block; width: 24px; height: 12px; border-radius: 3px; border: 1px solid #c6a873; background: #18241c; }
.swatch--unrevealed { border: 1px dashed #9a9d98; background: #5b5f5a; }
.swatch--here { border-color: #ffe9a0; box-shadow: 0 0 6px #ffe9a0aa; }
.swatch--movable { border-color: #8fd19a; }
.swatch--targetable { border-color: #f2d27a; box-shadow: 0 0 0 1px #f2d27a, 0 0 8px #f2d27aaa; }
/* Shrunk so the disc fits the icon column; the legend explains the symbol, not a real value. */
.legend-shroud { font-size: 0.6rem; }
.location-map[data-input='touch'] .view { min-height: var(--tap-min); padding: 0 16px; font-size: 0.8rem; }
.location-map[data-input='touch'] .panel { font-size: 0.9rem; gap: 6px; }
</style>
