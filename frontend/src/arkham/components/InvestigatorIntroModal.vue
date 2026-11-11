<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Game } from '@/arkham/types/Game'
import { investigatorPortrait } from '@/arkham/cardImages'
import { useDbCardStore } from '@/stores/dbCards'
import { useSettings } from '@/stores/settings'
import { narrationTracks, type NarrationManifest } from '@/arkham/narration'
import {
  NARRATION_ROOT,
  loadManifest,
  useNarrationControls,
} from '@/arkham/composables/useNarration'

/* Briefing shown once, between choosing decks and the first scenario: the
 * investigators at the table, each with the translated backstory (the card's
 * back flavor) and, where a recording exists, a spoken reading of it. */
const props = defineProps<{ game: Game; initialId?: string }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()
const dbCards = useDbCardStore()
const settings = useSettings()
const storyNarration = useNarrationControls()

const manifest = ref<NarrationManifest | null>(null)
const selectedId = ref<string | null>(props.initialId ?? null)
const speaking = ref(false)
let audio: HTMLAudioElement | null = null

const investigators = computed(() => Object.values(props.game.investigators ?? {}))

type Entry = {
  id: string
  code: string
  name: string
  subname: string | null
  portrait: string
  paragraphs: string[]
  trackUrl: string | null
  accent: string
}

/* Backstory text arrives with light markup (<i>, <b>); show it as plain paragraphs. */
function toParagraphs(raw: string | null | undefined): string[] {
  if (!raw) return []
  return raw
    .replace(/<[^>]*>/g, '')
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
}

/* The engine prefixes printed investigators with `c` (c10004); the card data and the
 * narration files are keyed by the bare code. */
const bareCode = (code: string) => code.replace(/^c(?=\d)/, '')

const entries = computed<Entry[]>(() =>
  investigators.value.map((inv) => {
    const code = bareCode(inv.cardCode)
    const dbCard = dbCards.getDbCard(code)
    const track = narrationTracks(
      [`investigators.${code}`],
      manifest.value,
      settings.narrationLanguage,
      NARRATION_ROOT,
    )[0]
    return {
      id: inv.id,
      code,
      name: dbCard?.name || inv.name.title,
      subname: dbCard?.subname ?? inv.name.subtitle ?? null,
      portrait: investigatorPortrait(props.game, inv.id),
      paragraphs: toParagraphs(dbCard?.back_flavor),
      trackUrl: track?.url ?? null,
      accent: `var(--${(inv.class ?? 'neutral').toLowerCase()}, var(--neutral))`,
    }
  }),
)

const selected = computed(() => entries.value.find((e) => e.id === selectedId.value) ?? entries.value[0] ?? null)

function stopSpeech() {
  if (audio) {
    audio.onended = null
    audio.pause()
  }
  audio = null
  speaking.value = false
}

function speak(entry: Entry | null) {
  stopSpeech()
  if (!entry?.trackUrl) return
  audio = new Audio(entry.trackUrl)
  audio.volume = settings.narrationVolume
  audio.onended = () => (speaking.value = false)
  speaking.value = true
  audio.play().catch(() => (speaking.value = false))
}

function select(id: string) {
  selectedId.value = id
}

function toggleSpeech() {
  if (speaking.value) stopSpeech()
  else speak(selected.value)
}

function begin() {
  stopSpeech()
  emit('close')
}

// Switching investigator reads that investigator's backstory (when narration is on).
watch(
  () => selected.value?.id,
  () => {
    if (settings.narration) speak(selected.value)
    else stopSpeech()
  },
)

// The manifest arrives after the first render; start the first reading once it is here.
watch(
  () => manifest.value,
  () => {
    if (settings.narration && !speaking.value) speak(selected.value)
  },
)

onMounted(() => {
  // The scenario intro would otherwise talk over the briefing.
  storyNarration.stop()
  void loadManifest().then((m) => (manifest.value = m))
})

onBeforeUnmount(stopSpeech)
</script>

<template>
  <div class="intro-backdrop" role="dialog" aria-modal="true" :aria-label="t('investigatorIntro.title')">
    <div class="intro-box">
      <div class="intro-header">
        <h2>{{ t('investigatorIntro.title') }}</h2>
        <div class="intro-rule"><span>✦</span></div>
        <p>{{ t('investigatorIntro.subtitle') }}</p>
      </div>

      <div class="intro-body">
        <ul class="intro-list">
          <li v-for="entry in entries" :key="entry.id">
            <button
              type="button"
              class="intro-pick"
              :class="{ active: selected?.id === entry.id }"
              :style="{ '--accent': entry.accent }"
              @click="select(entry.id)"
            >
              <img :src="entry.portrait" :alt="entry.name" class="no-overlay" />
              <span class="intro-pick-text">
                <strong>{{ entry.name }}</strong>
                <em v-if="entry.subname">{{ entry.subname }}</em>
              </span>
            </button>
          </li>
        </ul>

        <section v-if="selected" class="intro-detail" :style="{ '--accent': selected.accent }">
          <div class="intro-detail-head">
            <img :src="selected.portrait" :alt="selected.name" class="intro-portrait no-overlay" />
            <div class="intro-titles">
              <h3>{{ selected.name }}</h3>
              <p v-if="selected.subname">{{ selected.subname }}</p>
              <button
                v-if="selected.trackUrl"
                type="button"
                class="intro-speak"
                :class="{ speaking }"
                @click="toggleSpeech"
              >
                <span class="intro-eq" aria-hidden="true"><b></b><b></b><b></b><b></b></span>
                {{ speaking ? t('investigatorIntro.stop') : t('investigatorIntro.listen') }}
              </button>
            </div>
          </div>

          <div class="intro-story">
            <p v-for="(p, i) in selected.paragraphs" :key="i">{{ p }}</p>
            <p v-if="selected.paragraphs.length === 0" class="intro-empty">
              {{ t('investigatorIntro.noStory') }}
            </p>
          </div>
        </section>
      </div>

      <div class="intro-actions">
        <button type="button" class="intro-begin" @click="begin">{{ t('investigatorIntro.begin') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-index-100000);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: radial-gradient(ellipse at center, rgba(20, 24, 32, 0.82), rgba(0, 0, 0, 0.94));
  backdrop-filter: blur(4px);
  animation: intro-fade 220ms ease-out;
}

.intro-box {
  display: flex;
  flex-direction: column;
  width: min(1080px, 100%);
  height: min(720px, calc(100vh - 32px));
  max-height: calc(100vh - 32px);
  background: linear-gradient(180deg, #3a4150 0%, #2b303b 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  color: var(--title);
  overflow: hidden;
  animation: intro-rise 260ms ease-out;
}

.intro-header { padding: 22px 28px 6px; text-align: center; }
.intro-header h2 {
  margin: 0;
  font-family: Teutonic, serif;
  font-size: 2.1rem;
  font-weight: 400;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #eceff4;
}
.intro-header p { margin: 6px 0 0; font-size: 0.95rem; opacity: 0.7; }
.intro-rule {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 6px auto 0;
  width: min(360px, 70%);
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.8rem;
}
.intro-rule::before,
.intro-rule::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.intro-body { display: flex; gap: 22px; padding: 16px 28px; flex: 1; min-height: 0; }

.intro-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0 4px 0 0;
  list-style: none;
  width: 250px;
  flex-shrink: 0;
  overflow-y: auto;
}

.intro-pick {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 4px solid var(--accent);
  border-radius: 10px;
  color: var(--title);
  font-size: 1rem;
  line-height: 1.25;
  text-align: left;
  cursor: pointer;
  transition: background-color 140ms ease, transform 140ms ease, border-color 140ms ease;
}
.intro-pick:hover:not(:disabled) { background: rgba(255, 255, 255, 0.07); transform: translateX(2px); }
.intro-pick.active {
  background: color-mix(in srgb, var(--accent) 16%, rgba(0, 0, 0, 0.3));
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), 0 4px 18px rgba(0, 0, 0, 0.35);
}
.intro-pick img {
  width: 54px;
  height: 54px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--accent);
  flex-shrink: 0;
}
.intro-pick-text { display: flex; flex-direction: column; min-width: 0; }
.intro-pick-text strong { font-weight: 600; color: #eceff4; }
.intro-pick-text em { font-size: 0.82rem; opacity: 0.65; }

.intro-detail {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 18px 22px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 3px solid var(--accent);
  border-radius: 12px;
}
.intro-detail-head {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.intro-portrait {
  width: 112px;
  height: 112px;
  object-fit: cover;
  border-radius: 12px;
  border: 3px solid var(--accent);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
}
.intro-titles { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.intro-titles h3 {
  margin: 0;
  font-family: Teutonic, serif;
  font-weight: 400;
  font-size: 1.9rem;
  letter-spacing: 0.04em;
  color: #eceff4;
}
.intro-titles p { margin: 0; font-size: 1.05rem; font-style: italic; color: var(--accent); }

.intro-speak {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  padding: 7px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #eceff4;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  cursor: pointer;
}
.intro-speak.speaking {
  background: color-mix(in srgb, var(--accent) 30%, transparent);
  border-color: var(--accent);
}
.intro-eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 14px; }
.intro-eq b { display: block; width: 3px; height: 4px; background: currentColor; border-radius: 1px; }
.intro-speak.speaking .intro-eq b { animation: intro-eq 800ms ease-in-out infinite; }
.intro-speak.speaking .intro-eq b:nth-child(2) { animation-delay: 120ms; }
.intro-speak.speaking .intro-eq b:nth-child(3) { animation-delay: 240ms; }
.intro-speak.speaking .intro-eq b:nth-child(4) { animation-delay: 360ms; }

.intro-story {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 10px;
  font-family: Arno, Georgia, 'Times New Roman', serif;
  font-size: 1.12rem;
  line-height: 1.75;
  color: #dde2ea;
}
.intro-story p { margin: 0 0 1em; text-align: justify; }
.intro-story p:first-child::first-letter {
  float: left;
  margin: 0.05em 0.1em 0 0;
  font-size: 3.2em;
  line-height: 0.85;
  color: var(--accent);
  font-family: Teutonic, serif;
}
.intro-empty { opacity: 0.6; font-style: italic; }

.intro-actions { display: flex; justify-content: center; padding: 14px 28px 22px; }
.intro-begin {
  padding: 12px 44px;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #fff;
  background: linear-gradient(180deg, #7fa347, #5d7d2f);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
  cursor: pointer;
}
.intro-begin:hover:not(:disabled) { background: linear-gradient(180deg, #8fb556, #6a8d36); }

@keyframes intro-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes intro-rise {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
@keyframes intro-eq { 0%, 100% { height: 4px; } 50% { height: 14px; } }

@media (max-width: 720px) {
  .intro-box { height: 100%; }
  .intro-body { flex-direction: column; padding: 12px 16px; gap: 12px; }
  .intro-list { flex-direction: row; width: auto; overflow-x: auto; overflow-y: hidden; padding: 0 0 6px; }
  .intro-pick { width: auto; min-width: 190px; }
  .intro-detail { padding: 14px; min-height: 0; }
  .intro-portrait { width: 80px; height: 80px; }
  .intro-titles h3 { font-size: 1.5rem; }
}
</style>
