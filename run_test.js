const fs = require('fs');
const jsdom = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');

const dom = new jsdom.JSDOM(html, { 
  runScripts: 'dangerously'
});

setTimeout(() => console.log('Done test'), 1500);
