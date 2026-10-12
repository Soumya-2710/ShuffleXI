const fs = require('fs');

const filePath = 'C:/Users/asus/.gemini/antigravity-ide/brain/ff1100fa-2846-4263-857d-6ca1f6fe22ed/.system_generated/steps/1313/content.md';
const content = fs.readFileSync(filePath, 'utf8');

const scriptTags = [...content.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
console.log('Script 35 length:', scriptTags[35][1].length);
console.log(scriptTags[35][1].slice(0, 3000));
