const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configuration
const inputImage = 'src/images/digestive-system-illustration.jpg';
const outputDir = 'src/images/processed';
const sizes = [
  { name: 'small', width: 400, height: 350 },
  { name: 'medium', width: 600, height: 525 },
  { name: 'large', width: 800, height: 700 }
];

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processImage() {
  console.log('🖼️  Starting image processing...');
  
  try {
    // Process each size
    for (const size of sizes) {
      console.log(`\n📏 Processing ${size.name} size (${size.width}x${size.height})...`);
      
      // Create WebP version
      await sharp(inputImage)
        .resize(size.width, size.height, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .webp({ quality: 85 })
        .toFile(path.join(outputDir, `digestive-system-illustration-${size.name}.webp`));
      
      // Create optimized JPG version
      await sharp(inputImage)
        .resize(size.width, size.height, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .jpeg({ quality: 85, progressive: true })
        .toFile(path.join(outputDir, `digestive-system-illustration-${size.name}.jpg`));
      
      console.log(`✅ Created ${size.name} versions (WebP & JPG)`);
    }
    
    // Get file sizes
    console.log('\n📊 File sizes:');
    for (const size of sizes) {
      const webpPath = path.join(outputDir, `digestive-system-illustration-${size.name}.webp`);
      const jpgPath = path.join(outputDir, `digestive-system-illustration-${size.name}.jpg`);
      
      if (fs.existsSync(webpPath)) {
        const webpSize = (fs.statSync(webpPath).size / 1024).toFixed(1);
        const jpgSize = (fs.statSync(jpgPath).size / 1024).toFixed(1);
        console.log(`${size.name}: WebP ${webpSize}KB, JPG ${jpgSize}KB`);
      }
    }
    
    console.log('\n🎉 Image processing complete!');
    console.log(`📁 Output directory: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Error processing images:', error);
  }
}

// Run the script
processImage();
