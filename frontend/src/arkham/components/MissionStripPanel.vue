<script lang="ts" setup>
import { ref } from 'vue'
import type { CompletedCard } from '@/arkham/composables/useMissionStripPanels'

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
  /** The last resolved card of this deck, shown beside the current card. */
  completed?: CompletedCard[]
}>()
/* Flavor shows two lines; a click (or Enter) unfolds the rest in place. */
const flavorOpen = ref(false)
</script>

<template>
  <article class="mission" :class="[`mission--${tone}`, { 'mission--compact': compact }]" :style="compact ? { flexGrow: 1 } : { flexGrow: `var(--balance-grow, ${weight ?? 1})`, flexBasis: 'var(--balance-basis, 0px)' }">
    <header class="mission__head">
      <!-- Title and status share a line when they fit; otherwise the status wraps under the title.
           The card art on the right never wraps. -->
      <div class="mission__lead">
        <div class="mission__titles">
          <span class="mission__eyebrow">{{ eyebrow }}</span>
          <h3 class="mission__title" :title="title">{{ title }}</h3>
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
      <div v-if="completed?.length" class="mission__done" role="list" :aria-label="eyebrow">
        <img v-for="d in completed" :key="d.key" class="mission__thumb mission__thumb--landscape"
          role="listitem" :src="d.src" :data-image="d.src" :data-card-code="d.code" alt="" loading="lazy" />
      </div>
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
  /* Width grows with `weight` from a zero basis until useMissionStripBalance measures the panels and sets
   * a basis per panel; the min-width decides when the strip wraps. */
  flex: 1 1 0; min-width: min(320px, 100%);
  display: flex; flex-direction: column; gap: 3px;
  padding: 4px 8px 5px; border-radius: var(--radius, 6px); color: var(--text, #e8e3d0);
  background: linear-gradient(180deg, var(--surface-2, #1b2a22), var(--surface-1, #142019));
  border: 1px solid var(--line, #c6a87340); border-top: 2px solid var(--tone, #c6a873);
  box-shadow: var(--shadow, 0 2px 10px #0009);
}
.mission--agenda { --tone: #d6907f; --tone-text: #f2b8a8; --band-top: #8e3f33; --band-bottom: #6b2b22; }
.mission--act { --tone: #86c0d2; --tone-text: #b5e0ee; --band-top: #2f6278; --band-bottom: #22485a; }
.mission--reference { --tone: #c6a873; --tone-text: var(--accent-gold, #d9b878); --band-top: #8a6a36; --band-bottom: #664d25; }

/* flex: none keeps a wrapped header (eyebrow, title and chips on three lines) from being squeezed under its body. */
.mission__head { flex: none; display: flex; align-items: flex-start; gap: 8px; min-width: 0; min-height: 24px; }
/* The header is a band of its own in the panel's colour (crimson agenda, steel-blue act, bronze reference),
 * edge to edge and ruled off from the body. Each band has its own pure colour pair instead of a mix with
 * the green surface, which muddied all three towards green. */
.mission__head {
  margin: -4px -8px 0; padding: 5px 8px;
  background: linear-gradient(180deg, var(--band-top), var(--band-bottom));
  border-bottom: 1px solid var(--tone);
  box-shadow: inset 0 1px 0 #ffffff26;
  border-radius: var(--radius, 6px) var(--radius, 6px) 0 0;
}
/* On the bright band the caption turns light, with a shadow so it stays crisp over any tone. */
.mission__head .mission__eyebrow { color: #fff8ea; font-weight: 700; text-shadow: 0 1px 2px #000a; }
.mission__head .mission__title { text-shadow: 0 1px 2px #000a; }
/* Nothing under the header: the band fills the whole panel. */
.mission:not(:has(.mission__body)) .mission__head { margin-bottom: -5px; border-bottom: 0; border-radius: var(--radius, 6px); }
.mission__lead { flex: 1; min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 3px 10px; }
/* Eyebrow and title share a line when the title fits beside it; otherwise the whole title moves under
 * the eyebrow at full width instead of squeezing into a narrow column next to it. */
.mission__titles { flex: 1 1 auto; min-width: 0; display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 6px; }
.mission__eyebrow { flex: none; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.7rem; font-weight: 600; color: var(--tone-text); }
.mission__title { flex: 0 1 auto; margin: 0; min-width: 0; overflow-wrap: break-word; font: 600 0.95rem/1.2 var(--ui-serif); color: var(--heading, #fff4df); }
.mission__status { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; min-width: 0; }
.mission__side { flex: none; display: flex; align-items: center; gap: 6px; }


.mission__thumb { flex: none; height: 24px; object-fit: cover; border-radius: 3px; border: 1px solid var(--line-strong, #c6a87399); cursor: zoom-in; }
.mission__thumb--landscape { width: 34px; }
.mission__thumb--portrait { width: 17px; }
.mission__attached { flex: none; display: flex; gap: 3px; }
.mission__attached :deep(img) { height: 24px; width: auto; border-radius: 3px; border: 1px solid #c9887a99; cursor: zoom-in; }

/* Keep resolved art in the toolbar so the body starts immediately below the header. */
.mission__done { flex: none; display: flex; gap: 4px; }
.mission__done img { opacity: 0.9; }
.mission__done img:hover { opacity: 1; }

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
/* Little room for the strip, and it is folded: each panel is a chip as wide as its step and status, no
 * wider. The titles are on the cards themselves (hover or tap the thumbnail) and come back when the
 * strip is unfolded. */
.location-map[data-strip='tight'] .mission--compact { flex: 0 1 auto; min-width: 0; padding: 3px 7px 4px; }
.location-map[data-strip='tight'] .mission--compact .mission__head { margin: -3px -7px -4px; padding: 3px 7px 4px; }
.location-map[data-strip='tight'] .mission--compact .mission__lead,
.location-map[data-strip='tight'] .mission--compact .mission__status { flex-wrap: nowrap; }
.location-map[data-strip='tight'] .mission--compact .mission__title { display: none; }
.location-map[data-layout='phone'] .mission--compact { flex: none !important; }
</style>
