const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

async function checkTransfers() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  require('../models/League');
  require('../models/Club');
  const Player = require('../models/Player');
  const scrapedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/truehighlights_laliga_2026_27.json'), 'utf8'));

  const allDbPlayers = await Player.find({}).populate('club', 'name').populate('league', 'name');
  console.log(`Total players in entire DB across all leagues: ${allDbPlayers.length}`);

  const byName = new Map();
  allDbPlayers.forEach(p => {
    byName.set(p.name.toLowerCase().trim(), p);
    const norm = p.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    byName.set(norm, p);
  });

  const transfersFound = [];
  for (const c of scrapedData) {
    for (const p of c.players) {
      const match = byName.get(p.name.toLowerCase().trim()) || byName.get(p.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim());
      if (match && match.club?.name !== c.club) {
        transfersFound.push({
          player: p.name,
          oldClub: match.club?.name,
          oldLeague: match.league?.name,
          newClub: c.club,
          oldOverall: match.overall,
          image: match.image
        });
      }
    }
  }

  console.log(`Found ${transfersFound.length} cross-club/cross-league transfers!`);
  transfersFound.slice(0, 30).forEach(t => {
    console.log(` → ${t.player.padEnd(24)}: ${(t.oldClub || 'None').padEnd(20)} (${t.oldLeague || '?'}) -> ${t.newClub} [OVR: ${t.oldOverall}, Img: ${t.image ? 'Yes' : 'No'}]`);
  });

  await mongoose.disconnect();
}

checkTransfers().catch(console.error);
