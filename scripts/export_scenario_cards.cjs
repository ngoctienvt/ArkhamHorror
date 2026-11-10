const fs = require('fs');

const cardsVi = JSON.parse(fs.readFileSync('frontend/public/cards_vi.json', 'utf8'));
const cardsEn = JSON.parse(fs.readFileSync('frontend/public/cards.json', 'utf8'));
const enMap = new Map();
cardsEn.forEach(c => enMap.set(c.code, c));

const scenarios = cardsVi.filter(c => c.type_code === 'scenario');

const master = scenarios.map(c => {
  const en = enMap.get(c.code) || {};
  let enText = en.text || c.real_text || '';
  let enBackText = en.back_text || '';
  if (!enBackText && c.code !== '50032a') {
    // If cards.json didn't have it, check if vi_back_text was actually English
    if (c.back_text && /^[A-Za-z\s\d\W]+$/.test(c.back_text.slice(0, 50))) {
      enBackText = c.back_text;
    }
  }

  return {
    code: c.code,
    name: c.name,
    real_name: c.real_name,
    pack_name: c.pack_name,
    en_text: enText,
    en_back_text: enBackText,
    current_vi_text: c.text || '',
    current_vi_back_text: c.back_text || ''
  };
});

fs.writeFileSync('scenario_master.json', JSON.stringify(master, null, 2), 'utf8');
console.log('Saved scenario_master.json with ' + master.length + ' cards.');
