import type { Card } from '@/arkham/types/Card'
import { cardImage, toCardContents } from '@/arkham/types/Card'
import { cardImg, imgsrc } from '@/arkham/helpers'
import { homebrewScenarioDeckDisplay } from '@/arkham/homebrewAssets'

/* The picture a scenario deck shows on the table: its printed back, or for decks whose cards have
 * different backs (Summit, Otherworld, some homebrew decks) the top card face down. Shared by the
 * deck on the card board (ScenarioDeck) and the deck list in the map's Deck panel. */
export function scenarioDeckImage(key: string, cards: Card[]): string {
  const homebrew = homebrewScenarioDeckDisplay(key)
  const homebrewBack = homebrew?.back ? cardImg(homebrew.back) : null
  const topFaceDown = () => {
    const top = cards[0]
    if (!top) return null
    return imgsrc(cardImage({ ...toCardContents(top), isFlipped: true, facedown: false }))
  }

  if (homebrew?.image === 'player-back') return imgsrc('backs/back_player.jpg')
  if (homebrew?.image === 'top-card-back') return topFaceDown() ?? homebrewBack ?? imgsrc('backs/back_encounter.jpg')
  if (homebrewBack) return homebrewBack

  switch (key) {
    case 'UnknownPlacesDeck': return imgsrc('cards/05134b.avif')
    case 'ExhibitDeck': return imgsrc('cards/02132b.avif')
    case 'CosmosDeck': return imgsrc('cards/05333b.avif')
    case 'CatacombsDeck': return imgsrc('cards/03247b.avif')
    case 'TidalTunnelDeck': return imgsrc('cards/07048b.avif')
    case 'TekeliliDeck':
    case 'GuestDeck': return imgsrc('backs/back_player.jpg')
    case 'OtherworldDeck': {
      // The Otherworld deck shows its top card as it lies; an empty one falls back to the Woods back.
      const top = cards[0]
      return top ? imgsrc(cardImage(top)) : imgsrc('cards/10612b.avif')
    }
    case 'WoodsDeck': return imgsrc('cards/10612b.avif')
    case 'CavernsDeck': return imgsrc('cards/10577b.avif')
    case 'EnemyDeck': return imgsrc('backs/back_the_longest_night.jpg')
    case 'AbyssDeck': return imgsrc('cards/10670b.avif')
    case 'CthulhuDeck': return imgsrc('backs/back_cthulhu_deck.jpg')
    // Summit locations and Open Sky have different backs, so returned Open Sky cards show on the deck.
    case 'SummitDeck': return topFaceDown() ?? imgsrc('cards/11649b.avif')
    default: return imgsrc('backs/back_encounter.jpg')
  }
}

/* "ExplorationDeck" → "Exploration", "UnknownPlacesDeck" → "Unknown Places". Deck names stay in
 * English like the other game terms (Agenda, Act, Doom). */
export function scenarioDeckName(key: string): string {
  return key.replace(/Deck$/, '').replace(/([a-z])([A-Z])/g, '$1 $2') || key
}
