/**
 * Master Seed Script — Populates MongoDB with all 5 major European leagues (2026/27 Season)
 *
 * Leagues (20 teams each):
 * 1. Premier League
 * 2. La Liga
 * 3. Serie A
 * 4. Bundesliga
 * 5. Ligue 1
 *
 * Run: node seed/seed.js
 * (from the frontend/backend/ directory or via npm run seed:all)
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const League = require('../models/League');
const Club = require('../models/Club');
const Player = require('../models/Player');
const { allLeaguesData } = require('./index');

const fs = require('fs');
const CACHE_FILE = path.join(__dirname, '..', 'data', 'player_images_cache.json');
let imageCache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    imageCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    console.log(`Loaded ${Object.keys(imageCache).length} cached player images for seeding.\n`);
  } catch (e) {
    // Ignore cache load error
  }
}

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/football-game';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for master 5-league database seeding...\n');

    // Clear existing data
    await Player.deleteMany({});
    await Club.deleteMany({});
    await League.deleteMany({});
    console.log('Cleared existing database records.\n');

    let totalLeagues = 0;
    let totalClubs = 0;
    let totalPlayers = 0;

    for (const leagueData of allLeaguesData) {
      console.log(`===================================================`);
      console.log(`Seeding ${leagueData.league.name} (${leagueData.league.country})...`);

      const leagueDoc = await League.create(leagueData.league);
      totalLeagues++;

      let leaguePlayerCount = 0;
      for (const clubItem of leagueData.clubs) {
        const clubDoc = await Club.create({
          name: clubItem.name,
          stadium: clubItem.stadium,
          logo: clubItem.logo,
          league: leagueDoc._id,
        });
        totalClubs++;

        const playerDocs = clubItem.players.map((p) => {
          const cached = imageCache[p.name.trim()];
          return {
            ...p,
            club: clubDoc._id,
            league: leagueDoc._id,
            image: cached?.image || null,
            thumbnail: cached?.thumbnail || null,
            imageSource: cached?.imageSource || null,
          };
        });

        await Player.insertMany(playerDocs);
        leaguePlayerCount += playerDocs.length;
        totalPlayers += playerDocs.length;
        console.log(`  ✓ [${clubDoc.name}] - ${clubDoc.stadium} (${playerDocs.length} players)`);
      }

      console.log(`\n> Finished ${leagueData.league.name}: ${leagueData.clubs.length} clubs, ${leaguePlayerCount} players.\n`);
    }

    console.log('===================================================');
    console.log(`✅ Complete Master Seed Successful!`);
    console.log(`   - Leagues: ${totalLeagues}`);
    console.log(`   - Clubs:   ${totalClubs}`);
    console.log(`   - Players: ${totalPlayers}`);
    console.log('===================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Master seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
