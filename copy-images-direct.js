#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const imageMappings = [
  {
    source: 'C:\\Users\\ASUS\\Downloads\\Strength Training.jfif',
    target: 'public/images/classes/strength-training.jfif'
  },
  {
    source: 'C:\\Users\\ASUS\\Downloads\\High-Intensity Interval Training.jfif',
    target: 'public/images/classes/high-intensity-interval-training.jfif'
  },
  {
    source: 'C:\\Users\\ASUS\\Downloads\\yoga.jfif',
    target: 'public/images/classes/yoga-class.jfif'
  },
  {
    source: 'C:\\Users\\ASUS\\Downloads\\3166662233545953.jfif',
    target: 'public/images/testimonials/member-testimonial-01.jfif'
  },
  {
    source: 'C:\\Users\\ASUS\\Downloads\\Strength is more than just muscle gain_ It\'s a….jfif',
    target: 'public/images/testimonials/motivational-quote-strength.jfif'
  },
  {
    source: 'C:\\Users\\ASUS\\Downloads\\11540542794222734.jfif',
    target: 'public/images/testimonials/member-testimonial-02.jfif'
  },
  {
    source: 'C:\\Users\\ASUS\\Downloads\\dumbels.jfif',
    target: 'public/images/equipment/dumbbells-set.jfif'
  }
];

console.log('🖼️  Starting image copy process...\n');

// Create directories
imageMappings.forEach(mapping => {
  const dir = path.dirname(mapping.target);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
});

console.log('\n📸 Copying images...\n');

let successCount = 0;
let errorCount = 0;

imageMappings.forEach((mapping, index) => {
  try {
    if (!fs.existsSync(mapping.source)) {
      console.log(`✗ [${index + 1}] Source not found: ${mapping.source}`);
      errorCount++;
      return;
    }

    fs.copyFileSync(mapping.source, mapping.target);
    const fileSize = fs.statSync(mapping.target).size;
    console.log(`✓ [${index + 1}] ${path.basename(mapping.target)}`);
    console.log(`   Size: ${(fileSize / 1024).toFixed(2)} KB`);
    successCount++;
  } catch (error) {
    console.log(`✗ [${index + 1}] Error: ${error.message}`);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Successfully copied: ${successCount} images`);
if (errorCount > 0) {
  console.log(`❌ Errors: ${errorCount}`);
}
console.log('='.repeat(50));

console.log('\n📁 Image Organization Summary:');
console.log('   • classes/ → 3 images (yoga, strength, HIIT)');
console.log('   • testimonials/ → 3 images (testimonials + motivation)');
console.log('   • equipment/ → 1 image (dumbbells)');
console.log('\nReady to commit to GitHub! 🚀');