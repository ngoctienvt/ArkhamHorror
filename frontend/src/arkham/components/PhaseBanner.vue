<script lang="ts" setup>
/* Announces a new phase from the board itself, for players who turned off the
 * account's phase announcements (Game.vue plays those from the server's
 * PhaseChanged events). Both use the same band (PhaseAnnouncement.vue), so a
 * phase always looks the same however it is announced, and never twice.
 * Toggle in Settings; off with the motion setting. */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { Game } from '@/arkham/types/Game'
import type { Phase } from '@/arkham/types/Phase'
import { useSettings } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import { MOTION_MS, scaledMs } from '@/arkham/motion/motionTokens'
import PhaseAnnouncement from '@/arkham/components/PhaseAnnouncement.vue'

const props = defineProps<{ game: Game }>()
const settings = useSettings()
const userStore = useUserStore()

const ANNOUNCED = new Set<Phase>(['MythosPhase', 'InvestigationPhase', 'EnemyPhase', 'UpkeepPhase'])

/* How long the band stays up at normal speed, entrance and exit included. */
const SHOW_MS = MOTION_MS.linger + 600

const shown = ref<Phase | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null
let lastGameId = props.game.id

const enabled = computed(() =>
  settings.phaseBanner && settings.motionLevel !== 'off' && !userStore.currentUser?.phaseTransitionNotifications)

watch(
  () => props.game.phase,
  (phase, previous) => {
    const sameGame = props.game.id === lastGameId
    lastGameId = props.game.id
    if (!sameGame || previous === undefined || phase === previous || !enabled.value || !ANNOUNCED.has(phase)) return
    shown.value = phase
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => (shown.value = null), scaledMs(SHOW_MS, settings.motionSpeed))
  },
)

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <PhaseAnnouncement :phase="shown" />
</template>
