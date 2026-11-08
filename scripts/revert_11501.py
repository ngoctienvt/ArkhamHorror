p = 'frontend/src/arkham/hemlock-overview.ts'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the 11501 special case in hemlockVillagePosition
old_fn = """export function hemlockVillagePosition(code: string, scenario?: string): Point | undefined {
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
}"""

new_fn = """export function hemlockVillagePosition(code: string): Point | undefined {
  return villageAnchors[code.replace(/^c/, '').replace(/[ab]$/, '')]
}"""

old_overview = """export function hemlockOverview(id: string, reference: string, layout?: readonly string[] | null): HemlockOverview | undefined {
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

new_overview = """export function hemlockOverview(id: string, reference: string, layout?: readonly string[] | null): HemlockOverview | undefined {
  const scenario = id.replace(/^c/, '')
  if (scenario === '10501') {"""

for old, new in [(old_fn, new_fn), (old_overview, new_overview)]:
    if old.replace('\n', '\r\n') in c:
        c = c.replace(old.replace('\n', '\r\n'), new.replace('\n', '\r\n'))
    elif old in c:
        c = c.replace(old, new)

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)

print('Reverted 11501 overrides in hemlock-overview.ts')
