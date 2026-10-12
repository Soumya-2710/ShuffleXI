const fs = require('fs');

const filePath = 'C:/Users/asus/.gemini/antigravity-ide/brain/ff1100fa-2846-4263-857d-6ca1f6fe22ed/.system_generated/steps/1313/content.md';
const content = fs.readFileSync(filePath, 'utf8');

const tbodyMatch = content.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
if (tbodyMatch) {
  const tbodyHtml = tbodyMatch[1];
  const trs = [...tbodyHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  console.log(`Found ${trs.length} rows in <tbody>`);
  if (trs.length > 0) {
    console.log('--- Row 0 ---');
    console.log(trs[0][0].slice(0, 1000));
  } else {
    console.log('tbody is empty or has no <tr>');
    console.log('tbody slice:', tbodyHtml.slice(0, 500));
  }
} else {
  console.log('No <tbody> found');
}
