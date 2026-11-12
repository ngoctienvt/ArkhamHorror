<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from 'vue'

export interface Props {
  name?: string | null
  typeName?: string | null
  factionName?: string | null
  factionCode?: string | null
  traits?: string | null
  /** Keywords the card gained from modifiers (e.g. "Retaliate. Hunter"), kept as the standard English names. */
  keywords?: string | null
  text?: string | null
  flavor?: string | null
  /** Show the flavor above the rules text, where acts and agendas print it. */
  flavorFirst?: boolean
  reversed?: boolean
  upsideDown?: boolean
}

defineProps<Props>()

/* The flavor fades out only when the window is too short for it and it was actually cut. */
const flavorEl = ref<HTMLElement | null>(null)
const flavorClipped = ref(false)
const measure = () => { const el = flavorEl.value; flavorClipped.value = !!el && el.scrollHeight > el.clientHeight + 1 }
const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
watch(flavorEl, (el, old) => {
  if (old) observer?.unobserve(old)
  if (el) { observer?.observe(el); measure() }
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    class="card-data"
    :class="{
      reversed,
      Reversed: upsideDown,
      [`faction-${factionCode || 'neutral'}`]: true,
    }"
  >
    <div class="card-data-header">
      <p v-if="name"><b>{{ name }}</b></p>
    </div>
    <div class="card-data-body">
      <div class="card-info" v-if="typeName || traits || factionName">
        <div>
          <p v-if="typeName">{{ typeName }}</p>
          <p v-if="traits"><span style="font-style: italic;">{{ traits }}</span></p>
        </div>
        <div>
          <p v-if="factionName">{{ factionName }}</p>
        </div>
      </div>
      <p v-if="keywords" class="card-keywords">{{ keywords }}.</p>
      <div v-if="flavor && flavorFirst" ref="flavorEl" class="card-flavor card-flavor--first" :class="{ clipped: flavorClipped }">
        <p v-html="flavor"></p>
      </div>
      <div v-if="text" class="card-text">
        <p v-html="text"></p>
      </div>
      <div v-if="flavor && !flavorFirst" ref="flavorEl" class="card-flavor" :class="{ clipped: flavorClipped }">
        <p v-html="flavor"></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* The translated card text beside a card image, drawn like the text box printed on the card itself:
 * cream parchment with dark ink, a brown frame and a deep shadow, so it reads clearly and stands apart
 * from the dark green board it floats over. The faction colour is the accent stripe. It is as tall as its text instead of always matching
 * the card and leaving an empty block below; the overlay takes no pointer events, so it grows rather
 * than scrolls. */
.card-data {
  position: relative;
  width: 330px;
  align-self: flex-start;
  margin-left: 6px;
  border-radius: 10px;
  font-family: Arial, sans-serif;
  white-space: pre-wrap;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: radial-gradient(ellipse at 50% 35%, #f6eedb, #e9dcbc 85%);
  border: 1px solid #7a5f3a;
  border-top: 3px solid var(--panel-color);
  box-shadow: 0 0 0 1px #000a, 0 10px 28px #000d, inset 0 0 18px #b8996033;
  color: #1f1810;
  --panel-color: #8a8f86;
  --border-color: var(--panel-color);
}

/* CardOverlay's own scoped `.card-data` rule (for its customization sheet) also reaches this root and
 * gives it the card's aspect ratio; the doubled class wins so the panel stays as tall as its text. */
.card-data.card-data { aspect-ratio: auto; min-height: 0; height: auto; }

/* Never taller than the window: the overlay can't scroll, so a long back side (agenda/act flavor)
 * would run off the bottom. The rules text always shows in full; only the flavor gives way,
 * fading out where it is cut. */
.card-data { max-height: calc(100vh - 48px); }
.card-data-body { display: flex; flex-direction: column; min-height: 0; overflow: hidden; }
.card-data-body > * { flex-shrink: 0; }
.card-data-body > .card-flavor {
  flex-shrink: 1;
  min-height: 3.5em;
  overflow: hidden;
}
.card-data-body > .card-flavor.clipped {
  -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 2.5em), transparent);
  mask-image: linear-gradient(to bottom, #000 calc(100% - 2.5em), transparent);
}

.card-data.faction-guardian { --panel-color: #3a96cf; }
.card-data.faction-seeker { --panel-color: #e0913f; }
.card-data.faction-rogue { --panel-color: #3fae4a; }
.card-data.faction-mystic { --panel-color: #8a7ee0; }
.card-data.faction-survivor { --panel-color: #e0454f; }
.card-data.faction-mythos { --panel-color: #6b5233; }

.card-data-header {
  padding: 8px 12px 6px;
  font: 600 1.18em/1.25 var(--ui-serif, serif);
  color: #1f1810;
  text-align: left;
  background: #dccaa0;
  border-bottom: 1px solid #7a5f3a66;
  border-radius: 7px 7px 0 0;
}

.card-data-header p {
  margin: 0;
}

.card-data-body {
  font-size: 1em;
  line-height: 1.32;
  font-family: serif;
  padding: 8px 12px 12px;
  text-align: left;
}

.card-data-body > *:not(:first-child) {
  margin-top: 6px;
}

.card-data-body :deep(span[class$="-icon"]),
.card-data-body :deep(span[class*=" -icon"]) {
  font-size: 1.25em;
}

.card-data-body .card-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
  font-family: Arial, sans-serif;
  font-size: 0.9em;
  color: #4d3d27;
}

.card-data-body .card-info p {
  margin: 0;
}

.card-data-body .card-keywords {
  margin: 0;
  font-weight: bold;
  color: #1f1810;
}

.card-data-body .card-text {
  border-left: 2px solid var(--border-color);
  color: #1f1810;
}

.card-data-body .card-text p {
  margin: 0 10px;
}

.card-data-body .card-flavor {
  font-size: 0.92em;
  font-style: italic;
  color: #4d3d27;
}

.card-data-body .card-flavor p {
  margin: 0;
}
</style>
