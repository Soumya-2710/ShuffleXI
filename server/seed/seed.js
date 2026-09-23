/**
 * Seed script — populates MongoDB with test data.
 *
 * Run: node seed/seed.js
 * (from the server/ directory)
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const League = require('../models/League');
const Club = require('../models/Club');
const Player = require('../models/Player');

const seedData = {
  leagues: [
    { name: 'Premier League', country: 'England' },
    { name: 'La Liga', country: 'Spain' },
  ],
  clubs: {
    'Premier League': [
      { name: 'London City FC', stadium: 'City Arena' },
      { name: 'Manchester Eagles', stadium: 'Eagle Park' },
      { name: 'Liverpool Reds', stadium: 'Redfield Stadium' },
    ],
    'La Liga': [
      { name: 'Madrid Royals', stadium: 'Royal Bernabéu' },
      { name: 'Barcelona Stars', stadium: 'Camp Estrella' },
      { name: 'Sevilla United', stadium: 'Estadio Unido' },
    ],
  },
  players: {
    'London City FC': [
      { name: 'James Parker', position: 'GK', nationality: 'England', overall: 83, pace: 45, shooting: 20, passing: 55, dribbling: 30, defending: 25, physical: 78 },
      { name: 'Marcus Stone', position: 'CB', nationality: 'England', overall: 81, pace: 68, shooting: 42, passing: 60, dribbling: 55, defending: 82, physical: 80 },
      { name: 'Leo Fernandez', position: 'LB', nationality: 'Spain', overall: 79, pace: 82, shooting: 50, passing: 70, dribbling: 72, defending: 75, physical: 68 },
      { name: 'David Chen', position: 'RB', nationality: 'China', overall: 77, pace: 80, shooting: 45, passing: 65, dribbling: 68, defending: 73, physical: 72 },
      { name: 'Ryan Mitchell', position: 'CM', nationality: 'Ireland', overall: 80, pace: 72, shooting: 65, passing: 82, dribbling: 78, defending: 65, physical: 70 },
      { name: 'Thomas Wright', position: 'CDM', nationality: 'England', overall: 78, pace: 65, shooting: 50, passing: 75, dribbling: 62, defending: 80, physical: 82 },
      { name: 'Kai Tanaka', position: 'RW', nationality: 'Japan', overall: 84, pace: 90, shooting: 78, passing: 72, dribbling: 86, defending: 35, physical: 60 },
      { name: 'Oliver Grant', position: 'ST', nationality: 'England', overall: 85, pace: 85, shooting: 88, passing: 65, dribbling: 80, defending: 30, physical: 75 },
    ],
    'Manchester Eagles': [
      { name: 'Erik Sorensen', position: 'GK', nationality: 'Denmark', overall: 85, pace: 42, shooting: 18, passing: 60, dribbling: 28, defending: 22, physical: 82 },
      { name: 'Jack Thompson', position: 'CB', nationality: 'England', overall: 83, pace: 65, shooting: 38, passing: 62, dribbling: 50, defending: 85, physical: 84 },
      { name: 'Andre Silva', position: 'CB', nationality: 'Portugal', overall: 82, pace: 62, shooting: 40, passing: 58, dribbling: 48, defending: 83, physical: 82 },
      { name: 'Liam O\'Brien', position: 'LB', nationality: 'Ireland', overall: 78, pace: 84, shooting: 48, passing: 68, dribbling: 70, defending: 74, physical: 70 },
      { name: 'Marco Rossi', position: 'CM', nationality: 'Italy', overall: 86, pace: 74, shooting: 72, passing: 88, dribbling: 84, defending: 60, physical: 68 },
      { name: 'Yusuf Demir', position: 'CAM', nationality: 'Turkey', overall: 82, pace: 78, shooting: 75, passing: 80, dribbling: 82, defending: 40, physical: 62 },
      { name: 'Nathan Brooks', position: 'LW', nationality: 'England', overall: 81, pace: 88, shooting: 74, passing: 70, dribbling: 83, defending: 32, physical: 65 },
      { name: 'Carlos Vega', position: 'ST', nationality: 'Argentina', overall: 87, pace: 82, shooting: 90, passing: 68, dribbling: 82, defending: 28, physical: 78 },
    ],
    'Liverpool Reds': [
      { name: 'Alisson Costa', position: 'GK', nationality: 'Brazil', overall: 86, pace: 48, shooting: 15, passing: 62, dribbling: 32, defending: 20, physical: 80 },
      { name: 'Ben Carter', position: 'CB', nationality: 'England', overall: 80, pace: 66, shooting: 35, passing: 55, dribbling: 45, defending: 80, physical: 78 },
      { name: 'Riku Hayashi', position: 'RB', nationality: 'Japan', overall: 79, pace: 85, shooting: 52, passing: 72, dribbling: 74, defending: 72, physical: 66 },
      { name: 'Patrick Murphy', position: 'CDM', nationality: 'Ireland', overall: 81, pace: 68, shooting: 55, passing: 78, dribbling: 65, defending: 82, physical: 80 },
      { name: 'Samuel Mensah', position: 'CM', nationality: 'Ghana', overall: 83, pace: 76, shooting: 68, passing: 84, dribbling: 80, defending: 62, physical: 72 },
      { name: 'Lucas Dupont', position: 'LW', nationality: 'France', overall: 84, pace: 92, shooting: 76, passing: 74, dribbling: 88, defending: 30, physical: 58 },
      { name: 'Ahmed Hassan', position: 'RW', nationality: 'Egypt', overall: 82, pace: 86, shooting: 78, passing: 70, dribbling: 84, defending: 34, physical: 62 },
      { name: 'Connor Davies', position: 'ST', nationality: 'Wales', overall: 83, pace: 80, shooting: 85, passing: 62, dribbling: 78, defending: 32, physical: 76 },
    ],
    'Madrid Royals': [
      { name: 'Diego Navarro', position: 'GK', nationality: 'Spain', overall: 87, pace: 44, shooting: 16, passing: 65, dribbling: 30, defending: 24, physical: 84 },
      { name: 'Sergio Ramos Jr', position: 'CB', nationality: 'Spain', overall: 84, pace: 70, shooting: 50, passing: 65, dribbling: 52, defending: 88, physical: 86 },
      { name: 'Luca Bianchi', position: 'CB', nationality: 'Italy', overall: 82, pace: 64, shooting: 42, passing: 60, dribbling: 50, defending: 84, physical: 80 },
      { name: 'Felipe Santos', position: 'LB', nationality: 'Brazil', overall: 80, pace: 86, shooting: 52, passing: 72, dribbling: 74, defending: 76, physical: 70 },
      { name: 'Alejandro Cruz', position: 'CM', nationality: 'Spain', overall: 85, pace: 70, shooting: 70, passing: 86, dribbling: 82, defending: 65, physical: 72 },
      { name: 'Hugo Martin', position: 'CAM', nationality: 'France', overall: 83, pace: 76, shooting: 78, passing: 82, dribbling: 84, defending: 38, physical: 60 },
      { name: 'Raul Jimenez Jr', position: 'LW', nationality: 'Mexico', overall: 82, pace: 88, shooting: 76, passing: 70, dribbling: 85, defending: 30, physical: 64 },
      { name: 'Pedro Alvarez', position: 'ST', nationality: 'Spain', overall: 88, pace: 84, shooting: 92, passing: 70, dribbling: 84, defending: 26, physical: 80 },
    ],
    'Barcelona Stars': [
      { name: 'Marc Ter Waal', position: 'GK', nationality: 'Germany', overall: 88, pace: 46, shooting: 14, passing: 68, dribbling: 34, defending: 22, physical: 82 },
      { name: 'Jordi Alba Jr', position: 'LB', nationality: 'Spain', overall: 81, pace: 88, shooting: 55, passing: 78, dribbling: 76, defending: 72, physical: 66 },
      { name: 'Gerard Pique Jr', position: 'CB', nationality: 'Spain', overall: 83, pace: 60, shooting: 48, passing: 68, dribbling: 55, defending: 86, physical: 82 },
      { name: 'Ronald Koeman Jr', position: 'RB', nationality: 'Netherlands', overall: 79, pace: 78, shooting: 50, passing: 70, dribbling: 72, defending: 74, physical: 68 },
      { name: 'Frenkie De Boer', position: 'CM', nationality: 'Netherlands', overall: 87, pace: 78, shooting: 68, passing: 90, dribbling: 88, defending: 62, physical: 66 },
      { name: 'Ansu Traore', position: 'RW', nationality: 'Mali', overall: 84, pace: 92, shooting: 80, passing: 72, dribbling: 90, defending: 28, physical: 58 },
      { name: 'Memphis Dijk', position: 'ST', nationality: 'Netherlands', overall: 85, pace: 80, shooting: 86, passing: 72, dribbling: 82, defending: 30, physical: 78 },
      { name: 'Gavi Torres', position: 'CDM', nationality: 'Spain', overall: 82, pace: 72, shooting: 58, passing: 82, dribbling: 78, defending: 78, physical: 74 },
    ],
    'Sevilla United': [
      { name: 'Antonio Ruiz', position: 'GK', nationality: 'Spain', overall: 80, pace: 40, shooting: 12, passing: 52, dribbling: 26, defending: 20, physical: 76 },
      { name: 'Ivan Petrovic', position: 'CB', nationality: 'Serbia', overall: 79, pace: 66, shooting: 38, passing: 55, dribbling: 48, defending: 80, physical: 78 },
      { name: 'Daniel Reyes', position: 'CB', nationality: 'Spain', overall: 78, pace: 62, shooting: 36, passing: 52, dribbling: 45, defending: 78, physical: 76 },
      { name: 'Mateo Garcia', position: 'RB', nationality: 'Colombia', overall: 77, pace: 82, shooting: 48, passing: 66, dribbling: 70, defending: 72, physical: 68 },
      { name: 'Pablo Herrera', position: 'CM', nationality: 'Spain', overall: 80, pace: 70, shooting: 65, passing: 80, dribbling: 76, defending: 62, physical: 70 },
      { name: 'Omar Benali', position: 'LW', nationality: 'Morocco', overall: 81, pace: 90, shooting: 72, passing: 68, dribbling: 84, defending: 28, physical: 60 },
      { name: 'Esteban Lopez', position: 'CF', nationality: 'Spain', overall: 79, pace: 76, shooting: 80, passing: 65, dribbling: 74, defending: 32, physical: 72 },
      { name: 'Viktor Novak', position: 'CAM', nationality: 'Croatia', overall: 80, pace: 74, shooting: 72, passing: 78, dribbling: 80, defending: 42, physical: 64 },
    ],
  },
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Player.deleteMany({});
    await Club.deleteMany({});
    await League.deleteMany({});
    console.log('Cleared existing data.');

    // Insert leagues
    const leagueMap = {};
    for (const leagueData of seedData.leagues) {
      const league = await League.create(leagueData);
      leagueMap[league.name] = league;
      console.log(`  ✓ League: ${league.name}`);
    }

    // Insert clubs
    const clubMap = {};
    for (const [leagueName, clubs] of Object.entries(seedData.clubs)) {
      const league = leagueMap[leagueName];
      for (const clubData of clubs) {
        const club = await Club.create({ ...clubData, league: league._id });
        clubMap[club.name] = club;
        console.log(`    ✓ Club: ${club.name} (${leagueName})`);
      }
    }

    // Insert players
    let playerCount = 0;
    for (const [clubName, players] of Object.entries(seedData.players)) {
      const club = clubMap[clubName];
      const league = club.league;
      for (const playerData of players) {
        await Player.create({ ...playerData, club: club._id, league });
        playerCount++;
      }
      console.log(`      ✓ ${players.length} players for ${clubName}`);
    }

    console.log(`\n✅ Seed complete: ${seedData.leagues.length} leagues, ${Object.keys(clubMap).length} clubs, ${playerCount} players`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
