@echo off
REM Copy images to their respective folders

echo Creating directories...
mkdir "public\images\classes" 2>nul
mkdir "public\images\testimonials" 2>nul
mkdir "public\images\equipment" 2>nul

echo.
echo Copying images...

REM Copy class images
copy "C:\Users\ASUS\Downloads\Strength Training.jfif" "public\images\classes\strength-training.jfif"
copy "C:\Users\ASUS\Downloads\High-Intensity Interval Training.jfif" "public\images\classes\high-intensity-interval-training.jfif"
copy "C:\Users\ASUS\Downloads\yoga.jfif" "public\images\classes\yoga-class.jfif"

REM Copy testimonial images
copy "C:\Users\ASUS\Downloads\3166662233545953.jfif" "public\images\testimonials\member-testimonial-01.jfif"
copy "C:\Users\ASUS\Downloads\Strength is more than just muscle gain_ It's a….jfif" "public\images\testimonials\motivational-quote-strength.jfif"
copy "C:\Users\ASUS\Downloads\11540542794222734.jfif" "public\images\testimonials\member-testimonial-02.jfif"

REM Copy equipment images
copy "C:\Users\ASUS\Downloads\dumbels.jfif" "public\images\equipment\dumbbells-set.jfif"

echo.
echo All images copied successfully!
pause