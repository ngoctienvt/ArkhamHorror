import base from '@/locales/vi/base.json'
import log from '@/locales/vi/log.json'
import label from '@/locales/vi/label.json'
import gameBoard from '@/locales/vi/gameBoard/gameBoard'
import theFeastOfHemlockVale from '@/locales/vi/theFeastOfHemlockVale'
import theScarletKeys from '@/locales/vi/theScarletKeys'

// Partial translation: anything missing falls back to English (fallbackLocale in main.ts).
export default {
  ...base,
  ...label,
  label: { ...label },
  ...gameBoard,
  log,
  theFeastOfHemlockVale,
  theScarletKeys
}
