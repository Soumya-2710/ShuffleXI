const mongoose = require('mongoose');
const path = require('path');
const https = require('https');

function getWikiImage(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    https.get(url, { headers: { 'User-Agent': 'FootballGameApp/1.0' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          resolve(j.thumbnail?.source || null);
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function getTheSportsDB(name) {
  return new Promise((resolve) => {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(name)}`;
    https.get(url, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          resolve(j.player || []);
        } catch {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function run() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Player = require('../models/Player');
  const Club = require('../models/Club');

  const topClubs = [
    'Real Madrid', 'FC Barcelona', 'Atlético de Madrid',
    'Manchester City', 'Arsenal', 'Liverpool', 'Manchester United', 'Chelsea', 'Tottenham Hotspur',
    'Bayern München', 'Bayer 04 Leverkusen', 'Borussia Dortmund', 'RB Leipzig',
    'Inter', 'Juventus', 'AC Milan', 'Napoli',
    'Paris Saint-Germain'
  ];

  console.log('Inspecting key clubs...');
  const clubs = await Club.find({ name: { $in: topClubs } });
  
  for (const club of clubs) {
    const players = await Player.find({ club: club._id }).sort({ overall: -1 });
    console.log(`\n=== ${club.name.toUpperCase()} (${players.length} players) ===`);
    for (const p of players) {
      console.log(`${p.name} (${p.position}, ${p.overall} OVR, ${p.nationality}): ${p.image ? (p.image.length > 80 ? p.image.slice(0, 80) + '...' : p.image) : 'NO IMAGE'}`);
    }
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
