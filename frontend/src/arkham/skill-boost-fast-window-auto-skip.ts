/* The fast window before committing (between ST.1 and ST.2) is skipped for a
 * player when all they could do there is pump a skill ("+X for this skill test":
 * Physical Training, Higher Education...). Those pay off the same, or better,
 * in the window after committing, which still stops as usual.
 *
 * Import-free on purpose so the node tests can load it directly; the message tags
 * below are the wire values of MessageType.SKIP_TRIGGERS_BUTTON / ABILITY_LABEL. */

type ChoiceLike = { tag: string; ability?: { wantsSkillTest?: unknown } }

/** True when the engine tags the ability as wanting a test of a given skill, i.e. a skill boost. */
export function isSkillBoostAbility(ability: { wantsSkillTest?: unknown } | undefined): boolean {
  return JSON.stringify(ability?.wantsSkillTest ?? null).includes('"SkillTestWants"')
}

/** The skip button's index when the pre-commit window offers only skill boosts, else -1. */
export function boostOnlyFastWindowSkip(step: string | undefined, choices: readonly ChoiceLike[]): number {
  if (step !== 'SkillTestFastWindow1') return -1
  const skip = choices.findIndex((c) => c.tag === 'SkipTriggersButton')
  if (skip === -1) return -1
  const others = choices.filter((_, i) => i !== skip)
  const onlyBoosts = others.length > 0
    && others.every((c) => c.tag === 'AbilityLabel' && isSkillBoostAbility(c.ability))
  return onlyBoosts ? skip : -1
}
