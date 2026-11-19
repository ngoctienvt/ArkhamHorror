import { onBeforeUnmount, ref, watch, type Ref } from 'vue'
import type { Question } from '@/arkham/types/Question'
import type { Message } from '@/arkham/types/Message'
import { decideAutoAnswer, AUTO_ANSWER_DELAY_MS, type AutoAnswer } from '@/arkham/autoAnswerPolicy'

/* Answers the engine's non-questions (see autoAnswerPolicy) for the seat this
 * client is looking at, so phases run on without a click per step.
 *
 * Safety rails:
 * - only while nothing else is in flight or on screen (`blocked`);
 * - one submit per question: the step counter plus the chosen index must change
 *   before it answers again, so a slow server never gets a double answer;
 * - after an undo it stays out of the way for a moment, otherwise the restored
 *   question would be re-answered at once and undo would look broken. It comes
 *   back by itself (or as soon as the game moves forward): a lone "draw
 *   encounter card" restored in the Mythos phase has nothing else to press it,
 *   and left suspended the phase just sat there until a reload;
 * - a run cap, in case some card ever loops a lone choice forever. */

const MAX_CONSECUTIVE_AUTO_ANSWERS = 60
/* How long the restored state is left alone after an undo: long enough to see
 * it and to press Undo again to go further back, which restarts the wait. */
export const UNDO_RESUME_DELAY_MS = 3000

/* The choice the autopilot is about to take and how long until it does, so the
 * choice list can animate it while the pause runs. Module-level because only
 * one game board (one autopilot) is mounted at a time. */
export const pendingAutoPick = ref<{ index: number; delayMs: number } | null>(null)

export interface AutopilotOptions {
  enabled: Readonly<Ref<boolean>>
  question: Readonly<Ref<Question | null | undefined>>
  choices: Readonly<Ref<readonly Message[]>>
  /* The engine's step counter; it grows with every resolved answer. */
  step: Readonly<Ref<number | undefined>>
  /* True while something must not be answered over: a request in flight, an
   * overlay the player has to see, spectating, another seat's question. */
  blocked: Readonly<Ref<boolean>>
  hasRevealedCards: Readonly<Ref<boolean>>
  isCommitWindow: Readonly<Ref<boolean>>
  submit: (index: number) => void
  onCapReached?: () => void
}

export interface Autopilot {
  suspendUntilGameMoves: () => void
}

export function useAutopilot(options: AutopilotOptions): Autopilot {
  const { enabled, question, choices, step, blocked, hasRevealedCards, submit } = options

  let timer: ReturnType<typeof setTimeout> | null = null
  let lastSubmittedKey: string | null = null
  let consecutive = 0
  const suspendedAtStep = ref<number | null>(null)

  let resumeTimer: ReturnType<typeof setTimeout> | null = null

  function clearTimer() {
    if (timer) clearTimeout(timer)
    timer = null
    pendingAutoPick.value = null
  }

  function clearResumeTimer() {
    if (resumeTimer) clearTimeout(resumeTimer)
    resumeTimer = null
  }

  /* (Re)starts the wait after which the undo suspension lifts by itself. Lifting
   * it while the undo is still in flight is harmless: `blocked` holds until the
   * restored state is on the board. */
  function resumeAfterDelay() {
    clearResumeTimer()
    resumeTimer = setTimeout(() => {
      resumeTimer = null
      suspendedAtStep.value = null
    }, UNDO_RESUME_DELAY_MS)
  }

  function currentDecision(): { answer: AutoAnswer; key: string } | null {
    if (blocked.value || suspendedAtStep.value !== null) return null
    const answer = decideAutoAnswer(question.value, choices.value, {
      hasRevealedCards: hasRevealedCards.value,
      isCommitWindow: options.isCommitWindow.value,
    })
    if (!answer) return null
    // Mandatory activations do not depend on the optional convenience setting.
    if (!enabled.value && answer.reason !== 'rulesDecided' && answer.reason !== 'forcedAbility') return null
    return { answer, key: `${step.value ?? -1}:${answer.index}:${choices.value.length}` }
  }

  function schedule() {
    clearTimer()
    const decision = currentDecision()
    if (!decision) {
      // A question the player has to answer ends a run of automatic answers.
      if (question.value && !blocked.value) consecutive = 0
      return
    }
    if (decision.key === lastSubmittedKey) return
    if (consecutive >= MAX_CONSECUTIVE_AUTO_ANSWERS) {
      options.onCapReached?.()
      return
    }
    const delayMs = AUTO_ANSWER_DELAY_MS[decision.answer.reason]
    pendingAutoPick.value = { index: decision.answer.index, delayMs }
    timer = setTimeout(() => {
      timer = null
      pendingAutoPick.value = null
      // Re-check: the board may have changed during the pause.
      const again = currentDecision()
      if (!again || again.key !== decision.key) return
      lastSubmittedKey = again.key
      consecutive += 1
      console.debug('[Autopilot] Answering question', {
        step: step.value, index: again.answer.index, reason: again.answer.reason,
        choiceTag: choices.value[again.answer.index]?.tag,
      })
      submit(again.answer.index)
    }, delayMs)
  }

  watch([enabled, question, choices, step, blocked, hasRevealedCards, options.isCommitWindow, suspendedAtStep], schedule, {
    immediate: true,
  })

  // Lift the undo suspension once the game has moved past where the undo left it.
  watch(step, (now) => {
    const since = suspendedAtStep.value
    if (since === null || now === undefined) return
    if (since === -1) {
      suspendedAtStep.value = now
      // The wait counts from the moment the restored state can be seen.
      resumeAfterDelay()
      return
    }
    if (now > since) {
      clearResumeTimer()
      suspendedAtStep.value = null
    }
  })

  watch(enabled, (on) => {
    if (on) consecutive = 0
  })

  onBeforeUnmount(() => {
    clearTimer()
    clearResumeTimer()
  })

  return {
    suspendUntilGameMoves() {
      clearTimer()
      lastSubmittedKey = null
      consecutive = 0
      // -1 until the undone state arrives; its step becomes the baseline.
      suspendedAtStep.value = -1
      // Also from here, so a refused undo (the step never changes) cannot leave
      // the autopilot suspended for good.
      resumeAfterDelay()
    },
  }
}
