<script lang="ts" setup>
import { computed } from 'vue'
import { imgsrc } from '@/arkham/helpers'

export interface Props {
  type: string
  /* A string for a count shown against its maximum, e.g. clues left "0/1". */
  amount?: number | string
  tooltip?: string
  image?: string
}
const props = defineProps<Props>()

const emit = defineEmits<{ choose: [] }>()

const tokenImages: Record<string, string> = {
  clue: 'tokens/clue.png',
  doom: 'tokens/doom.png',
  resource: 'tokens/resource.png',
  sanity: 'horror.png',
  card: 'backs/back_encounter.jpg',
  player_card: 'backs/back_player.jpg',
  artifact_card: 'backs/back_artifact.jpg',
}

const image = computed(() => {
  return props.image ?? imgsrc(tokenImages[props.type] ?? `${props.type}.png`)
})
</script>

<template>
  <div class="poolItem" :class="`poolItem-${type}`" @click="emit('choose')" v-tooltip="tooltip">
    <img :src="image" />
    <span v-if="amount !== null && amount !== undefined">{{amount}}</span>
  </div>
</template>

<style scoped>

.poolItem {
  --width: var(--pool-token-width);
  pointer-events: inherit;
}

.poolItem.poolItem-resource {
  height: fit-content;
  align-self: center;
  img { 
    width: var(--width);
  }
  padding: 2px;
}

.poolItem.poolItem-clue {
  img {
    width: var(--width);
  }
}

/* The count sits in the token's lower-right corner, small and hanging slightly
   off its edge, so it does not cover the emblem (the emblems are light: cream
   clue, salmon heart, pale brain, so big centred digits blended into them). A
   heavy dark outline keeps the digits readable over the token or the card art. */
.poolItem {
  width: var(--width);
  display: grid;
  color: black;
  font-weight: 900;
  font-size: 1.7em;
  & > * {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
  }
  /* A thin light rim traced around the token's silhouette, then a dark shadow,
     so a token never sinks into the card art beneath it. Interactive states
     (can-take, can-interact) replace this with their own magenta outline. */
  img {
    width: 100%;
    filter:
      drop-shadow(1px 0 0 #f4ead0) drop-shadow(-1px 0 0 #f4ead0)
      drop-shadow(0 1px 0 #f4ead0) drop-shadow(0 -1px 0 #f4ead0)
      drop-shadow(1px 2px 2px rgb(0, 0, 0, 0.9));
  }

  span {
    justify-self: end;
    align-self: end;
    translate: 18% 12%;
    position: relative;
    z-index: 1;
    color: #fff;
    font: 800 0.5em/1 system-ui, "Segoe UI", sans-serif;
    font-variant-numeric: tabular-nums;
    text-shadow:
      1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000,
      1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
      0 0 4px #000;
    pointer-events: none;
  }
}

.clue--can-take, .clue--can-spend {
  pointer-events: auto;
  padding: 0px;
  cursor: pointer;
  border: 2px solid var(--select);
  width: fit-content;
  height: fit-content;
  border-radius: 100vw;
  img { filter: unset; flex: 1; width: 100%; height: auto;}
}

.resource--can-take, .resource--can-spend {
  pointer-events: auto;
  cursor: pointer;
  /* Outline the resource coin's silhouette (available action = magenta) rather
     than filling the hexagon; matches the health/sanity treatment. */
  clip-path: none;
  background-color: transparent;
  img {
    filter:
      drop-shadow(1px 0 0 var(--select))
      drop-shadow(-1px 0 0 var(--select))
      drop-shadow(0 1px 0 var(--select))
      drop-shadow(0 -1px 0 var(--select));
  }
}

.health--can-interact, .sanity--can-interact {
  pointer-events: auto;
  cursor: pointer;
  position: relative;
  z-index: 3;
  > span {
    padding: 0px;
    cursor: pointer;
  }
  /* Outline the token's PNG silhouette (available action = magenta) instead of
     drawing a circular ring around the count. */
  img {
    filter:
      drop-shadow(1px 0 0 var(--select))
      drop-shadow(-1px 0 0 var(--select))
      drop-shadow(0 1px 0 var(--select))
      drop-shadow(0 -1px 0 var(--select));
    animation: token-attention-pulse 0.9s ease-in-out infinite alternate;
  }
}

/* Pending damage/horror assignments block the turn, so their tokens tick
   between the base outline and a brighter, slightly enlarged glow. */
@keyframes token-attention-pulse {
  from {
    filter:
      drop-shadow(2px 0 0 var(--select))
      drop-shadow(-2px 0 0 var(--select))
      drop-shadow(0 2px 0 var(--select))
      drop-shadow(0 -2px 0 var(--select))
      drop-shadow(0 0 4px var(--select));
    transform: scale(1);
  }
  to {
    filter:
      drop-shadow(2px 0 0 #fff)
      drop-shadow(-2px 0 0 #fff)
      drop-shadow(0 2px 0 #fff)
      drop-shadow(0 -2px 0 #fff)
      drop-shadow(0 0 12px var(--select))
      drop-shadow(0 0 20px var(--select))
      brightness(1.4);
    transform: scale(1.3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .health--can-interact img, .sanity--can-interact img {
    animation: none;
  }
}
</style>
