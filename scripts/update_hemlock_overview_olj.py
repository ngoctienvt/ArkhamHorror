p = 'frontend/src/arkham/hemlock-overview.ts'
with open(p, 'r', encoding='utf-8') as f:
    content = f.read()

target = """export function hemlockVillagePosition(code: string): Point | undefined {
  return villageAnchors[code.replace(/^c/, '').replace(/[ab]$/, '')]
}

const houseRows: Record<string, number> = {
  '03': 13, '02': 31, '01': 50, '00': 75, n01: 92,
}

export function hemlockHousePosition(label: string): Point | undefined {
  const cell = /^pos(n01|00|01)(n01|00|01|02|03)$/.exec(label)
  if (!cell) return undefined
  const [, column, row] = cell
  if ((row === '03' || row === 'n01') && column !== '00') return undefined
  return [column === 'n01' ? 18 : column === '01' ? 82 : 50, houseRows[row]]
}

export type HemlockOverview = {
  image: string
  fixedPassages: boolean
  village?: boolean
  house?: boolean
}

export function hemlockOverview(id: string, reference: string, layout?: readonly string[] | null): HemlockOverview | undefined {
  const scenario = id.replace(/^c/, '')
  if (scenario === '10501') {"""

replacement = """export function hemlockVillagePosition(code: string, scenario?: string): Point | undefined {
  const cleanCode = code.replace(/^c/, '').replace(/[ab]$/, '')
  const scenarioKey = scenario?.replace(/^c/, '')
  if (scenarioKey === '11501') {
    const oneLastJobAnchors: Record<string, Point> = {
      '01134': [11.5, 33], // Northside
      '01130': [34.5, 33], // Downtown (First Bank)
      '01132': [57.5, 33], // Easttown
      '01125': [11.5, 50], // Rivertown (Docks on left)
      '01129': [34.5, 50], // Miskatonic University (Cathedral in center)
      '11509': [57.5, 50], // Tillinghast Esoterica (Green glowing shop)
      '11504': [25, 75],   // Hibb's Roadhouse
      '11505': [50, 75],   // La Bella Luna
    }
    if (cleanCode in oneLastJobAnchors) return oneLastJobAnchors[cleanCode]
  }
  return villageAnchors[cleanCode]
}

const houseRows: Record<string, number> = {
  '03': 13, '02': 31, '01': 50, '00': 75, n01: 92,
}

export function hemlockHousePosition(label: string): Point | undefined {
  const cell = /^pos(n01|00|01)(n01|00|01|02|03)$/.exec(label)
  if (!cell) return undefined
  const [, column, row] = cell
  if ((row === '03' || row === 'n01') && column !== '00') return undefined
  return [column === 'n01' ? 18 : column === '01' ? 82 : 50, houseRows[row]]
}

export type HemlockOverview = {
  image: string
  fixedPassages: boolean
  village?: boolean
  house?: boolean
  anchors?: Record<string, Point>
}

export function hemlockOverview(id: string, reference: string, layout?: readonly string[] | null): HemlockOverview | undefined {
  const scenario = id.replace(/^c/, '')
  if (scenario === '11501') {
    return {
      image: 'img/scenes/the-drowned-city/one-last-job.webp',
      fixedPassages: false,
      village: true,
      anchors: {
        '01134': [11.5, 33], // Northside
        '01130': [34.5, 33], // Downtown (First Bank)
        '01132': [57.5, 33], // Easttown
        '01125': [11.5, 50], // Rivertown (Docks on left)
        '01129': [34.5, 50], // Miskatonic University (Cathedral in center)
        '11509': [57.5, 50], // Tillinghast Esoterica (Green glowing shop)
        '11504': [25, 75],   // Hibb's Roadhouse
        '11505': [50, 75],   // La Bella Luna
      },
    }
  }
  if (scenario === '10501') {"""

if target.replace('\n', '\r\n') in content:
    content = content.replace(target.replace('\n', '\r\n'), replacement.replace('\n', '\r\n'))
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated hemlock-overview.ts with custom One Last Job anchors!')
elif target in content:
    content = content.replace(target, replacement)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated hemlock-overview.ts with custom One Last Job anchors!')
else:
    print('Target not found.')
