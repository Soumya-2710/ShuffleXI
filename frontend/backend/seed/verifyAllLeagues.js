const files = [
  { name: 'Premier League', path: './premierLeagueData.js' },
  { name: 'La Liga', path: './laligaData.js' },
  { name: 'Serie A', path: './serieAData.js' },
  { name: 'Bundesliga', path: './bundesligaData.js' },
  { name: 'Ligue 1', path: './ligue1Data.js' }
];

const validPositions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST', 'CF'];
let grandTotalClubs = 0;
let grandTotalPlayers = 0;
let errors = 0;
const playerRegistry = new Map();

files.forEach(({ name, path }) => {
  const data = require(path);
  if (!data.clubs || data.clubs.length !== 20) {
    console.error(`${name}: Expected 20 clubs, found ${data.clubs ? data.clubs.length : 0}`);
    errors++;
  }
  grandTotalClubs += data.clubs.length;
  let leaguePlayers = 0;

  data.clubs.forEach(club => {
    if (!club.name || !club.stadium || !club.logo || !Array.isArray(club.players)) {
      console.error(`${name}: Club ${club.name} missing required metadata`);
      errors++;
    }
    if (club.players.length < 15) {
      console.error(`${name}: Club ${club.name} has fewer than 15 players (${club.players.length})`);
      errors++;
    }
    leaguePlayers += club.players.length;

    club.players.forEach(p => {
      if (!p.name || typeof p.name !== 'string') {
        console.error(`Invalid player name in ${club.name}`);
        errors++;
      }
      if (!validPositions.includes(p.position)) {
        console.error(`Invalid position ${p.position} for ${p.name} in ${club.name}`);
        errors++;
      }
      ['overall', 'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'].forEach(stat => {
        if (typeof p[stat] !== 'number' || p[stat] < 1 || p[stat] > 99) {
          console.error(`Invalid ${stat} (${p[stat]}) for ${p.name} in ${club.name}`);
          errors++;
        }
      });

      // Check duplicate players across entire 5-league database
      const key = p.name.trim().toLowerCase();
      if (playerRegistry.has(key)) {
        const prev = playerRegistry.get(key);
        // Note: some players have common names (e.g. Arthur, Danilo, Rogerio), check if it's identical player
        console.warn(`DUPLICATE DETECTED: "${p.name}" in ${club.name} (${name}) AND ${prev.club} (${prev.league})`);
        errors++;
      } else {
        playerRegistry.set(key, { club: club.name, league: name });
      }
    });
  });
  console.log(`${name}: 20 clubs, ${leaguePlayers} players verified.`);
  grandTotalPlayers += leaguePlayers;
});

console.log('==============================');
console.log(`SUMMARY: Total Leagues: ${files.length}, Total Clubs: ${grandTotalClubs}, Total Players: ${grandTotalPlayers}, Total Errors: ${errors}`);
if (errors === 0) {
  console.log('ALL 5 LEAGUES PASSED ZERO-ERROR VALIDATION PERFECTLY!');
}
