const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const matches = [...html.matchAll(/src="([^"]+\.(png|jpg|jpeg))"/g)];
const images = matches.map(m => m[1]).filter((v, i, a) => a.indexOf(v) === i);
console.log('Images referenced in HTML:');
images.forEach(img => {
  const exists = fs.existsSync(img);
  console.log(`- ${img}: ${exists ? 'EXISTS' : 'MISSING'}`);
});
