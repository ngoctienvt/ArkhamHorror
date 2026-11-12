<script lang="ts" setup>
import { computed } from 'vue';
import { useDebug } from '@/arkham/debug';
import { Game } from '@/arkham/types/Game';
import { formatContent } from '@/arkham/helpers';
import * as ArkhamGame from '@/arkham/types/Game';
import { ChaosTokenFaceEffect, SkillTest, chaosTokenEffectDetail } from '@/arkham/types/SkillTest';
import { MessageType } from '@/arkham/types/Message';
import { ChaosBag } from '@/arkham/types/ChaosBag';
import Token from '@/arkham/components/Token.vue';
import ChaosBagChoice from '@/arkham/components/ChaosBagChoice.vue';
import SkillTestDraw from '@/arkham/components/debug/SkillTestDraw.vue';
import { chaosTokenEffectKey } from '@/arkham/types/Scenario';
import { useI18n } from 'vue-i18n';
import { chaosTokenImage, compareTokenFaces, numericTokenFaces } from '@/arkham/types/ChaosToken';
import { beginSealDrag, endCardDrag } from '@/arkham/debugCardDrop';
import ChaosDrawAnimation from '@/arkham/components/ChaosDrawAnimation.vue';
import { useChaosDraw } from '@/arkham/composables/useChaosDraw';

const props = defineProps<{
  game: Game
  skillTest: SkillTest | null
  chaosBag: ChaosBag
  playerId: string
}>()

const emit = defineEmits<{
  choose: [value: number]
}>()

const revealedChaosTokens = computed(() => {
  if (props.skillTest) return props.game.skillTestChaosTokens

  if (props.game.focusedChaosTokens.length > 0) {
    const tokens = [...props.game.skillTestChaosTokens, ...props.game.focusedChaosTokens]
    return Array.from(new Set(tokens.map((token) => JSON.stringify(token))))
      .map((token) => JSON.parse(token) as (typeof tokens)[number]);
  }

  return props.game.skillTestChaosTokens;
})

/* While a draw is playing, its tokens stay in the bag as far as the panel is
 * concerned; they land with the usual flip once it ends. */
const chaosDraw = useChaosDraw()
const heldBackTokens = computed(() =>
  props.skillTest ? revealedChaosTokens.value.filter((token) => chaosDraw.isHeldBack(token.id)) : []
)
const shownChaosTokens = computed(() =>
  heldBackTokens.value.length > 0
    ? revealedChaosTokens.value.filter((token) => !chaosDraw.isHeldBack(token.id))
    : revealedChaosTokens.value
)
const bagFaces = computed(() => props.chaosBag.chaosTokens.map((token) => token.face))

const choices = computed(() => ArkhamGame.choices(props.game, props.playerId))
const tokenAction = computed(() => choices.value.findIndex((c) => c.tag === MessageType.START_SKILL_TEST_BUTTON))
const debug = useDebug()
const { t } = useI18n()
// The preview drags real tokens (debug sealing needs an id), so sort the tokens
// themselves and read the faces back off them rather than sorting faces.
const allTokens = computed(() =>
  [...props.chaosBag.chaosTokens].sort((a, b) => compareTokenFaces(a.face, b.face))
)

// What one card does to a face, as one line: "-1 If you fail, discard a card..."
function effectDetail(effect: ChaosTokenFaceEffect) {
  return formatContent(chaosTokenEffectDetail(effect, t))
}

// The scenario's printed effect for a face, plus every card currently acting on it —
// the card effects sit alongside the printed one rather than replacing it. `false`
// disables `v-tooltip` on the faces with nothing to say.
function tokenTooltip(tokenFace: string) {
  const lines: string[] = []
  const scenario = props.game.scenario

  if (scenario) {
    const key = chaosTokenEffectKey(scenario, tokenFace)
    if (key) {
      const text = t(key)
      if (text !== key) lines.push(formatContent(text))
    }
  }

  for (const effect of valuesByFace.value.get(tokenFace)?.effects ?? []) {
    const detail = effectDetail(effect)
    lines.push(effect.name ? `<em>${effect.name}</em>${detail ? `: ${detail}` : ''}` : detail)
  }

  if (lines.length === 0) return false

  return { content: lines.join('<br>'), html: true }
}

// Only supplied while a skill test is running; carries each face's value and card effects.
const breakdown = computed(() => props.game.skillTest?.valueBreakdown ?? null)

// During a skill test the bag is checked from its own window (the Chaos Bag
// button), so the token grid only shows here for debug tools (force draw, sealing).
const showTokenGrid = computed(() => props.skillTest === null || debug.active)

const canForceDraw = computed(() => debug.active && tokenAction.value !== -1)

const forceDraw = (tokenFace: string) =>
  debug.send(props.game.id, {tag: 'ChaosBagMessage', contents: {tag: 'ForceChaosTokenDraw_', contents: tokenFace}})

const valuesByFace = computed(
  () => new Map((breakdown.value?.tokens ?? []).map((e) => [e.face, e]))
)

function faceValueLabel(tokenFace: string) {
  // Faces whose art already states their value get no label beneath them.
  if (numericTokenFaces.includes(tokenFace) || tokenFace === 'AutoFail') return null
  const entry = valuesByFace.value.get(tokenFace)
  if (!entry || entry.value === null) return null
  return entry.value > 0 ? `+${entry.value}` : `${entry.value}`
}

const choose = (idx: number) => emit('choose', idx)
</script>

<template>
  <div class="chaos-bag">
    <div class="chaos-bag-contents">
      <!-- Each token comes out of the bag in turn: it rises, turns face up and settles.
           A token cancelled or returned shrinks away rather than blinking out. -->
      <TransitionGroup name="chaos-reveal">
        <Token
          v-for="(revealedToken, i) in shownChaosTokens"
          :key="revealedToken.id"
          :token="revealedToken"
          :playerId="playerId"
          :game="game"
          :style="{ '--reveal-index': i }"
          @choose="choose"
        />
      </TransitionGroup>
      <ChaosDrawAnimation
        v-if="chaosDraw.draw.value && heldBackTokens.length > 0"
        :drawStyle="chaosDraw.draw.value.style"
        :faces="heldBackTokens.map((token) => token.face)"
        :bagFaces="bagFaces"
        :run="chaosDraw.draw.value.run"
        @skip="chaosDraw.finish"
      />
      <button
        v-if="tokenAction !== -1 && !chaosDraw.isDrawing.value"
        type="button"
        class="draw-button"
        @click="choose(tokenAction)"
      >{{ $t('skillTest.confirm') }}</button>
      <ChaosBagChoice v-if="chaosBag.choice && 'step' in chaosBag.choice && !game.skillTestResults && !chaosDraw.isDrawing.value" :choice="chaosBag.choice.step" :game="game" :playerId="playerId" @choose="choose" />
    </div>

    <div v-if="showTokenGrid" class="token-preview" :class="{ 'token-preview--debug': canForceDraw }">
      <div
        v-for="(token, idx) in allTokens"
        :key="`${token.face}${idx}`"
        class="token-slot"
        v-tooltip="tokenTooltip(token.face)"
        :draggable="debug.active"
        @click="canForceDraw && forceDraw(token.face)"
        @dragstart="beginSealDrag(token)"
        @dragend="endCardDrag"
      >
        <span v-if="faceValueLabel(token.face)" class="count-pill token-slot__value">{{ faceValueLabel(token.face) }}</span>
        <img
          class="token"
          :class="{'token-big': skillTest === null}"
          :src="chaosTokenImage(token.face)"
        />
      </div>
    </div>

    <div v-if="debug.active && skillTest" class="bag-toolbar">
      <SkillTestDraw :gameId="game.id" :skillTest="skillTest" :chaosBag="chaosBag" />
    </div>
  </div>
</template>

<style scoped>
.draw-button {
  width: 100%;
  min-height: 44px;
  margin-bottom: 10px;
  border: 0;
  text-transform: uppercase;
  background-color: var(--button-2);
  color: #EEE;
  cursor: pointer;
  transition: filter 0.2s ease-in;
  &:hover { filter: brightness(1.15); }
}



.chaos-reveal-enter-active {
  animation: chaos-token-reveal var(--motion-travel) var(--ease-land) both;
  animation-delay: calc(var(--reveal-index, 0) * 120ms * var(--motion-scale));
}
.chaos-reveal-leave-active {
  animation: chaos-token-return var(--motion-base) var(--ease-in-out) both;
}
.chaos-reveal-move {
  transition: transform var(--motion-base) var(--ease-out);
}

@keyframes chaos-token-reveal {
  0% { opacity: 0; transform: translateY(36px) scale(0.55) rotateY(180deg); }
  55% { opacity: 1; transform: translateY(-10px) scale(1.12) rotateY(0deg); }
  100% { opacity: 1; transform: none; }
}
@keyframes chaos-token-return {
  to { opacity: 0; transform: translateY(24px) scale(0.6); }
}

@media (prefers-reduced-motion: reduce) {
  .chaos-reveal-enter-active { animation-name: chaos-token-fade; animation-delay: 0s; }
  .chaos-reveal-leave-active { animation-name: chaos-token-fade; animation-direction: reverse; }
  .chaos-reveal-move { transition: none; }
}
@keyframes chaos-token-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.token {
  width: min(100px, 20vw);
  height: auto;
  margin-bottom: 10px;
}

.portrait {
  width: var(--card-width);
  height: auto;
}

.chaos-bag-contents {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
   @media (max-width: 800px) and (orientation: portrait) {
    position:absolute;
    width: 100%;
    left: 0;
   }
}

.token-preview {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  /* slots with a pill are taller; align on the token edge, not the slot top */
  align-items: flex-end;
  @media (max-width: 800px) and (orientation: portrait) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 3fr 1fr 1fr 1fr;
    .token-slot {
      margin: 0 auto;
    }
    .token-slot:nth-child(6n+1) {
      grid-column: 1;
    }

    .token-slot:nth-child(6n+2) {
      grid-column: 2;
    }

    .token-slot:nth-child(6n+3) {
      grid-column: 3;
    }

    .token-slot:nth-child(6n+4) {
      grid-column: 5;
    }

    .token-slot:nth-child(6n+5) {
      grid-column: 6;
    }

    .token-slot:nth-child(6n) {
      grid-column: 7;
    }
  }
  
  img {
    width: 30px;
    height: auto;
    transition: transform 0.2s;
    &:hover {
      transform: scale(1.2);
    }
    &.token-big {
      width: 50px;
      border-radius: 50px;
    }
    border: 1px solid rgba(255,255,255,0.4);
    border-radius: 30px;
    box-shadow: 0 4px 4px rgba(0,0,0,0.5);
  }
}

.chaos-bag {
  padding: 10px;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bag-toolbar {
  display: flex;
  align-items: center;
  margin: -6px -10px -10px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.35);
}

























.token-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  /* with the row bottom-aligned, this is what lifts the token off the baseline */
  img {
    margin-bottom: 9px;
  }
}

/* the shared pill, scaled down and dialled back so it reads as an annotation */
.token-slot__value {
  min-width: 0;
  /* symmetric vertical padding on a 1.0 line box centres the glyphs */
  padding: 2px 5px;
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.3);
  box-shadow: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 8px;
  font-weight: 400;
  line-height: 1;
}

/* Debug: the slots are draggable onto a card to seal the token there. */
.token-slot[draggable='true'] {
  cursor: grab;
}

.token-preview--debug .token-slot {
  cursor: pointer;
  img {
    border-color: var(--select);
  }
}

</style>

<style>
.v-popper--theme-chaos-bag-stats-popover .v-popper__inner {
  background: rgba(15, 15, 20, 0.94);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #fff;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}

.v-popper--theme-chaos-bag-stats-popover .v-popper__arrow-outer {
  border-color: rgba(255, 255, 255, 0.12);
}

.v-popper--theme-chaos-bag-stats-popover .v-popper__arrow-inner {
  border-color: rgba(15, 15, 20, 0.94);
}
</style>
