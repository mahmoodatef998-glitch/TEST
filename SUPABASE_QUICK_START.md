# 🚀 دليل سريع: Supabase + Vercel

## الخطوات السريعة (10 دقائق)

### 1️⃣ إنشاء قاعدة بيانات على Supabase

1. اذهب إلى: **https://supabase.com**
2. اضغط **Start your project**
3. سجل دخول بحساب GitHub
4. اضغط **New Project**
5. املأ البيانات:
   - **Name**: `perkins-cummins-db`
   - **Database Password**: اختر كلمة مرور قوية
   - **Region**: اختر أقرب منطقة
   - **Plan**: Free
6. اضغط **Create new project**
7. انتظر 2-3 دقائق

---

### 2️⃣ إنشاء جدول في قاعدة البيانات

1. في Supabase Dashboard، اضغط **Table Editor**
2. اضغط **New Table**
3. **Name**: `contact_messages`
4. اضغط **Add Column** وأضف:

| Column | Type | Default |
|--------|------|---------|
| `id` | `uuid` | `gen_random_uuid()` |
| `name` | `text` | - |
| `email` | `text` | - |
| `phone` | `text` | - |
| `message` | `text` | - |
| `created_at` | `timestamptz` | `now()` |

5. اضغط **Save**

---

### 3️⃣ الحصول على API Keys

1. اضغط **Settings** → **API**
2. انسخ:
   - **Project URL** (مثل: `https://xxxxx.supabase.co`)
   - **anon public key**

---

### 4️⃣ إعداد Row Level Security

1. في **Table Editor** → `contact_messages`
2. اضغط **Policies** → **New Policy**
3. اختر **For full customization**
4. **Policy name**: `Allow insert for all`
5. **Allowed operation**: `INSERT`
6. **Policy definition**: `true`
7. اضغط **Save policy**

---

### 5️⃣ إضافة متغيرات البيئة في Vercel

**للـ Frontend (Vercel):**
1. Vercel Dashboard → مشروعك → **Settings** → **Environment Variables**
2. أضف:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key

**للـ Backend (Railway/Render):**
1. Railway/Render Dashboard → مشروعك → **Variables**
2. أضف:
   - `SUPABASE_URL` = Project URL
   - `SUPABASE_ANON_KEY` = anon public key

---

### 6️⃣ تثبيت Supabase في Backend

```bash
cd backend
npm install @supabase/supabase-js
```

---

### 7️⃣ اختبار

1. افتح موقعك
2. املأ نموذج الاتصال
3. اذهب إلى Supabase → **Table Editor** → `contact_messages`
4. ✅ يجب أن ترى الرسالة الجديدة!

---

## ✅ Checklist

- [ ] حساب Supabase جاهز
- [ ] جدول `contact_messages` تم إنشاؤه
- [ ] API Keys تم نسخها
- [ ] Row Level Security تم إعداده
- [ ] متغيرات البيئة تم إضافتها
- [ ] Supabase تم تثبيته في Backend
- [ ] تم الاختبار بنجاح

---

## 🎯 النتيجة

الآن جميع رسائل نموذج الاتصال سيتم حفظها في قاعدة بيانات Supabase!

يمكنك:
- ✅ عرض جميع الرسائل في Supabase Dashboard
- ✅ تصدير البيانات
- ✅ إضافة المزيد من الجداول
- ✅ استخدام Supabase للـ Authentication

---

**بالتوفيق! 🚀**

