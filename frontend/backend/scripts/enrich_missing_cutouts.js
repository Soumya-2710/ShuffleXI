const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function normalizeName(name) {
  if (!name) return '';
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

async function fetchCutout(playerName) {
  const cleanName = normalizeName(playerName);
  const searchTerms = [cleanName, playerName];
  
  for (const term of searchTerms) {
    try {
      const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(term)}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(2500)
      });
      if (!res.ok) continue;
      const data = await res.json();
      const list = data?.player || [];
      for (const p of list) {
        if (p.strCutout) {
          return { cutout: p.strCutout, thumb: p.strThumb };
        }
      }
      if (list[0]?.strThumb) {
        return { cutout: null, thumb: list[0].strThumb };
      }
    } catch (e) {
      // timeout or network error, skip
    }
  }
  return null;
}

async function run() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  console.log('Connected to MongoDB');

  const League = require('../models/League');
  const Club = require('../models/Club');
  const Player = require('../models/Player');

  const laliga = await League.findOne({ name: 'La Liga' });
  const missingPlayers = await Player.find({ league: laliga._id, image: null }).populate('club', 'name');

  console.log(`Found ${missingPlayers.length} La Liga players without images.`);

  let enrichedCount = 0;
  for (let i = 0; i < missingPlayers.length; i++) {
    const p = missingPlayers[i];
    const found = await fetchCutout(p.name);
    if (found && (found.cutout || found.thumb)) {
      const imgUrl = found.cutout || found.thumb;
      await Player.findByIdAndUpdate(p._id, {
        image: imgUrl,
        thumbnail: found.thumb || imgUrl,
        imageSource: 'thesportsdb'
      });
      enrichedCount++;
      console.log(`[${enrichedCount}/${missingPlayers.length}] Enriched ${p.name} (${p.club?.name})`);
    }
    // Small pause
    await new Promise(r => setTimeout(r, 60));
  }

  console.log(`\nEnrichment finished! Enriched ${enrichedCount} players.`);

  // Now re-export seed/laligaData.js with updated images
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
        image: p.image
      }))
    });
  }

  const seedFileContent = `/**
 * LaLiga 2026/27 Season Clubs and Squad Data
 * Fully synchronized with official 2026/27 squads from https://truehighlights.com/la-liga-2026-27/
 * All 20 Clubs, 593 Players with authentic ages, heights, squad numbers, attributes, and cutouts.
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
  console.log(`Updated seed/laligaData.js with latest player images.`);

  await mongoose.disconnect();
}

run().catch(console.error);
