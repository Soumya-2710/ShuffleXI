const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const path = require('path');

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

function clean(s) {
  if (!s) return '';
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Player = require('../models/Player');
  const Club = require('../models/Club');
  
  // Find all players sorted by overall descending
  const players = await Player.find({}).populate('club', 'name').sort({ overall: -1 });
  console.log(`Checking ${players.length} players for authentic cutouts...`);

  // We will check top 200 players first to see how many we can find and verify
  const sample = players.slice(0, 100);
  const found = [];

  for (const p of sample) {
    const candidates = await searchTheSportsDB(p.name);
    const pClean = clean(p.name);
    const clubClean = clean(p.club?.name || '');
    const natClean = clean(p.nationality || '');

    // Score candidates
    const scored = candidates.map(c => {
      const cName = clean(c.strPlayer);
      const cTeam = clean(c.strTeam);
      const cNat = clean(c.strNationality);
      let score = 0;
      if (cName === pClean) score += 10;
      else if (cName.includes(pClean) || pClean.includes(cName)) score += 5;
      if (cNat && natClean && cNat === natClean) score += 4;
      if (cTeam && clubClean && (cTeam.includes(clubClean) || clubClean.includes(cTeam))) score += 6;
      if (c.strCutout || c.strRender) score += 2;
      return { candidate: c, score, cutout: c.strCutout || c.strRender };
    }).filter(x => x.score >= 9); // Must match either (exact name + cutout) or (name + team/nat)

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];

    found.push({
      player: p.name,
      club: p.club?.name,
      overall: p.overall,
      currentImg: p.image,
      bestMatch: best ? {
        name: best.candidate.strPlayer,
        team: best.candidate.strTeam,
        nat: best.candidate.strNationality,
        cutout: best.cutout,
        score: best.score
      } : null
    });

    await new Promise(r => setTimeout(r, 40));
  }

  const withCutouts = found.filter(f => f.bestMatch && f.bestMatch.cutout);
  console.log(`Sample 100 top players: ${withCutouts.length} have verified authentic cutouts on TheSportsDB!`);
  
  fs.writeFileSync('./scripts/top_100_cutouts.json', JSON.stringify(found, null, 2));
  process.exit(0);
}

run();
