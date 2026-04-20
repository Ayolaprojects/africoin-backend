import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const svgPath = path.join(__dirname, 'src/assets/logo.svg');
const pngPath = path.join(__dirname, 'src/assets/logo.png');
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
    // First, convert SVG to base PNG
    console.log('Converting SVG to PNG...');
    const svgBuffer = fs.readFileSync(svgPath);
    
    await sharp(svgBuffer, { density: 300 })
      .png()
      .toFile(pngPath);
    
    console.log('✓ SVG converted to PNG');

    // Generate icons for each density
    for (const [dir, size] of Object.entries(sizes)) {
      const dirPath = path.join(basePath, dir);
      
      // Ensure directory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Generate ic_launcher.png
      await sharp(pngPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 2, g: 8, b: 23, alpha: 1 }
        })
        .png()
        .toFile(path.join(dirPath, 'ic_launcher.png'));

      // Generate ic_launcher_round.png
      await sharp(pngPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 2, g: 8, b: 23, alpha: 1 }
        })
        .png()
        .toFile(path.join(dirPath, 'ic_launcher_round.png'));

      console.log(`✓ Generated ${size}x${size} icons for ${dir}`);
    }
    
    // Generate splash screen icon
    const splashDir = path.join(__dirname, 'android/app/src/main/res/drawable');
    if (!fs.existsSync(splashDir)) {
      fs.mkdirSync(splashDir, { recursive: true });
    }

    await sharp(pngPath)
      .resize(512, 512, { fit: 'contain', background: { r: 2, g: 8, b: 23, alpha: 1 } })
      .png()
      .toFile(path.join(splashDir, 'splash.png'));

    console.log('✓ Generated splash screen icon');
    console.log('\n✓ All icons generated successfully!');
  } catch (error) {
    console.error('✗ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();
