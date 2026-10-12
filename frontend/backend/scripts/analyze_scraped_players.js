const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

async function analyze() {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/truehighlights_laliga_2026_27.json'), 'utf8'));
  console.log(`Loaded ${data.length} clubs.`);

  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Player = require('../models/Player');
  const Club = require('../models/Club');

  const existingPlayers = await Player.find({}).populate('club', 'name');
  console.log(`Existing players in DB: ${existingPlayers.length}`);

  const existingByName = new Map();
  existingPlayers.forEach(p => {
    existingByName.set(p.name.toLowerCase().trim(), p);
  });

  let matchedCount = 0;
  let newCount = 0;
  const newByClub = {};

  for (const clubData of data) {
    newByClub[clubData.club] = { matched: 0, newPlayers: [] };
    for (const p of clubData.players) {
      const match = existingByName.get(p.name.toLowerCase().trim());
      if (match) {
        matchedCount++;
        newByClub[clubData.club].matched++;
      } else {
        newCount++;
        newByClub[clubData.club].newPlayers.push(p);
      }
    }
  }

  console.log(`Matched existing players: ${matchedCount}`);
  console.log(`New players from TrueHighlights: ${newCount}`);
  console.log('\nBreakdown by club:');
  for (const [cName, stats] of Object.entries(newByClub)) {
    console.log(`- ${cName.padEnd(30)}: ${stats.matched} matched, ${stats.newPlayers.length} new (Total: ${stats.matched + stats.newPlayers.length})`);
    if (stats.newPlayers.length > 0 && stats.newPlayers.length <= 10) {
      console.log(`    Sample new: ${stats.newPlayers.map(p => `#${p.number} ${p.name}`).slice(0, 5).join(', ')}`);
    }
  }

  await mongoose.disconnect();
}

analyze().catch(console.error);
