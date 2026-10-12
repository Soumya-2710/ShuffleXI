const mongoose = require('mongoose');
const path = require('path');
const https = require('https');

async function searchTheSportsDB(query) {
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

function cleanStr(s) {
  if (!s) return '';
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

async function run() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Player = require('../models/Player');
  const Club = require('../models/Club');
  const League = require('../models/League');

  const players = await Player.find({}).populate('club', 'name logo').populate('league', 'name country').sort({ overall: -1 });
  console.log(`Auditing ${players.length} players in the database...`);

  // Group top players by overall (>= 80 OVR) to inspect their images
  const topPlayers = players.filter(p => p.overall >= 80);
  console.log(`Checking ${topPlayers.length} star players (80+ OVR)...`);

  const issues = [];

  for (let i = 0; i < topPlayers.length; i++) {
    const p = topPlayers[i];
    const clubName = p.club?.name || 'Unknown';
    const leagueName = p.league?.name || 'Unknown';
    const img = p.image || '';

    // Search TheSportsDB to see what candidates exist
    const candidates = await searchTheSportsDB(p.name);
    
    // Find best candidate on TheSportsDB
    const matchingCandidate = candidates.find(c => {
      const cTeam = cleanStr(c.strTeam);
      const myTeam = cleanStr(clubName);
      const cNat = cleanStr(c.strNationality);
      const myNat = cleanStr(p.nationality);

      // Check team match or national team / former team match
      const teamMatch = cTeam && myTeam && (cTeam.includes(myTeam) || myTeam.includes(cTeam));
      const natMatch = cNat && myNat && (cNat === myNat);
      return (c.strSport === 'Soccer' || !c.strSport) && (teamMatch || natMatch);
    });

    // Check if the current image matches candidate cutout or if current candidate has a better/correct cutout
    if (candidates.length > 0) {
      const firstCand = candidates[0];
      const firstTeam = firstCand.strTeam || '';
      const firstNat = firstCand.strNationality || '';

      // Check for flagrant mismatch (e.g. Jay Rodriguez vs Rodri)
      const nameClean = cleanStr(p.name);
      const candClean = cleanStr(firstCand.strPlayer);

      const isExactName = candClean.includes(nameClean) || nameClean.includes(candClean);
      const natMatches = cleanStr(firstNat) === cleanStr(p.nationality);

      if (!isExactName || (!natMatches && !matchingCandidate)) {
        issues.push({
          player: p.name,
          overall: p.overall,
          club: clubName,
          nationality: p.nationality,
          currentImage: img,
          firstCandidate: `${firstCand.strPlayer} (${firstTeam}, ${firstNat})`,
          bestCandidate: matchingCandidate ? `${matchingCandidate.strPlayer} (${matchingCandidate.strTeam}, ${matchingCandidate.strNationality})` : 'NONE',
          correctCutout: matchingCandidate?.strCutout || matchingCandidate?.strRender || null,
          issue: 'NAME/NATION MISMATCH'
        });
      } else if (firstTeam && clubName && !cleanStr(firstTeam).includes(cleanStr(clubName)) && !cleanStr(clubName).includes(cleanStr(firstTeam))) {
        // Team differs (might be transfer or wrong team cutout)
        // Check if there's a better candidate matching current team
        if (matchingCandidate && matchingCandidate.strCutout && matchingCandidate.strCutout !== img) {
          issues.push({
            player: p.name,
            overall: p.overall,
            club: clubName,
            theSportsDBTeam: firstTeam,
            currentImage: img,
            betterCutout: matchingCandidate.strCutout,
            issue: 'TEAM MISMATCH WITH BETTER CUTOUT AVAILABLE'
          });
        }
      }
    }

    if ((i + 1) % 50 === 0) {
      console.log(`Processed ${i + 1} / ${topPlayers.length} players...`);
    }

    // Small delay to be respectful to API
    await new Promise(r => setTimeout(r, 60));
  }

  console.log(`\n=== AUDIT RESULTS: Found ${issues.length} Potential Issues in Top Players ===\n`);
  console.log(JSON.stringify(issues, null, 2));

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
