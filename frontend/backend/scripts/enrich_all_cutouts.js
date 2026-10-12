const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const League = require('../models/League');
const Club = require('../models/Club');
const Player = require('../models/Player');

function normalize(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

const cacheFile = path.join(__dirname, '../data/tsdb_cutouts_cache.json');
let cache = {};
if (fs.existsSync(cacheFile)) {
  try {
    cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  } catch (e) {
    cache = {};
  }
}

const mapFile = path.join(__dirname, '../../src/data/playerImageMap.json');
let playerImageMap = {};
if (fs.existsSync(mapFile)) {
  try {
    playerImageMap = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
  } catch (e) {
    playerImageMap = {};
  }
}

async function searchTSDB(name) {
  if (cache[name] !== undefined) return cache[name];

  const queries = [name, normalize(name)];
  const parts = name.split(' ');
  if (parts.length > 2) {
    queries.push(`${parts[0]} ${parts[parts.length - 1]}`);
    queries.push(parts[parts.length - 1]);
  } else if (parts.length === 2) {
    queries.push(parts[1]); // e.g. "Sow", "Carreras", "Khadra"
  }

  for (const q of queries) {
    try {
      const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(q)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) continue;
      const data = await res.json();
      const list = data?.player || [];

      // 1. First priority: exact match with strCutout
      for (const p of list) {
        if (p.strCutout && normalize(p.strPlayer).toLowerCase() === normalize(name).toLowerCase()) {
          const result = { cutout: p.strCutout, thumb: p.strThumb, name: p.strPlayer };
          cache[name] = result;
          return result;
        }
      }

      // 2. Second priority: any player in list with strCutout
      for (const p of list) {
        if (p.strCutout) {
          const result = { cutout: p.strCutout, thumb: p.strThumb, name: p.strPlayer };
          cache[name] = result;
          return result;
        }
      }

      // 3. Third priority: strThumb
      for (const p of list) {
        if (p.strThumb) {
          const result = { cutout: null, thumb: p.strThumb, name: p.strPlayer };
          cache[name] = result;
          return result;
        }
      }
    } catch (err) {
      // ignore
    }
  }

  cache[name] = null;
  return null;
}

async function run() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  console.log('Connected to MongoDB');

  // Specific high-priority names from user's screenshot first!
  const priorityNames = [
    'Djibril Sow', 'Ibrahima Sow', 'Saïdou Sow',
    'Lucas Martínez Quarta', 'Patric', 'Reda Khadra',
    'Manu Bueno', 'Santiago Bueno', 'David Bueno',
    'Davinchi', 'Hugo Burcio', 'Alejandro Primo',
    'Gorka Carrera', 'Jofre Carreras', 'Álvaro Carreras',
    'Dejan Kulusevski', 'Manolis Saliakas'
  ];

  console.log('Enriching priority players from user screenshot first...');
  for (const name of priorityNames) {
    const res = await searchTSDB(name);
    if (res && (res.cutout || res.thumb)) {
      const bestImg = res.cutout || res.thumb;
      await Player.updateMany({ name }, {
        image: bestImg,
        thumbnail: res.thumb || bestImg,
        imageSource: 'thesportsdb'
      });
      playerImageMap[name] = {
        image: bestImg,
        thumbnail: res.thumb || bestImg,
        imageSource: 'thesportsdb',
        isCutout: Boolean(res.cutout)
      };
      console.log(`[PRIORITY MATCH] ${name} -> ${bestImg} (Cutout: ${Boolean(res.cutout)})`);
    }
  }

  // Also query any players without cutouts
  const players = await Player.find({
    $or: [
      { image: null },
      { image: '' },
      { image: { $not: /cutout/ } }
    ]
  }).populate('club', 'name');

  console.log(`\nFound ${players.length} players to check for authentic cutouts.`);

  let cutoutsFound = 0;
  let thumbsFound = 0;
  let count = 0;

  for (const p of players) {
    count++;
    if (p.image && p.image.startsWith('/players/')) {
      continue;
    }

    const res = await searchTSDB(p.name);
    if (res && res.cutout) {
      await Player.findByIdAndUpdate(p._id, {
        image: res.cutout,
        thumbnail: res.thumb || res.cutout,
        imageSource: 'thesportsdb'
      });
      playerImageMap[p.name] = {
        image: res.cutout,
        thumbnail: res.thumb || res.cutout,
        imageSource: 'thesportsdb',
        isCutout: true
      };
      cutoutsFound++;
      if (cutoutsFound % 10 === 0) {
        console.log(`[${count}/${players.length}] ✨ REAL CUTOUT: ${p.name} -> ${res.cutout}`);
      }
    } else if (res && res.thumb && (!p.image || p.image === '')) {
      await Player.findByIdAndUpdate(p._id, {
        image: res.thumb,
        thumbnail: res.thumb,
        imageSource: 'thesportsdb'
      });
      playerImageMap[p.name] = {
        image: res.thumb,
        thumbnail: res.thumb,
        imageSource: 'thesportsdb',
        isCutout: false
      };
      thumbsFound++;
    }

    if (count % 30 === 0) {
      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
      fs.writeFileSync(mapFile, JSON.stringify(playerImageMap, null, 2));
      console.log(`Saved checkpoint. Progress: ${count}/${players.length} (Cutouts: ${cutoutsFound}, Thumbs: ${thumbsFound})`);
    }

    await new Promise(r => setTimeout(r, 45));
  }

  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
  fs.writeFileSync(mapFile, JSON.stringify(playerImageMap, null, 2));
  console.log(`\nALL DONE! Added ${cutoutsFound} cutouts and ${thumbsFound} thumbs.`);

  await mongoose.disconnect();
}

run().catch(console.error);
