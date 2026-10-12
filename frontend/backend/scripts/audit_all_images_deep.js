const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

async function inspectImages() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Player = require('../models/Player');
  const Club = require('../models/Club');
  const League = require('../models/League');

  const players = await Player.find({ image: { $exists: true, $ne: null, $ne: '' } })
    .populate('club', 'name')
    .populate('league', 'name')
    .sort({ overall: -1 });

  console.log('Total players with non-empty image in DB:', players.length);

  const list = players.map(p => ({
    id: p._id,
    name: p.name,
    overall: p.overall,
    position: p.position,
    club: p.club?.name || 'No Club',
    league: p.league?.name || 'No League',
    nationality: p.nationality,
    image: p.image,
    thumbnail: p.thumbnail,
    imageSource: p.imageSource,
    isCutout: p.isCutout
  }));

  const outPath = path.join(__dirname, 'players_with_images.json');
  fs.writeFileSync(outPath, JSON.stringify(list, null, 2));
  console.log(`Saved ${list.length} players to ${outPath}`);

  // Let's also check for common patterns of suspicious images:
  // 1. Wikipedia filenames that might be stadiums, logos, crowds, or wrong names
  // 2. TheSportsDB cutouts that might belong to other clubs or namesakes
  const suspicious = [];

  list.forEach(p => {
    const img = p.image || '';
    const imgLower = img.toLowerCase();
    const nameLower = p.name.toLowerCase();

    // Check if image is obviously not a person (e.g., stadium, flag, crest, coat of arms, map, match action with 10 people, statue)
    const badKeywords = ['stadium', 'arena', 'coat_of_arms', 'flag', 'crest', 'logo', 'stand', 'spectator', 'fans', 'statue', 'sculpture', 'monument', 'trophy', 'pitch'];
    for (const kw of badKeywords) {
      if (imgLower.includes(kw)) {
        suspicious.push({ player: p.name, club: p.club, reason: `URL contains suspicious word: ${kw}`, img });
        break;
      }
    }

    // Check if Wikipedia image name has a completely different name
    if (img.includes('wikimedia.org') || img.includes('wikipedia.org')) {
      // Extract filename from URL
      try {
        const decoded = decodeURIComponent(img);
        const fileName = decoded.split('/').pop().toLowerCase();
        // check if player last name or first name is anywhere in the filename
        const parts = nameLower.split(' ').filter(x => x.length > 2);
        const matchesAnyPart = parts.some(part => {
          const normPart = part.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const normFile = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return normFile.includes(normPart);
        });

        if (!matchesAnyPart && parts.length > 0) {
          suspicious.push({ player: p.name, club: p.club, reason: `Wikipedia filename does not contain player name parts: ${fileName}`, img });
        }
      } catch (e) {}
    }
  });

  console.log(`\nFound ${suspicious.length} initially suspicious images based on heuristics:`);
  suspicious.forEach(s => {
    console.log(`- [${s.club}] ${s.player}: ${s.reason}`);
    console.log(`  URL: ${s.img}`);
  });

  process.exit(0);
}

inspectImages().catch(err => {
  console.error(err);
  process.exit(1);
});
