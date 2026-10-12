const mongoose = require('mongoose');
const fs = require('fs');
const https = require('https');

async function inspectBarcaDetails() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Club = require('../models/Club');
  const Player = require('../models/Player');
  
  const barca = await Club.findOne({ name: /Barcelona/i });
  const players = await Player.find({ club: barca._id }).sort({ overall: -1 });

  const summary = players.map(p => ({
    name: p.name,
    number: p.number,
    overall: p.overall,
    position: p.position,
    nationality: p.nationality,
    image: p.image,
    imageSource: p.imageSource,
    isCutout: p.isCutout
  }));

  fs.writeFileSync('./scripts/barca_current_players.json', JSON.stringify(summary, null, 2));
  console.log(`Saved ${summary.length} Barca players to barca_current_players.json`);
  process.exit(0);
}

inspectBarcaDetails();
