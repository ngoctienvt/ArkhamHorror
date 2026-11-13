type Translate = (key: string, values?: Record<string, unknown>) => string

/** Text for one of a location's `extras` (see locationInfoModel): `key:YellowKey` → "Yellow key", `flood:FullyFlooded` → "Flood: fully flooded"… */
export function locationExtraLabel(extra: string, t: Translate): string {
  const [kind, value = ''] = extra.split(':')
  if (kind === 'key') return t('locationMap.info.extra.key', { value: t(`locationMap.keyColor.${value}`) })
  // Flood levels arrive as enum names (FullyFlooded…); show them translated.
  return t(`locationMap.info.extra.${kind}`, { value: kind === 'flood' ? t(`locationMap.info.floodLevels.${value}`) : value })
}
