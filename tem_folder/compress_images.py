#!/usr/bin/env python3
"""
Image Compression Script for NUVIC5M Project
Compresses JPEG images while maintaining good quality
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("PIL (Pillow) not available. Install with: pip install Pillow")
    sys.exit(1)

def compress_image(input_path, output_path=None, quality=85, max_width=1920, max_height=1080):
    """
    Compress a JPEG image
    
    Args:
        input_path: Path to input image
        output_path: Path for output (if None, overwrites input)
        quality: JPEG quality (1-100, higher = better quality)
        max_width: Maximum width in pixels
        max_height: Maximum height in pixels
    """
    if output_path is None:
        output_path = input_path
    
    try:
        with Image.open(input_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Get original size
            original_size = os.path.getsize(input_path)
            
            # Resize if too large
            if img.width > max_width or img.height > max_height:
                img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
                print(f"Resized {input_path} to {img.width}x{img.height}")
            
            # Save with compression
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            # Get new size
            new_size = os.path.getsize(output_path)
            reduction = ((original_size - new_size) / original_size) * 100
            
            print(f"Compressed {input_path}:")
            print(f"  Original: {original_size/1024/1024:.1f}MB")
            print(f"  New: {new_size/1024/1024:.1f}MB")
            print(f"  Reduction: {reduction:.1f}%")
            print()
            
    except Exception as e:
        print(f"Error compressing {input_path}: {e}")

def main():
    # Path to images directory
    images_dir = Path("assets/images")
    
    if not images_dir.exists():
        print("assets/images directory not found!")
        return
    
    # Get all JPEG files
    jpeg_files = list(images_dir.glob("*.jpg")) + list(images_dir.glob("*.jpeg"))
    
    if not jpeg_files:
        print("No JPEG files found!")
        return
    
    print(f"Found {len(jpeg_files)} JPEG files to compress...")
    print()
    
    # Create backup directory
    backup_dir = images_dir / "originals"
    backup_dir.mkdir(exist_ok=True)
    
    for img_file in jpeg_files:
        # Skip if already very small
        file_size = os.path.getsize(img_file)
        if file_size < 500 * 1024:  # Skip files smaller than 500KB
            print(f"Skipping {img_file.name} (already small: {file_size/1024:.0f}KB)")
            continue
        
        # Create backup
        backup_path = backup_dir / img_file.name
        if not backup_path.exists():
            import shutil
            shutil.copy2(img_file, backup_path)
            print(f"Backed up {img_file.name}")
        
        # Compress the image
        compress_image(img_file, quality=85, max_width=1920, max_height=1080)
    
    print("Compression complete!")
    print(f"Original files backed up to: {backup_dir}")

if __name__ == "__main__":
    main()
