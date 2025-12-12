@echo off
echo ========================================
echo   PERKINS + CUMMINS Generators Website
echo ========================================
echo.
echo جاري تشغيل السيرفرات...
echo.

REM إنشاء نوافذ منفصلة للسيرفرات
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

start "Frontend Server" cmd /k "cd frontend && npm run dev"
timeout /t 8 /nobreak >nul

echo.
echo جاري فتح المتصفح...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo   تم تشغيل المشروع بنجاح!
echo ========================================
echo.
echo الواجهة الأمامية: http://localhost:3000
echo الواجهة الخلفية: http://localhost:5000
echo.
echo اضغط أي مفتاح لإغلاق هذه النافذة...
echo (السيرفرات ستبقى تعمل في نوافذ منفصلة)
pause >nul

