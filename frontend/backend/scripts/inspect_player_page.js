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
  const html = await getPage('https://truehighlights.com/la-liga-2026-27/player/pedri');
  console.log('Status: OK, length:', html.length);
  
  // Extract JSON-LD
  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  if (jsonLdMatches) {
    jsonLdMatches.forEach((m, idx) => {
      console.log(`JSON-LD ${idx}:`, m.replace(/<\/?script[^>]*>/g, '').slice(0, 500));
    });
  }

  // Look for stat-rows or bio facts
  const statIndex = html.indexOf('<ul class="stat-rows">');
  if (statIndex !== -1) {
    console.log('Stat rows:\n', html.substring(statIndex, statIndex + 1500));
  }
}

run().catch(console.error);
