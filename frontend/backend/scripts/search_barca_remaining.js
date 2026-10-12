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

function searchWiki(query) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    https.get(url, { headers: { 'User-Agent': 'BarcaAudit/1.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          resolve(j);
        } catch {
          resolve({});
        }
      });
    }).on('error', () => resolve({}));
  });
}

async function run() {
  const queries = [
    'Marc Casado',
    'Marc Casado Torras',
    'Wojciech Szczesny',
    'Pau Victor',
    'Pau Victor Delgado',
    'Hector Fort',
    'Gerard Martin',
    'Gerard Martin Langreo'
  ];

  for (const q of queries) {
    const tsdb = await searchTheSportsDB(q);
    const wiki = await searchWiki(q.replace(/\s+/g, '_'));
    console.log(`\n=== "${q}" ===`);
    if (tsdb.length > 0) {
      tsdb.forEach(p => console.log(`  [TSDB] ${p.strPlayer} (${p.strTeam}) Cutout: ${p.strCutout} Thumb: ${p.strThumb}`));
    } else {
      console.log('  [TSDB] No results');
    }
    if (wiki && wiki.thumbnail) {
      console.log(`  [WIKI] ${wiki.title} => ${wiki.thumbnail.source}`);
    } else {
      console.log('  [WIKI] No thumbnail');
    }
  }
}

run();
