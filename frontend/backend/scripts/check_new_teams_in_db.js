const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/football-game');
  require('../models/League');
  const Club = require('../models/Club');
  
  const searchRegexes = [/Deportivo/i, /Racing/i, /Levante/i, /Elche/i, /M[áa]laga/i];
  for (const r of searchRegexes) {
    const found = await Club.find({ name: r }).populate('league', 'name');
    console.log(r, 'matches:', found.map(c => `${c.name} (${c.league?.name})`));
  }
  process.exit(0);
}

run();
