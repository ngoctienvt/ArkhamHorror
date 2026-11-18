import type { SceneSnapshot, StageBoard } from './scene-stage-types'

/** Challenges reuse the physical place, while keeping their own advancement rules. */
const sharedReferences: Readonly<Record<string, string>> = {
  ':dark-matter:190': '03043', // The Machine in Yellow uses the same Ward Theatre rooms.
  '90004': '02041', // Read or Die: Miskatonic campus
  '90011': '02062', // All or Nothing: Clover Club
  '90020': '04113', // Bad Blood: Arkham with Diner, Shoppe and Town Hall
  '90032': '01120', // By the Book: Arkham districts
  '90041': '07056', // Red Tide Rising: Innsmouth
  '90054': '05161', // Laid to Rest: Hangman's Hill
  '90065': '04054', // Relics of the Past: Eztli ruins
  '90094': '03043', // Enthralling Encore: Ward Theatre
}

export function sceneSharedReference(id: string): string | undefined {
  return sharedReferences[id.replace(/^c/, '')]
}

export function sharedReferenceStage(base: StageBoard | undefined, state: SceneSnapshot): StageBoard | undefined {
  if (!base || state.id.replace(/^c/, '') !== '90065') return base
  return { ...base, anchors: { ...base.anchors,
    '90070': [82, 82], '90071': [50, 84], '90072': [20, 52],
  } }
}
