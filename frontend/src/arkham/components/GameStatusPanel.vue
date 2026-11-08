<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import { useGameStatusLines } from '@/arkham/composables/useGameStatusLines'

/* Sits on top of the game log so every seat sees the same thing: what the game is resolving right now, and
 * exactly who it is waiting on and for what. The viewer's own row also says how to move on. It only reads
 * state the server already sent and sends nothing. */
const props = defineProps<{ game: Game; playerId: string }>()

const { t } = useI18n()
const { phase, turnOf, stepLine, doing, rows, over } = useGameStatusLines(() => props.game, () => props.playerId)
const idleText = computed(() => over.value ? t('locationMap.status.over') : t('locationMap.status.processing'))
</script>

<template>
  <aside class="status" role="status" aria-live="polite">
    <header class="bar">
      <span class="phase">{{ phase }}</span>
      <span v-if="turnOf" class="turn-of">{{ turnOf }}</span>
    </header>
    <p v-if="stepLine && !over" class="step">{{ stepLine }}</p>
    <p v-if="doing && !over" class="doing"><b>{{ t('locationMap.status.doing') }}</b> {{ doing }}</p>
    <p v-if="over || rows.length === 0" class="idle">{{ idleText }}</p>
    <ul v-else class="rows">
      <li v-for="r in rows" :key="r.id" :class="{ mine: r.mine }">
        <span v-if="r.effect" class="effect">{{ r.effect }}</span>
        <span class="text"><b v-if="r.mine" class="you">{{ t('locationMap.status.you') }}</b> {{ r.text }}</span>
        <span v-if="r.detail" class="detail">{{ r.detail }}</span>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.status { flex: none; font-size: 0.8rem; color: #e5e2d4; background: #0f1813; border-bottom: 1px solid #c6a87355; }
.bar { display: flex; align-items: baseline; gap: 8px; padding: 6px 10px; background: #1d2e24; }
.phase { font-size: 0.74rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #e6c584; }
.turn-of { font-size: 0.74rem; color: #c9d0c3; }
.step { margin: 0; padding: 6px 10px 0; font-size: 0.74rem; color: #e6c584; }
.doing, .idle { margin: 0; padding: 6px 10px 0; font-size: 0.74rem; color: #c9d0c3; }
.doing b { color: #98a38f; font-weight: 600; margin-right: 4px; }
.idle { padding-bottom: 6px; }
.rows { list-style: none; margin: 0; padding: 6px 10px 8px; display: flex; flex-direction: column; gap: 6px; }
.rows li { display: flex; flex-direction: column; gap: 1px; padding-left: 8px; border-left: 3px solid #7d8a9a; }
.rows li.mine { border-left-color: #6fcf8a; }
.text { font-weight: 600; }
.you { color: #6fcf8a; margin-right: 2px; }
.detail { font-size: 0.72rem; color: #b4bdab; }
.effect { font-size: 0.72rem; font-style: italic; line-height: 1.35; color: #d9c9a3; padding: 3px 6px; margin-bottom: 2px; background: #c6a87314; border-radius: 4px; }
</style>
