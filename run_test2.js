const fs = require('fs');
const jsdom = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("jsdomError", (e) => { console.error("JSDOM Error:", e.message); });
virtualConsole.on("error", (e) => { console.error("Console Error:", e); });

const dom = new jsdom.JSDOM(html, { 
  runScripts: 'dangerously',
  virtualConsole: virtualConsole
});

dom.window.addEventListener("error", (e) => {
  console.error("Window error:", e.error.message, e.error.stack);
});
dom.window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled rejection:", e.reason);
});

setTimeout(() => {
  console.log('Test completed');
}, 2000);
