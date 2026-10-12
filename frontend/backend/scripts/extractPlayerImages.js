/**
 * High-Performance FIFA / EA Sports FC Player Image Extractor & Cache Generator
 *
 * Extracts player headshots and cutouts from:
 * 1. TheSportsDB API (official transparent EA Sports FC cutout PNGs & renders)
 * 2. Wikipedia REST Summary API with athlete disambiguation fallback
 *
 * Caches results in frontend/backend/data/player_images_cache.json
 * Automatically syncs to frontend/src/data/playerImageMap.json
 * Updates MongoDB Player documents directly.
 *
 * Usage:
 *   node scripts/extractPlayerImages.js --all          # Runs across all players in database
 *   node scripts/extractPlayerImages.js --limit 300    # Extracts next 300 players
 *   node scripts/extractPlayerImages.js --sync         # Syncs existing cache into MongoDB & frontend
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Player = require('../models/Player');

const BACKEND_CACHE_FILE = path.join(__dirname, '..', 'data', 'player_images_cache.json');
const FRONTEND_CACHE_FILE = path.join(__dirname, '..', '..', 'src', 'data', 'playerImageMap.json');

// Nickname and alias map for FIFA/EA Sports players
const PLAYER_ALIASES = {
  Rodri: 'Rodrigo Cascante',
  'Rodrigo Hernández': 'Rodrigo Cascante',
  'Rodrigo Hernandez': 'Rodrigo Cascante',
  Savinho: 'Savio',
  Gavi: 'Pablo Gavi',
  Koke: 'Jorge Resurrección Merodio',
  'Anthony Gordon': 'Anthony Gordon',
  'Luis Díaz': 'Luis Diaz',
  'Ben White': 'Benjamin White',
  'Nick Pope': 'Nicholas Pope',
  'Nuno Mendes': 'Nuno Alexandre Tavares Mendes',
  'Lucas Paquetá': 'Lucas Paqueta',
  'Manuel Ugarte': 'Manuel Ugarte Ribeiro',
  'Kim Min-jae': 'Kim Min-jae',
  'Marc-André ter Stegen': 'Marc-Andre ter Stegen',
  'Wojciech Szczęsny': 'Wojciech Szczesny',
  'Martin Ødegaard': 'Martin Odegaard',
  'Alexander Sørloth': 'Alexander Sorloth',
  'Nicolò Barella': 'Nicolo Barella',
  'Hakan Çalhanoğlu': 'Hakan Calhanoglu',
  'Dušan Vlahović': 'Dusan Vlahovic',
  'Teun Koopmeiners': 'Teun Koopmeiners',
  'Éderson': 'Ederson dos Santos',
  'Ederson': 'Ederson Moraes',
  'Alisson Becker': 'Alisson',
  'Gabriel Magalhães': 'Gabriel Magalhaes',
  'Jurriën Timber': 'Jurrien Timber',
  'Rúben Dias': 'Ruben Dias',
  'Matthijs de Ligt': 'Matthijs de Ligt',
  'João Neves': 'Joao Neves',
  'João Palhinha': 'Joao Palhinha',
  'João Félix': 'Joao Felix',
  'Vitinha': 'Vitinha',
  'Lee Kang-in': 'Kang-in Lee',
  'Takefusa Kubo': 'Takefusa Kubo',
  'Arda Güler': 'Arda Guler',
  'Endrick': 'Endrick',
  'Lamine Yamal': 'Lamine Yamal',
  'Pau Cubarsí': 'Pau Cubarsi',
  'Leny Yoro': 'Leny Yoro',
  'Joshua Zirkzee': 'Joshua Zirkzee',
  'Cole Palmer': 'Cole Palmer',
  'Bradley Barcola': 'Bradley Barcola',
  'Warren Zaïre-Emery': 'Warren Zaire-Emery',
  'Kobbie Mainoo': 'Kobbie Mainoo',
};

// Helper to normalize names (strip accents, diacritics)
function normalizeName(name) {
  if (!name) return '';
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/İ/g, 'I')
    .replace(/ı/g, 'i')
    .replace(/ø/gi, 'o')
    .replace(/æ/gi, 'ae')
    .replace(/ß/g, 'ss')
    .trim();
}

// Load cache
function loadCache() {
  try {
    if (fs.existsSync(BACKEND_CACHE_FILE)) {
      const raw = fs.readFileSync(BACKEND_CACHE_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('⚠️ Could not load cache, starting fresh:', err.message);
  }
  return {};
}

// Save cache to both backend and frontend
function saveCache(cache) {
  try {
    const jsonStr = JSON.stringify(cache, null, 2);
    fs.writeFileSync(BACKEND_CACHE_FILE, jsonStr, 'utf-8');
    const frontendDir = path.dirname(FRONTEND_CACHE_FILE);
    if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir, { recursive: true });
    fs.writeFileSync(FRONTEND_CACHE_FILE, jsonStr, 'utf-8');
  } catch (err) {
    console.error('❌ Failed to save cache:', err.message);
  }
}

// Sleep helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch from TheSportsDB
async function fetchTheSportsDB(playerName) {
  const namesToTry = [playerName];
  if (PLAYER_ALIASES[playerName]) namesToTry.push(PLAYER_ALIASES[playerName]);

  for (const name of namesToTry) {
    try {
      const clean = normalizeName(name);
      const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(clean)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) continue;
      const data = await res.json();
      if (!data || !data.player || !data.player.length) continue;

      const p = data.player[0];
      const cutout = p.strCutout || p.strRender;
      const thumb = p.strThumb;

      if (cutout) {
        return {
          image: cutout,
          thumbnail: thumb || cutout,
          imageSource: 'thesportsdb',
          isCutout: true,
        };
      }

      if (thumb) {
        return {
          image: thumb,
          thumbnail: thumb,
          imageSource: 'thesportsdb',
          isCutout: false,
        };
      }
    } catch (e) {
      // Ignore network timeout
    }
  }
  return null;
}

// Fetch from Wikipedia REST API with disambiguation fallback
async function fetchWikipedia(playerName) {
  const clean = normalizeName(playerName).replace(/\s+/g, '_');
  const attempts = [clean, `${clean}_(footballer)`, `${clean}_(soccer)`];

  for (const query of attempts) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(url, {
        headers: {
          'User-Agent': 'FootballGameSquadBuilder/2.0 (contact: admin@footballgame.local)',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) continue;
      const data = await res.json();
      if (data.thumbnail && data.thumbnail.source) {
        return {
          image: data.thumbnail.source,
          thumbnail: data.thumbnail.source,
          imageSource: 'wikipedia',
          isCutout: false,
        };
      }
    } catch (e) {
      // Ignore
    }
  }
  return null;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const syncOnly = args.includes('--sync');
  const allPlayers = args.includes('--all');
  const limitArgIdx = args.indexOf('--limit');
  const limit = limitArgIdx !== -1 ? parseInt(args[limitArgIdx + 1], 10) : (allPlayers ? null : null);

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/football-game';
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB.\n');

  const cache = loadCache();
  const cachedKeys = Object.keys(cache);
  console.log(`📦 Loaded local cache with ${cachedKeys.length} existing player entries.`);

  // If sync only, apply cache to MongoDB & frontend
  if (syncOnly) {
    console.log('⚡ Syncing cache entries to MongoDB & Frontend...');
    let updated = 0;
    for (const [name, info] of Object.entries(cache)) {
      if (info && info.image) {
        const res = await Player.updateMany(
          { name },
          {
            $set: {
              image: info.image,
              thumbnail: info.thumbnail,
              imageSource: info.imageSource,
            },
          }
        );
        updated += res.modifiedCount;
      }
    }
    saveCache(cache);
    console.log(`✅ Synced ${updated} player records in MongoDB with image URLs.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  // Query players sorted by overall descending (top players first)
  let query = Player.find({}).sort({ overall: -1 });
  if (limit) {
    query = query.limit(limit);
    console.log(`🎯 Targeting ${limit} players...`);
  } else {
    console.log('🎯 Targeting all 2026/27 players across all 100 teams...');
  }

  const players = await query.exec();
  console.log(`Found ${players.length} players to process.\n`);

  let fetchedFromWeb = 0;
  let cacheHits = 0;
  let cutoutsCount = 0;
  let wikiCount = 0;
  let missingCount = 0;

  // Concurrency pool (5 workers)
  const CONCURRENCY = 5;
  const uncachedPlayers = players.filter((p) => cache[p.name.trim()] === undefined);
  cacheHits = players.length - uncachedPlayers.length;

  console.log(`⚡ ${cacheHits} already cached. Processing ${uncachedPlayers.length} uncached players with ${CONCURRENCY} parallel workers...\n`);

  async function processPlayer(player, idx, total) {
    const key = player.name.trim();

    // 1. Try TheSportsDB
    let result = await fetchTheSportsDB(player.name);

    // 2. Fallback to Wikipedia
    if (!result) {
      result = await fetchWikipedia(player.name);
    }

    if (result) {
      cache[key] = result;
      fetchedFromWeb++;
      if (result.isCutout) cutoutsCount++;
      if (result.imageSource === 'wikipedia') wikiCount++;
      console.log(`[${idx + 1}/${total}] "${player.name}" -> ✓ ${result.imageSource.toUpperCase()} (${result.isCutout ? 'Cutout PNG' : 'Photo'})`);
    } else {
      cache[key] = { image: null, thumbnail: null, imageSource: null, fallback: true };
      missingCount++;
      console.log(`[${idx + 1}/${total}] "${player.name}" -> ✗ No image found`);
    }

    // Update in MongoDB
    if (result && result.image) {
      await Player.updateOne(
        { _id: player._id },
        {
          $set: {
            image: result.image,
            thumbnail: result.thumbnail,
            imageSource: result.imageSource,
          },
        }
      );
    }
  }

  // Worker loop
  let currentIndex = 0;
  async function worker() {
    while (currentIndex < uncachedPlayers.length) {
      const idx = currentIndex++;
      const player = uncachedPlayers[idx];
      await processPlayer(player, idx, uncachedPlayers.length);
      await sleep(100); // Polite throttling
      if (idx % 25 === 0) {
        saveCache(cache);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  // Sync remaining cached players into MongoDB to ensure 100% sync
  for (const player of players) {
    const cached = cache[player.name.trim()];
    if (cached && cached.image && !player.image) {
      await Player.updateOne(
        { _id: player._id },
        {
          $set: {
            image: cached.image,
            thumbnail: cached.thumbnail,
            imageSource: cached.imageSource,
          },
        }
      );
    }
  }

  // Final cache save
  saveCache(cache);

  console.log('\n===================================================');
  console.log('🎉 2026/27 Player Image Extraction & Sync Complete!');
  console.log(`   - Total Processed: ${players.length}`);
  console.log(`   - Cache Hits:      ${cacheHits}`);
  console.log(`   - Web Fetched:     ${fetchedFromWeb}`);
  console.log(`   - Cutouts (PNG):   ${cutoutsCount}`);
  console.log(`   - Wikipedia:       ${wikiCount}`);
  console.log(`   - Missing/Fallback:${missingCount}`);
  console.log(`   - Total in Cache:  ${Object.keys(cache).length} players stored`);
  console.log('===================================================\n');

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Fatal error in extractor:', err);
  process.exit(1);
});
