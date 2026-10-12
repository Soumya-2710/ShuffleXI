const https = require('https');

async function testJson() {
  const url = 'https://www.footballcritic.com/json/competition-player-stats.php?uid=80342';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.footballcritic.com/la-liga/season-2026-2027/player-stats/all/6/80342'
    }
  });

  console.log('HTTP status:', res.status);
  const data = await res.json();
  console.log('Data is array?', Array.isArray(data));
  console.log('Data length:', data.length);
  if (data[0]) {
    console.log('data[0] length (players):', data[0].length);
    console.log('Sample player 0:', data[0][0]);
    console.log('Sample player 1:', data[0][1]);
  }
}

testJson().catch(console.error);
