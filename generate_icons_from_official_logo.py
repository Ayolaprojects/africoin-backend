#!/usr/bin/env python
"""Generate Africoin app icons from official AFRICOIN logo with proper scaling"""

import os
from PIL import Image
from pathlib import Path
import shutil

# Define sizes for different Android densities
SIZES = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
}

def generate_icons_from_logo():
    """Generate icons using the official AFRICOIN logo with proper padding"""
    logo_path = r'C:\Users\zwexm\LPSN\AFRICOIN\logo.png'
    base_path = Path('android/app/src/main/res')
    
    # Verify logo exists
    if not os.path.exists(logo_path):
        print(f'✗ Logo not found at: {logo_path}')
        return False
    
    # Load the original logo
    logo = Image.open(logo_path).convert('RGBA')
    print(f'✓ Loaded logo from: {logo_path}')
    print(f'  Original size: {logo.size}')
    
    # Generate icons for each density
    for density_dir, size in SIZES.items():
        dir_path = base_path / density_dir
        dir_path.mkdir(parents=True, exist_ok=True)
        
        # Create a canvas with transparent background
        canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        
        # Calculate scaling to fit logo with padding (85% of canvas)
        max_logo_size = int(size * 0.85)
        
        # Resize logo maintaining aspect ratio
        logo_resized = logo.copy()
        logo_resized.thumbnail((max_logo_size, max_logo_size), Image.Resampling.LANCZOS)
        
        # Calculate position to center the logo
        logo_x = (size - logo_resized.width) // 2
        logo_y = (size - logo_resized.height) // 2
        
        # Paste logo onto canvas
        canvas.paste(logo_resized, (logo_x, logo_y), logo_resized)
        
        # Save launcher icons
        canvas.save(dir_path / 'ic_launcher.png')
        canvas.save(dir_path / 'ic_launcher_round.png')
        canvas.save(dir_path / 'ic_launcher_foreground.png')
        
        print(f'✓ Generated {size}x{size} icon for {density_dir} (logo: {logo_resized.size})')
    
    # Generate splash screen image (512x512)
    splash_dir = base_path / 'drawable'
    splash_dir.mkdir(parents=True, exist_ok=True)
    
    splash_canvas = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    max_splash_logo = int(512 * 0.75)
    
    splash_logo = logo.copy()
    splash_logo.thumbnail((max_splash_logo, max_splash_logo), Image.Resampling.LANCZOS)
    
    splash_x = (512 - splash_logo.width) // 2
    splash_y = (512 - splash_logo.height) // 2
    
    splash_canvas.paste(splash_logo, (splash_x, splash_y), splash_logo)
    splash_canvas.save(splash_dir / 'splash.png')
    print('✓ Generated splash screen icon (512x512)')
    
    print('\n✓ All Africoin icons generated with proper scaling!')
    return True

if __name__ == '__main__':
    success = generate_icons_from_logo()
    exit(0 if success else 1)

