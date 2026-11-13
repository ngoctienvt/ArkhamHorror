import type { Asset } from '@/arkham/types/Asset'
import type { Location } from '@/arkham/types/Location'

export function sceneLocationAssets(
  location: Pick<Location, 'id' | 'assets'>,
  assets: Readonly<Record<string, Asset>>,
): Asset[] {
  return location.assets.flatMap((id) => {
    const asset = assets[id]
    const placement = asset?.placement
    // Use the asset's own placement even if a snapshot still lists its id at the location.
    return (placement?.tag === 'AtLocation' || placement?.tag === 'AttachedToLocation')
      && placement.contents === location.id ? [asset] : []
  })
}
