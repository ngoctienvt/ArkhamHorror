#!/usr/bin/env node
/*
 * Writes frontend/homebrew/<campaign>/cards_en.json for every homebrew campaign,
 * shaped like the ArkhamDB records in public/cards/cards_*.json so the same
 * lookups serve both. ArkhamDB has no fan-made cards, so without this file a
 * homebrew card shows its raw code instead of a name.
 *
 * Names come from the engine itself: the backend's `/arkham/homebrew/cards`
 * (fronts only), plus the back sides read off its CardDefs. A campaign that is
 * also published on arkham.build gets its full printed text and flavor from
 * there by opting in with frontend/homebrew/<campaign>/arkham-build.json:
 *   {
 *     "project": "<arkham.build fan-made project id>",
 *     // Optional: which printing letter each back belongs to, for a number the
 *     // engine prints several times (":dark-matter:090aa"/"ba"/"ca"), when the
 *     // backend's card defs do not name those backs themselves.
 *     "variantBacks": { "090": { "Observer Effect": "a" } }
 *   }
 *
 * arkham.build names every card by a UUID; the card's `position` is its printed
 * number, which is what the engine's `:<campaign>:<number>` codes use. Cards the
 * engine defines but arkham.build does not have get a name-only record.
 *
 * The text is rendered with v-html, so markup is reduced to a small allowlist.
 *
 * Usage (needs the backend running, reached through the dev server's proxy):
 *   node scripts/import-arkham-build-homebrew.cjs            # every homebrew campaign
 *   node scripts/import-arkham-build-homebrew.cjs dark-matter
 *   node scripts/import-arkham-build-homebrew.cjs dark-matter --project-file ./project.json
 *   node scripts/import-arkham-build-homebrew.cjs --defs ./homebrew-cards.json   # saved API answer
 */

const fs = require('fs')
const path = require('path')

const FRONTEND = path.resolve(__dirname, '..')
const HOMEBREW = path.join(FRONTEND, 'homebrew')
const BACKEND_HOMEBREW = path.resolve(FRONTEND, '../backend/arkham-api/library/Arkham/Homebrew')
const CONFIG_FILE = 'arkham-build.json'

const projectUrl = (id) => `https://assets.arkham.build/fan_made_content/${id}/project.json`

const TYPE_NAMES = {
  act: 'Act',
  agenda: 'Agenda',
  asset: 'Asset',
  enemy: 'Enemy',
  event: 'Event',
  investigator: 'Investigator',
  location: 'Location',
  scenario: 'Scenario',
  skill: 'Skill',
  story: 'Story',
  treachery: 'Treachery',
}

// CardDefs/<File>.hs -> type_code, for the name-only records.
const DEF_FILE_TYPES = {
  Acts: 'act',
  Agendas: 'agenda',
  Assets: 'asset',
  Enemies: 'enemy',
  Events: 'event',
  Investigators: 'investigator',
  Locations: 'location',
  Skills: 'skill',
  Stories: 'story',
  Treacheries: 'treachery',
}

const ALLOWED_TAGS = new Set(['b', 'i', 'u', 'em', 'strong', 'blockquote', 'hr', 'br'])

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)
const pad3 = (n) => String(n).padStart(3, '0')
const pascalCase = (slug) => slug.split('-').map(capitalize).join('')

// The campaign's display name, for the pack line of engine-only records.
function campaignName(slug) {
  try {
    return JSON.parse(fs.readFileSync(path.join(HOMEBREW, slug, 'campaign.json'), 'utf8')).name ?? slug
  } catch {
    return slug
  }
}

/* Strange Eons inlines its own icons as remote images (location symbols,
 * encounter-set icons). Keep the word the file is named after instead of
 * hotlinking: "…/Images/Triangle.png?cachebust=1" -> "Triangle". */
function imageWord(tag) {
  const src = tag.match(/src\s*=\s*"([^"]*)"/i)?.[1] ?? ''
  const file = src.split('?')[0].split('/').pop() ?? ''
  try {
    return decodeURIComponent(file).replace(/\.[a-z0-9]+$/i, '')
  } catch {
    return file.replace(/\.[a-z0-9]+$/i, '')
  }
}

/** Card text reduced to allowlisted, attribute-free tags. */
function cleanText(text) {
  if (typeof text !== 'string') return undefined
  const out = text
    .replace(/<img\b[^>]*>/gi, (tag) => imageWord(tag))
    .replace(/<\s*(\/?)\s*([a-zA-Z]+)\b[^>]*>/g, (_, close, tag) => {
      const name = tag.toLowerCase()
      return ALLOWED_TAGS.has(name) ? `<${close}${name}>` : ''
    })
    .replace(/[ \t]+\n/g, '\n')
    .trim()
  return out || undefined
}

/** A name with every tag removed ("<family "Chiller"><b>IT</b>" -> "IT"). */
function cleanName(name) {
  if (typeof name !== 'string') return undefined
  const out = name.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return out || undefined
}

const unescapeHs = (s) => s.replace(/\\(.)/g, '$1')

/* The printed names the engine gives each card code, read off the campaign's
 * CardDefs: `ctor ":c:001" "Name"` or `ctor ":c:001" ("Name" <:> "Subname")`,
 * with any line breaks between. */
function parseBackendDefs(files) {
  const defs = new Map()
  const pattern =
    /"(:[a-z0-9-]+:[0-9a-z]+)"\s*\(?\s*"((?:[^"\\]|\\.)*)"(?:\s*<:>\s*"((?:[^"\\]|\\.)*)")?/g
  for (const { name, source } of files) {
    const typeCode = DEF_FILE_TYPES[name] ?? null
    for (const m of source.matchAll(pattern)) {
      if (defs.has(m[1])) continue
      defs.set(m[1], {
        name: unescapeHs(m[2]),
        subname: m[3] === undefined ? undefined : unescapeHs(m[3]),
        type_code: typeCode,
      })
    }
  }
  return defs
}

function readBackendDefs(slug) {
  const dir = path.join(BACKEND_HOMEBREW, pascalCase(slug), 'CardDefs')
  if (!fs.existsSync(dir)) return new Map()
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.hs'))
    .map((f) => ({ name: f.replace(/\.hs$/, ''), source: fs.readFileSync(path.join(dir, f), 'utf8') }))
  return parseBackendDefs(files)
}

const withoutUndefined = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined))

function sideFields(raw) {
  return {
    name: cleanName(raw.name),
    traits: cleanName(raw.traits),
    text: cleanText(raw.text),
    flavor: cleanText(raw.flavor),
  }
}

function toRecord(code, front, back, ctx) {
  const side = sideFields(front)
  const backSide = back ? sideFields(back) : null
  const typeCode = front.type_code
  const factionCode = front.faction_code
  const encounter = typeof front.encounter_code === 'string'
    ? front.encounter_code.replace(`${ctx.projectId}-`, '')
    : undefined

  return withoutUndefined({
    code,
    name: side.name ?? code,
    real_name: side.name ?? code,
    subname: cleanName(front.subname),
    traits: side.traits,
    real_traits: side.traits,
    text: side.text,
    real_text: side.text,
    flavor: side.flavor,
    back_name: backSide?.name,
    back_traits: backSide?.traits,
    back_text: backSide?.text,
    back_flavor: backSide?.flavor,
    type_code: typeCode,
    type_name: TYPE_NAMES[typeCode] ?? capitalize(typeCode),
    subtype_code: front.subtype_code,
    faction_code: factionCode,
    faction_name: capitalize(factionCode) ?? 'Mythos',
    pack_name: ctx.packName,
    encounter_code: encounter,
    is_unique: front.is_unique === true,
    double_sided: !!back,
    xp: front.xp,
    doom: front.doom,
    stage: front.stage,
    shroud: front.shroud,
    clues: front.clues,
    clues_fixed: front.clues_fixed,
    victory: front.victory,
  })
}

/* Which printing letter each arkham.build front takes when one number is printed
 * several times. An explicit `variantBacks` entry wins, then a backend def whose
 * back (`<n><x>b`) carries the same name, then the letters still free, in order. */
function assignVariantLetters(number, fronts, backsByCode, letters, ctx) {
  const explicit = ctx.variantBacks[number] ?? {}
  const free = [...letters]
  const take = (letter) => {
    const i = free.indexOf(letter)
    if (i === -1) return null
    free.splice(i, 1)
    return letter
  }

  const named = fronts.map((front) => {
    const backName = cleanName(backsByCode.get(front.back_link)?.name)
    const byConfig = backName ? explicit[backName] : undefined
    const byDefs = backName
      ? letters.find((l) => ctx.backendDefs.get(`${ctx.prefix}${number}${l}b`)?.name === backName)
      : undefined
    return (byConfig && take(byConfig)) ?? (byDefs && take(byDefs)) ?? null
  })
  return named.map((letter) => letter ?? free.shift() ?? null)
}

const comparable = (name) => (name ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')

/* Either side may carry the name the engine knows the card by, and arkham.build
 * sometimes adds a qualifier ("Unleashed Chaos (Acceleration)"). */
function namesAgree(record, def) {
  const engine = [def.name, def.revealedName].map(comparable).filter(Boolean)
  const ours = [record.name, record.back_name].map(comparable).filter(Boolean)
  return ours.some((n) => engine.some((e) => n === e || n.startsWith(e)))
}

/**
 * The card records for one campaign. `project` is the arkham.build export, or
 * null for a campaign known only from the engine's defs.
 * @param {{ project: any, slug: string, backendDefs: Map<string, any>, variantBacks?: Record<string, Record<string, string>>, onConflict?: (code: string, engineName: string, arkhamBuildName: string) => void }} input
 */
function buildHomebrewCards({ project, slug, backendDefs, variantBacks = {}, onConflict = () => {} }) {
  const data = project?.data ?? project ?? { cards: [] }
  const prefix = `:${slug}:`
  const ctx = {
    prefix,
    backendDefs,
    variantBacks,
    projectId: project?.meta?.code ?? data.packs?.[0]?.code ?? '',
    packName: data.packs?.[0]?.name ?? project?.meta?.name ?? campaignName(slug),
  }

  const backsByCode = new Map()
  const groups = new Map()
  for (const card of data.cards) {
    if (card.code.endsWith('-back')) {
      backsByCode.set(card.code, card)
      continue
    }
    if (typeof card.position !== 'number') continue
    const number = pad3(card.position)
    groups.set(number, [...(groups.get(number) ?? []), card])
  }

  const records = new Map()
  const add = (record) => {
    if (!records.has(record.code)) records.set(record.code, record)
  }

  for (const [number, fronts] of groups) {
    const letterPattern = new RegExp(`^${prefix}${number}([a-z])a$`)
    const letters = [...backendDefs.keys()]
      .map((code) => code.match(letterPattern)?.[1])
      .filter(Boolean)
      .sort()

    // One printing, or duplicate rows of the same printing.
    if (fronts.length === 1 || letters.length === 0) {
      const front = fronts[0]
      add(toRecord(`${prefix}${number}`, front, backsByCode.get(front.back_link), ctx))
      continue
    }

    const assigned = assignVariantLetters(number, fronts, backsByCode, letters, ctx)
    fronts.forEach((front, i) => {
      const letter = assigned[i]
      if (!letter) return
      const back = backsByCode.get(front.back_link)
      add(toRecord(`${prefix}${number}${letter}a`, front, back, ctx))
      if (back) add(toRecord(`${prefix}${number}${letter}b`, back, front, ctx))
    })
  }

  // A position is only a printed number, and arkham.build's numbering can drift
  // from the engine's (a reprint of an official card sitting where the engine
  // has its own). Text filed under the wrong card is worse than none, so a record
  // whose name the engine disagrees with falls back to the engine's.
  for (const [code, record] of records) {
    const def = backendDefs.get(code)
    if (!def?.name || namesAgree(record, def)) continue
    onConflict(code, def.name, record.name)
    records.set(code, defToRecord(code, def, ctx))
  }

  // Engine cards arkham.build does not carry: a name is better than a code. A
  // `b` side is covered by its front's back_* fields when arkham.build gave one.
  for (const [code, def] of backendDefs) {
    if (!code.startsWith(prefix) || records.has(code) || !def.name) continue
    if (code.endsWith('b') && records.get(code.slice(0, -1))?.back_name) continue
    add(defToRecord(code, def, ctx))
  }

  return [...records.values()].sort((a, b) => a.code.localeCompare(b.code))
}

const traitLine = (traits) => (traits?.length ? traits.map((t) => `${t}.`).join(' ') : undefined)

/* A name-only record from the engine's own def. A location is filed revealed
 * side first, ArkhamDB-style, with its unrevealed name as the back. */
function defToRecord(code, def, ctx) {
  const revealed = !!def.revealedName && def.revealedName !== def.name
  const name = revealed ? def.revealedName : def.name
  const traits = traitLine(revealed ? def.revealedTraits : def.traits)
  return withoutUndefined({
    code,
    name,
    real_name: name,
    subname: revealed ? def.revealedSubname : def.subname,
    traits,
    real_traits: traits,
    back_name: revealed ? def.name : undefined,
    back_traits: revealed ? traitLine(def.traits) : undefined,
    type_code: def.type_code ?? undefined,
    type_name: def.type_code ? TYPE_NAMES[def.type_code] : undefined,
    faction_name: 'Mythos',
    pack_name: ctx.packName,
    is_unique: def.unique === true,
    double_sided: def.doubleSided === true,
    stage: def.stage,
    victory: def.victory,
  })
}

const API_TYPES = {
  ActType: 'act',
  AgendaType: 'agenda',
  AssetType: 'asset',
  EncounterAssetType: 'asset',
  EnemyType: 'enemy',
  EventType: 'event',
  InvestigatorType: 'investigator',
  LocationType: 'location',
  PlayerTreacheryType: 'treachery',
  SkillType: 'skill',
  StoryType: 'story',
  TreacheryType: 'treachery',
}

/* The engine's card defs as `/arkham/homebrew/cards` serves them, keyed like the
 * CardDefs parse: `c:dark-matter:027` -> `:dark-matter:027`. */
function apiDefsToBackendDefs(apiCards) {
  const defs = new Map()
  for (const card of apiCards) {
    defs.set(card.cardCode.replace(/^c/, ''), {
      name: card.name?.title,
      subname: card.name?.subtitle ?? undefined,
      revealedName: card.revealedName?.title,
      revealedSubname: card.revealedName?.subtitle ?? undefined,
      traits: card.cardTraits,
      revealedTraits: card.revealedCardTraits,
      type_code: API_TYPES[card.cardType] ?? null,
      unique: card.unique,
      doubleSided: card.doubleSided,
      stage: card.stage ?? undefined,
      victory: card.victoryPoints ?? undefined,
    })
  }
  return defs
}

/* The API is authoritative but lists fronts only (and campaign helpers such as
 * `amaltheaWeaver code "Subtitle"` defeat a source parse); the CardDefs parse
 * only fills in the back sides the API leaves out. */
function mergeBackendDefs(apiDefs, parsedDefs) {
  const merged = new Map(apiDefs)
  for (const [code, def] of parsedDefs) if (!merged.has(code)) merged.set(code, def)
  return merged
}

const DEFAULT_DEFS_URL = 'http://127.0.0.1:8080/api/v1/arkham/homebrew/cards'

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: ${response.status} ${response.statusText}`)
  return response.json()
}

async function loadProject(config, projectFile) {
  if (projectFile) return JSON.parse(fs.readFileSync(projectFile, 'utf8'))
  return fetchJson(projectUrl(config.project))
}

// Every frontend homebrew folder whose campaign the engine defines cards for.
function homebrewCampaigns() {
  return fs
    .readdirSync(HOMEBREW)
    .filter((dir) => fs.existsSync(path.join(BACKEND_HOMEBREW, pascalCase(dir), 'CardDefs')))
}

const flagValue = (argv, flag) => {
  const i = argv.indexOf(flag)
  return i === -1 ? null : argv[i + 1]
}

async function loadApiCards(source) {
  if (!/^https?:/.test(source)) return JSON.parse(fs.readFileSync(source, 'utf8'))
  try {
    return await fetchJson(source)
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e)
    throw new Error(`${reason}\n  Start the backend and dev server, or pass --defs <saved homebrew/cards JSON>.`)
  }
}

async function main(argv) {
  const projectFile = flagValue(argv, '--project-file')
  const defsSource = flagValue(argv, '--defs') ?? DEFAULT_DEFS_URL
  const flagArgs = new Set(['--project-file', '--defs'].flatMap((f) => [f, flagValue(argv, f)]))
  const named = argv.filter((a) => !flagArgs.has(a))
  const campaigns = named.length ? named : homebrewCampaigns()
  if (projectFile && campaigns.length !== 1) {
    throw new Error('--project-file needs exactly one campaign')
  }

  const apiDefs = apiDefsToBackendDefs(await loadApiCards(defsSource))

  for (const slug of campaigns) {
    const configPath = path.join(HOMEBREW, slug, CONFIG_FILE)
    const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {}
    const project = config.project ? await loadProject(config, projectFile) : null
    const prefix = `:${slug}:`
    const campaignApiDefs = new Map([...apiDefs].filter(([code]) => code.startsWith(prefix)))
    const backendDefs = mergeBackendDefs(campaignApiDefs, readBackendDefs(slug))
    const onConflict = (code, engineName, arkhamBuildName) =>
      console.log(`  ${code}: arkham.build has "${arkhamBuildName}", engine has "${engineName}" -- kept the engine's name`)
    const cards = buildHomebrewCards({ project, slug, backendDefs, variantBacks: config.variantBacks, onConflict })

    const out = path.join(HOMEBREW, slug, 'cards_en.json')
    fs.writeFileSync(out, `${JSON.stringify(cards, null, 1)}\n`)
    const source = project ? 'arkham.build text + engine names' : 'engine names only'
    console.log(`${slug}: ${cards.length} cards (${source}) -> ${path.relative(FRONTEND, out)}`)
  }
}

module.exports = {
  buildHomebrewCards,
  parseBackendDefs,
  apiDefsToBackendDefs,
  mergeBackendDefs,
  cleanText,
  cleanName,
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((e) => {
    console.error(e instanceof Error ? e.message : e)
    process.exit(1)
  })
}
