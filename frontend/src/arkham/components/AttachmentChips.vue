<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import { attachmentsOf, type HostKind } from '@/arkham/attachments'
import { cardImage } from '@/arkham/cardImages'
import { useCardNames } from '@/arkham/composables/useCardNames'
import GameIcon from '@/arkham/components/GameIcon.vue'

/* The cards attached to a location, enemy or investigator, drawn as small round chips on the host rather
 * than as cards. A chip shows the card's art and any counters; hovering it shows the full card through the
 * usual card preview, because the chip carries the card's image (no tooltip of its own, it would overlap
 * the preview). Past `max` chips the rest fold into a "+N" button. */
const props = withDefaults(defineProps<{
  game: Game
  host: HostKind
  hostId: string
  max?: number
  placement?: 'up' | 'down'
}>(), { max: 3, placement: 'up' })

const { t } = useI18n()
const nameOf = useCardNames()
const expanded = ref(false)

const all = computed(() => attachmentsOf(props.game, props.host, props.hostId))
const shown = computed(() => expanded.value ? all.value : all.value.slice(0, props.max))
const hidden = computed(() => Math.max(0, all.value.length - props.max))
</script>

<template>
  <span v-if="all.length" class="chips" :class="placement" :aria-label="t('locationMap.attach.label')" @click.stop>
    <span v-for="a in shown" :key="a.id" class="chip" :class="[a.tone, { exhausted: a.exhausted }]" tabindex="0" :aria-label="nameOf(a.cardCode)"
      :data-image="cardImage(a.cardCode)" :data-card-code="a.cardCode">
      <span class="art" :style="{ backgroundImage: `url(${cardImage(a.cardCode)})` }"></span>
      <b v-for="c in a.counters" :key="c.token" class="counter" :class="c.token"><GameIcon :type="c.token" />{{ c.count }}</b>
    </span>
    <button v-if="hidden && !expanded" type="button" class="more" :title="t('locationMap.attach.more', { n: hidden })" @click="expanded = true">+{{ hidden }}</button>
    <button v-else-if="hidden" type="button" class="more" :title="t('locationMap.attach.less')" @click="expanded = false">−</button>
  </span>
</template>

<style scoped>
.chips { position: relative; display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 3px; max-width: 130px; }
.chip { position: relative; width: 26px; height: 26px; border-radius: 50%; border: 2px solid var(--tone, #c6a873); background: #111815; box-shadow: 0 1px 4px #000c; cursor: help; }
.chip.harm { --tone: #d9695b; }
.chip.aid { --tone: #d9b45b; }
.chip.exhausted { opacity: 0.6; }
.chip:focus-visible { outline: 2px solid #ffe9a0; }
.art { position: absolute; inset: 0; border-radius: 50%; background-size: 240% auto; background-position: 50% 22%; background-repeat: no-repeat; }
.counter { position: absolute; right: -8px; bottom: -6px; display: inline-flex; align-items: center; gap: 1px; min-width: 14px; height: 15px; padding: 0 4px 0 2px; border-radius: 8px; background: #0b100d; border: 1px solid #ffffff44; color: #ffe9a0; font: 700 9px/13px system-ui, sans-serif; text-align: center; }
.counter.doom { color: #ff9b87; }
.counter :deep(.game-icon) { width: 12px; height: 12px; vertical-align: 0; }
.counter + .counter { right: auto; left: -8px; }
.more { width: 26px; height: 26px; padding: 0; border-radius: 50%; border: 1px solid #c6a873aa; background: #101a15e6; color: #f1e6c1; font: 700 10px/1 system-ui, sans-serif; cursor: pointer; }
.more:hover { background: #26352bf0; }
</style>
