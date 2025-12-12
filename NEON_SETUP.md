# إعداد Neon Database مع المشروع

## 📋 ما هو Neon?

Neon هو **PostgreSQL Serverless Database** مجاني يوفر:
- ✅ PostgreSQL Database (قاعدة بيانات PostgreSQL)
- ✅ Serverless (لا حاجة لإدارة السيرفرات)
- ✅ Branching (فروع للبيانات)
- ✅ مجاني مع حد معقول
- ✅ سريع وسهل الاستخدام

---

## 🚀 الخطوة 1: إنشاء حساب على Neon

1. اذهب إلى: **https://neon.tech**
2. اضغط على **Sign Up** (إنشاء حساب)
3. سجل دخول بحساب GitHub أو Email
4. امنح الصلاحيات المطلوبة

---

## 🏗️ الخطوة 2: إنشاء مشروع جديد

1. بعد تسجيل الدخول، اضغط **Create Project**
2. املأ البيانات:
   - **Name**: `perkins-cummins-db` (أو أي اسم تريده)
   - **Region**: اختر أقرب منطقة لك
   - **PostgreSQL version**: اتركه على الإعداد الافتراضي (أحدث إصدار)
   - **Compute size**: اختر **Free** (مجاني)
3. اضغط **Create Project**
4. انتظر 1-2 دقيقة حتى يتم إنشاء المشروع

---

## 🔑 الخطوة 3: الحصول على Connection String

1. بعد إنشاء المشروع، ستجد **Connection String** في الصفحة الرئيسية
2. اضغط على **Copy** لنسخه
3. سيبدو مثل:
   ```
   postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

**احفظ هذا الرابط!** ستحتاجه لاحقاً.

---

## 📊 الخطوة 4: إنشاء جدول في قاعدة البيانات

### الطريقة 1: استخدام SQL Editor في Neon

1. في لوحة التحكم، اضغط على **SQL Editor**
2. انسخ محتوى ملف `NEON_SQL.sql`
3. الصق في SQL Editor
4. اضغط **Run** أو `Ctrl+Enter`

### الطريقة 2: استخدام psql (اختياري)

إذا كنت تفضل استخدام psql محلياً:
```bash
psql "your-connection-string"
```
ثم نفذ محتوى `NEON_SQL.sql`

---

## 📝 الخطوة 5: SQL Script

استخدم ملف `NEON_SQL.sql` الموجود في المشروع:

```sql
-- Create the contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at 
ON contact_messages(created_at DESC);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_messages_email 
ON contact_messages(email);
```

---

## ⚙️ الخطوة 6: تثبيت Neon Client

في مجلد `backend`:

```bash
cd backend
npm install @neondatabase/serverless
```

---

## 🔐 الخطوة 7: إضافة متغيرات البيئة

### محلياً (في ملف `.env`):

أنشئ ملف `.env` في مجلد `backend`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### في Railway/Render (للـ Backend):

1. اذهب إلى إعدادات المشروع
2. اضغط **Environment Variables** أو **Variables**
3. أضف:
   - **Name**: `DATABASE_URL`
   - **Value**: Connection String من Neon

### في Vercel (للـ Frontend):

لا حاجة لإضافة متغيرات خاصة بـ Neon في Frontend، فقط:
- `NEXT_PUBLIC_API_URL` = رابط الـ backend

---

## ✅ الخطوة 8: اختبار الاتصال

بعد إضافة المتغيرات وإعادة النشر:

1. اذهب إلى موقعك
2. املأ نموذج الاتصال
3. تحقق من Console في Backend (يجب أن ترى: `✅ Message saved to Neon database`)
4. اذهب إلى Neon → **SQL Editor** واكتب:
   ```sql
   SELECT * FROM contact_messages ORDER BY created_at DESC;
   ```
5. اضغط **Run**
6. ✅ يجب أن ترى الرسالة الجديدة!

---

## 📚 روابط مفيدة

- [Neon Documentation](https://neon.tech/docs)
- [Neon Dashboard](https://console.neon.tech)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)

---

## 🎯 ملخص سريع

1. ✅ أنشئ حساب على Neon
2. ✅ أنشئ مشروع جديد
3. ✅ احصل على Connection String
4. ✅ أنشئ جدول `contact_messages` (استخدم `NEON_SQL.sql`)
5. ✅ أضف `DATABASE_URL` في متغيرات البيئة
6. ✅ ثبت `@neondatabase/serverless`
7. ✅ اختبر!

---

## 🔄 الفرق بين Neon و Supabase

| الميزة | Neon | Supabase |
|--------|------|----------|
| نوع قاعدة البيانات | PostgreSQL | PostgreSQL |
| Serverless | ✅ | ✅ |
| Authentication | ❌ | ✅ |
| Real-time | ❌ | ✅ |
| Storage | ❌ | ✅ |
| API تلقائية | ❌ | ✅ |
| السعر المجاني | أكثر سخاء | محدود |

**Neon أفضل عندما تحتاج فقط قاعدة بيانات PostgreSQL خالصة!**

---

## 🆘 حل المشاكل

### المشكلة: Connection String لا يعمل
**الحل:**
- تأكد من نسخ Connection String كاملاً
- تحقق من أن المشروع نشط في Neon
- تأكد من إضافة `?sslmode=require` في النهاية

### المشكلة: الجدول غير موجود
**الحل:**
- تأكد من تنفيذ SQL Script في Neon SQL Editor
- تحقق من أنك في Database الصحيح
- راجع الأخطاء في SQL Editor

### المشكلة: البيانات لا تُحفظ
**الحل:**
- تحقق من Console في Backend للأخطاء
- تأكد من أن `DATABASE_URL` صحيح
- تحقق من أن الجدول موجود

---

**بالتوفيق! 🚀**

