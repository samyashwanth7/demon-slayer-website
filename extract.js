const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
fs.writeFileSync('script.js', scriptMatch[1]);
console.log('Script written.');
