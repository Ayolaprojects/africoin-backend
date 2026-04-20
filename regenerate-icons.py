#!/usr/bin/env python3
from PIL import Image, ImageDraw
import os

# Load the original logo
logo_path = r'C:\Users\zwexm\LPSN\AFRICOIN\logo.png'
img = Image.open(logo_path).convert('RGBA')
print(f"✓ Loaded logo: {img.size} {img.mode}")

# Icon sizes for Android
sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
}

base_dir = r'C:\Users\zwexm\LPSN\AFRICOIN-APP\android\app\src\main\res'

# Generate icons
for folder, size in sizes.items():
    # Create folder if it doesn't exist
    folder_path = os.path.join(base_dir, folder)
    os.makedirs(folder_path, exist_ok=True)
    
    # Create a transparent background
    icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    
    # Resize logo to fit (95% of icon size)
    logo_size = int(size * 0.95)
    resized = img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Calculate position to center
    offset = (size - logo_size) // 2
    
    # Paste logo onto transparent background
    icon.paste(resized, (offset, offset), resized)
    
    # Save ic_launcher.png
    icon_path = os.path.join(folder_path, 'ic_launcher.png')
    icon.save(icon_path, 'PNG')
    print(f"✓ Generated {size}x{size} → {folder}/ic_launcher.png")
    
    # Save ic_launcher_round.png (same for now, fully transparent corners)
    round_path = os.path.join(folder_path, 'ic_launcher_round.png')
    icon.save(round_path, 'PNG')
    print(f"✓ Generated {size}x{size} → {folder}/ic_launcher_round.png")

print("\n✓ All Android launcher icons regenerated with transparency!")
