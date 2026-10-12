const https = require('https');

async function getPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });
  return await res.text();
}

async function run() {
  const html = await getPage('https://truehighlights.com/la-liga-2026-27/team/barcelona');
  
  // Find where HTML markup for player-card starts
  const firstCardIndex = html.indexOf('<li class="player-card">');
  if (firstCardIndex !== -1) {
    console.log('--- FIRST 2 CARDS ---');
    console.log(html.substring(firstCardIndex, firstCardIndex + 2500));
  } else {
    console.log('No <li class="player-card"> found');
  }

  // Also check JSON-LD to see if all players are in schema
  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  if (jsonLdMatches) {
    jsonLdMatches.forEach((m, idx) => {
      try {
        const parsed = JSON.parse(m.replace(/<\/?script[^>]*>/g, ''));
        console.log(`JSON-LD ${idx} keys:`, Object.keys(parsed));
        if (parsed['@graph']) {
          parsed['@graph'].forEach((item, j) => {
            console.log(`  Graph item ${j}: type=${item['@type']}, name=${item.name}`);
            if (item.itemListElement) {
              console.log(`    itemListElement count: ${item.itemListElement.length}`);
              console.log('    First item:', item.itemListElement[0]);
            }
          });
        }
      } catch (e) {
        console.log(`JSON-LD parse error:`, e.message);
      }
    });
  }
}

run().catch(console.error);
