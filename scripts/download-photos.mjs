import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const PHOTOS = [
  {
    name: 'freelancer-working-laptop-cafe',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=85&auto=format&fit=crop',
    title: 'Freelancer working on laptop in cafe',
  },
  {
    name: 'home-office-desk-minimal',
    url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1600&q=85&auto=format&fit=crop',
    title: 'Home office desk minimal workspace',
  },
  {
    name: 'creative-studio-workspace',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=85&auto=format&fit=crop',
    title: 'Creative studio workspace',
  },
  {
    name: 'person-relaxed-laptop-coffee',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=85&auto=format&fit=crop',
    title: 'Person relaxed with laptop and coffee',
  },
  {
    name: 'invoice-paperwork-desk',
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&q=85&auto=format&fit=crop',
    title: 'Invoice paperwork and business documents on desk',
  },
  {
    name: 'tax-documents-calculator-desk',
    url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1600&q=85&auto=format&fit=crop',
    title: 'Tax documents, calculator and financial paperwork on desk',
  },
];

async function run() {
  const targetDir = path.resolve(process.cwd(), 'assets/photos');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Downloading ${PHOTOS.length} photos...`);

  for (const item of PHOTOS) {
    try {
      console.log(`Fetching: ${item.name}...`);
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Save JPG
      const jpgPath = path.join(targetDir, `${item.name}.jpg`);
      fs.writeFileSync(jpgPath, buffer);
      console.log(`  ✓ Saved ${item.name}.jpg (${(buffer.length / 1024).toFixed(1)} KB)`);

      // Convert to crisp PNG
      const base64 = buffer.toString('base64');
      await page.setViewportSize({ width: 1200, height: 800 });
      await page.setContent(`
        <html style="margin:0;padding:0;overflow:hidden;background:transparent;">
          <body style="margin:0;padding:0;overflow:hidden;">
            <img src="data:image/jpeg;base64,${base64}" style="width:1200px;height:800px;object-fit:cover;display:block;" />
          </body>
        </html>
      `);
      const pngBuffer = await page.screenshot({ type: 'png' });
      const pngPath = path.join(targetDir, `${item.name}.png`);
      fs.writeFileSync(pngPath, pngBuffer);
      console.log(`  ✓ Saved ${item.name}.png (${(pngBuffer.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  ✗ Error downloading ${item.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('Finished photos download.');
}

run().catch(console.error);
