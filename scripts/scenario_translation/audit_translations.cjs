const fs = require('fs');

const b1 = require('./batch1.cjs');
const b2 = require('./batch2.cjs');
const b3 = require('./batch3.cjs');
const b4 = require('./batch4.cjs');
const b5 = require('./batch5.cjs');
const b6 = require('./batch6.cjs');
const b7 = require('./batch7.cjs');

const all = Object.assign({}, b1, b2, b3, b4, b5, b6, b7);
const master = JSON.parse(fs.readFileSync('scenario_master.json', 'utf8'));

console.log('--- AUDIT REPORT FOR 149 SCENARIO CARDS ---');

let totalErrors = 0;

// 1. Check traits in [[...]]
Object.entries(all).forEach(([code, card]) => {
  const combined = (card.text || '') + ' ' + (card.back_text || '');
  const traitMatches = combined.match(/\[\[(.*?)\]\]/g) || [];
  traitMatches.forEach(tag => {
    // Check if tag contains Vietnamese diacritics
    if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(tag)) {
      console.error(`[TRAIT ERROR] Card ${code} has Vietnamese trait: ${tag}`);
      totalErrors++;
    }
  });
});

// 2. Check headers
const returnCodes = new Set(master.filter(c => c.code.startsWith('5')).map(c => c.code));

Object.entries(all).forEach(([code, card]) => {
  if (returnCodes.has(code)) {
    // Return to setup card
    if (!card.text.includes('Thực hiện việc thiết lập')) {
      console.warn(`[RETURN SETUP WARN] Card ${code} does not start with setup: ${card.text.slice(0, 30)}`);
    }
    return;
  }

  // Token scenario cards
  const textFirstLine = card.text.split('\n')[0].trim();
  const backFirstLine = (card.back_text || '').split('\n')[0].trim();

  if (code === '10501') {
    if (textFirstLine !== 'Dễ / Tiêu chuẩn - Màn 1' || backFirstLine !== 'Dễ / Tiêu chuẩn - Màn 2') {
      console.error(`[HEADER ERROR] 10501 header mismatch: Front="${textFirstLine}", Back="${backFirstLine}"`);
      totalErrors++;
    }
  } else if (code === '10502') {
    if (textFirstLine !== 'Khó / Chuyên gia - Màn 1' || backFirstLine !== 'Khó / Chuyên gia - Màn 2') {
      console.error(`[HEADER ERROR] 10502 header mismatch: Front="${textFirstLine}", Back="${backFirstLine}"`);
      totalErrors++;
    }
  } else {
    if (textFirstLine !== 'Dễ / Tiêu chuẩn') {
      console.error(`[HEADER ERROR] Card ${code} front does not start with "Dễ / Tiêu chuẩn": "${textFirstLine}"`);
      totalErrors++;
    }
    if (backFirstLine !== 'Khó / Chuyên gia') {
      console.error(`[HEADER ERROR] Card ${code} back does not start with "Khó / Chuyên gia": "${backFirstLine}"`);
      totalErrors++;
    }
  }
});

// 3. Check for lingering untranslated English words
// Allowed tokens / proper names / keywords:
const allowedWords = new Set([
  // tokens and formatting
  'skull', 'cultist', 'tablet', 'elder_thing', 'auto_fail', 'curse', 'bless', 'frost', 'per_investigator',
  'action', 'reaction', 'fast', 'free', 'willpower', 'intellect', 'combat', 'agility', 'wild',
  'br', 'hr', 'i', 'b', 'nbsp',
  // arkham mechanics
  'doom', 'shroud', 'parley', 'evade', 'patrol', 'aloof', 'retaliate', 'hunter', 'swarm', 'swarming',
  'peril', 'surge', 'hollow', 'decoy', 'haunted', 'seal', 'fight', 'spawn', 'circle',
  'act', 'agenda', 'scenario', 'victory', 'encounter', 'setup',
  // Proper names and nouns from scenarios
  'ghoul', 'cultists', 'monster', 'elite', 'ancient', 'one', 'witch', 'criminal', 'silver', 'twilight',
  'spectral', 'bayou', 'geist', 'abomination', 'oztoc', 'yithian', 'serpent', 'vehicle', 'byakhee',
  'lunatic', 'altered', 'extradimensional', 'deep', 'staff', 'woods', 'graveyard', 'spider', 'hazard',
  'coterie', 'locus', 'site', 'outsider', 'stable', 'unstable', 'insect', 'lair', 'sunken', 'bog',
  'colour', 'cave', 'glyph', 'stowaway', 'guest', 'innocent', 'tome', 'mutated', 'hex', 'suspect',
  'hideout', 'scientist', 'ally', 'private', 'saturnite', 'dinosaur', 'present-day', 'otherworld',
  'shattered', 'basement', 'ground', 'floor', 'humanoid',
  'hunting', 'horror', // Hunting Horror
  'the', 'void', 'nahab', 'hastur', 'azathoth', 'nyarlathotep', 'cthulhu', 'rougarou', 'cnidathqua',
  'daisy', 'walker', 'skids', 'o', 'toole', 'agnes', 'baker', 'elspeth', 'baudin', 'roland', 'banks',
  'veda', 'whitsley', 'naomi', 'bannion', 'seth', 'bishop', 'dianne', 'devine', 'erynn', 'mcaoidh',
  'senator', 'nathaniel', 'rhodes', 'amalgam', 'tekeli-li', 'prison', 'of', 'memories', 'eidolon',
  'expedition', 'elder', 'thing', 'things', 'mist-pylon', 'key', 'reaper', 'shade', 'mine', 'cart',
  'scrap', 'switch', 'grasping', 'tendril', 'cosmic', 'emissary', 'unfinished', 'business', 'road',
  'leads', 'beyond', 'tindalos', 'bloodless', 'man', 'sinister', 'soloist', 'measure', 'measures',
  'trapped', 'mysterious', 'gateway', 'study', 'aberrant', 'hall', 'bedroom', 'bathroom', 'hallway',
  'attic', 'cellar', 'easttown', 'northside', 'rivertown', 'miskatonic', 'university', 'acolyte',
  'enthralled', 'security', 'guard', 'administration', 'building', 'orne', 'library', 'warren',
  'observatory', 'clover', 'club', 'stage', 'lounge', 'exhibit', 'deck', 'restricted', 'tear',
  'reality', 'where', 's', 'smoke', 'train', 'car', 'engine', 'engineer', 'village', 'commons',
  'decay', 'silent', 'hired', 'gun', 'crew', 'brood', 'yog-sothoth', 'base', 'hill', 'ascending',
  'path', 'warped', 'twisted', 'diverging', 'thrall', 'breaking', 'through', 'realms', 'stranger',
  'royal', 'mercurial', 'mischievous', 'hiding', 'an', 'oath', 'unspoken', 'sickening', 'shocking',
  'display', 'quiet', 'halls', 'historical', 'society', 'keeper', 'host', 'insanity', 'radical',
  'treatment', 'conviction', 'doubt', 'bad', 'ones', 'montparnasse', 'guignol', 'père', 'lachaise',
  'cemetery', 'canal', 'saint-martin', 'notre-dame', 'gardens', 'luxembourg', 'figure', 'shadows',
  'organist', 'catacombs', 'tomb', 'blocked', 'passage', 'corpse', 'dweller', 'cloister', 'knight',
  'palace', 'king', 'domain', 'recesses', 'your', 'own', 'mind', 'throne', 'room', 'ward', 'theatre',
  'knows', 'secret', 'camp', 'check', 'supplies', 'harbinger', 'valusia', 'sleeper', 'returns',
  'burial', 'pit', 'underground', 'ruins', 'viper', 'serpents', 'sealed', 'mosaic', 'ancients',
  'snake', 'advertiser', 'meaning', 'source', 'trouble', 'overgrown', 'estate', 'pnakotus',
  'southern', 'corridors', 'cyclopean', 'vaults', 'alien', 'conservatory', 'access', 'unrestricted',
  'perils', 'yoth', 'descent', 'mouth', 'k', 'nyan', 'watcher', 'grasp', 'glade', 'entry',
  'unstable', 'realm', 'death', 'unknown', 'places', 'house', 'hangman', 'brook', 'heretic',
  'hidden', 'passageway', 'sanctum', 'doorway', 'lodge', 'binding', 'rite', 'french', 'southside',
  'uptown', 'south', 'church', 'merchant', 'district', 'cosmos', 'nightgaunt', 'steed',
  'relic', 'ages', 'alarm', 'level', 'infestation', 'signs', 'gods', 'intensity', 'storm',
  'open', 'sky', 'adjacent', 'disturbance', 'rage', 'fire', 'still', 'behind', 'you'
]);

// Suspicious English words that should NOT appear in Vietnamese translation:
const forbiddenEnglish = [
  'fail', 'failed', 'fails', 'failing',
  'succeed', 'succeeded', 'succeeds',
  'take', 'takes', 'taking',
  'reveal', 'revealed', 'reveals',
  'another',
  'discard', 'discarded', 'discards',
  'shuffle', 'shuffled', 'shuffles',
  'search', 'searched', 'searches',
  'damage', 'horror',
  'clue', 'clues',
  'action', 'actions',
  'instead',
  'automatically',
  'exhaust', 'exhausted',
  'ready', 'readies',
  'location', 'locations',
  'enemy', 'enemies',
  'threat area',
  'encounter deck',
  'discard pile',
  'chaos bag',
  'play into',
  'into play',
  'out of play',
  'remove from the game',
  'removed from the game',
  'set aside',
  'put into play',
  'in play',
  'at your location',
  'at a connecting location',
  'highest', 'lowest',
  'equal to',
  'more than',
  'twice the',
  'half the',
  'rounded up', 'rounded down',
  'spend', 'spent',
  'lose', 'lost',
  'gain', 'gained',
  'place', 'placed',
  'cancel', 'cancelled',
  'draw', 'drawn', 'draws'
];

Object.entries(all).forEach(([code, card]) => {
  const checkText = (txt, label) => {
    if (!txt) return;
    // Remove [[...]], <...>, [...]
    let cleaned = txt
      .replace(/\[\[.*?\]\]/g, ' ')
      .replace(/\[.*?\]/g, ' ')
      .replace(/<.*?>/g, ' ');

    forbiddenEnglish.forEach(word => {
      // Use word boundary regex
      const re = new RegExp('\\b' + word + '\\b', 'gi');
      const matches = cleaned.match(re);
      if (matches) {
        // Check if it's an allowed context or proper name
        // For example: "horror" in "Hunting Horror", "damage" in "place 1 damage on the nearest [[Bog]] as a sinkhole"
        // Wait, did we translate "Hunting Horror"? Hunting Horror is enemy name.
        // Let's print occurrences:
        console.warn(`[ENGLISH DETECTED] Card ${code} ${label}: found "${matches[0]}" in "...${cleaned.slice(Math.max(0, cleaned.indexOf(matches[0]) - 25), cleaned.indexOf(matches[0]) + matches[0].length + 25).replace(/\n/g, ' ')}..."`);
        totalErrors++;
      }
    });
  };

  checkText(card.text, 'FRONT');
  checkText(card.back_text, 'BACK');
});

console.log('--- AUDIT FINISHED ---');
console.log('Total potential issues flagged:', totalErrors);
