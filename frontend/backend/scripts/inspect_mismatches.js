const fs = require('fs');
const list = JSON.parse(fs.readFileSync('./scripts/players_with_images.json', 'utf8'));

const suspicious = [];
list.forEach(p => {
  const img = p.image || '';
  if (img.includes('wikimedia.org') || img.includes('wikipedia.org')) {
    try {
      const decoded = decodeURIComponent(img);
      const fileName = decoded.split('/').pop().toLowerCase();
      const parts = p.name.toLowerCase().split(' ').filter(x => x.length > 2);
      const matchesAnyPart = parts.some(part => {
        const normPart = part.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normFile = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return normFile.includes(normPart);
      });
      if (!matchesAnyPart && parts.length > 0) {
        suspicious.push({ player: p.name, club: p.club, nationality: p.nationality, fileName, img });
      }
    } catch(e) {}
  }
});

console.log('Count of wikipedia name mismatches:', suspicious.length);
suspicious.forEach(s => {
  console.log(`${s.player} (${s.club}, ${s.nationality}) => ${s.fileName}`);
});
