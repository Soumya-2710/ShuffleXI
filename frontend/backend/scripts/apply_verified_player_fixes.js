const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Verified authentic image mapping
const VERIFIED_FIXES = {
  // --- FC BARCELONA ---
  'Pedri': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/82xtuu1726509836.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/82xtuu1726509836.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  'Gavi': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/amm91q1726510077.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/amm91q1726510077.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  'Pau Cubarsí': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/tynei31768321729.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/tynei31768321729.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  'Fermín López': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/4skahz1761512602.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/4skahz1761512602.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  'Marc Bernal': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/wm6np51768321476.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/wm6np51768321476.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  'Ferran Torres': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/feey201726510461.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/feey201726510461.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  'Ansu Fati': {
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/%D0%9C%D0%B0%D1%82%D1%87_%C2%AB%D0%94%D0%B8%D0%BD%D0%B0%D0%BC%D0%BE%C2%BB_-_%C2%AB%D0%91%D0%B0%D1%80%D1%81%D0%B5%D0%BB%D0%BE%D0%BD%D0%B0%C2%BB_0-1._2_%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%BF%D0%B0%D0%B4%D0%B0_2021_%D1%80%D0%BE%D0%BA%D1%83_%E2%80%94_1289339_%28cropped%29.jpg/330px-%D0%9C%D0%B0%D1%82%D1%87_%C2%AB%D0%94%D0%B8%D0%BD%D0%B0%D0%BC%D0%BE%C2%BB_-_%C2%AB%D0%91%D0%B0%D1%80%D1%81%D0%B5%D0%BB%D0%BE%D0%BD%D0%B0%C2%BB_0-1._2_%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%BF%D0%B0%D0%B4%D0%B0_2021_%D1%80%D0%BE%D0%BA%D1%83_%E2%80%94_1289339_%28cropped%29.jpg',
    thumbnail: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/%D0%9C%D0%B0%D1%82%D1%87_%C2%AB%D0%94%D0%B8%D0%BD%D0%B0%D0%BC%D0%BE%C2%BB_-_%C2%AB%D0%91%D0%B0%D1%80%D1%81%D0%B5%D0%BB%D0%BE%D0%BD%D0%B0%C2%BB_0-1._2_%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%BF%D0%B0%D0%B4%D0%B0_2021_%D1%80%D0%BE%D0%BA%D1%83_%E2%80%94_1289339_%28cropped%29.jpg/330px-%D0%9C%D0%B0%D1%82%D1%87_%C2%AB%D0%94%D0%B8%D0%BD%D0%B0%D0%BC%D0%BE%C2%BB_-_%C2%AB%D0%91%D0%B0%D1%80%D1%81%D0%B5%D0%BB%D0%BE%D0%BD%D0%B0%C2%BB_0-1._2_%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%BF%D0%B0%D0%B4%D0%B0_2021_%D1%80%D0%BE%D0%BA%D1%83_%E2%80%94_1289339_%28cropped%29.jpg',
    imageSource: 'wikipedia',
    isCutout: false
  },

  // --- REAL MADRID ---
  'Endrick': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/lhg9vv1788114231.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/lhg9vv1788114231.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  'Arda Güler': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/ye6tv41788113953.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/ye6tv41788113953.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },

  // --- MANCHESTER UNITED ---
  'Kobbie Mainoo': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/cqc0oh1789120518.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/cqc0oh1789120518.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  'Leny Yoro': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/qy4qlx1789120067.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/qy4qlx1789120067.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  'Casemiro': {
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Casemiro_Brazil_V_Morocco_13_June_2026-76_%28cropped%29.jpg/330px-Casemiro_Brazil_V_Morocco_13_June_2026-76_%28cropped%29.jpg',
    thumbnail: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Casemiro_Brazil_V_Morocco_13_June_2026-76_%28cropped%29.jpg/330px-Casemiro_Brazil_V_Morocco_13_June_2026-76_%28cropped%29.jpg',
    imageSource: 'wikipedia',
    isCutout: false
  },
  'Rasmus Højlund': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Rasmus_H%C3%B8jlund_with_a_fan.jpg',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Rasmus_H%C3%B8jlund_with_a_fan.jpg',
    imageSource: 'wikipedia',
    isCutout: false
  },
  'Antony': {
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Antony_%28cropped%29.jpg/500px-Antony_%28cropped%29.jpg',
    thumbnail: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Antony_%28cropped%29.jpg/500px-Antony_%28cropped%29.jpg',
    imageSource: 'wikipedia',
    isCutout: false
  },

  // --- ARSENAL ---
  'Ben White': {
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/Ben_White_2018.jpg/330px-Ben_White_2018.jpg',
    thumbnail: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/Ben_White_2018.jpg/330px-Ben_White_2018.jpg',
    imageSource: 'wikipedia',
    isCutout: false
  },

  // --- LIVERPOOL ---
  'Luis Díaz': {
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/FC_RB_Salzburg_gegen_FC_Bayern_M%C3%BCnchen_%282026-01-06_Testspiel%29_40_%28Luiz_D%C3%ADaz%29.jpg/500px-FC_RB_Salzburg_gegen_FC_Bayern_M%C3%BCnchen_%282026-01-06_Testspiel%29_40_%28Luiz_D%C3%ADaz%29.jpg',
    thumbnail: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/FC_RB_Salzburg_gegen_FC_Bayern_M%C3%BCnchen_%282026-01-06_Testspiel%29_40_%28Luiz_D%C3%ADaz%29.jpg/500px-FC_RB_Salzburg_gegen_FC_Bayern_M%C3%BCnchen_%282026-01-06_Testspiel%29_40_%28Luiz_D%C3%ADaz%29.jpg',
    imageSource: 'wikipedia',
    isCutout: false
  },

  // --- BAYERN MUNICH ---
  'Kim Min-jae': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/m4uh701756408877.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/m4uh701756408877.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },

  // --- PARIS SAINT-GERMAIN ---
  'Nuno Mendes': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/zhdk3h1766335452.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/zhdk3h1766335452.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },

  // --- JUVENTUS ---
  'Francisco Conceição': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/ekqivz1759225498.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/ekqivz1759225498.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  'Danilo': {
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Danilo_and_Bilal_El_Khannouss_at_2026_FIFA_World_Cup_by_YantsImages_%28cropped%29.jpg/330px-Danilo_and_Bilal_El_Khannouss_at_2026_FIFA_World_Cup_by_YantsImages_%28cropped%29.jpg',
    thumbnail: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Danilo_and_Bilal_El_Khannouss_at_2026_FIFA_World_Cup_by_YantsImages_%28cropped%29.jpg/330px-Danilo_and_Bilal_El_Khannouss_at_2026_FIFA_World_Cup_by_YantsImages_%28cropped%29.jpg',
    imageSource: 'wikipedia',
    isCutout: false
  },
  'Kenan Yıldız': {
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Kenan_Y%C4%B1ld%C4%B1z_in_the_international_match_%28March_2025%29_%28cropped%29.jpg/330px-Kenan_Y%C4%B1ld%C4%B1z_in_the_international_match_%28March_2025%29_%28cropped%29.jpg',
    thumbnail: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Kenan_Y%C4%B1ld%C4%B1z_in_the_international_match_%28March_2025%29_%28cropped%29.jpg/330px-Kenan_Y%C4%B1ld%C4%B1z_in_the_international_match_%28March_2025%29_%28cropped%29.jpg',
    imageSource: 'wikipedia',
    isCutout: false
  },

  // --- ATLETICO MADRID ---
  'Koke': {
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/dy8l941762288151.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/dy8l941762288151.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },

  // --- BAYER LEVERKUSEN ---
  'Arthur': {
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Arthur-2025.jpg/330px-Arthur-2025.jpg',
    thumbnail: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Arthur-2025.jpg/330px-Arthur-2025.jpg',
    imageSource: 'wikipedia',
    isCutout: false
  },

  // --- AC MILAN ---
  'Davide Calabria': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Calabria2022Salzburg.jpg',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Calabria2022Salzburg.jpg',
    imageSource: 'wikipedia',
    isCutout: false
  },
  'Emerson Royal': {
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Emerson_Royal_%28cropped%29.webp/500px-Emerson_Royal_%28cropped%29.webp',
    thumbnail: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Emerson_Royal_%28cropped%29.webp/500px-Emerson_Royal_%28cropped%29.webp',
    imageSource: 'wikipedia',
    isCutout: false
  },
  'Tammy Abraham': {
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/FC_Salzburg_gegen_AS_Roma_%28UEFA_Euroleague_play-off%2C_2023-02-16%29_39_%28cropped2%29.jpg/500px-FC_Salzburg_gegen_AS_Roma_%28UEFA_Euroleague_play-off%2C_2023-02-16%29_39_%28cropped2%29.jpg',
    thumbnail: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/FC_Salzburg_gegen_AS_Roma_%28UEFA_Euroleague_play-off%2C_2023-02-16%29_39_%28cropped2%29.jpg/500px-FC_Salzburg_gegen_AS_Roma_%28UEFA_Euroleague_play-off%2C_2023-02-16%29_39_%28cropped2%29.jpg',
    imageSource: 'wikipedia',
    isCutout: false
  },

  // --- INTER MILAN ---
  'Mehdi Taremi': {
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Iran_-_Japan%2C_AFC_Asian_Cup_2019_42_%28cropped%29.jpg',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Iran_-_Japan%2C_AFC_Asian_Cup_2019_42_%28cropped%29.jpg',
    imageSource: 'wikipedia',
    isCutout: false
  },
  'Matteo Darmian': {
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/20150616_-_Portugal_-_Italie_-_Gen%C3%A8ve_-_Matteo_Darmian_1.jpg/330px-20150616_-_Portugal_-_Italie_-_Gen%C3%A8ve_-_Matteo_Darmian_1.jpg',
    thumbnail: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/20150616_-_Portugal_-_Italie_-_Gen%C3%A8ve_-_Matteo_Darmian_1.jpg/330px-20150616_-_Portugal_-_Italie_-_Gen%C3%A8ve_-_Matteo_Darmian_1.jpg',
    imageSource: 'wikipedia',
    isCutout: false
  }
};

async function applyFixes() {
  const backendCachePath = path.resolve(__dirname, '../data/player_images_cache.json');
  const frontendMapPath = path.resolve(__dirname, '../../src/data/playerImageMap.json');

  const bCache = JSON.parse(fs.readFileSync(backendCachePath, 'utf8'));
  const fMap = JSON.parse(fs.readFileSync(frontendMapPath, 'utf8'));

  Object.entries(VERIFIED_FIXES).forEach(([name, data]) => {
    bCache[name] = data;
    fMap[name] = data;
  });

  fs.writeFileSync(backendCachePath, JSON.stringify(bCache, null, 2));
  fs.writeFileSync(frontendMapPath, JSON.stringify(fMap, null, 2));
  console.log(`Updated cache files with ${Object.keys(VERIFIED_FIXES).length} verified player fixes.`);

  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Player = require('../models/Player');

  let updatedCount = 0;
  for (const [name, data] of Object.entries(VERIFIED_FIXES)) {
    const res = await Player.updateOne(
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
    if (res.modifiedCount > 0) {
      updatedCount++;
      console.log(`[DB UPDATED] ${name}`);
    } else {
      console.log(`[DB MATCHED/UNCHANGED] ${name}`);
    }
  }

  console.log(`\nSuccessfully applied all fixes! Total DB modified: ${updatedCount}`);
  process.exit(0);
}

applyFixes().catch(err => {
  console.error(err);
  process.exit(1);
});
