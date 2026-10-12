const mongoose = require('mongoose');

async function checkCurrentImages() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  const Player = require('../models/Player');
  const Club = require('../models/Club');

  const checkNames = [
    'Mohamed Salah',
    'Robert Lewandowski',
    'Bernardo Silva',
    'Florian Wirtz',
    'Gianluigi Donnarumma',
    'Emiliano Martínez',
    'Marc-André ter Stegen',
    'Antoine Griezmann',
    'Ederson',
    'Kevin De Bruyne',
    'Rodri',
    'Kylian Mbappé',
    'Erling Haaland',
    'Vinícius Júnior',
    'Jude Bellingham',
    'Bukayo Saka',
    'Phil Foden',
    'Declan Rice',
    'Martin Ødegaard',
    'Cole Palmer',
    'Lamine Yamal',
    'Pedri',
    'Gavi',
    'Raphinha',
    'Federico Valverde',
    'Eduardo Camavinga',
    'Aurélien Tchouaméni',
    'Rodrygo',
    'Luka Modrić',
    'Antonio Rüdiger',
    'Thibaut Courtois',
    'Virgil van Dijk',
    'Trent Alexander-Arnold',
    'Alisson Becker',
    'William Saliba',
    'Gabriel Magalhães',
    'Kai Havertz',
    'Bruno Fernandes',
    'Marcus Rashford',
    'Kobbie Mainoo',
    'Rasmus Højlund',
    'Alejandro Garnacho',
    'Harry Kane',
    'Jamal Musiala',
    'Leroy Sané',
    'Joshua Kimmich',
    'Alphonso Davies',
    'Manuel Neuer',
    'Ousmane Dembélé',
    'Bradley Barcola',
    'Warren Zaïre-Emery',
    'Achraf Hakimi',
    'Marquinhos',
    'Lautaro Martínez',
    'Nicolò Barella',
    'Hakan Çalhanoğlu',
    'Marcus Thuram',
    'Alessandro Bastoni',
    'Rafael Leão',
    'Theo Hernández',
    'Christian Pulisic',
    'Dušan Vlahović',
    'Teun Koopmeiners',
    'Khvicha Kvaratskhelia',
    'Victor Osimhen'
  ];

  const players = await Player.find({ name: { $in: checkNames } }).populate('club', 'name');
  
  console.log(`Found ${players.length} key star players in DB:`);
  players.forEach(p => {
    console.log(`- [${p.overall}] ${p.name} | Club: ${p.club?.name} | Image: ${p.image}`);
  });

  process.exit(0);
}

checkCurrentImages();
