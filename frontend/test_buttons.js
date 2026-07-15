const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:5174/expenses');
  await page.waitForSelector('button');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && (text.includes('Add Expense') || text.includes('Add First Expense'))) {
      console.log('Clicking', text.trim());
      await btn.click();
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  await browser.close();
})();
