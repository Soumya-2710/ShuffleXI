const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./scripts/tsdb_team_audit.json', 'utf8'));

console.log('Total audited:', data.length);
data.forEach(d => {
  console.log(`[${d.overall}] ${d.name} | Club: ${d.club} | TSDB: ${d.tsdbPlayer} | TSDB Team: ${d.tsdbTeam}`);
});
