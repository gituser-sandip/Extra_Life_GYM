#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Image mappings - source path to target folder and new name
const imageMappings = [
  {
    source: 'c:\\Users\\ASUS\\Downloads\\Strength Training.jfif',
    target: 'public/images/classes',
    newName: 'strength-training.jfif'
  },
  {
    source: 'c:\\Users\\ASUS\\Downloads\\High-Intensity Interval Training.jfif',
    target: 'public/images/classes',
    newName: 'high-intensity-interval-training.jfif'
  },
  {
    source: 'c:\\Users\\ASUS\\Downloads\\yoga.jfif',
    target: 'public/images/classes',
    newName: 'yoga-class.jfif'
  },
  {
    source: 'c:\\Users\\ASUS\\Downloads\\3166662233545953.jfif',
    target: 'public/images/testimonials',
    newName: 'member-testimonial-01.jfif'
  },
  {
    source: 'c:\\Users\\ASUS\\Downloads\\Strength is more than just muscle gain_ Its a.jfif',
    target: 'public/images/testimonials',
    newName: 'motivational-quote-strength.jfif'
  },
  {
    source: 'c:\\Users\\ASUS\\Downloads\\11540542794222734.jfif',
    target: 'public/images/testimonials',
    newName: 'member-testimonial-02.jfif'
  },
  {
    source: 'c:\\Users\\ASUS\\Downloads\\dumbels.jfif',
    target: 'public/images/equipment',
    newName: 'dumbbells-set.jfif'
  }
];

console.log('Image Organization Guide Created!');
console.log('\nImage Mappings:');
imageMappings.forEach((mapping, i) => {
  console.log(`${i+1}. ${mapping.newName} -> ${mapping.target}/`);
});
