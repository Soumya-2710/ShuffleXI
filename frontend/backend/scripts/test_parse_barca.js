const https = require('https');

async function getPage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });
  return await res.text();
}

function parseTeamSquad(html) {
  const players = [];
  // Split by <div class="roundhead">
  const sections = html.split('<div class="roundhead">');
  
  for (let i = 1; i < sections.length; i++) {
    const sec = sections[i];
    const posMatch = sec.match(/^([^<]+)/);
    const posGroup = posMatch ? posMatch[1].trim() : 'Unknown';
    
    // Find all player-card <li>
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

      players.push({
        name: nameMatch ? nameMatch[1].trim() : '',
        number: numMatch ? parseInt(numMatch[1].replace('#', '').trim(), 10) : null,
        nationality: natMatch ? natMatch[1].trim() : '',
        positionGroup: posGroup,
        age: stats['age'] ? parseInt(stats['age'], 10) : null,
        height: stats['height'] || null,
        url: linkMatch ? linkMatch[1] : ''
      });
    }
  }
  return players;
}

async function run() {
  const html = await getPage('https://truehighlights.com/la-liga-2026-27/team/barcelona');
  const squad = parseTeamSquad(html);
  console.log(`Found ${squad.length} players for Barcelona:`);
  squad.forEach(p => {
    console.log(` #${p.number || '-'} ${p.name.padEnd(25)} | ${p.positionGroup.padEnd(12)} | ${p.nationality.padEnd(12)} | Age: ${p.age} | H: ${p.height}`);
  });
}

run().catch(console.error);
