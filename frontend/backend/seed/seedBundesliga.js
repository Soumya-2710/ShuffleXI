/**
 * Dedicated Seeder for 20 Bundesliga Teams & Squads (2026/27)
 * Run: node seed/seedBundesliga.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const League = require('../models/League');
const Club = require('../models/Club');
const Player = require('../models/Player');
const bundesligaData = require('./bundesligaData');

const seedBundesliga = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/football-game';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for Bundesliga seeding...');

    // 1. Find or create Bundesliga
    let league = await League.findOne({ name: bundesligaData.league.name });
    if (!league) {
      league = await League.create(bundesligaData.league);
      console.log(`✓ Created league: ${league.name}`);
    } else {
      league.logo = bundesligaData.league.logo;
      league.country = bundesligaData.league.country;
      await league.save();
      console.log(`✓ Updated league: ${league.name}`);
    }

    // 2. Remove existing clubs and players for Bundesliga
    const existingClubs = await Club.find({ league: league._id });
    const existingClubIds = existingClubs.map((c) => c._id);

    await Player.deleteMany({ club: { $in: existingClubIds } });
    await Club.deleteMany({ league: league._id });
    console.log(`Cleared existing clubs and players for ${league.name}.`);

    // 3. Insert all 20 clubs and their rosters
    let totalPlayers = 0;
    for (const clubItem of bundesligaData.clubs) {
      const club = await Club.create({
        name: clubItem.name,
        stadium: clubItem.stadium,
        logo: clubItem.logo,
        league: league._id,
      });

      const playerDocs = clubItem.players.map((p) => ({
        ...p,
        club: club._id,
        league: league._id,
      }));

      await Player.insertMany(playerDocs);
      totalPlayers += playerDocs.length;
      console.log(`  ✓ [${club.name}] - ${club.stadium} (${playerDocs.length} players)`);
    }

    console.log(`\n🎉 Successfully seeded all ${bundesligaData.clubs.length} Bundesliga clubs with ${totalPlayers} players!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Bundesliga seed failed:', error);
    process.exit(1);
  }
};

seedBundesliga();
