const mongoose = require('mongoose');
const fs = require('fs');
const https = require('https');

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

async function run() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Player = require('../models/Player');
  const Club = require('../models/Club');

  const players = await Player.find({ image: { $regex: 'thesportsdb' } }).populate('club', 'name').sort({ overall: -1 });
  console.log(`Found ${players.length} players with TheSportsDB images.`);

  // Let's inspect each one to see what team TheSportsDB listed for this cutout!
  const results = [];

  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    const cands = await searchTheSportsDB(p.name);
    // Find candidate that matches p.image
    const matched = cands.find(c => (c.strCutout === p.image || c.strRender === p.image || c.strThumb === p.image));
    
    results.push({
      name: p.name,
      overall: p.overall,
      club: p.club?.name || 'Unknown',
      nationality: p.nationality,
      image: p.image,
      tsdbPlayer: matched?.strPlayer || 'NOT FOUND',
      tsdbTeam: matched?.strTeam || 'UNKNOWN',
      tsdbSport: matched?.strSport || 'UNKNOWN'
    });

    if ((i + 1) % 25 === 0) {
      console.log(`Checked ${i + 1} / ${players.length}...`);
    }
    await new Promise(r => setTimeout(r, 40));
  }

  fs.writeFileSync('./scripts/tsdb_team_audit.json', JSON.stringify(results, null, 2));

  // Find mismatches
  const mismatches = results.filter(r => {
    const myClub = (r.club || '').toLowerCase();
    const tsdbTeam = (r.tsdbTeam || '').toLowerCase();
    if (tsdbTeam === 'unknown') return false;
    // Normalize club names (e.g. Manchester City / Man City, Bayern Munich / FC Bayern München, etc.)
    const normClub = myClub.replace(/fc |cf |vfb |sc |sv |rcd |rc |bayer 04 |borussia |1\. |calcio|münchen/g, '').trim();
    const normTsdb = tsdbTeam.replace(/fc |cf |vfb |sc |sv |rcd |rc |bayer 04 |borussia |1\. |calcio|munich/g, '').trim();
    if (!normClub || !normTsdb) return false;
    return !normTsdb.includes(normClub) && !normClub.includes(normTsdb);
  });

  console.log(`\nFound ${mismatches.length} players with mismatched teams in their TheSportsDB images:`);
  mismatches.forEach(m => {
    console.log(`- [${m.overall}] ${m.name} | Game Club: ${m.club} | TheSportsDB Team: ${m.tsdbTeam} | Cutout: ${m.image}`);
  });

  process.exit(0);
}

run();
