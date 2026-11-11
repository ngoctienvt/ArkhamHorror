import { imgsrc } from '@/arkham/helpers'
import type { ArkhamKey } from '@/arkham/types/Key'
import { chaosTokenImage } from '@/arkham/types/ChaosToken'

/** The picture of a key token (The Innsmouth Conspiracy, Edge of the Earth), shared by Key.vue and the scene panel. */
export function keyToImage(k: ArkhamKey): string {
  switch (k.tag) {
    case 'TokenKey': return chaosTokenImage(k.contents.face)
    case 'BlueKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/blue-key.jpg')
    case 'GreenKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/green-key.jpg')
    case 'RedKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/red-key.jpg')
    case 'YellowKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/yellow-key.jpg')
    case 'PurpleKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/purple-key.jpg')
    case 'BlackKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/black-key.jpg')
    case 'WhiteKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/white-key.jpg')
    case 'UnrevealedKey': return imgsrc('extra/the-innsmouth-conspiracy/keys/key-back.jpg')
  }
}
