const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const FIXES = {
  'Bernardo Silva': {
    image: '/players/bernardo_silva.png',
    thumbnail: '/players/bernardo_silva.png',
    imageSource: 'footyrenders',
    isCutout: true
  },
  'Ederson': {
    image: '/players/ederson.png',
    thumbnail: '/players/ederson.png',
    imageSource: 'footyrenders',
    isCutout: true
  },
  'Florian Wirtz': {
    image: '/players/florian_wirtz.png',
    thumbnail: '/players/florian_wirtz.png',
    imageSource: 'footyrenders',
    isCutout: true
  },
  'Gianluigi Donnarumma': {
    image: '/players/donnarumma.png',
    thumbnail: '/players/donnarumma.png',
    imageSource: 'footyrenders',
    isCutout: true
  },
  'Joan García': {
    image: '/players/joan_garcia.png',
    thumbnail: '/players/joan_garcia.png',
    imageSource: 'thesportsdb',
    isCutout: true
  }
};

async function apply() {
  const src = 'C:/Users/asus/.gemini/antigravity-ide/brain/ff1100fa-2846-4263-857d-6ca1f6fe22ed/scratch/joan_garcia.png';
  const dst = path.resolve(__dirname, '../../public/players/joan_garcia.png');
  if (fs.existsSync(src)) fs.copyFileSync(src, dst);

  const bCachePath = path.resolve(__dirname, '../data/player_images_cache.json');
  const fMapPath = path.resolve(__dirname, '../../src/data/playerImageMap.json');

  const bCache = JSON.parse(fs.readFileSync(bCachePath, 'utf8'));
  const fMap = JSON.parse(fs.readFileSync(fMapPath, 'utf8'));

  Object.entries(FIXES).forEach(([name, data]) => {
    bCache[name] = data;
    fMap[name] = data;
  });

  fs.writeFileSync(bCachePath, JSON.stringify(bCache, null, 2));
  fs.writeFileSync(fMapPath, JSON.stringify(fMap, null, 2));

  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Player = require('../models/Player');

  for (const [name, data] of Object.entries(FIXES)) {
    const res = await Player.updateMany(
      { name },
      {
        $set: {
          image: data.image,
          thumbnail: data.thumbnail,
          imageSource: data.imageSource,
          isCutout: data.isCutout
        }
      }
    );
    console.log(`[DB UPDATED] ${name}: ${res.modifiedCount} matches`);
  }

  process.exit(0);
}

apply();
