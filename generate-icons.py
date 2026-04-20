#!/usr/bin/env python3
from PIL import Image
import os

logo_path = r"C:\Users\zwexm\LPSN\AFRICOIN\logo.png"
base_path = r"c:\Users\zwexm\LPSN\AFRICOIN-APP\android\app\src\main\res"

sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

try:
    # Open original logo
    img = Image.open(logo_path).convert("RGBA")
    print(f"Original image mode: {img.mode}, size: {img.size}")
    
    for dir_name, size in sizes.items():
        dir_path = os.path.join(base_path, dir_name)
        os.makedirs(dir_path, exist_ok=True)
        
        # Create a square canvas with transparency
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        
        # Resize image maintaining aspect ratio
        img_copy = img.copy()
        img_copy.thumbnail((size, size), Image.Resampling.LANCZOS)
        
        # Calculate position to center the image
        offset = ((size - img_copy.width) // 2, (size - img_copy.height) // 2)
        
        # Paste onto canvas
        canvas.paste(img_copy, offset, img_copy)
        
        # Save as PNG (preserves transparency and quality for Android)
        launcher_path = os.path.join(dir_path, 'ic_launcher.png')
        launcher_round_path = os.path.join(dir_path, 'ic_launcher_round.png')
        
        canvas.save(launcher_path, 'PNG', quality=95)
        canvas.save(launcher_round_path, 'PNG', quality=95)
        
        print(f"✓ Generated {size}x{size} (mode: RGBA) icons for {dir_name}")
    
    print("\n✓ All Android launcher icons generated with transparency!")
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)
