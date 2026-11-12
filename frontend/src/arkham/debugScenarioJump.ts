/* Debug "jump to scenario" for campaign games.
 *
 * The jump reuses the engine's own end-of-scenario path instead of a new
 * backend endpoint, so it also works against a remote server:
 *
 *   Run [ClearUI, EndOfScenario (Just (ScenarioStep sid))]
 *
 * - `EndOfScenario` clears the queue (dropping the AskMap the raw endpoint
 *   re-queues behind every debug message), runs the usual investigator/game
 *   cleanup, then `NextCampaignStep (Just step)`, which sets the campaign step
 *   to the target, so the campaign continues from the jumped scenario when it
 *   resolves.
 * - `ClearUI` wipes the pending question from state; the queued copy is gone
 *   via clearQueue, but the stored one would otherwise linger for other seats.
 *
 * `ClearQueue` must never go in the same Run: it would wipe the messages that
 * follow it. The jump only makes sense while a scenario is in play (between
 * scenarios nothing handles EndOfScenario) and only in a campaign (a standalone
 * EndOfScenario ends the game). */

export interface ScenarioJumpEntry {
  id: string
  name: string
  campaign?: string
  returnTo?: string
  returnToName?: string
  show?: boolean
  scenarios?: { id: string; name: string }[]
}

export interface CampaignJumpEntry {
  id: string
  returnTo?: { id: string } | null
}

export interface ScenarioJumpTarget {
  /** Scenario code without the engine's `c` prefix, e.g. `01120`. */
  code: string
  name: string
  /** Not offered in the new-game chooser (e.g. a part of a multi-part scenario). */
  hidden: boolean
}

/* The scenarios a campaign can jump to, in campaign order. A Return To campaign
 * (e.g. `50`) has no scenarios of its own in the data: its scenarios are the base
 * campaign's `returnTo` codes. Multi-part entries expand into their parts. */
export function scenarioJumpTargets(
  campaignId: string,
  scenarios: readonly ScenarioJumpEntry[],
  campaigns: readonly CampaignJumpEntry[],
): ScenarioJumpTarget[] {
  const base = campaigns.find((c) => c.returnTo?.id === campaignId)
  const ownerId = base ? base.id : campaignId
  const seen = new Set<string>()
  const targets: ScenarioJumpTarget[] = []

  const add = (code: string, name: string, hidden: boolean) => {
    if (seen.has(code)) return
    seen.add(code)
    targets.push({ code, name, hidden })
  }

  for (const s of scenarios) {
    if (s.campaign !== ownerId) continue
    const hidden = s.show === false
    if (s.scenarios?.length) {
      for (const part of s.scenarios) add(part.id, part.name, hidden)
    } else if (base) {
      add(s.returnTo ?? s.id, s.returnToName ?? s.name, hidden)
    } else {
      add(s.id, s.name, hidden)
    }
  }
  return targets
}

/** The engine's scenario id for a jump target code. */
export function scenarioJumpId(code: string): string {
  return code.startsWith('c') ? code : `c${code}`
}

/** The raw message that ends the current scenario and starts `code` next. */
export function scenarioJumpMessage(code: string) {
  return {
    tag: 'Run',
    contents: [
      { tag: 'ClearUI' },
      { tag: 'EndOfScenario', contents: { tag: 'ScenarioStep', contents: scenarioJumpId(code) } },
    ],
  }
}
