import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logoPath = path.join(__dirname, 'src/assets/logo.png');
const basePath = path.join(__dirname, 'android/app/src/main/res');

const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

async function generateIcons() {
  try {
    for (const [dir, size] of Object.entries(sizes)) {
      const dirPath = path.join(basePath, dir);
      
      // Ensure directory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Generate ic_launcher.png
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(path.join(dirPath, 'ic_launcher.png'));

      // Generate ic_launcher_round.png
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(path.join(dirPath, 'ic_launcher_round.png'));

      console.log(`✓ Generated ${size}x${size} icons for ${dir}`);
    }
    console.log('\n✓ All Android launcher icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
