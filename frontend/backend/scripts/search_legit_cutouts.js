const https = require('https');

function searchTheSportsDB(query) {
  return new Promise((resolve) => {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`;
    https.get(url, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          resolve(j.player || []);
        } catch {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function findCandidates() {
  const players = [
    'Ter Stegen',
    'Marc-Andre ter Stegen',
    'Robert Lewandowski',
    'Lewandowski',
    'Bernardo Silva',
    'Ederson Moraes',
    'Ederson',
    'Gianluigi Donnarumma',
    'Donnarumma',
    'Florian Wirtz',
    'Wirtz',
    'Joan Garcia'
  ];

  for (const p of players) {
    const res = await searchTheSportsDB(p);
    console.log(`\n=== Query: "${p}" (${res.length} results) ===`);
    res.forEach((c, idx) => {
      console.log(`[${idx}] ${c.strPlayer} | Team: ${c.strTeam} | Nat: ${c.strNationality}`);
      console.log(`     Cutout: ${c.strCutout || 'NONE'}`);
      console.log(`     Render: ${c.strRender || 'NONE'}`);
      console.log(`     Thumb:  ${c.strThumb || 'NONE'}`);
    });
  }
}

findCandidates();
