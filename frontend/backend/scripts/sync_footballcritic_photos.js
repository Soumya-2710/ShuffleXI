const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function normalizeName(str) {
  if (!str) return '';
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

async function run() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  console.log('Connected to MongoDB');

  const League = require('../models/League');
  const Club = require('../models/Club');
  const Player = require('../models/Player');

  const fcPlayers = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/footballcritic_laliga_2026_27.json'), 'utf8'));
  const laliga = await League.findOne({ name: 'La Liga' });
  const dbPlayers = await Player.find({ league: laliga._id }).populate('club', 'name');

  console.log(`DB La Liga players: ${dbPlayers.length}`);
  console.log(`FootballCritic players available: ${fcPlayers.length}`);

  // Build lookup map from FootballCritic
  const fcByName = new Map();
  fcPlayers.forEach(p => {
    if (p.photoUrl) {
      fcByName.set(p.name.toLowerCase().trim(), p.photoUrl);
      fcByName.set(normalizeName(p.name), p.photoUrl);
      if (p.fullName) {
        fcByName.set(p.fullName.toLowerCase().trim(), p.photoUrl);
        fcByName.set(normalizeName(p.fullName), p.photoUrl);
      }
    }
  });

  let updatedPhotos = 0;

  for (const dbP of dbPlayers) {
    const photo = fcByName.get(dbP.name.toLowerCase().trim()) || fcByName.get(normalizeName(dbP.name));
    
    // We update image if player currently has no image, or if image is not a local custom barca/real transparent cutout
    const hasLocalCustom = dbP.image && dbP.image.startsWith('/players/');
    
    if (photo) {
      const newImage = hasLocalCustom ? dbP.image : photo;
      await Player.findByIdAndUpdate(dbP._id, {
        thumbnail: photo,
        image: newImage,
        imageSource: hasLocalCustom ? 'local' : 'footballcritic'
      });
      updatedPhotos++;
    }
  }

  console.log(`Updated photo references for ${updatedPhotos} players!`);

  // Now sync back to seed/laligaData.js
  const allClubs = await Club.find({ league: laliga._id });
  const finalSeedClubs = [];

  for (const c of allClubs) {
    const players = await Player.find({ club: c._id }).sort({ overall: -1 });
    finalSeedClubs.push({
      name: c.name,
      stadium: c.stadium,
      logo: c.logo,
      manager: c.manager,
      shortName: c.shortName,
      players: players.map(p => ({
        name: p.name,
        number: p.number,
        position: p.position,
        nationality: p.nationality,
        age: p.age,
        height: p.height,
        overall: p.overall,
        isStarter: p.isStarter,
        pace: p.pace,
        shooting: p.shooting,
        passing: p.passing,
        dribbling: p.dribbling,
        defending: p.defending,
        physical: p.physical,
        image: p.image,
        thumbnail: p.thumbnail
      }))
    });
  }

  const seedFileContent = `/**
 * LaLiga 2026/27 Season Clubs and Squad Data
 * Updated with authentic player photos from FootballCritic: https://www.footballcritic.com/la-liga/season-2026-2027/player-stats/all/6/80342
 * All 20 Clubs, 593 Players with authentic ages, heights, squad numbers, attributes, and photos.
 */

const laligaData = {
  league: {
    name: 'La Liga',
    country: 'Spain',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_logo_2023.svg',
  },
  clubs: ${JSON.stringify(finalSeedClubs, null, 2)}
};

module.exports = laligaData;
`;

  fs.writeFileSync(path.join(__dirname, '../seed/laligaData.js'), seedFileContent, 'utf8');
  console.log('Successfully updated seed/laligaData.js with FootballCritic photos.');

  await mongoose.disconnect();
}

run().catch(console.error);
