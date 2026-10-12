const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(d));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function test() {
  const clubs = await get('http://localhost:5000/api/clubs');
  const barca = clubs.data.find(c => c.name.includes('Barcelona'));
  console.log('Barca Club API:', {
    id: barca._id,
    name: barca.name,
    stadium: barca.stadium,
    manager: barca.manager,
    founded: barca.founded
  });

  const players = await get(`http://localhost:5000/api/players?club=${barca._id}`);
  console.log(`Barca Players Count: ${players.data.length}`);
  console.log('First 10 players:');
  players.data.slice(0, 10).forEach(p => {
    console.log(`[#${p.number}] ${p.name.padEnd(25)} (${p.position.padEnd(3)}) OVR: ${p.overall} | Starter: ${p.isStarter} | Img: ${p.image}`);
  });
}

test().catch(e => console.error('Error:', e.message));
