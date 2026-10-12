const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const NEW_CLUBS_DATA = [
  {
    name: 'RC Deportivo de La Coruña',
    stadium: 'ABANCA-Riazor',
    logo: '/crests/dep.png',
    manager: 'Imanol Idiakez',
    founded: 1906,
    shortName: 'DEP',
    players: [
      { name: 'Helton Leite', number: 1, position: 'GK', nationality: 'Brazil', overall: 76, isStarter: true, pace: 46, shooting: 18, passing: 68, dribbling: 36, defending: 18, physical: 75 },
      { name: 'German Parreño', number: 13, position: 'GK', nationality: 'Spain', overall: 71, isStarter: false, pace: 42, shooting: 16, passing: 64, dribbling: 32, defending: 16, physical: 72 },
      { name: 'Pablo Martínez', number: 5, position: 'CB', nationality: 'France', overall: 74, isStarter: true, pace: 68, shooting: 36, passing: 64, dribbling: 62, defending: 75, physical: 78 },
      { name: 'Dani Barcia', number: 4, position: 'CB', nationality: 'Spain', overall: 72, isStarter: true, pace: 69, shooting: 32, passing: 66, dribbling: 64, defending: 73, physical: 74 },
      { name: 'Ximo Navarro', number: 24, position: 'RB', nationality: 'Spain', overall: 73, isStarter: true, pace: 75, shooting: 52, passing: 68, dribbling: 70, defending: 74, physical: 73 },
      { name: 'Rafael Obrador', number: 15, position: 'LB', nationality: 'Spain', overall: 72, isStarter: true, pace: 78, shooting: 48, passing: 67, dribbling: 71, defending: 71, physical: 68 },
      { name: 'Diego Villares', number: 8, position: 'CM', nationality: 'Spain', overall: 74, isStarter: true, pace: 73, shooting: 64, passing: 74, dribbling: 73, defending: 74, physical: 76 },
      { name: 'Jose Ángel Jurado', number: 6, position: 'CDM', nationality: 'Spain', overall: 72, isStarter: true, pace: 64, shooting: 62, passing: 73, dribbling: 70, defending: 73, physical: 75 },
      { name: 'Charlie Patiño', number: 22, position: 'CM', nationality: 'England', overall: 73, isStarter: false, pace: 68, shooting: 66, passing: 76, dribbling: 75, defending: 65, physical: 66 },
      { name: 'Mario Soriano', number: 21, position: 'CAM', nationality: 'Spain', overall: 75, isStarter: true, pace: 76, shooting: 71, passing: 77, dribbling: 79, defending: 46, physical: 60 },
      { name: 'Yeremay Hernández', number: 10, position: 'LW', nationality: 'Spain', overall: 76, isStarter: true, pace: 84, shooting: 74, passing: 75, dribbling: 82, defending: 34, physical: 62 },
      { name: 'David Mella', number: 17, position: 'RW', nationality: 'Spain', overall: 75, isStarter: true, pace: 87, shooting: 72, passing: 71, dribbling: 78, defending: 38, physical: 64 },
      { name: 'Lucas Pérez', number: 7, position: 'ST', nationality: 'Spain', overall: 77, isStarter: true, pace: 74, shooting: 80, passing: 78, dribbling: 77, defending: 42, physical: 72 },
      { name: 'Mohamed Bouldini', number: 20, position: 'ST', nationality: 'Morocco', overall: 73, isStarter: false, pace: 73, shooting: 74, passing: 62, dribbling: 70, defending: 36, physical: 80 },
      { name: 'Iván Barbero', number: 9, position: 'ST', nationality: 'Spain', overall: 72, isStarter: false, pace: 75, shooting: 73, passing: 63, dribbling: 71, defending: 35, physical: 74 }
    ]
  },
  {
    name: 'Real Racing Club de Santander',
    stadium: 'Campos de Sport de El Sardinero',
    logo: '/crests/rac.png',
    manager: 'José Alberto López',
    founded: 1913,
    shortName: 'RAC',
    players: [
      { name: 'Jokin Ezkieta', number: 1, position: 'GK', nationality: 'Spain', overall: 75, isStarter: true, pace: 46, shooting: 18, passing: 68, dribbling: 36, defending: 18, physical: 76 },
      { name: 'Miquel Parera', number: 13, position: 'GK', nationality: 'Spain', overall: 71, isStarter: false, pace: 44, shooting: 16, passing: 65, dribbling: 34, defending: 16, physical: 72 },
      { name: 'Javi Montero', number: 4, position: 'CB', nationality: 'Spain', overall: 74, isStarter: true, pace: 70, shooting: 38, passing: 66, dribbling: 64, defending: 75, physical: 77 },
      { name: 'Manu Hernando', number: 5, position: 'CB', nationality: 'Spain', overall: 73, isStarter: true, pace: 68, shooting: 36, passing: 65, dribbling: 63, defending: 74, physical: 76 },
      { name: 'Clément Michelin', number: 2, position: 'RB', nationality: 'France', overall: 73, isStarter: true, pace: 78, shooting: 54, passing: 70, dribbling: 72, defending: 72, physical: 72 },
      { name: 'Mario García', number: 3, position: 'LB', nationality: 'Spain', overall: 72, isStarter: true, pace: 79, shooting: 48, passing: 68, dribbling: 71, defending: 71, physical: 69 },
      { name: 'Unai Vencedor', number: 6, position: 'CM', nationality: 'Spain', overall: 75, isStarter: true, pace: 68, shooting: 68, passing: 77, dribbling: 74, defending: 74, physical: 73 },
      { name: 'Aritz Aldasoro', number: 8, position: 'CM', nationality: 'Spain', overall: 73, isStarter: true, pace: 72, shooting: 64, passing: 73, dribbling: 73, defending: 72, physical: 75 },
      { name: 'Maguette Gueye', number: 21, position: 'CDM', nationality: 'Senegal', overall: 71, isStarter: false, pace: 66, shooting: 56, passing: 68, dribbling: 68, defending: 72, physical: 76 },
      { name: 'Pablo Rodríguez', number: 22, position: 'CAM', nationality: 'Spain', overall: 73, isStarter: false, pace: 76, shooting: 70, passing: 74, dribbling: 76, defending: 44, physical: 62 },
      { name: 'Iñigo Vicente', number: 10, position: 'LW', nationality: 'Spain', overall: 77, isStarter: true, pace: 78, shooting: 76, passing: 79, dribbling: 82, defending: 40, physical: 66 },
      { name: 'Andrés Martín', number: 7, position: 'RW', nationality: 'Spain', overall: 76, isStarter: true, pace: 82, shooting: 76, passing: 74, dribbling: 78, defending: 44, physical: 70 },
      { name: 'Juan Carlos Arana', number: 9, position: 'ST', nationality: 'Spain', overall: 75, isStarter: true, pace: 78, shooting: 76, passing: 66, dribbling: 74, defending: 35, physical: 76 },
      { name: 'Jon Karrikaburu', number: 19, position: 'ST', nationality: 'Spain', overall: 73, isStarter: false, pace: 76, shooting: 74, passing: 64, dribbling: 72, defending: 36, physical: 75 },
      { name: 'Lago Junior', number: 11, position: 'LW', nationality: 'Ivory Coast', overall: 72, isStarter: false, pace: 80, shooting: 71, passing: 67, dribbling: 74, defending: 42, physical: 70 }
    ]
  },
  {
    name: 'Levante UD',
    stadium: 'Estadi Ciutat de València',
    logo: '/crests/lev.png',
    manager: 'Julián Calero',
    founded: 1909,
    shortName: 'LEV',
    players: [
      { name: 'Andrés Fernández', number: 1, position: 'GK', nationality: 'Spain', overall: 75, isStarter: true, pace: 45, shooting: 18, passing: 67, dribbling: 35, defending: 18, physical: 74 },
      { name: 'Alfonso Pastor', number: 13, position: 'GK', nationality: 'Spain', overall: 70, isStarter: false, pace: 42, shooting: 16, passing: 62, dribbling: 32, defending: 16, physical: 70 },
      { name: 'Unai Elgezabal', number: 5, position: 'CB', nationality: 'Spain', overall: 73, isStarter: true, pace: 66, shooting: 38, passing: 64, dribbling: 62, defending: 75, physical: 78 },
      { name: 'Adrián de la Fuente', number: 4, position: 'CB', nationality: 'Spain', overall: 73, isStarter: true, pace: 68, shooting: 36, passing: 66, dribbling: 64, defending: 74, physical: 76 },
      { name: 'Andrés García', number: 2, position: 'RB', nationality: 'Spain', overall: 73, isStarter: true, pace: 82, shooting: 56, passing: 69, dribbling: 73, defending: 71, physical: 72 },
      { name: 'Diego Pampín', number: 14, position: 'LB', nationality: 'Spain', overall: 72, isStarter: true, pace: 78, shooting: 50, passing: 68, dribbling: 71, defending: 72, physical: 70 },
      { name: 'Oriol Rey', number: 20, position: 'CDM', nationality: 'Spain', overall: 73, isStarter: true, pace: 67, shooting: 58, passing: 74, dribbling: 72, defending: 74, physical: 75 },
      { name: 'Giorgi Kochorashvili', number: 6, position: 'CM', nationality: 'Georgia', overall: 76, isStarter: true, pace: 74, shooting: 72, passing: 77, dribbling: 76, defending: 74, physical: 77 },
      { name: 'Pablo Martínez', number: 10, position: 'CM', nationality: 'Spain', overall: 74, isStarter: false, pace: 73, shooting: 70, passing: 75, dribbling: 75, defending: 68, physical: 72 },
      { name: 'Carlos Álvarez', number: 24, position: 'CAM', nationality: 'Spain', overall: 76, isStarter: true, pace: 78, shooting: 73, passing: 78, dribbling: 82, defending: 46, physical: 60 },
      { name: 'Roger Brugué', number: 7, position: 'RW', nationality: 'Spain', overall: 74, isStarter: true, pace: 81, shooting: 73, passing: 71, dribbling: 76, defending: 48, physical: 72 },
      { name: 'José Luis Morales', number: 11, position: 'ST', nationality: 'Spain', overall: 77, isStarter: true, pace: 80, shooting: 78, passing: 74, dribbling: 79, defending: 44, physical: 70 },
      { name: 'Iván Romero', number: 9, position: 'ST', nationality: 'Spain', overall: 72, isStarter: false, pace: 77, shooting: 72, passing: 66, dribbling: 73, defending: 38, physical: 72 },
      { name: 'Fabrício', number: 12, position: 'ST', nationality: 'Brazil', overall: 73, isStarter: false, pace: 83, shooting: 73, passing: 62, dribbling: 74, defending: 35, physical: 76 }
    ]
  },
  {
    name: 'Elche CF',
    stadium: 'Estadio Martínez Valero',
    logo: '/crests/elc.png',
    manager: 'Eder Sarabia',
    founded: 1923,
    shortName: 'ELC',
    players: [
      { name: 'Matías Dituro', number: 1, position: 'GK', nationality: 'Argentina', overall: 75, isStarter: true, pace: 46, shooting: 18, passing: 72, dribbling: 38, defending: 18, physical: 73 },
      { name: 'San Román', number: 13, position: 'GK', nationality: 'Spain', overall: 71, isStarter: false, pace: 44, shooting: 16, passing: 66, dribbling: 34, defending: 16, physical: 71 },
      { name: 'Pedro Bigas', number: 6, position: 'CB', nationality: 'Spain', overall: 74, isStarter: true, pace: 68, shooting: 44, passing: 68, dribbling: 66, defending: 76, physical: 76 },
      { name: 'David Affengruber', number: 5, position: 'CB', nationality: 'Austria', overall: 74, isStarter: true, pace: 70, shooting: 40, passing: 67, dribbling: 64, defending: 75, physical: 78 },
      { name: 'Álvaro Núñez', number: 12, position: 'RB', nationality: 'Spain', overall: 73, isStarter: true, pace: 80, shooting: 50, passing: 70, dribbling: 72, defending: 72, physical: 70 },
      { name: 'José Salinas', number: 3, position: 'LB', nationality: 'Spain', overall: 72, isStarter: true, pace: 78, shooting: 48, passing: 68, dribbling: 70, defending: 71, physical: 69 },
      { name: 'Aleix Febas', number: 14, position: 'CM', nationality: 'Spain', overall: 76, isStarter: true, pace: 75, shooting: 68, passing: 78, dribbling: 81, defending: 70, physical: 68 },
      { name: 'Gerard Hernández', number: 8, position: 'CM', nationality: 'Spain', overall: 72, isStarter: true, pace: 70, shooting: 62, passing: 74, dribbling: 73, defending: 71, physical: 71 },
      { name: 'Nicolás Castro', number: 21, position: 'CAM', nationality: 'Argentina', overall: 76, isStarter: true, pace: 76, shooting: 74, passing: 78, dribbling: 78, defending: 55, physical: 74 },
      { name: 'Josan', number: 17, position: 'RW', nationality: 'Spain', overall: 73, isStarter: true, pace: 81, shooting: 68, passing: 72, dribbling: 74, defending: 62, physical: 69 },
      { name: 'Yago Santiago', number: 7, position: 'LW', nationality: 'Spain', overall: 74, isStarter: true, pace: 84, shooting: 72, passing: 70, dribbling: 77, defending: 40, physical: 64 },
      { name: 'Agustín Álvarez', number: 19, position: 'ST', nationality: 'Uruguay', overall: 75, isStarter: true, pace: 78, shooting: 76, passing: 66, dribbling: 73, defending: 36, physical: 75 },
      { name: 'Mourad', number: 11, position: 'ST', nationality: 'Morocco', overall: 73, isStarter: false, pace: 74, shooting: 74, passing: 60, dribbling: 70, defending: 38, physical: 82 },
      { name: 'Elbasan Rashani', number: 10, position: 'LW', nationality: 'Kosovo', overall: 73, isStarter: false, pace: 79, shooting: 72, passing: 70, dribbling: 74, defending: 45, physical: 71 }
    ]
  },
  {
    name: 'Málaga CF',
    stadium: 'La Rosaleda',
    logo: '/crests/mlg.png',
    manager: 'Sergio Pellicer',
    founded: 1904,
    shortName: 'MLG',
    players: [
      { name: 'Alfonso Herrero', number: 1, position: 'GK', nationality: 'Spain', overall: 75, isStarter: true, pace: 46, shooting: 18, passing: 68, dribbling: 36, defending: 18, physical: 75 },
      { name: 'Carlos López', number: 13, position: 'GK', nationality: 'Spain', overall: 70, isStarter: false, pace: 42, shooting: 16, passing: 63, dribbling: 33, defending: 16, physical: 70 },
      { name: 'Nelson Monte', number: 4, position: 'CB', nationality: 'Portugal', overall: 73, isStarter: true, pace: 68, shooting: 36, passing: 64, dribbling: 62, defending: 75, physical: 77 },
      { name: 'Einar Galilea', number: 5, position: 'CB', nationality: 'Spain', overall: 73, isStarter: true, pace: 66, shooting: 38, passing: 65, dribbling: 61, defending: 74, physical: 77 },
      { name: 'Carlos Puga', number: 2, position: 'RB', nationality: 'Spain', overall: 72, isStarter: true, pace: 80, shooting: 52, passing: 68, dribbling: 71, defending: 71, physical: 70 },
      { name: 'Víctor García', number: 14, position: 'LB', nationality: 'Spain', overall: 73, isStarter: true, pace: 79, shooting: 54, passing: 70, dribbling: 72, defending: 72, physical: 72 },
      { name: 'Manu Molina', number: 8, position: 'CM', nationality: 'Spain', overall: 73, isStarter: true, pace: 68, shooting: 64, passing: 76, dribbling: 73, defending: 72, physical: 72 },
      { name: 'Juanpe', number: 6, position: 'CDM', nationality: 'Spain', overall: 72, isStarter: true, pace: 67, shooting: 60, passing: 72, dribbling: 70, defending: 73, physical: 75 },
      { name: 'Dani Lorenzo', number: 22, position: 'CAM', nationality: 'Spain', overall: 74, isStarter: true, pace: 76, shooting: 71, passing: 75, dribbling: 77, defending: 50, physical: 66 },
      { name: 'Antoñito Cordero', number: 26, position: 'RW', nationality: 'Spain', overall: 75, isStarter: true, pace: 85, shooting: 73, passing: 72, dribbling: 79, defending: 38, physical: 64 },
      { name: 'Kevin Medina', number: 11, position: 'LW', nationality: 'Spain', overall: 74, isStarter: true, pace: 84, shooting: 72, passing: 71, dribbling: 80, defending: 40, physical: 65 },
      { name: 'Dioni', number: 17, position: 'ST', nationality: 'Spain', overall: 73, isStarter: true, pace: 73, shooting: 76, passing: 66, dribbling: 72, defending: 38, physical: 74 },
      { name: 'Roko Baturina', number: 9, position: 'ST', nationality: 'Croatia', overall: 72, isStarter: false, pace: 74, shooting: 73, passing: 61, dribbling: 70, defending: 35, physical: 78 },
      { name: 'Yanis Rahmani', number: 7, position: 'LW', nationality: 'France', overall: 73, isStarter: false, pace: 80, shooting: 71, passing: 70, dribbling: 74, defending: 44, physical: 70 }
    ]
  }
];

const RELEGATED_CLUBS = ['Girona FC', 'RCD Mallorca', 'UD Las Palmas', 'Real Valladolid', 'CD Leganés'];

// Mapping of 15 remaining clubs to update crests to local /crests/<slug>.png
const EXISTING_CLUBS_UPDATE = {
  'FC Barcelona': { logo: '/crests/fcb.png', stadium: 'Spotify Camp Nou', manager: 'Hansi Flick', shortName: 'BAR' },
  'Atlético de Madrid': { logo: '/crests/atm.png', stadium: 'Riyadh Air Metropolitano', manager: 'Diego Simeone', shortName: 'ATM' },
  'Real Betis': { logo: '/crests/bet.png', stadium: 'La Cartuja de Sevilla', manager: 'Manuel Pellegrini', shortName: 'BET' },
  'Real Madrid': { logo: '/crests/rma.png', stadium: 'Santiago Bernabéu', manager: 'Carlo Ancelotti', shortName: 'RMA' },
  'Sevilla FC': { logo: '/crests/sev.png', stadium: 'Ramón Sánchez-Pizjuán', manager: 'García Pimienta', shortName: 'SEV' },
  'Deportivo Alavés': { logo: '/crests/ala.png', stadium: 'Mendizorrotza', manager: 'Luis García Plaza', shortName: 'ALA' },
  'Real Sociedad': { logo: '/crests/rso.png', stadium: 'Reale Arena', manager: 'Imanol Alguacil', shortName: 'RSO' },
  'Villarreal CF': { logo: '/crests/vil.png', stadium: 'Estadio de la Cerámica', manager: 'Marcelino García Toral', shortName: 'VIL' },
  'Athletic Club': { logo: '/crests/ath.png', stadium: 'San Mamés', manager: 'Ernesto Valverde', shortName: 'ATH' },
  'Getafe CF': { logo: '/crests/get.png', stadium: 'Coliseum', manager: 'José Bordalás', shortName: 'GET' },
  'Rayo Vallecano': { logo: '/crests/ray.png', stadium: 'Campo de Fútbol de Vallecas', manager: 'Iñigo Pérez', shortName: 'RAY' },
  'CA Osasuna': { logo: '/crests/osa.png', stadium: 'El Sadar', manager: 'Vicente Moreno', shortName: 'OSA' },
  'RC Celta de Vigo': { logo: '/crests/cel.png', stadium: 'ABANCA Balaídos', manager: 'Claudio Giráldez', shortName: 'CEL' },
  'RCD Espanyol': { logo: '/crests/esp.png', stadium: 'RCDE Stadium', manager: 'Manolo González', shortName: 'ESP' },
  'Valencia CF': { logo: '/crests/val.png', stadium: 'Camp de Mestalla', manager: 'Rubén Baraja', shortName: 'VAL' }
};

async function run() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const League = require('../models/League');
  const Club = require('../models/Club');
  const Player = require('../models/Player');

  const laliga = await League.findOne({ name: 'La Liga' });
  if (!laliga) {
    console.error('La Liga not found!');
    process.exit(1);
  }

  console.log(`Synchronizing La Liga (${laliga._id}) to match https://laligatable.co/ ...`);

  // 1. Remove 5 relegated clubs from La Liga
  for (const relName of RELEGATED_CLUBS) {
    const club = await Club.findOne({ name: relName, league: laliga._id });
    if (club) {
      const pRes = await Player.deleteMany({ club: club._id });
      await Club.deleteOne({ _id: club._id });
      console.log(`[RELEGATED & REMOVED] ${relName} (deleted ${pRes.deletedCount} players)`);
    }
  }

  // 2. Update existing 15 clubs with local crests & verified stadiums
  for (const [name, meta] of Object.entries(EXISTING_CLUBS_UPDATE)) {
    const res = await Club.updateOne(
      { name, league: laliga._id },
      { $set: meta }
    );
    console.log(`[CLUB UPDATED] ${name} -> modified: ${res.modifiedCount}`);
  }

  // 3. Insert the 5 new promoted clubs and their players
  for (const newClub of NEW_CLUBS_DATA) {
    let club = await Club.findOne({ name: newClub.name, league: laliga._id });
    if (!club) {
      club = await Club.create({
        name: newClub.name,
        league: laliga._id,
        stadium: newClub.stadium,
        logo: newClub.logo,
        manager: newClub.manager,
        founded: newClub.founded,
        shortName: newClub.shortName
      });
      console.log(`[NEW CLUB CREATED] ${newClub.name} (${club._id})`);
    } else {
      club.stadium = newClub.stadium;
      club.logo = newClub.logo;
      club.manager = newClub.manager;
      club.founded = newClub.founded;
      club.shortName = newClub.shortName;
      await club.save();
      console.log(`[CLUB UPDATED] ${newClub.name}`);
    }

    // Insert players for this club
    for (const p of newClub.players) {
      await Player.findOneAndUpdate(
        { name: p.name, club: club._id },
        {
          $set: {
            ...p,
            club: club._id,
            league: laliga._id
          }
        },
        { upsert: true, new: true }
      );
    }
    console.log(`  Inserted ${newClub.players.length} players for ${newClub.name}`);
  }

  // Verify total count
  const allClubs = await Club.find({ league: laliga._id }).sort({ name: 1 });
  console.log(`\n=== Verification: La Liga now has exactly ${allClubs.length} clubs ===`);
  allClubs.forEach((c, idx) => {
    console.log(`${(idx + 1).toString().padStart(2)}. ${c.name.padEnd(32)} | 🏟️ ${c.stadium.padEnd(25)} | Logo: ${c.logo}`);
  });

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
