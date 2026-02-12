# PowerShell Migration Script for Mahoura Cosmetics
# Run this from the extracted mahoura-cosmetics directory

param(
    [string]$targetPath = "D:\programming\Mahoura\Frontend"
)

Write-Host "🎨 Mahoura Cosmetics Migration Script" -ForegroundColor Cyan
Write-Host "Target: $targetPath" -ForegroundColor Yellow
Write-Host ""

# Confirm before proceeding
$confirm = Read-Host "This will copy files to your existing project. Continue? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Migration cancelled." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "📦 Step 1: Copying app files..." -ForegroundColor Green
Copy-Item -Path ".\src\app\*" -Destination "$targetPath\src\app\" -Recurse -Force
Write-Host "✓ App files copied" -ForegroundColor Green

Write-Host ""
Write-Host "📦 Step 2: Copying UI components..." -ForegroundColor Green
New-Item -ItemType Directory -Force -Path "$targetPath\src\components\ui" | Out-Null
Copy-Item -Path ".\src\components\ui\*" -Destination "$targetPath\src\components\ui\" -Recurse -Force
Write-Host "✓ UI components copied" -ForegroundColor Green

Write-Host ""
Write-Host "📦 Step 3: Copying lib utils..." -ForegroundColor Green
Copy-Item -Path ".\src\lib\*" -Destination "$targetPath\src\lib\" -Recurse -Force
Write-Host "✓ Lib files copied" -ForegroundColor Green

Write-Host ""
Write-Host "⚠️  Manual Steps Required:" -ForegroundColor Yellow
Write-Host "1. Update your package.json with new dependencies (see INSTALLATION.md)"
Write-Host "2. Merge globals.css styles (see extracted file)"
Write-Host "3. Merge tailwind.config.ts colors and animations"
Write-Host "4. Run: npm install"
Write-Host "5. Run: npm run dev"
Write-Host ""
Write-Host "✨ Migration complete! Check INSTALLATION.md for details." -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next: cd $targetPath && npm install && npm run dev" -ForegroundColor Green
