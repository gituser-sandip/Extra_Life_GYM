# Image Setup Instructions

## Two Ways to Copy Images

### Option 1: Using Node.js (Recommended)

Run from project root:

```bash
node copy-images-direct.js
```

Or use npm:

```bash
npm run copy:images
```

### Option 2: Using Batch File (Windows)

Double-click `copy-images.bat` from the project root folder.

OR run from Command Prompt:

```cmd
copy-images.bat
```

## What Gets Copied

✅ **Classes** (3 images)
- Strength Training → `public/images/classes/strength-training.jfif`
- High-Intensity Interval Training → `public/images/classes/high-intensity-interval-training.jfif`
- yoga → `public/images/classes/yoga-class.jfif`

✅ **Testimonials** (3 images)
- 3166662233545953 → `public/images/testimonials/member-testimonial-01.jfif`
- Strength is more than... → `public/images/testimonials/motivational-quote-strength.jfif`
- 11540542794222734 → `public/images/testimonials/member-testimonial-02.jfif`

✅ **Equipment** (1 image)
- dumbels → `public/images/equipment/dumbbells-set.jfif`

## After Copying

Commit your changes:

```bash
git add public/images/
git commit -m "Add gym images to respective folders"
```

Then push to GitHub! 🚀