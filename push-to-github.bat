@echo off
REM Commit and push to GitHub

echo.
echo ========================================
echo GitHub Commit ^& Push Script
echo ========================================
echo.

REM Check git status
echo Checking git status...
git status --short

echo.
echo ========================================
echo Staging changes...
echo ========================================
git add -A

echo.
echo ========================================
echo Creating commit...
echo ========================================
git commit -m "Add image folder structure and setup scripts" -m "- Create organized image folders (13 directories)" -m "- classes/: training and fitness class images" -m "- testimonials/: member testimonials and motivation" -m "- equipment/: gym equipment showcase" -m "- Add image copy scripts (Node.js and batch)" -m "- Add npm scripts for image organization" -m "- Update package.json with setup commands" -m "- Add IMAGE-SETUP.md documentation" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo.
echo ========================================
echo Pushing to GitHub...
echo ========================================
git push origin agents-create-image-folders

echo.
echo ========================================
echo Success! Changes pushed to GitHub
echo ========================================
echo.
pause