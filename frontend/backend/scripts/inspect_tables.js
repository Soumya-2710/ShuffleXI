const fs = require('fs');

const filePath = 'C:/Users/asus/.gemini/antigravity-ide/brain/ff1100fa-2846-4263-857d-6ca1f6fe22ed/.system_generated/steps/1313/content.md';
const content = fs.readFileSync(filePath, 'utf8');

// Find all <table> occurrences
const matches = [...content.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)];
console.log('Total tables:', matches.length);
matches.forEach((m, i) => {
  console.log(`Table ${i}: length=${m[0].length}, slice=${m[0].slice(0, 200).replace(/\s+/g, ' ')}`);
});
