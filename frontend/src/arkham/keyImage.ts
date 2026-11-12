import { imgsrc } from '@/arkham/helpers'
import type { ArkhamKey } from '@/arkham/types/Key'
import { chaosTokenImage } from '@/arkham/types/ChaosToken'

/** The picture of a key token (The Innsmouth Conspiracy, Edge of the Earth), shared by Key.vue and the scene panel. */
export function keyToImage(k: ArkhamKey): string {
  switch (k.tag) {
    case 'TokenKey': return chaosTokenImage(k.contents.face)
    case 'BlueKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/blue-key.png')
    case 'GreenKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/green-key.png')
    case 'RedKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/red-key.png')
    case 'YellowKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/yellow-key.png')
    case 'PurpleKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/purple-key.png')
    case 'BlackKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/black-key.png')
    case 'WhiteKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/white-key.png')
    case 'UnrevealedKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/key-back.png')
  }
}
