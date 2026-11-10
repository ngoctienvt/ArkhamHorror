const fs = require('fs');
const path = require('path');

const b1 = require('./batch1.cjs');
const b2 = require('./batch2.cjs');
const b3 = require('./batch3.cjs');
const b4 = require('./batch4.cjs');
const b5 = require('./batch5.cjs');
const b6 = require('./batch6.cjs');
const b7 = require('./batch7.cjs');

const translations = Object.assign({}, b1, b2, b3, b4, b5, b6, b7);
console.log('Total translation entries:', Object.keys(translations).length);

const targetPath = path.resolve('frontend/public/cards_vi.json');
const raw = fs.readFileSync(targetPath, 'utf8');
const cardsVi = JSON.parse(raw);

let appliedCount = 0;

for (let i = 0; i < cardsVi.length; i++) {
  const card = cardsVi[i];
  if (card.type_code === 'scenario' && translations[card.code]) {
    const t = translations[card.code];
    card.text = t.text;
    if (t.back_text !== undefined) {
      card.back_text = t.back_text;
    }
    appliedCount++;
  }
}

console.log(`Updated ${appliedCount} scenario cards in cards_vi.`);

if (appliedCount !== 149) {
  console.error(`ERROR: Expected 149 cards updated, got ${appliedCount}`);
  process.exit(1);
}

// Safe write pattern: write to tmp then copy/rename
const tmpPath = targetPath + '.tmp';
fs.writeFileSync(tmpPath, JSON.stringify(cardsVi, null, 2), 'utf8');

// Overwrite target file
fs.copyFileSync(tmpPath, targetPath);
fs.unlinkSync(tmpPath);

console.log('Successfully written updated data to frontend/public/cards_vi.json');
