const fs = require('fs');

const filePath = 'C:/Users/asus/.gemini/antigravity-ide/brain/ff1100fa-2846-4263-857d-6ca1f6fe22ed/.system_generated/steps/1313/content.md';
const content = fs.readFileSync(filePath, 'utf8');

// Find all script tags or ajax calls
const scriptTags = [...content.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
console.log('Total script tags:', scriptTags.length);

scriptTags.forEach((s, i) => {
  const code = s[1];
  if (code.includes('ajax') || code.includes('url') || code.includes('80342') || code.includes('players-table')) {
    console.log(`Script ${i}:`);
    console.log(code.slice(0, 500));
    console.log('---');
  }
});
