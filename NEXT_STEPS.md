# الخطوات التالية بعد إضافة Environment Variables

## ✅ ما تم إنجازه
- تم إضافة Environment Variables في Vercel

---

## 📋 الخطوات التالية

### 1️⃣ تأكد من Environment Variables في Vercel (Frontend)

في Vercel يجب أن يكون لديك:
- ✅ `NEXT_PUBLIC_API_URL` = رابط الـ backend (مثل: `https://your-backend.railway.app`)

**ملاحظة مهمة**: Vercel للـ Frontend فقط، لا يحتاج `DATABASE_URL`

---

### 2️⃣ نشر Backend على Railway أو Render

**الـ Backend يحتاج إلى نشر منفصل!**

#### خيار 1: Railway (موصى به)
1. اذهب إلى: https://railway.app
2. سجل دخول بحساب GitHub
3. اضغط **New Project**
4. اختر **Deploy from GitHub repo**
5. اختر مشروعك **TEST**
6. في **Root Directory** ضع: `backend`
7. Railway سينشر الـ backend تلقائياً

#### خيار 2: Render
1. اذهب إلى: https://render.com
2. سجل دخول بحساب GitHub
3. اضغط **New +** → **Web Service**
4. اختر مشروعك من GitHub
5. في **Root Directory** ضع: `backend`
6. اضغط **Create Web Service**

---

### 3️⃣ إضافة Environment Variables في Railway/Render (Backend)

**هنا يجب إضافة `DATABASE_URL`!**

#### في Railway:
1. اذهب إلى مشروعك في Railway
2. اضغط **Variables**
3. أضف:
   - **Name**: `DATABASE_URL`
   - **Value**: Connection String من Neon
   - (مثل: `postgresql://user:pass@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require`)

#### في Render:
1. اذهب إلى مشروعك في Render
2. اضغط **Environment**
3. أضف:
   - **Key**: `DATABASE_URL`
   - **Value**: Connection String من Neon

---

### 4️⃣ تحديث NEXT_PUBLIC_API_URL في Vercel

بعد نشر Backend:
1. احصل على رابط الـ backend من Railway/Render
2. اذهب إلى Vercel → مشروعك → **Settings** → **Environment Variables**
3. حدث `NEXT_PUBLIC_API_URL` برابط الـ backend الجديد
4. أعد نشر المشروع (Redeploy)

---

### 5️⃣ إنشاء الجدول في Neon

1. اذهب إلى Neon Dashboard: https://console.neon.tech
2. اضغط **SQL Editor**
3. انسخ محتوى ملف `NEON_SQL.sql`
4. الصق في SQL Editor
5. اضغط **Run**

---

### 6️⃣ اختبار كل شيء

1. افتح موقعك على Vercel
2. املأ نموذج الاتصال
3. تحقق من Console في Backend (يجب أن ترى: `✅ Message saved to Neon database`)
4. اذهب إلى Neon → **SQL Editor**:
   ```sql
   SELECT * FROM contact_messages ORDER BY created_at DESC;
   ```
5. اضغط **Run**
6. ✅ يجب أن ترى الرسالة الجديدة!

---

## ✅ Checklist النهائي

- [ ] `NEXT_PUBLIC_API_URL` موجود في Vercel
- [ ] Backend منشور على Railway/Render
- [ ] `DATABASE_URL` موجود في Railway/Render
- [ ] الجدول `contact_messages` تم إنشاؤه في Neon
- [ ] تم الاختبار بنجاح

---

## 🎯 البنية النهائية

```
Vercel (Frontend)
  ↓ (NEXT_PUBLIC_API_URL)
Railway/Render (Backend)
  ↓ (DATABASE_URL)
Neon (Database)
```

---

## 🆘 حل المشاكل

### المشكلة: Backend لا يعمل
**الحل:**
- تأكد من نشر Backend على Railway/Render
- تحقق من أن Root Directory = `backend`
- تأكد من أن `package.json` موجود في `backend`

### المشكلة: DATABASE_URL لا يعمل
**الحل:**
- تأكد من إضافة `DATABASE_URL` في Railway/Render (ليس Vercel!)
- تحقق من Connection String من Neon
- تأكد من إضافة `?sslmode=require` في النهاية

### المشكلة: البيانات لا تُحفظ
**الحل:**
- تحقق من Console في Backend
- تأكد من أن الجدول موجود في Neon
- تحقق من `DATABASE_URL` في Railway/Render

---

**بالتوفيق! 🚀**

