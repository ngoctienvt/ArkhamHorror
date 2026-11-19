import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = fileURLToPath(new URL('..', import.meta.url))
const optionalLocales = new Set([
  'ultimatumsAndBoonsZh.test.mjs', 'whisperingChaosTranslations.test.mjs',
  'zhCnAchievements.test.mjs', 'zhCnLocaleLoading.test.mjs', 'zhCnScenarioLocale.test.mjs',
])
const localeChecks = new Set([...optionalLocales, 'localeIconPlaceholders.test.mjs', 'localeMarkup.test.mjs'])
const args = process.argv.slice(2)
if (args.includes('--all') && args.includes('--locales')) {
  console.error('Choose either --all or --locales.')
  process.exit(1)
}
const all = args.includes('--all')
const locales = args.includes('--locales')
const files = readdirSync(new URL('../tests/', import.meta.url)).filter((file) => file.endsWith('.test.mjs'))
  .filter((file) => all || (locales ? localeChecks.has(file) : !optionalLocales.has(file)))
  .sort().map((file) => `tests/${file}`)
console.debug(`[Tests] ${all ? 'all' : locales ? 'locales' : 'core'}: ${files.length} files; locale checks: ${all || locales ? 'all languages' : 'en, vi'}`)
if (args.includes('--list')) {
  console.log(files.join('\n'))
} else {
  const forwarded = args.filter((arg) => !['--all', '--locales', '--list'].includes(arg))
  const result = spawnSync(process.execPath, ['--test', '--test-concurrency=2', ...forwarded, ...files], {
    cwd: root, stdio: 'inherit', shell: false,
    env: { ...process.env, ARKHAM_TEST_ALL_LOCALES: all || locales ? '1' : '0' },
  })
  if (result.error) console.error(result.error.message)
  process.exit(result.status ?? 1)
}
