const mongoose = require('mongoose');

async function checkDbPlayers() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Player = require('../models/Player');
  const Club = require('../models/Club');
  const League = require('../models/League');

  const laliga = await League.findOne({ name: 'La Liga' });
  const laligaPlayers = await Player.find({ league: laliga._id }).populate('club', 'name');

  console.log(`Current La Liga players in DB: ${laligaPlayers.length}`);
  const withImages = laligaPlayers.filter(p => p.image);
  console.log(`With images: ${withImages.length}`);
  console.log('Sample with images:');
  withImages.slice(0, 10).forEach(p => console.log(` - ${p.name} (${p.club?.name}): ${p.image}`));

  await mongoose.disconnect();
}

checkDbPlayers().catch(console.error);
