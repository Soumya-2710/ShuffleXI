const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const BARCA_PLAYERS_UPDATE = [
  {
    name: 'Marc-André ter Stegen',
    number: 1,
    position: 'GK',
    nationality: 'Germany',
    overall: 89,
    isStarter: true,
    pace: 45, shooting: 20, passing: 70, dribbling: 40, defending: 22, physical: 83,
    image: '/players/ter_stegen.png',
    thumbnail: '/players/ter_stegen.png',
    imageSource: 'footyrenders',
    isCutout: true
  },
  {
    name: 'Pau Cubarsí',
    number: 2,
    position: 'CB',
    nationality: 'Spain',
    overall: 80,
    isStarter: true,
    pace: 72, shooting: 42, passing: 80, dribbling: 74, defending: 82, physical: 74,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/tynei31768321729.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/tynei31768321729.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Alejandro Balde',
    number: 3,
    position: 'LB',
    nationality: 'Spain',
    overall: 81,
    isStarter: true,
    pace: 91, shooting: 50, passing: 74, dribbling: 78, defending: 75, physical: 68,
    image: '/players/balde.png',
    thumbnail: '/players/balde.png',
    imageSource: 'footyrenders',
    isCutout: true
  },
  {
    name: 'Ronald Araújo',
    number: 4,
    position: 'CB',
    nationality: 'Uruguay',
    overall: 86,
    isStarter: false,
    pace: 84, shooting: 48, passing: 66, dribbling: 64, defending: 86, physical: 85,
    image: '/players/araujo.png',
    thumbnail: '/players/araujo.png',
    imageSource: 'footyrenders',
    isCutout: true
  },
  {
    name: 'Iñigo Martínez',
    number: 5,
    position: 'CB',
    nationality: 'Spain',
    overall: 82,
    isStarter: true,
    pace: 66, shooting: 54, passing: 76, dribbling: 68, defending: 83, physical: 80,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/mo68fx1726509870.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/mo68fx1726509870.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Gavi',
    number: 6,
    position: 'CM',
    nationality: 'Spain',
    overall: 83,
    isStarter: false,
    pace: 76, shooting: 66, passing: 80, dribbling: 84, defending: 75, physical: 80,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/amm91q1726510077.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/amm91q1726510077.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Ferran Torres',
    number: 7,
    position: 'ST',
    nationality: 'Spain',
    overall: 80,
    isStarter: false,
    pace: 82, shooting: 79, passing: 77, dribbling: 80, defending: 42, physical: 68,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/feey201726510461.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/feey201726510461.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Pedri',
    number: 8,
    position: 'CM',
    nationality: 'Spain',
    overall: 86,
    isStarter: true,
    pace: 78, shooting: 69, passing: 85, dribbling: 88, defending: 68, physical: 73,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/82xtuu1726509836.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/82xtuu1726509836.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Robert Lewandowski',
    number: 9,
    position: 'ST',
    nationality: 'Poland',
    overall: 88,
    isStarter: true,
    pace: 75, shooting: 88, passing: 79, dribbling: 84, defending: 44, physical: 80,
    image: '/players/lewandowski.png',
    thumbnail: '/players/lewandowski.png',
    imageSource: 'footyrenders',
    isCutout: true
  },
  {
    name: 'Ansu Fati',
    number: 10,
    position: 'LW',
    nationality: 'Spain',
    overall: 77,
    isStarter: false,
    pace: 84, shooting: 78, passing: 73, dribbling: 80, defending: 30, physical: 60,
    image: '/players/ansu_fati.png',
    thumbnail: '/players/ansu_fati.png',
    imageSource: 'footyrenders',
    isCutout: true
  },
  {
    name: 'Raphinha',
    number: 11,
    position: 'LW',
    nationality: 'Brazil',
    overall: 86,
    isStarter: true,
    pace: 91, shooting: 82, passing: 82, dribbling: 87, defending: 55, physical: 75,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/w94spe1726510018.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/w94spe1726510018.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Iñaki Peña',
    number: 13,
    position: 'GK',
    nationality: 'Spain',
    overall: 77,
    isStarter: false,
    pace: 44, shooting: 18, passing: 68, dribbling: 34, defending: 18, physical: 72,
    image: '/players/inaki_pena.png',
    thumbnail: '/players/inaki_pena.png',
    imageSource: 'footyrenders',
    isCutout: true
  },
  {
    name: 'Rodri',
    number: 14,
    position: 'CDM',
    nationality: 'Spain',
    overall: 91,
    isStarter: true,
    pace: 66, shooting: 80, passing: 86, dribbling: 84, defending: 87, physical: 85,
    image: '/players/rodri.png',
    thumbnail: '/players/rodri.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Andreas Christensen',
    number: 15,
    position: 'CB',
    nationality: 'Denmark',
    overall: 83,
    isStarter: false,
    pace: 68, shooting: 36, passing: 74, dribbling: 70, defending: 85, physical: 76,
    image: '/players/christensen.png',
    thumbnail: '/players/christensen.png',
    imageSource: 'footyrenders',
    isCutout: true
  },
  {
    name: 'Fermín López',
    number: 16,
    position: 'CAM',
    nationality: 'Spain',
    overall: 80,
    isStarter: false,
    pace: 78, shooting: 79, passing: 77, dribbling: 80, defending: 64, physical: 72,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/4skahz1761512602.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/4skahz1761512602.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Marc Casadó',
    number: 17,
    position: 'CDM',
    nationality: 'Spain',
    overall: 81,
    isStarter: true,
    pace: 76, shooting: 64, passing: 83, dribbling: 81, defending: 81, physical: 78,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/ocpyt41768321624.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/ocpyt41768321624.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Pau Víctor',
    number: 18,
    position: 'ST',
    nationality: 'Spain',
    overall: 75,
    isStarter: false,
    pace: 80, shooting: 76, passing: 68, dribbling: 76, defending: 36, physical: 72,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/j8qs271726510493.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/j8qs271726510493.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Lamine Yamal',
    number: 19,
    position: 'RW',
    nationality: 'Spain',
    overall: 86,
    isStarter: true,
    pace: 89, shooting: 80, passing: 84, dribbling: 90, defending: 38, physical: 60,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/m9n4ja1761512633.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/m9n4ja1761512633.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Dani Olmo',
    number: 20,
    position: 'CAM',
    nationality: 'Spain',
    overall: 85,
    isStarter: true,
    pace: 79, shooting: 82, passing: 84, dribbling: 87, defending: 52, physical: 65,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/s9hzoh1725611346.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/s9hzoh1725611346.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Frenkie de Jong',
    number: 21,
    position: 'CM',
    nationality: 'Netherlands',
    overall: 87,
    isStarter: false,
    pace: 82, shooting: 69, passing: 86, dribbling: 88, defending: 77, physical: 78,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/b8k6611726510284.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/b8k6611726510284.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Jules Koundé',
    number: 23,
    position: 'RB',
    nationality: 'France',
    overall: 85,
    isStarter: true,
    pace: 84, shooting: 45, passing: 75, dribbling: 76, defending: 85, physical: 78,
    image: '/players/kounde.png',
    thumbnail: '/players/kounde.png',
    imageSource: 'footyrenders',
    isCutout: true
  },
  {
    name: 'Wojciech Szczęsny',
    number: 25,
    position: 'GK',
    nationality: 'Poland',
    overall: 84,
    isStarter: false,
    pace: 46, shooting: 18, passing: 72, dribbling: 38, defending: 18, physical: 78,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/f6c4oc1762289852.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/f6c4oc1762289852.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Marc Bernal',
    number: 28,
    position: 'CDM',
    nationality: 'Spain',
    overall: 75,
    isStarter: false,
    pace: 73, shooting: 63, passing: 77, dribbling: 76, defending: 76, physical: 78,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/wm6np51768321476.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/wm6np51768321476.png',
    imageSource: 'thesportsdb',
    isCutout: true
  },
  {
    name: 'Héctor Fort',
    number: 32,
    position: 'RB',
    nationality: 'Spain',
    overall: 74,
    isStarter: false,
    pace: 80, shooting: 50, passing: 72, dribbling: 74, defending: 73, physical: 70,
    image: '/players/hector_fort.jpg',
    thumbnail: '/players/hector_fort.jpg',
    imageSource: 'thesportsdb',
    isCutout: false
  },
  {
    name: 'Gerard Martín',
    number: 35,
    position: 'LB',
    nationality: 'Spain',
    overall: 73,
    isStarter: false,
    pace: 78, shooting: 48, passing: 68, dribbling: 70, defending: 73, physical: 72,
    image: 'https://r2.thesportsdb.com/images/media/player/cutout/ktmbzp1727027878.png',
    thumbnail: 'https://r2.thesportsdb.com/images/media/player/cutout/ktmbzp1727027878.png',
    imageSource: 'thesportsdb',
    isCutout: true
  }
];

async function run() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Club = require('../models/Club');
  const Player = require('../models/Player');
  const League = require('../models/League');

  console.log('Connecting and finding FC Barcelona...');
  const barca = await Club.findOne({ name: /Barcelona/i });
  if (!barca) {
    console.error('FC Barcelona club not found!');
    process.exit(1);
  }

  // Update Club details
  barca.stadium = 'Spotify Camp Nou';
  barca.manager = 'Hansi Flick';
  barca.founded = 1899;
  barca.shortName = 'BAR';
  barca.logo = 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg';
  await barca.save();
  console.log('Updated FC Barcelona Club details (Manager: Hansi Flick, Stadium: Spotify Camp Nou, Founded: 1899).');

  // Update backend cache & frontend playerImageMap
  const bCachePath = path.resolve(__dirname, '../data/player_images_cache.json');
  const fMapPath = path.resolve(__dirname, '../../src/data/playerImageMap.json');

  const bCache = JSON.parse(fs.readFileSync(bCachePath, 'utf8'));
  const fMap = JSON.parse(fs.readFileSync(fMapPath, 'utf8'));

  BARCA_PLAYERS_UPDATE.forEach(p => {
    const entry = {
      image: p.image,
      thumbnail: p.thumbnail,
      imageSource: p.imageSource,
      isCutout: p.isCutout
    };
    bCache[p.name] = entry;
    fMap[p.name] = entry;
  });

  fs.writeFileSync(bCachePath, JSON.stringify(bCache, null, 2));
  fs.writeFileSync(fMapPath, JSON.stringify(fMap, null, 2));
  console.log('Updated cache files with all 25 Barca players.');

  // Update MongoDB Player records
  for (const p of BARCA_PLAYERS_UPDATE) {
    const res = await Player.updateOne(
      { name: p.name, club: barca._id },
      {
        $set: {
          number: p.number,
          isStarter: p.isStarter,
          position: p.position,
          nationality: p.nationality,
          overall: p.overall,
          pace: p.pace,
          shooting: p.shooting,
          passing: p.passing,
          dribbling: p.dribbling,
          defending: p.defending,
          physical: p.physical,
          image: p.image,
          thumbnail: p.thumbnail,
          imageSource: p.imageSource
        }
      },
      { upsert: false }
    );
    console.log(`[UPDATED] #${p.number} ${p.name} -> modified: ${res.modifiedCount}`);
  }

  console.log('\nAll 25 FC Barcelona players successfully updated!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
