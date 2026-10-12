const fs = require('fs');
const path = require('path');

const filePath = 'C:/Users/asus/.gemini/antigravity-ide/brain/ff1100fa-2846-4263-857d-6ca1f6fe22ed/.system_generated/steps/1313/content.md';
const content = fs.readFileSync(filePath, 'utf8');

console.log('Total file length:', content.length);

// Look for <table> or player rows
const tableIndex = content.indexOf('<table');
if (tableIndex !== -1) {
  console.log('First <table> found at index', tableIndex);
  console.log(content.substring(tableIndex, tableIndex + 2500));
} else {
  console.log('No <table> found');
}

// Look for sportsbase.io or images or player links
const sportsbaseImgs = [...content.matchAll(/https?:\/\/[^"'\s]+sportsbase\.io[^"'\s]+/g)].map(m => m[0]);
console.log('Sportsbase images count:', sportsbaseImgs.length);
console.log('Sample sportsbase images:', sportsbaseImgs.slice(0, 10));

// Player links / rows
const playerLinks = [...content.matchAll(/<a[^>]+href="([^"]*player[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)];
console.log('Player links count:', playerLinks.length);
if (playerLinks.length > 0) {
  playerLinks.slice(0, 10).forEach(m => console.log('  Link:', m[1], 'Text:', m[2].replace(/<[^>]+>/g, '').trim()));
}
