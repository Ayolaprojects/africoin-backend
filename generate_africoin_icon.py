#!/usr/bin/env python
"""Generate Africoin app icons from scratch using PIL"""

import os
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

# Define sizes for different Android densities
SIZES = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
}

# Colors
DARK_BG = (2, 8, 23)  # Dark navy
GREEN = (34, 197, 94)  # Green accent
GOLD = (251, 191, 36)  # Gold accent

def create_africoin_icon(size):
    """Create an Africoin icon of the specified size"""
    # Create image with dark background
    img = Image.new('RGBA', (size, size), DARK_BG + (255,))
    draw = ImageDraw.Draw(img)
    
    # Draw outer circle border
    margin = int(size * 0.05)
    draw.ellipse([margin, margin, size-margin, size-margin], outline=GREEN, width=int(size*0.03))
    
    center = size // 2
    radius = int(size * 0.35)
    
    # Draw letter "A" using lines (simplified geometric style)
    line_thickness = max(1, int(size * 0.05))
    
    # Left diagonal of A
    pt1 = (center - radius, center + radius)
    pt2 = (center, center - radius)
    draw.line([pt1, pt2], fill=GREEN, width=line_thickness)
    
    # Right diagonal of A
    pt3 = (center + radius, center + radius)
    draw.line([pt2, pt3], fill=GREEN, width=line_thickness)
    
    # Horizontal bar of A
    bar_y = center + int(radius * 0.3)
    bar_left = center - int(radius * 0.6)
    bar_right = center + int(radius * 0.6)
    draw.line([(bar_left, bar_y), (bar_right, bar_y)], fill=GOLD, width=int(line_thickness * 0.8))
    
    # Add small dots for detail
    dot_radius = max(1, int(size * 0.02))
    draw.ellipse([center-radius-10, center-radius, center-radius, center-radius+10], fill=GOLD)
    draw.ellipse([center+radius, center-radius, center+radius+10, center-radius+10], fill=GOLD)
    
    return img

def generate_icons():
    """Generate icons for all Android densities"""
    base_path = Path('android/app/src/main/res')
    
    for density_dir, size in SIZES.items():
        dir_path = base_path / density_dir
        dir_path.mkdir(parents=True, exist_ok=True)
        
        # Create icon
        icon = create_africoin_icon(size)
        
        # Save launcher icons
        icon.save(dir_path / 'ic_launcher.png')
        icon.save(dir_path / 'ic_launcher_round.png')
        
        print(f'✓ Generated {size}x{size} icons for {density_dir}')
    
    # Generate splash screen image
    splash_dir = base_path / 'drawable'
    splash_dir.mkdir(parents=True, exist_ok=True)
    splash = create_africoin_icon(512)
    splash.save(splash_dir / 'splash.png')
    print('✓ Generated splash screen icon')
    
    # Generate foreground icon for adaptive icon (Android 8+)
    for density_dir, size in SIZES.items():
        foreground = create_africoin_icon(size)
        dir_path = base_path / density_dir
        foreground.save(dir_path / 'ic_launcher_foreground.png')
    
    print('\n✓ All Africoin icons generated successfully!')

if __name__ == '__main__':
    generate_icons()
