import type { Point } from './locationGraph'

type SceneLocation = { id: string; cardCode: string; revealed: boolean; enemyLocation?: boolean }
type Scene = { hiddenArt: string; landmarks: Record<string, readonly Point[]> }

const scenes: Record<string, Scene> = {
  '11517': {
    hiddenArt: 'the-drowned-city/western-wall',
    landmarks: {
      '11521': [[52, 63], [57, 69]], '11522': [[26, 46], [33, 50]],
      '11523': [[74, 40]], '11524': [[68, 54]], '11525': [[65, 73]],
      '11526': [[49, 78]], '11527': [[15, 82]], '11528': [[87, 76]],
      '11529': [[51, 91]], '11530': [[49, 16]], '11532': [[84, 88]],
    },
  },
  '11536': {
    hiddenArt: 'the-drowned-city/drowned-quarter',
    landmarks: {
      '11540': [[50, 50]], '11541': [[10, 29], [21, 30], [32, 30]],
      '11542': [[55, 21]], '11543': [[84, 81]], '11544': [[17, 50]],
      '11545': [[85, 48]], '11546': [[88, 22]], '11547': [[50, 83]],
      '11548': [[17, 81]],
    },
  },
  '11587': {
    hiddenArt: 'the-drowned-city/grand-vault',
    landmarks: {
      '11593': [[15, 53]], '11594': [[39, 51]], '11595': [[56, 51]],
      '11596': [[29, 84], [80, 85]], '11598': [[76, 49]], '11599': [[71, 58]],
      '11600': [[30, 23]], '11601': [[53, 23]], '11602': [[79, 24]],
      '11603': [[53, 78]], '11604': [[92, 53]],
    },
  },
  '12168': {
    hiddenArt: 'brethren-of-ash/queen-of-ash',
    landmarks: {
      '12174': [[50, 32]], '12175': [[50, 14]], '12182': [[50, 82]],
      '12183': [[13, 55]], '12184': [[33, 57]], '12185': [[52, 60]],
      '12186': [[71, 57]], '12187': [[88, 61]],
    },
  },
  '10523': {
    hiddenArt: 'hemlock-vale/hemlock-house',
    landmarks: {
      '10532': [[22, 26]], '10533': [[40, 26]], '10534': [[59, 26]], '10535': [[78, 26]],
      '10536': [[17, 45]], '10537': [[33, 45]], '10538': [[48, 45]],
      '10539': [[65, 45]], '10540': [[82, 45]], '10541': [[23, 68]],
      '10542': [[78, 68]], '10543': [[50, 68]], '10547': [[50, 90]],
    },
  },
  ':ages-unwound:062': {
    hiddenArt: 'ages-unwound/unstuck',
    landmarks: {
      '069': [[15, 55]], '071': [[73, 25]], '073': [[56, 84]], '075': [[30, 80]],
      '077': [[82, 78]], '079': [[88, 45]], '081': [[47, 20]], '083': [[23, 26]],
      '085': [[44, 51]], '086': [[61, 54]],
    },
  },
  ':dark-matter:054': {
    hiddenArt: 'dark-matter/electric-nightmare',
    landmarks: {
      '069': [[53, 20]], '070': [[25, 32]], '071': [[48, 51]], '072': [[77, 31]],
      '073': [[75, 67]], '074': [[24, 65]], '075': [[49, 79]],
    },
  },
}

export function hiddenSceneArt(scenarioId: string): string | undefined {
  const art = scenes[scenarioId.replace(/^c/, '')]?.hiddenArt
  return art && `img/scenes/${art}/back.webp`
}

export function showsSceneLandmark(location: SceneLocation): boolean {
  return location.revealed || Boolean(location.enemyLocation)
}

export function revealedScenePositions(
  scenarioId: string, locations: readonly SceneLocation[], grid: Record<string, Point>,
): Record<string, Point> | undefined {
  const scenario = scenarioId.replace(/^c/, '')
  const landmarks = scenes[scenario]?.landmarks
  if (!landmarks) return undefined

  const positions = { ...grid }
  const claimed = new Set<Point>()
  // Sort only by instance ID so two revealed copies retain distinct points when the game moves their cards.
  for (const location of [...locations].sort((a, b) => a.id.localeCompare(b.id))) {
    if (!showsSceneLandmark(location) || !grid[location.id]) continue
    let code = location.cardCode.replace(/^c/, '').split(':').at(-1)!.replace(/b$/, '')
    if (scenario === ':ages-unwound:062' && Number(code) >= 69 && Number(code) <= 84 && Number(code) % 2 === 0) {
      code = String(Number(code) - 1).padStart(3, '0')
    }
    const landmark = landmarks[code]?.find((point) => !claimed.has(point))
    if (landmark) {
      claimed.add(landmark)
      positions[location.id] = landmark
    }
  }
  // Use the shuffled card board to assign provisional slots without looking at hidden card codes.
  const hidden = locations.filter((l) => !showsSceneLandmark(l) && grid[l.id])
    .sort((a, b) => grid[a.id][1] - grid[b.id][1] || grid[a.id][0] - grid[b.id][0] || a.id.localeCompare(b.id))
  const available = Object.values(landmarks).flat()
  for (const { id } of hidden) {
    const [x, y] = grid[id]
    const distance = ([a, b]: Point) => (a - x) ** 2 + (b - y) ** 2
    const point = available.filter((p) => !claimed.has(p)).sort((a, b) => distance(a) - distance(b))[0]
    if (point) {
      claimed.add(point)
      positions[id] = point
    }
  }
  return positions
}
