import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ICON_SIZES = [192, 512];
const SOURCE_ICON = join(__dirname, '../src/assets/witch-icon.png');
const OUTPUT_DIR = join(__dirname, '../public');

async function generateIcons() {
  try {
    // Create a simple colored square if source icon doesn't exist
    if (!existsSync(SOURCE_ICON)) {
      await sharp({
        create: {
          width: 512,
          height: 512,
          channels: 4,
          background: { r: 102, g: 51, b: 153, alpha: 1 }
        }
      })
      .png()
      .toFile(SOURCE_ICON);
    }

    // Generate icons for each size
    for (const size of ICON_SIZES) {
      await sharp(SOURCE_ICON)
        .resize(size, size)
        .png()
        .toFile(join(OUTPUT_DIR, `pwa-${size}x${size}.png`));
    }

    console.log('PWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating PWA icons:', error);
  }
}

generateIcons(); 