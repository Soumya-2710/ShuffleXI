const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Player = require('../models/Player');
  const Club = require('../models/Club');
  const League = require('../models/League');

  const topClubNames = [
    'FC Barcelona',
    'Real Madrid',
    'Manchester City',
    'Arsenal',
    'Liverpool',
    'Chelsea',
    'Manchester United',
    'Paris Saint-Germain',
    'FC Bayern München',
    'Bayer 04 Leverkusen',
    'Borussia Dortmund',
    'Inter Milan',
    'Juventus',
    'AC Milan',
    'Atlético de Madrid'
  ];

  const clubs = await Club.find({ name: { $in: topClubNames } });
  const clubIds = clubs.map(c => c._id);

  const players = await Player.find({ club: { $in: clubIds } })
    .populate('club', 'name')
    .sort({ overall: -1 });

  console.log(`Found ${players.length} players across top 15 clubs.`);

  const list = players.map(p => ({
    name: p.name,
    overall: p.overall,
    pos: p.position,
    club: p.club.name,
    nat: p.nationality,
    img: p.image || null,
    isCutout: p.isCutout || false,
    source: p.imageSource || 'none'
  }));

  const outPath = path.join(__dirname, 'top_clubs_players.json');
  fs.writeFileSync(outPath, JSON.stringify(list, null, 2));
  console.log(`Saved to ${outPath}`);

  // Group by club
  const byClub = {};
  list.forEach(p => {
    if (!byClub[p.club]) byClub[p.club] = [];
    byClub[p.club].push(p);
  });

  Object.entries(byClub).forEach(([cName, squad]) => {
    console.log(`\n=== ${cName} (${squad.length} players) ===`);
    squad.forEach(p => {
      const imgShort = p.img ? (p.img.startsWith('data:') ? 'DATA_URI' : p.img.split('/').pop().substring(0, 40)) : 'NO_IMAGE';
      console.log(`  [${p.overall}] ${p.name.padEnd(25)} | ${p.pos.padEnd(4)} | ${p.nat.padEnd(12)} | ${imgShort}`);
    });
  });

  process.exit(0);
}

run();
