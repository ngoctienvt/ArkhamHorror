<script lang="ts" setup>
import { ref } from 'vue'

/* The shared frame of every mission-strip panel (agenda, act, reference card). Everything that has to be
 * read every turn lives on one header line, so the strip stays short:
 *   [EYEBROW · Title ....... status (meter, chips, button) | aside | attached | thumb]
 *   [body: flavor (max 3 lines, scrolls), rules text, actions]
 * The header wraps on narrow panels. The thumbnail is a small icon; hovering it opens the full card in
 * the card overlay (CardOverlay reads `data-image` / `data-card-code`). Flavor text shows two lines; a click
 * unfolds the rest. */
defineProps<{
  tone: 'agenda' | 'act' | 'reference'
  eyebrow: string
  title: string
  image: string
  cardCode?: string
  portrait?: boolean
  flavor?: string
  /** Collapsed strip: only the header line. */
  compact?: boolean
  /** Share of the strip's width (see textWeight); panels with more text get wider. */
  weight?: number
}>()
/* Flavor shows two lines; a click (or Enter) unfolds the rest in place. */
const flavorOpen = ref(false)
</script>

<template>
  <article class="mission" :class="[`mission--${tone}`, { 'mission--compact': compact }]" :style="{ flexGrow: compact ? 1 : (weight ?? 1) }">
    <header class="mission__head">
      <!-- Title and status share a line when they fit; otherwise the status wraps under the title.
           The card art on the right never wraps. -->
      <div class="mission__lead">
        <div class="mission__titles">
          <span class="mission__eyebrow">{{ eyebrow }}</span>
          <h3 class="mission__title">{{ title }}</h3>
        </div>
        <div v-if="$slots.status" class="mission__status"><slot name="status" /></div>
      </div>
      <div class="mission__side">
      <slot name="aside" />
      <!-- Cards lying on / next to this one sit beside its thumbnail. -->
      <div v-if="$slots.attached" class="mission__attached"><slot name="attached" /></div>
      <img
        class="mission__thumb"
        :class="portrait ? 'mission__thumb--portrait' : 'mission__thumb--landscape'"
        :src="image" :data-image="image" :data-card-code="cardCode" :alt="title" loading="lazy"
      />
      </div>
    </header>
    <div v-if="!compact && ($slots.default || flavor)" class="mission__body">
      <p v-if="flavor" class="mission__flavor" :class="{ 'mission__flavor--open': flavorOpen }" :title="flavorOpen ? undefined : flavor"
        role="button" tabindex="0" :aria-expanded="flavorOpen"
        @click="flavorOpen = !flavorOpen" @keydown.enter.prevent="flavorOpen = !flavorOpen" @keydown.space.prevent="flavorOpen = !flavorOpen">{{ flavor }}</p>
      <slot />
    </div>
  </article>
</template>

<style scoped>
.mission {
  /* Width grows with `weight` from a zero basis; the min-width decides when the strip wraps. */
  flex: 1 1 0; min-width: min(320px, 100%);
  display: flex; flex-direction: column; gap: 3px;
  padding: 4px 8px 5px; border-radius: var(--radius, 6px); color: var(--text, #e8e3d0);
  background: linear-gradient(180deg, var(--surface-2, #1b2a22), var(--surface-1, #142019));
  border: 1px solid var(--line, #c6a87340); border-top: 2px solid var(--tone, #c6a873);
  box-shadow: var(--shadow, 0 2px 10px #0009);
}
.mission--agenda { --tone: #d6907f; --tone-text: #f2b8a8; }
.mission--act { --tone: #86c0d2; --tone-text: #b5e0ee; }
.mission--reference { --tone: #c6a873; --tone-text: var(--accent-gold, #d9b878); }

/* flex: none keeps a wrapped header (eyebrow, title and chips on three lines) from being squeezed under its body. */
.mission__head { flex: none; display: flex; align-items: flex-start; gap: 8px; min-width: 0; min-height: 24px; }
.mission__lead { flex: 1; min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 3px 10px; }
/* Eyebrow and title share a line when the title fits beside it; otherwise the whole title moves under
 * the eyebrow at full width instead of squeezing into a narrow column next to it. */
.mission__titles { flex: 1 1 auto; min-width: 0; display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 6px; }
.mission__eyebrow { flex: none; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.68rem; font-weight: 600; color: var(--tone-text); }
.mission__title { flex: 0 1 auto; margin: 0; min-width: 0; overflow-wrap: break-word; font: 600 0.95rem/1.2 var(--ui-serif); color: var(--heading, #fff4df); }
.mission__status { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; min-width: 0; }
.mission__side { flex: none; display: flex; align-items: center; gap: 6px; }


.mission__thumb { flex: none; height: 24px; object-fit: cover; border-radius: 3px; border: 1px solid var(--line-strong, #c6a87399); cursor: zoom-in; }
.mission__thumb--landscape { width: 34px; }
.mission__thumb--portrait { width: 17px; }
.mission__attached { flex: none; display: flex; gap: 3px; }
.mission__attached :deep(img) { height: 24px; width: auto; border-radius: 3px; border: 1px solid #c9887a99; cursor: zoom-in; }

/* The body scrolls inside the panel, so the header always stays in view. */
.mission__body { display: flex; flex-direction: column; gap: 3px; min-height: 0; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #c6a87366 transparent; }
.mission__body:empty { display: none; }
.mission__body :deep(p) { margin: 0; font-size: 0.78rem; line-height: 1.35; text-align: left; }
.mission__flavor { flex: none; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; overflow: hidden; cursor: pointer; font-style: italic; color: var(--text-flavor, #cdd4c2); border-left: 2px solid var(--tone); padding-left: 7px; }
.mission__flavor--open { display: block; -webkit-line-clamp: unset; line-clamp: none; }
.mission__flavor:hover { color: var(--text, #e8e3d0); }
.mission__flavor:focus-visible { outline: 1px solid var(--accent-gold, #d9b878); outline-offset: 2px; }
/* A height budget, so a wordy card never pushes the map down: past it the body scrolls under the header. */
.mission { max-height: 172px; }
</style>
