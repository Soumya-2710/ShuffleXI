/**
 * League & Club metadata for the EA FC Mobile Cinematic Prediction Reel
 */

export const REEL_LEAGUES = [
  {
    id: 'laliga',
    name: 'La Liga',
    country: 'Spain',
    flag: '🇪🇸',
    color: '#ff2882',
    accentColor: '#ffe600',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_logo_2023.svg',
    sampleClubs: ['Real Madrid', 'FC Barcelona', 'Atlético de Madrid', 'Real Betis', 'Sevilla FC', 'Athletic Club']
  },
  {
    id: 'premierleague',
    name: 'Premier League',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    color: '#38003c',
    accentColor: '#00ff85',
    logo: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
    sampleClubs: ['Manchester City', 'Arsenal', 'Liverpool', 'Chelsea', 'Tottenham Hotspur', 'Manchester United']
  },
  {
    id: 'seriea',
    name: 'Serie A',
    country: 'Italy',
    flag: '🇮🇹',
    color: '#008fd7',
    accentColor: '#00e676',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Serie_A_logo_2019.svg',
    sampleClubs: ['Inter Milan', 'Juventus', 'AC Milan', 'Napoli', 'Atalanta', 'AS Roma']
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    country: 'Germany',
    flag: '🇩🇪',
    color: '#d20515',
    accentColor: '#ffffff',
    logo: 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg',
    sampleClubs: ['FC Bayern München', 'Borussia Dortmund', 'Bayer 04 Leverkusen', 'RB Leipzig', 'VfB Stuttgart', 'Eintracht Frankfurt']
  },
  {
    id: 'ligue1',
    name: 'Ligue 1',
    country: 'France',
    flag: '🇫🇷',
    color: '#091c3e',
    accentColor: '#dae025',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Ligue1_logo.svg',
    sampleClubs: ['Paris Saint-Germain', 'Olympique de Marseille', 'AS Monaco', 'Olympique Lyonnais', 'LOSC Lille', 'OGC Nice']
  }
];

export function getLeagueMetadata(leagueName) {
  if (!leagueName) return REEL_LEAGUES[0];
  const lower = leagueName.toLowerCase();
  for (const l of REEL_LEAGUES) {
    if (lower.includes(l.id) || lower.includes(l.name.toLowerCase()) || lower.includes(l.country.toLowerCase())) {
      return l;
    }
  }
  return {
    id: 'europe',
    name: leagueName,
    country: 'Europe',
    flag: '🌍',
    color: '#1a365d',
    accentColor: '#ffd700',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_logo_2023.svg',
    sampleClubs: []
  };
}
