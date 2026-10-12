const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

async function cleanPlaceholders() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Player = mongoose.model('Player', new mongoose.Schema({}, { strict: false }));

  const count = await Player.countDocuments({ image: /no_player/ });
  console.log('Players with generic placeholder:', count);

  const res = await Player.updateMany({ image: /no_player/ }, { $set: { image: null, thumbnail: null } });
  console.log('Cleaned up in MongoDB:', res.modifiedCount);

  // Also clean from playerImageMap
  const mapFile = path.join(__dirname, '../../src/data/playerImageMap.json');
  let map = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
  let mapCleaned = 0;
  for (const [k, v] of Object.entries(map)) {
    if (v && v.image && v.image.includes('no_player')) {
      delete map[k];
      mapCleaned++;
    }
  }
  fs.writeFileSync(mapFile, JSON.stringify(map, null, 2), 'utf8');
  console.log('Cleaned from playerImageMap.json:', mapCleaned);

  await mongoose.disconnect();
}

cleanPlaceholders().catch(console.error);
