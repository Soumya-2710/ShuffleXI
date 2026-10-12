const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const backendCachePath = path.resolve(__dirname, '../data/player_images_cache.json');
const frontendMapPath = path.resolve(__dirname, '../../src/data/playerImageMap.json');

const bCache = JSON.parse(fs.readFileSync(backendCachePath, 'utf8'));
const fMap = JSON.parse(fs.readFileSync(frontendMapPath, 'utf8'));

const rodriData = {
  image: '/players/rodri.png',
  thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/6ggnc31769182523.png',
  imageSource: 'thesportsdb',
  isCutout: true
};

const kdbData = {
  image: '/players/kevin_de_bruyne.png',
  thumbnail: 'https://www.footyrenders.com/render/kevin-de-bruyne-53.png',
  imageSource: 'thesportsdb',
  isCutout: true
};

bCache['Rodri'] = rodriData;
bCache['Rodrigo Cascante'] = rodriData;
bCache['Rodrigo Hernández'] = rodriData;
bCache['Rodrigo Hernandez'] = rodriData;
bCache['Kevin De Bruyne'] = kdbData;

fMap['Rodri'] = rodriData;
fMap['Rodrigo Cascante'] = rodriData;
fMap['Rodrigo Hernández'] = rodriData;
fMap['Rodrigo Hernandez'] = rodriData;
fMap['Kevin De Bruyne'] = kdbData;

fs.writeFileSync(backendCachePath, JSON.stringify(bCache, null, 2));
fs.writeFileSync(frontendMapPath, JSON.stringify(fMap, null, 2));
console.log('Caches updated successfully.');

mongoose.connect('mongodb://localhost:27017/football-game').then(async () => {
  const Player = mongoose.model('Player', new mongoose.Schema({}, { strict: false }));
  const Club = mongoose.model('Club', new mongoose.Schema({}, { strict: false }));
  const League = mongoose.model('League', new mongoose.Schema({}, { strict: false }));

  const barca = await Club.findOne({ name: 'FC Barcelona' });
  const laLiga = await League.findOne({ name: 'La Liga' });
  const manCity = await Club.findOne({ name: 'Manchester City' });

  console.log('Barca:', barca?.name, barca?._id);
  console.log('La Liga:', laLiga?.name, laLiga?._id);
  console.log('Man City:', manCity?.name, manCity?._id);

  if (barca && laLiga) {
    const rodriUpdate = await Player.updateOne(
      { name: 'Rodri' },
      {
        $set: {
          club: barca._id,
          league: laLiga._id,
          image: '/players/rodri.png',
          thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/6ggnc31769182523.png',
          imageSource: 'thesportsdb',
          isCutout: true
        }
      }
    );
    console.log('Rodri MongoDB update:', rodriUpdate);
  }

  if (manCity) {
    const kdbUpdate = await Player.updateOne(
      { name: 'Kevin De Bruyne' },
      {
        $set: {
          club: manCity._id,
          image: '/players/kevin_de_bruyne.png',
          thumbnail: 'https://www.footyrenders.com/render/kevin-de-bruyne-53.png',
          imageSource: 'thesportsdb',
          isCutout: true
        }
      }
    );
    console.log('KDB MongoDB update:', kdbUpdate);
  }

  // Verify
  const updatedRodri = await Player.findOne({ name: 'Rodri' }).populate('club').populate('league');
  const updatedKdb = await Player.findOne({ name: 'Kevin De Bruyne' }).populate('club');

  console.log('VERIFIED RODRI:', {
    name: updatedRodri.name,
    club: updatedRodri.club?.name,
    league: updatedRodri.league?.name,
    image: updatedRodri.image,
    thumbnail: updatedRodri.thumbnail
  });

  console.log('VERIFIED KDB:', {
    name: updatedKdb.name,
    club: updatedKdb.club?.name,
    image: updatedKdb.image,
    thumbnail: updatedKdb.thumbnail
  });

  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
