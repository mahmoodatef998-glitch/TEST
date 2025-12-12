# PowerShell script to start both servers and open browser
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PERKINS + CUMMINS Generators Website" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "جاري تشغيل السيرفرات..." -ForegroundColor Yellow
Write-Host ""

# تشغيل الواجهة الخلفية في نافذة منفصلة
Write-Host "تشغيل الواجهة الخلفية..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev" -WindowStyle Normal

# انتظار قليل قبل تشغيل الواجهة الأمامية
Start-Sleep -Seconds 3

# تشغيل الواجهة الأمامية في نافذة منفصلة
Write-Host "تشغيل الواجهة الأمامية..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev" -WindowStyle Normal

# انتظار حتى يبدأ السيرفر
Write-Host "انتظار بدء تشغيل السيرفرات..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# فتح المتصفح
Write-Host "جاري فتح المتصفح..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  تم تشغيل المشروع بنجاح!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "الواجهة الأمامية: http://localhost:3000" -ForegroundColor White
Write-Host "الواجهة الخلفية: http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "اضغط أي مفتاح لإغلاق هذه النافذة..." -ForegroundColor Yellow
Write-Host "(السيرفرات ستبقى تعمل في نوافذ منفصلة)" -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

