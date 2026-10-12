const fs = require('fs');
const path = require('path');

async function analyzeFootballCriticData() {
  const url = 'https://www.footballcritic.com/json/competition-player-stats.php?uid=80342';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Referer': 'https://www.footballcritic.com/la-liga/season-2026-2027/player-stats/all/6/80342'
    }
  });

  const raw = await res.json();
  const players = raw[0];
  console.log(`Total players in FootballCritic: ${players.length}`);

  // Map of extracted players
  const extracted = players.map(p => {
    return {
      name: p[2],
      photoUrl: p[4],
      clubShort: p[5],
      clubLogo: p[6],
      clubName: p[8],
      nationality: p[10],
      flagCode: p[11],
      positionText: p[13],
      personId: p[14],
      fullName: p[16],
      rating: p[71],
      profileUrl: p[81],
      teamUrl: p[82],
      fullPosition: p[86]
    };
  });

  const outDir = path.join(__dirname, '../data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, 'footballcritic_laliga_2026_27.json');
  fs.writeFileSync(outFile, JSON.stringify(extracted, null, 2), 'utf8');
  console.log(`Successfully saved ${extracted.length} players to ${outFile}`);
}

analyzeFootballCriticData().catch(console.error);
