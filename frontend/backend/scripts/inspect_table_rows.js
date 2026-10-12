const fs = require('fs');

const filePath = 'C:/Users/asus/.gemini/antigravity-ide/brain/ff1100fa-2846-4263-857d-6ca1f6fe22ed/.system_generated/steps/1313/content.md';
const content = fs.readFileSync(filePath, 'utf8');

const tableMatch = content.match(/<table class="players-table[^>]*>([\s\S]*?)<\/table>/i);
if (tableMatch) {
  const tableHtml = tableMatch[0];
  const trMatches = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  console.log(`Found ${trMatches.length} <tr> rows in Table 1.`);
  for (let i = 0; i < Math.min(10, trMatches.length); i++) {
    console.log(`--- Row ${i} ---`);
    console.log(trMatches[i][0].replace(/\t+/g, ' ').replace(/\n+/g, ' '));
  }
}
