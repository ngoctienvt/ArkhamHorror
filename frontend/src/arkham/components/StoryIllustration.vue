<script setup lang="ts">
import { computed, ref } from 'vue'
import { carcosaStoryArtFor } from '@/arkham/carcosaStoryArt'
import { circleUndoneStoryArtFor } from '@/arkham/circleUndoneStoryArt'
import { dunwichStoryArtFor } from '@/arkham/dunwichStoryArt'
import { forgottenAgeStoryArtFor } from '@/arkham/forgottenAgeStoryArt'
import { innsmouthStoryArtFor } from '@/arkham/innsmouthStoryArt'
import { lateCampaignStoryArtFor } from '@/arkham/lateCampaignStoryArt'
import { nightOfTheZealotStoryArtFor } from '@/arkham/nightOfTheZealotStoryArt'
import type { FlavorTextEntry } from '@/arkham/types/FlavorText'
import carcosaPrologueArt from '@/assets/return-to-carcosa-prologue.webp'

const props = defineProps<{
  campaignId: string | undefined
  entries: FlavorTextEntry[]
}>()

const storyArt = import.meta.glob<string>([
  '../../assets/carcosa-story/*.webp',
  '../../assets/circle-undone-story/*.webp',
  '../../assets/dunwich-story/*.webp',
  '../../assets/forgotten-age-story/*.webp',
  '../../assets/innsmouth-story/*.webp',
  '../../assets/edge-of-the-earth-story/*.webp',
  '../../assets/scarlet-keys-story/*.webp',
  '../../assets/hemlock-vale-story/*.webp',
  '../../assets/drowned-city-story/*.webp',
  '../../assets/night-of-the-zealot-story/*.webp',
], {
  eager: true,
  import: 'default',
  query: '?url',
})
const campaignLookup = [
  ['carcosa-story', carcosaStoryArtFor],
  ['dunwich-story', dunwichStoryArtFor],
  ['forgotten-age-story', forgottenAgeStoryArtFor],
  ['circle-undone-story', circleUndoneStoryArtFor],
  ['innsmouth-story', innsmouthStoryArtFor],
  ['night-of-the-zealot-story', nightOfTheZealotStoryArtFor],
] as const

const failedImages = ref(new Set<string>())
const imageUrl = computed(() => {
  const lateArtwork = lateCampaignStoryArtFor(props.campaignId, props.entries)
  if (lateArtwork) {
    const url = storyArt[`../../assets/${lateArtwork}.webp`]
    if (url && !failedImages.value.has(url)) return url
  }

  for (const [directory, findArt] of campaignLookup) {
    const artwork = findArt(props.campaignId, props.entries)
    if (!artwork) continue
    const url = directory === 'carcosa-story' && artwork === 'campaign-prologue'
      ? carcosaPrologueArt
      : storyArt[`../../assets/${directory}/${artwork}.webp`]
    if (url && !failedImages.value.has(url)) return url
  }
})

function hideImage(event: Event) {
  const url = (event.currentTarget as HTMLImageElement).getAttribute('src')
  if (!url) return
  failedImages.value.add(url)
  if (import.meta.env.DEV) {
    console.debug('[StoryIllustration] Could not load story illustration', url)
  }
}
</script>

<template>
  <img
    v-if="imageUrl"
    :key="imageUrl"
    :src="imageUrl"
    class="story-illustration"
    width="1536"
    height="1024"
    alt=""
    @error="hideImage"
  />
</template>

<style scoped>
.story-illustration {
  display: block;
  width: min(100%, 640px);
  height: auto;
  margin: 0 auto 12px;
  border-radius: 8px;
}
</style>
