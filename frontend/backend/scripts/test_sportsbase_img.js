const fs = require('fs');
const path = require('path');

async function testImg() {
  const url = 'https://www.sportsbase.io/images/people/1439.png';
  const res = await fetch(url);
  console.log('Status:', res.status, 'Type:', res.headers.get('content-type'), 'Length:', res.headers.get('content-length'));
  const buf = Buffer.from(await res.arrayBuffer());
  const outPath = path.join(__dirname, 'test_sportsbase_1439.png');
  fs.writeFileSync(outPath, buf);
  console.log('Saved to', outPath, 'bytes:', buf.length);
}

testImg().catch(console.error);
