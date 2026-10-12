const fs = require('fs');

async function testPlayerDetails() {
  const testUrls = [
    'https://truehighlights.com/la-liga-2026-27/player/kylian-mbappe',
    'https://truehighlights.com/la-liga-2026-27/player/jude-bellingham',
    'https://truehighlights.com/la-liga-2026-27/player/antonio-rudiger',
    'https://truehighlights.com/la-liga-2026-27/player/thibaut-courtois',
    'https://truehighlights.com/la-liga-2026-27/player/vinicius-junior',
    'https://truehighlights.com/la-liga-2026-27/player/dani-carvajal'
  ];

  for (const url of testUrls) {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const statRows = html.match(/<ul class="stat-rows">[\s\S]*?<\/ul>/);
    const posMatch = html.match(/<li>Position<b>([^<]+)<\/b><\/li>/);
    const numMatch = html.match(/<li>Shirt<b>([^<]+)<\/b><\/li>/);
    const nameMatch = html.match(/<title>([^—<]+)/);
    console.log(`${nameMatch ? nameMatch[1].trim() : url}: Pos=${posMatch ? posMatch[1] : 'none'}, Shirt=${numMatch ? numMatch[1] : 'none'}`);
  }
}

testPlayerDetails().catch(console.error);
