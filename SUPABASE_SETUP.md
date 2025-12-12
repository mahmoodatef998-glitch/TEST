# إعداد Supabase Database مع المشروع

## 📋 ما هو Supabase؟

Supabase هو بديل مفتوح المصدر لـ Firebase، يوفر:
- ✅ PostgreSQL Database (قاعدة بيانات)
- ✅ Authentication (المصادقة)
- ✅ Real-time subscriptions (الاشتراكات الفورية)
- ✅ Storage (التخزين)
- ✅ API تلقائية

---

## 🚀 الخطوة 1: إنشاء حساب على Supabase

1. اذهب إلى: **https://supabase.com**
2. اضغط على **Start your project**
3. سجل دخول بحساب GitHub
4. امنح الصلاحيات المطلوبة

---

## 🏗️ الخطوة 2: إنشاء مشروع جديد

1. بعد تسجيل الدخول، اضغط **New Project**
2. املأ البيانات:
   - **Name**: `perkins-cummins-db` (أو أي اسم تريده)
   - **Database Password**: اختر كلمة مرور قوية (احفظها!)
   - **Region**: اختر أقرب منطقة لك
   - **Pricing Plan**: اختر **Free** للمشاريع الصغيرة
3. اضغط **Create new project**
4. انتظر 2-3 دقائق حتى يتم إنشاء المشروع

---

## 📊 الخطوة 3: إنشاء جدول لقاعدة البيانات

### إنشاء جدول للرسائل (Contact Messages)

1. في لوحة التحكم، اضغط على **Table Editor** من القائمة الجانبية
2. اضغط **New Table**
3. املأ البيانات:
   - **Name**: `contact_messages`
   - **Description**: `Store contact form submissions`
4. اضغط **Add Column** لإضافة الأعمدة:

#### الأعمدة المطلوبة:

| Column Name | Type | Default Value | Nullable |
|------------|------|---------------|----------|
| `id` | `uuid` | `gen_random_uuid()` | ❌ |
| `name` | `text` | - | ❌ |
| `email` | `text` | - | ❌ |
| `phone` | `text` | - | ❌ |
| `message` | `text` | - | ❌ |
| `created_at` | `timestamptz` | `now()` | ❌ |

5. اضغط **Save** لحفظ الجدول

---

## 🔑 الخطوة 4: الحصول على API Keys

1. في لوحة التحكم، اضغط على **Settings** (الإعدادات)
2. اضغط على **API** من القائمة الجانبية
3. ستجد:
   - **Project URL**: مثل `https://xxxxx.supabase.co`
   - **anon public key**: المفتاح العام
   - **service_role key**: المفتاح الخاص (احتفظ به سراً!)

**احفظ هذه المعلومات!** ستحتاجها لاحقاً.

---

## 🔐 الخطوة 5: إعداد Row Level Security (RLS)

1. اذهب إلى **Table Editor** → `contact_messages`
2. اضغط على **Policies** (السياسات)
3. اضغط **New Policy**
4. اختر **For full customization**
5. املأ:
   - **Policy name**: `Allow insert for all`
   - **Allowed operation**: `INSERT`
   - **Policy definition**: 
     ```sql
     true
     ```
6. اضغط **Review** ثم **Save policy**

---

## 📝 الخطوة 6: تثبيت Supabase Client

في مجلد `backend`:

```bash
cd backend
npm install @supabase/supabase-js
```

---

## ⚙️ الخطوة 7: تحديث Backend لاستخدام Supabase

سيتم تحديث ملف `backend/server.js` لاستخدام Supabase بدلاً من console.log.

---

## 🌐 الخطوة 8: إضافة متغيرات البيئة في Vercel

بعد نشر المشروع على Vercel:

1. اذهب إلى **Vercel Dashboard** → مشروعك → **Settings**
2. اضغط **Environment Variables**
3. أضف المتغيرات التالية:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | Project URL من Supabase |
| `SUPABASE_ANON_KEY` | anon public key من Supabase |

---

## 🔄 الخطوة 9: إضافة متغيرات البيئة في Railway/Render (للـ Backend)

إذا كنت تستخدم Railway أو Render للـ Backend:

1. اذهب إلى إعدادات المشروع
2. اضغط **Environment Variables**
3. أضف نفس المتغيرات:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

---

## ✅ الخطوة 10: اختبار الاتصال

بعد إضافة المتغيرات وإعادة النشر:
1. اذهب إلى موقعك
2. املأ نموذج الاتصال
3. اذهب إلى Supabase → Table Editor → `contact_messages`
4. يجب أن ترى الرسالة الجديدة!

---

## 📚 روابط مفيدة

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Dashboard](https://app.supabase.com)
- [PostgreSQL Tutorial](https://supabase.com/docs/guides/database)

---

## 🎯 ملخص سريع

1. ✅ أنشئ حساب على Supabase
2. ✅ أنشئ مشروع جديد
3. ✅ أنشئ جدول `contact_messages`
4. ✅ احصل على API Keys
5. ✅ أضف متغيرات البيئة
6. ✅ حدث الـ Backend
7. ✅ اختبر!

---

**بالتوفيق! 🚀**

