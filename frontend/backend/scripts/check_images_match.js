const fs = require('fs');
const path = require('path');

const scrapedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/truehighlights_laliga_2026_27.json'), 'utf8'));
const imagesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'players_with_images.json'), 'utf8'));

const imageMap = new Map();
imagesData.forEach(p => {
  if (p.image) {
    imageMap.set(p.name.toLowerCase().trim(), p.image);
    // also without accents
    const normalized = p.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    imageMap.set(normalized, p.image);
  }
});

let withImg = 0;
let withoutImg = 0;
const missing = [];

for (const c of scrapedData) {
  for (const p of c.players) {
    const norm = p.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    if (imageMap.has(p.name.toLowerCase().trim()) || imageMap.has(norm)) {
      withImg++;
    } else {
      withoutImg++;
      missing.push(`${c.club}: #${p.number} ${p.name}`);
    }
  }
}

console.log(`With image in players_with_images: ${withImg} / 593 (${Math.round(withImg/593*100)}%)`);
console.log(`Missing image: ${withoutImg}`);
console.log('Sample missing:', missing.slice(0, 15));
