const fs = require('fs');
const path = require('path');

const currentLaligaData = require('../seed/laligaData');
const { syncData } = require('./sync_laliga_table_season');

const CREST_MAP = {
  'Real Madrid': { logo: '/crests/rma.png', stadium: 'Santiago Bernabéu', manager: 'Carlo Ancelotti', shortName: 'RMA' },
  'FC Barcelona': { logo: '/crests/fcb.png', stadium: 'Spotify Camp Nou', manager: 'Hansi Flick', shortName: 'BAR' },
  'Atlético de Madrid': { logo: '/crests/atm.png', stadium: 'Riyadh Air Metropolitano', manager: 'Diego Simeone', shortName: 'ATM' },
  'Athletic Club': { logo: '/crests/ath.png', stadium: 'San Mamés', manager: 'Ernesto Valverde', shortName: 'ATH' },
  'Real Sociedad': { logo: '/crests/rso.png', stadium: 'Reale Arena', manager: 'Imanol Alguacil', shortName: 'RSO' },
  'Real Betis': { logo: '/crests/bet.png', stadium: 'La Cartuja de Sevilla', manager: 'Manuel Pellegrini', shortName: 'BET' },
  'Villarreal CF': { logo: '/crests/vil.png', stadium: 'Estadio de la Cerámica', manager: 'Marcelino García Toral', shortName: 'VIL' },
  'Sevilla FC': { logo: '/crests/sev.png', stadium: 'Ramón Sánchez-Pizjuán', manager: 'García Pimienta', shortName: 'SEV' },
  'Valencia CF': { logo: '/crests/val.png', stadium: 'Camp de Mestalla', manager: 'Rubén Baraja', shortName: 'VAL' },
  'RC Celta de Vigo': { logo: '/crests/cel.png', stadium: 'ABANCA Balaídos', manager: 'Claudio Giráldez', shortName: 'CEL' },
  'CA Osasuna': { logo: '/crests/osa.png', stadium: 'El Sadar', manager: 'Vicente Moreno', shortName: 'OSA' },
  'Getafe CF': { logo: '/crests/get.png', stadium: 'Coliseum', manager: 'José Bordalás', shortName: 'GET' },
  'Rayo Vallecano': { logo: '/crests/ray.png', stadium: 'Campo de Fútbol de Vallecas', manager: 'Iñigo Pérez', shortName: 'RAY' },
  'Deportivo Alavés': { logo: '/crests/ala.png', stadium: 'Mendizorrotza', manager: 'Luis García Plaza', shortName: 'ALA' },
  'RCD Espanyol': { logo: '/crests/esp.png', stadium: 'RCDE Stadium', manager: 'Manolo González', shortName: 'ESP' },
};

const RELEGATED = ['Girona FC', 'RCD Mallorca', 'UD Las Palmas', 'Real Valladolid', 'CD Leganés'];

// Filter out relegated clubs and update metadata for the 15 clubs
const retainedClubs = currentLaligaData.clubs
  .filter(c => !RELEGATED.includes(c.name))
  .map(c => {
    const meta = CREST_MAP[c.name] || {};
    return {
      name: c.name,
      stadium: meta.stadium || c.stadium,
      logo: meta.logo || c.logo,
      manager: meta.manager || c.manager,
      founded: c.founded || undefined,
      shortName: meta.shortName || c.shortName,
      players: c.players
    };
  });

// Read the new clubs from sync_laliga_table_season
// To get NEW_CLUBS_DATA from sync script, let's load it or extract it
const syncScriptContent = fs.readFileSync(path.join(__dirname, 'sync_laliga_table_season.js'), 'utf8');
const match = syncScriptContent.match(/const NEW_CLUBS_DATA = (\[[\s\S]*?\]);\s*const RELEGATED_CLUBS/);

if (!match) {
  console.error("Could not parse NEW_CLUBS_DATA");
  process.exit(1);
}

const newClubs = eval(match[1]);

const finalClubs = [...retainedClubs, ...newClubs];

const fileContent = `/**
 * LaLiga 2026/27 Season Clubs and Squad Data
 * Matches official 20-team roster from https://laligatable.co/
 * 20 Clubs: 15 Retained + 5 Promoted (Deportivo, Racing Santander, Levante, Elche, Málaga)
 */

const laligaData = {
  league: {
    name: 'La Liga',
    country: 'Spain',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_logo_2023.svg',
  },
  clubs: ${JSON.stringify(finalClubs, null, 2)}
};

module.exports = laligaData;
`;

fs.writeFileSync(path.join(__dirname, '../seed/laligaData.js'), fileContent, 'utf8');
console.log(`Successfully updated laligaData.js with ${finalClubs.length} clubs.`);
