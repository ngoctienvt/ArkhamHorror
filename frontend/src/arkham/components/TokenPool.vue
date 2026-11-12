<script lang="ts" setup>
import { computed } from 'vue'
import PoolItem from '@/arkham/components/PoolItem.vue'
import { customTokenSlug, type Token, type Tokens } from '@/arkham/types/Token'
import { customSetToken } from '@/arkham/customCards'
import { useDebug } from '@/arkham/debug'
import { draggedOff, removeDragAttrs, type RemoveTarget } from '@/arkham/debugCardDrop'

export type TokenPoolItem = {
  key: string
  type: string
  amount?: number
  tooltip?: string
  /* An image to draw instead of the one `type` names. Only a custom card set's
   * own token has one: the engine knows it by a slug and the art came with the
   * set, so there is no `type` to resolve it from. */
  image?: string
  class?: unknown
  force?: boolean
  /* The backend `Token` tag to remove when this item is dragged to the debug trash.
   * Only needed for `extraItems`, whose keys are display names; a token's own key
   * already is its tag. */
  removeToken?: string
}

export type TokenPoolOverride = {
  type?: string
  tooltip?: string
  class?: unknown
  force?: boolean
}

const TOKEN_CONFIG: Partial<Record<Token, { type: string; tooltip?: string }>> = {
  AlarmLevel: { type: 'doom', tooltip: 'Alarm Level' },
  Clue: { type: 'clue' },
  Damage: { type: 'health' },
  Doom: { type: 'doom' },
  Horror: { type: 'horror' },
  Resource: { type: 'resource' },
  Pillar: { type: 'resource' },
  Kindling: { type: 'resource' },
  Leyline: { type: 'resource', tooltip: 'Leyline' },
  Shard: { type: 'resource', tooltip: 'Shard' },
  ScoutingReport: { type: 'resource', tooltip: 'Scouting Report' },
  Scrap: { type: 'resource', tooltip: 'Scrap' },
  Depletion: { type: 'resource', tooltip: 'Scouting Report' },
  Antiquity: { type: 'resource', tooltip: 'Antiquity' },
  Civilian: { type: 'resource', tooltip: 'Civilian' },
  Study: { type: 'resource', tooltip: 'Civilian' },
  Target: { type: 'resource', tooltip: 'Target' },
  Time: { type: 'resource', tooltip: 'Time' },
  Newspaper: { type: 'resource', tooltip: 'Newspaper' },
  Shipment: { type: 'resource', tooltip: 'Shipment' },
  Seed: { type: 'resource', tooltip: 'Seed' },
  TimeCapsule: { type: 'resource', tooltip: 'Time Capsule' },
  Seal: { type: 'resource', tooltip: 'Seal' },
  Depth: { type: 'resource' },
  LostSoul: { type: 'resource' },
  Overgrowth: { type: 'resource' },
  Bounty: { type: 'resource' },
  Evidence: { type: 'resource', tooltip: 'Evidence' },
  Warning: { type: 'resource', tooltip: 'Warning' },
  Memory: { type: 'resource', tooltip: 'Memory' },
  Mutation: { type: 'resource', tooltip: 'Mutation' },
  Brilliance: { type: 'resource', tooltip: 'Brilliance' },
  Charge: { type: 'resource' },
  Obligation: { type: 'resource', tooltip: 'Obligation' },
  Discovery: { type: 'resource', tooltip: 'Discovery' },
  Dose: { type: 'resource', tooltip: 'Dose' },
  Chance: { type: 'resource', tooltip: 'Chance' },
  Obsession: { type: 'resource', tooltip: 'Obsession' },
  Offering: { type: 'resource', tooltip: 'Offering' },
  Sign: { type: 'resource', tooltip: 'Sign' },
  Snare: { type: 'resource', tooltip: 'Snare' },
}

const props = withDefaults(defineProps<{
  tokens?: Tokens
  order?: readonly Token[]
  /* Set to make this pool's tokens draggable onto the debug trash can. */
  target?: RemoveTarget
  overrides?: Partial<Record<Token, TokenPoolOverride>>
  extraItems?: readonly TokenPoolItem[]
}>(), {
  tokens: () => ({}),
  overrides: () => ({}),
  extraItems: () => [],
})

const emit = defineEmits<{ choose: [key: string] }>()

const debug = useDebug()

/* Debug-only: drag a token off the card and onto the token panel's trash to remove it. */
function removeAttrs(item: TokenPoolItem & { count: number }) {
  if (!debug.active || !props.target || item.count <= 0) return {}
  return removeDragAttrs(props.target, item.removeToken ?? item.key, item.count)
}

const tokenKeys = computed<Token[]>(() => {
  if (props.order) return [...props.order]

  const keys = Object.keys(props.tokens) as Token[]
  for (const key of Object.keys(props.overrides) as Token[]) {
    if (!keys.includes(key)) keys.push(key)
  }
  return keys
})

/* A token a custom card set brought with it. The engine only knows its slug, so
 * its name and its art are read back off the set, which stamped both onto every
 * card in it. A token whose set is not registered still counts -- it is drawn as
 * a plain marker labelled with its slug rather than disappearing. */
type ResolvedTokenConfig = { type: string; tooltip?: string; image?: string }

function customConfig(token: Token): ResolvedTokenConfig | null {
  const slug = customTokenSlug(token)
  if (!slug) return null
  const declared = customSetToken(slug)
  return {
    type: 'resource',
    tooltip: declared?.name || slug,
    image: declared?.image ?? undefined,
  }
}

const tokenItems = computed<TokenPoolItem[]>(() => tokenKeys.value.flatMap((token) => {
  const amount = props.tokens[token] ?? 0
  const config: ResolvedTokenConfig =
    TOKEN_CONFIG[token] ?? customConfig(token) ?? { type: 'resource', tooltip: token }
  const override = props.overrides[token] ?? {}
  const force = override.force ?? false
  if (!force && amount <= 0) return []

  return [{
    key: token,
    type: override.type ?? config.type,
    tooltip: override.tooltip ?? config.tooltip,
    image: config.image,
    class: override.class,
    amount,
    force,
  }]
}))

/* A token being dragged off the card has already left it as far as the pool is
 * concerned: the count shows one fewer (or the whole stack fewer while shift is held)
 * and the item drops out entirely once none are left. `count` keeps what is really
 * there, which is what shift takes. */
type DisplayItem = TokenPoolItem & { count: number; hidden?: boolean }

const items = computed<DisplayItem[]>(() =>
  [...props.extraItems, ...tokenItems.value].flatMap((item) => {
    const count = item.amount ?? 0
    const inFlight = draggedOff(props.target, item.removeToken ?? item.key, count)
    const amount = Math.max(0, count - inFlight)
    if (!item.force && amount <= 0) {
      if (inFlight <= 0) return []
      /* Dragging the last one away empties the pool, but the element has to stay
       * mounted until the drag is over: `dragend` on a detached node never reaches
       * the window listener that clears the drag. Hide it instead. */
      return [{ ...item, amount, count, hidden: true }]
    }
    return [{ ...item, amount, count }]
  })
)

const itemStyle = (item: DisplayItem) => item.hidden ? { display: 'none' } : undefined

/* Damage and horror are read together, so they share one row at the front of the
 * pool instead of being split by the parent's wrap; every other token follows. */
const WOUND_TYPES = new Set(['health', 'damage', 'sanity', 'horror'])
const wounds = computed(() => items.value.filter((item) => WOUND_TYPES.has(item.type)))
const others = computed(() => items.value.filter((item) => !WOUND_TYPES.has(item.type)))
</script>

<template>
  <!-- Every token lies on the card itself, in the parent .pool's flex layout, with
       its count in its corner: no clumped stack or hover fan to open. -->
  <div class="token-pool">
    <div v-if="wounds.length" class="token-pool__wounds">
      <PoolItem
        v-for="item in wounds"
        :key="item.key"
        :type="item.type"
        :amount="item.amount"
        :tooltip="item.tooltip"
        :image="item.image"
        :class="item.class"
        :style="itemStyle(item)"
        v-bind="removeAttrs(item)"
        @choose="emit('choose', item.key)"
      />
    </div>
    <PoolItem
      v-for="item in others"
      :key="item.key"
      :type="item.type"
      :amount="item.amount"
      :tooltip="item.tooltip"
      :image="item.image"
      :class="item.class"
      :style="itemStyle(item)"
      v-bind="removeAttrs(item)"
      @choose="emit('choose', item.key)"
    />
  </div>
</template>

<style scoped>
.token-pool {
  display: contents;
}

.token-pool__wounds {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 2px;
}
</style>
