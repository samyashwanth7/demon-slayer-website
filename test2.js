const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('pageerror', err => {
    console.log("PAGEERROR_MESSAGE:", err.message);
    console.log("PAGEERROR_NAME:", err.name);
    console.log("PAGEERROR_STACK:", err.stack);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });
  const url = 'file:///' + process.cwd().replace(/\\/g, '/') + '/index.html';
  await page.goto(url);
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
