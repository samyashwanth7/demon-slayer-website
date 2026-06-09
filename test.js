const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.toString());
  });
  page.on('console', msg => {
    if (msg.type() === 'error') console.error('CONSOLE ERROR:', msg.text());
  });
  const url = 'file:///' + process.cwd().replace(/\\/g, '/') + '/index.html';
  console.log("Navigating to", url);
  await page.goto(url);
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
  console.log("Done");
})();
