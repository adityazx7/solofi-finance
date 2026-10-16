import fs from 'fs';
import path from 'path';

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function run() {
  const assetsDir = path.resolve(process.cwd(), 'assets');
  const publicAssetsDir = path.resolve(process.cwd(), 'public/assets');

  console.log(`Syncing assets from ${assetsDir} to ${publicAssetsDir}...`);
  copyDirRecursive(assetsDir, publicAssetsDir);

  // Copy favicon to public root
  const faviconSvg = path.join(assetsDir, 'social-and-brand/favicon.svg');
  if (fs.existsSync(faviconSvg)) {
    fs.copyFileSync(faviconSvg, path.resolve(process.cwd(), 'public/favicon.svg'));
  }
  const appleTouch = path.join(assetsDir, 'social-and-brand/apple-touch-icon.png');
  if (fs.existsSync(appleTouch)) {
    fs.copyFileSync(appleTouch, path.resolve(process.cwd(), 'public/apple-touch-icon.png'));
  }

  console.log('✓ Successfully mirrored assets to public/assets for Next.js static serving!');
}

run().catch(console.error);
