const https = require('https');
const fs = require('fs');

const teams = [
  'barcelona',
  'atletico-madrid',
  'real-betis',
  'real-madrid',
  'sevilla',
  'alaves',
  'deportivo',
  'real-sociedad',
  'villarreal',
  'athletic-club',
  'getafe',
  'rayo-vallecano',
  'osasuna',
  'celta-vigo',
  'espanyol',
  'racing-santander',
  'levante',
  'elche',
  'valencia',
  'malaga'
];

function fetchPage(slug) {
  return new Promise((resolve) => {
    const url = `https://laligatable.co/teams/${slug}/`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // Extract JSON-LD
          const match = data.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
          if (match && match[1]) {
            const parsed = JSON.parse(match[1]);
            const teamObj = (parsed['@graph'] || []).find(item => item['@type'] === 'SportsTeam');
            resolve({
              slug,
              name: teamObj?.name || slug,
              stadium: teamObj?.location?.name || '',
              city: teamObj?.location?.address?.addressLocality || '',
              founded: teamObj?.foundingDate ? parseInt(teamObj.foundingDate, 10) : null,
              website: teamObj?.sameAs?.[0] || '',
              crestUrl: `https://laligatable.co/assets/crests/${slug}.png`
            });
            return;
          }
        } catch (e) {}
        resolve({ slug, name: slug });
      });
    }).on('error', () => resolve({ slug, name: slug }));
  });
}

async function run() {
  console.log('Fetching 20 teams from laligatable.co...');
  const results = [];
  for (const t of teams) {
    const info = await fetchPage(t);
    results.push(info);
    console.log(`Fetched ${info.name} | Stadium: ${info.stadium} | City: ${info.city}`);
  }

  fs.writeFileSync('./scripts/laligatable_teams.json', JSON.stringify(results, null, 2));
  console.log('Saved to ./scripts/laligatable_teams.json');
}

run();
