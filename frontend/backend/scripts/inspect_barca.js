const mongoose = require('mongoose');

async function checkBarca() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Club = require('../models/Club');
  const Player = require('../models/Player');
  
  const barca = await Club.findOne({ name: /Barcelona/i });
  if (!barca) {
    console.log('No barca club found!');
    process.exit(1);
  }
  console.log('Found Club:', barca.name, 'ID:', barca._id, 'Logo:', barca.logo);
  const players = await Player.find({ club: barca._id }).sort({ overall: -1 });
  console.log(`Total players in Barca: ${players.length}`);
  players.forEach(p => {
    console.log(`[${p.overall}] #${p.number || '?'} ${p.name.padEnd(25)} (${p.position.padEnd(3)}) [${p.nationality}] - Img: ${p.image ? p.image.substring(0, 60) + '...' : 'NONE'}`);
  });
  process.exit(0);
}

checkBarca().catch(err => {
  console.error(err);
  process.exit(1);
});
