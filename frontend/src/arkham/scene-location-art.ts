import type { Point } from './locationGraph'

type SceneLocation = { id: string; label: string; cardCode: string; revealed: boolean }

const trainFolder = 'img/scenes/the-dunwich-legacy/essex-train'
const trainSlots = /^(?:trainCar([1-6])|engineCar|pos(0[0-6])00)$/

/** Essex layouts use named slots in the original and grid coordinates in Return to. */
export function essexTrainPosition(label: string): Point | undefined {
  const match = trainSlots.exec(label)
  if (!match) return undefined
  const index = match[1] ? 6 - Number(match[1]) : match[2] ? Number(match[2]) : 6
  return [22 + index * 11, 54]
}

export function essexTrainArt({ cardCode, revealed }: SceneLocation): string {
  const code = cardCode.replace(/^c/, '')
  const engine = /^(0217[5-7]|51028)$/.test(code)
  const face = engine ? 'engine' : !revealed ? 'closed'
    : code === '02172' ? 'sleeping'
    : code === '02173' ? 'dining'
    : code === '02174' ? 'parlor'
    : code === '51029' ? 'freight'
    : code === '51030' ? 'baggage' : 'passenger'
  return `${trainFolder}/${face}.webp`
}

export function hiddenChamberPosition([x, y]: Point): Point {
  return [x + (x > 65 ? -11 : 11), y + (y > 75 ? -11 : 11)]
}

/** Locations whose art varies with the card drawn or placed in the game. */
export function hasLocationArt(art: string, { label, cardCode }: SceneLocation): boolean {
  const code = cardCode.replace(/^c/, '')
  switch (art) {
    case 'the-dunwich-legacy/blood-on-the-altar': return code === '02214'
    case 'the-dunwich-legacy/where-doom-awaits': return /^(diverging|altered)Path\d+$/.test(label)
    case 'the-dunwich-legacy/lost-in-time-and-space': return true
    case 'the-forgotten-age/the-untamed-wilds':
    case 'the-forgotten-age/the-doom-of-eztli':
    case 'the-forgotten-age/turn-back-time':
    case 'the-forgotten-age/heart-of-the-elders-part-1':
    case 'the-forgotten-age/heart-of-the-elders-part-2':
    case 'the-forgotten-age/the-depths-of-yoth': return true
    case 'the-forgotten-age/the-boundary-beyond': return /^041(?:7[4-9]|8[0-5])$/.test(code)
    case 'the-circle-undone/the-witching-hour': return !/^05055b?$/.test(code)
    case 'the-circle-undone/the-secret-name':
      return /^(unknownPlaces|strangeGeometry)\d+$/.test(label) || /^5403[0-3]$/.test(code)
    case 'the-circle-undone/union-and-disillusion': return /^unvisitedIsle\d+$/.test(label)
    case 'the-innsmouth-conspiracy/the-lair-of-dagon':
      return /^0710[2-4]b?$/.test(code) || /^:return-to-the-innsmouth-conspiracy:06[5-7]$/.test(code)
    default: return false
  }
}
