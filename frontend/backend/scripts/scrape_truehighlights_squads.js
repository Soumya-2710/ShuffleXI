const fs = require('fs');
const path = require('path');

const TEAMS = [
  { slug: 'alaves', name: 'Deportivo Alavés' },
  { slug: 'athletic-club', name: 'Athletic Club' },
  { slug: 'atletico-madrid', name: 'Atlético de Madrid' },
  { slug: 'barcelona', name: 'FC Barcelona' },
  { slug: 'celta-vigo', name: 'RC Celta de Vigo' },
  { slug: 'deportivo', name: 'RC Deportivo de La Coruña' },
  { slug: 'elche', name: 'Elche CF' },
  { slug: 'espanyol', name: 'RCD Espanyol' },
  { slug: 'getafe', name: 'Getafe CF' },
  { slug: 'levante', name: 'Levante UD' },
  { slug: 'malaga', name: 'Málaga CF' },
  { slug: 'osasuna', name: 'CA Osasuna' },
  { slug: 'racing-santander', name: 'Real Racing Club de Santander' },
  { slug: 'rayo-vallecano', name: 'Rayo Vallecano' },
  { slug: 'real-betis', name: 'Real Betis' },
  { slug: 'real-madrid', name: 'Real Madrid' },
  { slug: 'real-sociedad', name: 'Real Sociedad' },
  { slug: 'sevilla', name: 'Sevilla FC' },
  { slug: 'valencia', name: 'Valencia CF' },
  { slug: 'villarreal', name: 'Villarreal CF' }
];

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  return await res.text();
}

function parseSquadFromHtml(html, clubMeta) {
  const players = [];
  const sections = html.split('<div class="roundhead">');
  
  for (let i = 1; i < sections.length; i++) {
    const sec = sections[i];
    const posMatch = sec.match(/^([^<]+)/);
    const posGroup = posMatch ? posMatch[1].trim() : 'Unknown';
    
    // Stop if we hit non-player sections
    if (posGroup.toLowerCase().includes('coming up') || posGroup.toLowerCase().includes('watch')) {
      continue;
    }

    const cardMatches = sec.match(/<li class="player-card">[\s\S]*?<\/li>/g) || [];
    
    for (const card of cardMatches) {
      const linkMatch = card.match(/href="([^"]+)"/);
      const numMatch = card.match(/class="pc-num">([^<]+)<\/span>/);
      const nameMatch = card.match(/class="pc-name">([^<]+)<\/span>/);
      const natMatch = card.match(/class="pc-nat">[\s\S]*?<span>([^<]+)<\/span>/);
      const statsMatch = [...card.matchAll(/<span class="pc-stat-k">([^<]+)<\/span><span class="pc-stat-v">([^<]+)<\/span>/g)];
      
      const stats = {};
      statsMatch.forEach(m => {
        stats[m[1].trim().toLowerCase()] = m[2].trim();
      });

      const playerName = nameMatch ? nameMatch[1].trim() : '';
      if (!playerName) continue;

      players.push({
        name: playerName,
        number: numMatch ? parseInt(numMatch[1].replace('#', '').trim(), 10) : null,
        nationality: natMatch ? natMatch[1].trim() : 'Unknown',
        positionGroup: posGroup,
        age: stats['age'] ? parseInt(stats['age'], 10) : null,
        height: stats['height'] || null,
        playerUrl: linkMatch ? linkMatch[1] : null,
        clubName: clubMeta.name,
        clubSlug: clubMeta.slug
      });
    }
  }
  return players;
}

async function scrapeAll() {
  console.log(`Starting scrape of 20 La Liga clubs from TrueHighlights...`);
  const allClubsData = [];
  let totalPlayersCount = 0;

  for (const team of TEAMS) {
    const url = `https://truehighlights.com/la-liga-2026-27/team/${team.slug}`;
    try {
      const html = await fetchPage(url);
      const players = parseSquadFromHtml(html, team);
      totalPlayersCount += players.length;
      allClubsData.push({
        club: team.name,
        slug: team.slug,
        playerCount: players.length,
        players
      });
      console.log(`[✓] ${team.name.padEnd(32)}: ${players.length} players`);
    } catch (err) {
      console.error(`[✗] Error scraping ${team.name} (${url}):`, err.message);
    }
    // Polite pause
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nTotal players scraped across all 20 clubs: ${totalPlayersCount}`);
  const outDir = path.join(__dirname, '../data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, 'truehighlights_laliga_2026_27.json');
  fs.writeFileSync(outFile, JSON.stringify(allClubsData, null, 2), 'utf8');
  console.log(`Saved output to ${outFile}`);
}

scrapeAll().catch(console.error);
