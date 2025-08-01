#!/usr/bin/env python3
"""
Windows Image Compression Script for NUVIC5M Project
Compresses JPEG images while maintaining good quality
Compatible with Windows Command Prompt
"""

import os
import sys
import shutil
from pathlib import Path

def check_pillow():
    """Check if Pillow is installed"""
    try:
        from PIL import Image, ImageOps
        return True
    except ImportError:
        print("❌ PIL (Pillow) not available.")
        print("📦 Install with: pip install Pillow")
        print("🔄 Then run this script again.")
        return False

def get_file_size_mb(file_path):
    """Get file size in MB"""
    return os.path.getsize(file_path) / (1024 * 1024)

def compress_image(input_path, output_path=None, quality=85, max_width=1920, max_height=1080):
    """
    Compress a JPEG image for web use
    
    Args:
        input_path: Path to input image
        output_path: Path for output (if None, overwrites input)
        quality: JPEG quality (1-100, higher = better quality)
        max_width: Maximum width in pixels
        max_height: Maximum height in pixels
    """
    from PIL import Image
    
    if output_path is None:
        output_path = input_path
    
    try:
        with Image.open(input_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Get original dimensions and size
            original_width, original_height = img.size
            original_size_mb = get_file_size_mb(input_path)
            
            # Resize if too large
            resized = False
            if img.width > max_width or img.height > max_height:
                img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
                resized = True
            
            # Save with compression
            img.save(output_path, 'JPEG', quality=quality, optimize=True, progressive=True)
            
            # Get new size
            new_size_mb = get_file_size_mb(output_path)
            reduction = ((original_size_mb - new_size_mb) / original_size_mb) * 100
            
            # Print results
            print(f"✅ {os.path.basename(input_path)}")
            if resized:
                print(f"   📐 Resized: {original_width}x{original_height} → {img.width}x{img.height}")
            print(f"   📊 Size: {original_size_mb:.1f}MB → {new_size_mb:.1f}MB")
            print(f"   💾 Saved: {reduction:.1f}% ({original_size_mb - new_size_mb:.1f}MB)")
            print()
            
            return new_size_mb, reduction
            
    except Exception as e:
        print(f"❌ Error compressing {input_path}: {e}")
        return None, 0

def main():
    """Main compression function"""
    print("🖼️  NUVIC5M Image Compression Tool")
    print("=" * 50)
    
    # Check if Pillow is available
    if not check_pillow():
        return
    
    # Path to images directory
    script_dir = Path(__file__).parent
    images_dir = script_dir / "assets" / "images"
    
    if not images_dir.exists():
        print(f"❌ Directory not found: {images_dir}")
        print("💡 Make sure you're running this script from the project root directory")
        return
    
    # Get all JPEG files
    jpeg_files = list(images_dir.glob("*.jpg")) + list(images_dir.glob("*.jpeg"))
    
    if not jpeg_files:
        print("❌ No JPEG files found!")
        return
    
    print(f"📁 Found {len(jpeg_files)} JPEG files")
    print()
    
    # Create backup directory
    backup_dir = images_dir / "originals_backup"
    backup_dir.mkdir(exist_ok=True)
    
    # Sort files by size (largest first)
    jpeg_files.sort(key=lambda x: os.path.getsize(x), reverse=True)
    
    total_original_size = 0
    total_new_size = 0
    compressed_count = 0
    
    for img_file in jpeg_files:
        file_size_mb = get_file_size_mb(img_file)
        total_original_size += file_size_mb
        
        # Skip if already very small
        if file_size_mb < 0.5:  # Skip files smaller than 500KB
            print(f"⏭️  Skipping {img_file.name} (already small: {file_size_mb:.1f}MB)")
            total_new_size += file_size_mb
            continue
        
        # Create backup
        backup_path = backup_dir / img_file.name
        if not backup_path.exists():
            shutil.copy2(img_file, backup_path)
            print(f"💾 Backed up {img_file.name}")
        
        # Determine compression settings based on file size
        if file_size_mb > 5:
            quality = 80  # More aggressive compression for very large files
            max_width, max_height = 1920, 1080
        elif file_size_mb > 2:
            quality = 85  # Moderate compression
            max_width, max_height = 1920, 1080
        else:
            quality = 90  # Light compression
            max_width, max_height = 1920, 1080
        
        # Compress the image
        new_size, reduction = compress_image(
            img_file, 
            quality=quality, 
            max_width=max_width, 
            max_height=max_height
        )
        
        if new_size is not None:
            total_new_size += new_size
            compressed_count += 1
    
    # Print summary
    print("=" * 50)
    print("📊 COMPRESSION SUMMARY")
    print("=" * 50)
    print(f"📁 Files processed: {compressed_count}")
    print(f"📊 Total original size: {total_original_size:.1f}MB")
    print(f"📊 Total new size: {total_new_size:.1f}MB")
    print(f"💾 Total saved: {total_original_size - total_new_size:.1f}MB")
    print(f"📈 Overall reduction: {((total_original_size - total_new_size) / total_original_size) * 100:.1f}%")
    print(f"💾 Backups saved to: {backup_dir}")
    print()
    print("✅ Compression complete!")
    print("🌐 Your website will now load much faster!")

if __name__ == "__main__":
    main()
