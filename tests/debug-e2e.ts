import { chromium } from 'playwright';

async function testPage() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:3000/ ...');
  const response = await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  console.log('Status:', response?.status());
  console.log('URL:', page.url());
  const title = await page.title();
  console.log('Title:', title);
  const h1 = await page.locator('h1').allInnerTexts();
  console.log('H1s found:', h1);

  console.log('Navigating to http://localhost:3000/login ...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  console.log('Login H1s:', await page.locator('h1').allInnerTexts());
  console.log('Elena Vance count:', await page.locator('text=Elena Vance').count());

  await browser.close();
}

testPage().catch(console.error);
