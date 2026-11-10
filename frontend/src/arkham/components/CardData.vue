<script lang="ts" setup>
export interface Props {
  name?: string | null
  typeName?: string | null
  factionName?: string | null
  factionCode?: string | null
  traits?: string | null
  text?: string | null
  flavor?: string | null
  reversed?: boolean
  upsideDown?: boolean
}

defineProps<Props>()
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
      <div v-if="text" class="card-text">
        <p v-html="text"></p>
      </div>
      <div v-if="flavor" class="card-flavor">
        <p v-html="flavor"></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-data {
  position: relative;
  width: 300px;
  min-height: inherit;
  overflow-y: auto;
  margin-left: 2px;
  border-radius: 12px;
  font-family: Arial, sans-serif;
  white-space: pre-wrap;
  word-wrap: break-word;
  aspect-ratio: var(--card-aspect, 0.705);
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  --panel-color: #808080;
  --border-color: var(--panel-color);
  box-sizing: border-box;
}

.card-data.faction-guardian {
  --panel-color: #1c6e9f;
}
.card-data.faction-seeker {
  --panel-color: #ba6d2a;
}
.card-data.faction-rogue {
  --panel-color: #1e6b24;
}
.card-data.faction-mystic {
  --panel-color: #554c9e;
}
.card-data.faction-survivor {
  --panel-color: #bd2330;
}
.card-data.faction-mythos {
  --panel-color: #dbdbdb;
  --border-color: #0a0a0a;
}

.card-data::-webkit-scrollbar {
  width: 4px;
}
.card-data::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.card-data-header {
  font-size: 1.0em;
  font-family: sans-serif;
  background-color: var(--panel-color);
  color: #0a0a0a;
  padding: 6px 8px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  text-align: left;
}

.card-data-header p {
  margin: 0;
}

.card-data-body {
  font-size: 0.9em;
  font-family: serif;
  flex: 1;
  padding: 8px 10px;
  background-color: #e6e6e6;
  color: #0a0a0a;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  text-align: left;
}

.card-data-body > *:not(:first-child) {
  margin-top: 8px;
}

.card-data-body :deep(span[class$="-icon"]),
.card-data-body :deep(span[class*=" -icon"]) {
  font-size: 1.25em;
}

.card-data-body .card-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.card-data-body .card-info p {
  margin: 0;
}

.card-data-body .card-text {
  border-color: var(--border-color);
  border-left-width: 2px;
  border-left-style: solid;
}

.card-data-body .card-text p {
  margin: 0 8px;
}

.card-data-body .card-flavor {
  font-size: 0.85em;
  font-style: italic;
}

.card-data-body .card-flavor p {
  margin: 0;
}
</style>
