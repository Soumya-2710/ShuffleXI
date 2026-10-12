const https = require('https');

async function testTSDB() {
  const names = ['Anthony Gordon', 'Joao Cancelo', 'Dominik Livakovic', 'Eric Garcia'];
  for (const n of names) {
    try {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(n)}`);
      const data = await res.json();
      const p = data?.player?.[0];
      console.log(`${n}: cutout=${p?.strCutout || 'none'}, thumb=${p?.strThumb || 'none'}`);
    } catch (e) {
      console.log(`${n}: error ${e.message}`);
    }
  }
}

testTSDB().catch(console.error);
