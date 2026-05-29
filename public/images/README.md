# Image Assets Structure for ExtraLife GYM

This directory contains all image assets used throughout the website.

## Folder Organization

- **hero/** - Landing page hero section banners and background images
- **classes/** - Class-specific images (yoga, cardio, weightlifting, CrossFit, etc.)
- **trainers/** - Trainer profile photos and promotional images
- **pricing/** - Membership tier and pricing section images
- **services/** - Gym services and special offerings visuals
- **testimonials/** - Member success stories and testimonial images
- **members/** - Member gallery and profile images
- **equipment/** - Gym equipment showcase and feature images
- **facilities/** - Facility tours, locations, and amenities
- **about/** - Company history, mission, and team images
- **logos/** - Company logos, brand assets, and variations
- **icons/** - UI icons, social media icons, and icon sets

## Best Practices

- Use optimized image formats (WebP, JPG for photos, PNG for graphics)
- Include Next.js Image component optimization
- Maintain consistent naming conventions (kebab-case)
- Add alt text for accessibility
- Keep high-resolution originals in version control or documentation

## Usage in Components

Import and use images in React components:

```tsx
import Image from 'next/image';
import heroImg from '@/public/images/hero/main-banner.jpg';

export default function HeroSection() {
  return <Image src={heroImg} alt="Hero banner" />;
}
```