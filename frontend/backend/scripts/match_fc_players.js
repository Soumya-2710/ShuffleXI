const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function normalizeName(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

async function matchPlayers() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Player = require('../models/Player');
  const Club = require('../models/Club');
  const League = require('../models/League');

  const fcPlayers = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/footballcritic_laliga_2026_27.json'), 'utf8'));
  const laliga = await League.findOne({ name: 'La Liga' });
  const dbPlayers = await Player.find({ league: laliga._id }).populate('club', 'name');

  console.log(`DB La Liga players: ${dbPlayers.length}`);
  console.log(`FootballCritic players: ${fcPlayers.length}`);

  // Build lookups from FootballCritic
  const fcByName = new Map();
  fcPlayers.forEach(p => {
    fcByName.set(p.name.toLowerCase().trim(), p);
    fcByName.set(normalizeName(p.name), p);
    if (p.fullName) {
      fcByName.set(p.fullName.toLowerCase().trim(), p);
      fcByName.set(normalizeName(p.fullName), p);
    }
  });

  let matched = 0;
  const matchedList = [];
  const missingInFC = [];

  for (const dbP of dbPlayers) {
    const direct = fcByName.get(dbP.name.toLowerCase().trim()) || fcByName.get(normalizeName(dbP.name));
    if (direct) {
      matched++;
      matchedList.push({ db: dbP.name, fc: direct.name, photo: direct.photoUrl, club: dbP.club?.name });
    } else {
      missingInFC.push({ name: dbP.name, club: dbP.club?.name });
    }
  }

  console.log(`Direct matches: ${matched} / ${dbPlayers.length} (${Math.round(matched/dbPlayers.length*100)}%)`);
  console.log('Sample matches:');
  matchedList.slice(0, 10).forEach(m => console.log(` [✓] ${m.db.padEnd(25)} (${m.club}): ${m.photo}`));

  console.log('\nSample missing from FootballCritic (often youth / newly promoted):');
  missingInFC.slice(0, 10).forEach(m => console.log(` [-] ${m.name} (${m.club})`));

  await mongoose.disconnect();
}

matchPlayers().catch(console.error);
