/**
 * Official Kit Data & Colors for all 20 La Liga Clubs
 * Allows dynamic rendering of authentic team jerseys for each club
 */

export const TEAM_KITS = {
  // FC Barcelona: Blaugrana vertical stripes
  'FC Barcelona': {
    primary: '#004d98',
    secondary: '#a50044',
    trim: '#edbb00',
    pattern: 'stripes',
    stripeColor: '#a50044',
    baseColor: '#004d98',
    collarColor: '#edbb00',
    sponsor: 'Spotify',
    crest: '/crests/fcb.png',
    shortName: 'BAR'
  },
  'Barcelona': {
    primary: '#004d98',
    secondary: '#a50044',
    trim: '#edbb00',
    pattern: 'stripes',
    stripeColor: '#a50044',
    baseColor: '#004d98',
    collarColor: '#edbb00',
    sponsor: 'Spotify',
    crest: '/crests/fcb.png',
    shortName: 'BAR'
  },

  // Real Madrid: Pristine all-white with gold/navy trim
  'Real Madrid': {
    primary: '#ffffff',
    secondary: '#e5b332',
    trim: '#001e4a',
    pattern: 'solid',
    baseColor: '#ffffff',
    collarColor: '#e5b332',
    sponsor: 'Emirates',
    crest: '/crests/rma.png',
    shortName: 'RMA'
  },
  'Real Madrid CF': {
    primary: '#ffffff',
    secondary: '#e5b332',
    trim: '#001e4a',
    pattern: 'solid',
    baseColor: '#ffffff',
    collarColor: '#e5b332',
    sponsor: 'Emirates',
    crest: '/crests/rma.png',
    shortName: 'RMA'
  },

  // Atlético de Madrid: Red & white vertical stripes
  'Atlético de Madrid': {
    primary: '#cb3524',
    secondary: '#ffffff',
    trim: '#0a1d37',
    pattern: 'stripes',
    stripeColor: '#ffffff',
    baseColor: '#cb3524',
    collarColor: '#0a1d37',
    sponsor: 'Riyadh Air',
    crest: '/crests/atm.png',
    shortName: 'ATM'
  },
  'Club Atlético de Madrid': {
    primary: '#cb3524',
    secondary: '#ffffff',
    trim: '#0a1d37',
    pattern: 'stripes',
    stripeColor: '#ffffff',
    baseColor: '#cb3524',
    collarColor: '#0a1d37',
    sponsor: 'Riyadh Air',
    crest: '/crests/atm.png',
    shortName: 'ATM'
  },

  // Real Betis: Verdiblanco green and white vertical stripes
  'Real Betis': {
    primary: '#00954c',
    secondary: '#ffffff',
    trim: '#000000',
    pattern: 'stripes',
    stripeColor: '#ffffff',
    baseColor: '#00954c',
    collarColor: '#00954c',
    sponsor: 'Gree',
    crest: '/crests/bet.png',
    shortName: 'BET'
  },
  'Real Betis Balompié': {
    primary: '#00954c',
    secondary: '#ffffff',
    trim: '#000000',
    pattern: 'stripes',
    stripeColor: '#ffffff',
    baseColor: '#00954c',
    collarColor: '#00954c',
    sponsor: 'Gree',
    crest: '/crests/bet.png',
    shortName: 'BET'
  },

  // Athletic Club: Red & white stripes
  'Athletic Club': {
    primary: '#ee2524',
    secondary: '#ffffff',
    trim: '#000000',
    pattern: 'stripes',
    stripeColor: '#ffffff',
    baseColor: '#ee2524',
    collarColor: '#000000',
    sponsor: 'Kutxabank',
    crest: '/crests/ath.png',
    shortName: 'ATH'
  },

  // Villarreal CF: Submarino all-yellow
  'Villarreal CF': {
    primary: '#ffe000',
    secondary: '#003366',
    trim: '#003366',
    pattern: 'solid',
    baseColor: '#ffe000',
    collarColor: '#003366',
    sponsor: 'Pamesa',
    crest: '/crests/vil.png',
    shortName: 'VIL'
  },

  // Real Sociedad: Royal blue and white vertical stripes
  'Real Sociedad': {
    primary: '#0067b1',
    secondary: '#ffffff',
    trim: '#002b49',
    pattern: 'stripes',
    stripeColor: '#ffffff',
    baseColor: '#0067b1',
    collarColor: '#0067b1',
    sponsor: 'Yasuda',
    crest: '/crests/rso.png',
    shortName: 'RSO'
  },
  'Real Sociedad de Fútbol': {
    primary: '#0067b1',
    secondary: '#ffffff',
    trim: '#002b49',
    pattern: 'stripes',
    stripeColor: '#ffffff',
    baseColor: '#0067b1',
    collarColor: '#0067b1',
    sponsor: 'Yasuda',
    crest: '/crests/rso.png',
    shortName: 'RSO'
  },

  // Sevilla FC: Crisp white with red trim
  'Sevilla FC': {
    primary: '#ffffff',
    secondary: '#d4001f',
    trim: '#d4001f',
    pattern: 'solid',
    baseColor: '#ffffff',
    collarColor: '#d4001f',
    sponsor: 'Midea',
    crest: '/crests/sev.png',
    shortName: 'SEV'
  },

  // Valencia CF: White with black/orange trim
  'Valencia CF': {
    primary: '#ffffff',
    secondary: '#1a1a1a',
    trim: '#ff7300',
    pattern: 'solid',
    baseColor: '#ffffff',
    collarColor: '#1a1a1a',
    sponsor: 'TM',
    crest: '/crests/val.png',
    shortName: 'VAL'
  },

  // RC Celta de Vigo: Sky blue
  'RC Celta de Vigo': {
    primary: '#8ac3ee',
    secondary: '#ffffff',
    trim: '#990033',
    pattern: 'solid',
    baseColor: '#8ac3ee',
    collarColor: '#ffffff',
    sponsor: 'Estrella Galicia',
    crest: '/crests/cel.png',
    shortName: 'CEL'
  },

  // Rayo Vallecano: White with red diagonal sash (Franja)
  'Rayo Vallecano': {
    primary: '#ffffff',
    secondary: '#e20613',
    trim: '#000000',
    pattern: 'sash',
    baseColor: '#ffffff',
    stripeColor: '#e20613',
    collarColor: '#e20613',
    sponsor: 'Digi',
    crest: '/crests/ray.png',
    shortName: 'RAY'
  },
  'Rayo Vallecano de Madrid': {
    primary: '#ffffff',
    secondary: '#e20613',
    trim: '#000000',
    pattern: 'sash',
    baseColor: '#ffffff',
    stripeColor: '#e20613',
    collarColor: '#e20613',
    sponsor: 'Digi',
    crest: '/crests/ray.png',
    shortName: 'RAY'
  },

  // CA Osasuna: Red with navy blue
  'CA Osasuna': {
    primary: '#a51e22',
    secondary: '#001a40',
    trim: '#001a40',
    pattern: 'solid',
    baseColor: '#a51e22',
    collarColor: '#001a40',
    sponsor: 'Kosner',
    crest: '/crests/osa.png',
    shortName: 'OSA'
  },

  // Getafe CF: Royal blue
  'Getafe CF': {
    primary: '#005ca9',
    secondary: '#ffffff',
    trim: '#002f6c',
    pattern: 'solid',
    baseColor: '#005ca9',
    collarColor: '#ffffff',
    sponsor: 'Tecnocasa',
    crest: '/crests/get.png',
    shortName: 'GET'
  },

  // Deportivo Alavés: Blue & white stripes
  'Deportivo Alavés': {
    primary: '#0055a5',
    secondary: '#ffffff',
    trim: '#000000',
    pattern: 'stripes',
    stripeColor: '#ffffff',
    baseColor: '#0055a5',
    collarColor: '#0055a5',
    sponsor: 'LEA',
    crest: '/crests/ala.png',
    shortName: 'ALA'
  },

  // RCD Espanyol: Blue & white stripes
  'RCD Espanyol': {
    primary: '#007fc8',
    secondary: '#ffffff',
    trim: '#002b49',
    pattern: 'stripes',
    stripeColor: '#ffffff',
    baseColor: '#007fc8',
    collarColor: '#007fc8',
    sponsor: 'Conservas Dani',
    crest: '/crests/esp.png',
    shortName: 'ESP'
  },
  'RCD Espanyol de Barcelona': {
    primary: '#007fc8',
    secondary: '#ffffff',
    trim: '#002b49',
    pattern: 'stripes',
    stripeColor: '#ffffff',
    baseColor: '#007fc8',
    collarColor: '#007fc8',
    sponsor: 'Conservas Dani',
    crest: '/crests/esp.png',
    shortName: 'ESP'
  },

  // RC Deportivo de La Coruña: Blue & white stripes
  'RC Deportivo de La Coruña': {
    primary: '#1e468e',
    secondary: '#ffffff',
    trim: '#001a40',
    pattern: 'stripes',
    stripeColor: '#ffffff',
    baseColor: '#1e468e',
    collarColor: '#1e468e',
    sponsor: 'Estrella Galicia',
    crest: '/crests/dep.png',
    shortName: 'DEP'
  },
  'RC Deportivo A Coruña': {
    primary: '#1e468e',
    secondary: '#ffffff',
    trim: '#001a40',
    pattern: 'stripes',
    stripeColor: '#ffffff',
    baseColor: '#1e468e',
    collarColor: '#1e468e',
    sponsor: 'Estrella Galicia',
    crest: '/crests/dep.png',
    shortName: 'DEP'
  },

  // Real Racing Club de Santander: White with green
  'Real Racing Club de Santander': {
    primary: '#ffffff',
    secondary: '#008542',
    trim: '#000000',
    pattern: 'solid',
    baseColor: '#ffffff',
    collarColor: '#008542',
    sponsor: 'Plenitude',
    crest: '/crests/rac.png',
    shortName: 'RAC'
  },
  'Real Racing Club': {
    primary: '#ffffff',
    secondary: '#008542',
    trim: '#000000',
    pattern: 'solid',
    baseColor: '#ffffff',
    collarColor: '#008542',
    sponsor: 'Plenitude',
    crest: '/crests/rac.png',
    shortName: 'RAC'
  },

  // Levante UD: Granota blue and red stripes
  'Levante UD': {
    primary: '#003366',
    secondary: '#990033',
    trim: '#ffffff',
    pattern: 'stripes',
    stripeColor: '#990033',
    baseColor: '#003366',
    collarColor: '#990033',
    sponsor: 'Marcos',
    crest: '/crests/lev.png',
    shortName: 'LEV'
  },

  // Elche CF: White with green horizontal band (Franja verde)
  'Elche CF': {
    primary: '#ffffff',
    secondary: '#008542',
    trim: '#008542',
    pattern: 'hoops',
    baseColor: '#ffffff',
    stripeColor: '#008542',
    collarColor: '#008542',
    sponsor: 'VegaFibra',
    crest: '/crests/elc.png',
    shortName: 'ELC'
  },

  // Málaga CF: Light blue and white vertical stripes
  'Málaga CF': {
    primary: '#4b92db',
    secondary: '#ffffff',
    trim: '#001a40',
    pattern: 'stripes',
    stripeColor: '#ffffff',
    baseColor: '#4b92db',
    collarColor: '#4b92db',
    sponsor: 'Sabor a Málaga',
    crest: '/crests/mlg.png',
    shortName: 'MLG'
  }
};

/**
 * Get kit configuration for any club
 */
export function getTeamKit(clubName) {
  if (!clubName) {
    return {
      primary: '#00e676',
      secondary: '#0a0e1a',
      trim: '#ffd700',
      pattern: 'solid',
      baseColor: '#121829',
      collarColor: '#00e676',
      sponsor: 'FC MOBILE',
      crest: null,
      shortName: 'FC'
    };
  }

  // Exact match
  if (TEAM_KITS[clubName]) return TEAM_KITS[clubName];

  // Partial match
  const lower = clubName.toLowerCase();
  for (const [key, kit] of Object.entries(TEAM_KITS)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return kit;
    }
  }

  // Fallback kit
  return {
    primary: '#1e293b',
    secondary: '#00e676',
    trim: '#ffd700',
    pattern: 'solid',
    baseColor: '#1e293b',
    collarColor: '#00e676',
    sponsor: 'FC MOBILE',
    crest: null,
    shortName: clubName.slice(0, 3).toUpperCase()
  };
}
