const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./scripts/top_100_cutouts.json', 'utf8'));

const mismatched = data.filter(d => {
  if (!d.bestMatch) return false;
  const t = (d.bestMatch.team || '').toLowerCase();
  const c = (d.club || '').toLowerCase();
  return t && c && !t.includes(c) && !c.includes(t);
});

console.log(`Players with team mismatch on TheSportsDB among top 100: ${mismatched.length}`);
mismatched.forEach(m => {
  console.log(`- ${m.player} (DB Club: ${m.club}) => TSDB Candidate: ${m.bestMatch.name} (Team: ${m.bestMatch.team}), Cutout: ${m.bestMatch.cutout || 'NONE'}`);
});

console.log('\n--- Missing Cutout but High Overall ---');
const noCutouts = data.filter(d => !d.bestMatch || !d.bestMatch.cutout);
console.log(`Count without cutout: ${noCutouts.length}`);
noCutouts.slice(0, 20).forEach(n => {
  console.log(`- [${n.overall}] ${n.player} (${n.club}) => Current: ${n.currentImg ? n.currentImg.substring(0, 50) + '...' : 'NONE'}`);
});
