#!/bin/bash

echo "========================================"
echo "  PERKINS + CUMMINS Generators Website"
echo "========================================"
echo ""
echo "جاري تشغيل السيرفرات..."
echo ""

# تشغيل الواجهة الخلفية في الخلفية
echo "تشغيل الواجهة الخلفية..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# انتظار قليل
sleep 3

# تشغيل الواجهة الأمامية في الخلفية
echo "تشغيل الواجهة الأمامية..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# انتظار حتى يبدأ السيرفر
echo "انتظار بدء تشغيل السيرفرات..."
sleep 8

# فتح المتصفح
echo "جاري فتح المتصفح..."
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v open > /dev/null; then
    open http://localhost:3000
fi

echo ""
echo "========================================"
echo "  تم تشغيل المشروع بنجاح!"
echo "========================================"
echo ""
echo "الواجهة الأمامية: http://localhost:3000"
echo "الواجهة الخلفية: http://localhost:5000"
echo ""
echo "لإيقاف السيرفرات، اضغط Ctrl+C"
echo ""

# انتظار حتى يتم الضغط على Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait

