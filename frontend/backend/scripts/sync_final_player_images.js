const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

async function syncAll() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  console.log('Connected to MongoDB');

  const Player = mongoose.model('Player', new mongoose.Schema({}, { strict: false }));
  const mapFile = path.join(__dirname, '../../src/data/playerImageMap.json');
  let playerImageMap = JSON.parse(fs.readFileSync(mapFile, 'utf8'));

  // Ensure Burcio has an image
  await Player.updateMany({ name: 'Hugo Burcio' }, {
    image: 'https://www.sportsbase.io/images/people/4867.png',
    thumbnail: 'https://www.sportsbase.io/images/people/4867.png',
    imageSource: 'sportsbase'
  });
  playerImageMap['Hugo Burcio'] = {
    image: 'https://www.sportsbase.io/images/people/4867.png',
    thumbnail: 'https://www.sportsbase.io/images/people/4867.png',
    imageSource: 'sportsbase',
    isCutout: false
  };

  // Sync all players from MongoDB into playerImageMap so frontend has 100% of DB photos
  const allPlayersWithImage = await Player.find({ image: { $ne: null, $nin: ['', null] } });
  console.log(`Syncing ${allPlayersWithImage.length} players with images to playerImageMap...`);

  let added = 0;
  for (const p of allPlayersWithImage) {
    if (!playerImageMap[p.name] || !playerImageMap[p.name].image || (p.image.includes('cutout') && !playerImageMap[p.name].image.includes('cutout'))) {
      playerImageMap[p.name] = {
        image: p.image,
        thumbnail: p.thumbnail || p.image,
        imageSource: p.imageSource || 'thesportsdb',
        isCutout: Boolean(p.image.includes('cutout') || p.image.startsWith('/players/'))
      };
      added++;
    }
  }
  console.log(`Updated ${added} player images in playerImageMap.json`);

  fs.writeFileSync(mapFile, JSON.stringify(playerImageMap, null, 2), 'utf8');

  // Also update seed/laligaData.js with latest player images
  const seedFile = path.join(__dirname, '../seed/laligaData.js');
  let laligaData = require(seedFile);
  let seedUpdated = 0;
  for (const club of laligaData.clubs) {
    for (const player of club.players) {
      if (playerImageMap[player.name]?.image) {
        player.image = playerImageMap[player.name].image;
        seedUpdated++;
      }
    }
  }
  const newContent = `/**
 * LaLiga 2026/27 Season Clubs and Squad Data
 * All 20 Clubs with authentic 2026/27 squads, player cutouts, and attributes.
 */

const laligaData = ${JSON.stringify(laligaData, null, 2)};

module.exports = laligaData;
`;
  fs.writeFileSync(seedFile, newContent, 'utf8');
  console.log(`Updated ${seedUpdated} players in seed/laligaData.js`);

  await mongoose.disconnect();
  console.log('Sync complete!');
}

syncAll().catch(console.error);
