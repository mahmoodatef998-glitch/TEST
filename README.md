# دفتر حسابات الوكالة

نظام محاسبة وإدارة عملاء/فريق داخلي — Next.js (App Router) + TypeScript + Prisma + شات بوت داخلي متصل بـ Claude لتنفيذ عمليات حقيقية على قاعدة البيانات بالعربي.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 — واجهة RTL كاملة
- Prisma ORM — SQLite محليًا، وقابل للتحويل لـ Postgres (Neon/Supabase) لأي بيئة إنتاج
- NextAuth v5 (Credentials) — تسجيل دخول بالبريد وكلمة المرور
- Anthropic API (Claude, Tool Use) — الشات بوت الداخلي

## التشغيل محليًا

```bash
npm install
cp .env.example .env   # لو مش موجود، راجع القيم المطلوبة تحت
npm run db:push        # ينشئ SQLite db من الـ schema
npm run db:seed        # بيانات تجريبية واضحة (اسمها فيه "تجريبي")
npm run dev
```

يفتح على http://localhost:3000 — هيوجهك لصفحة تسجيل الدخول.

بيانات دخول تجريبية بعد الـ seed:
- `sales@ataswg.com` / `demo1234`
- `partner2@demo.test` / `demo1234`

## متغيرات البيئة (`.env`)

```
DATABASE_URL="file:./dev.db"          # أو postgresql://... للإنتاج
NEXTAUTH_SECRET="..."                  # أي قيمة عشوائية طويلة
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY=""                   # لازم تتضاف عشان الشات بوت يشتغل
ANTHROPIC_MODEL="claude-sonnet-5"     # اختياري
```

## التحويل لـ Postgres (Neon/Supabase) في الإنتاج

1. غيّر `provider` في `prisma/schema.prisma` من `sqlite` إلى `postgresql`.
2. حط رابط الاتصال في `DATABASE_URL` على Vercel.
3. `npx prisma db push` (أو migrate) على قاعدة البيانات الجديدة.

لا تغييرات تانية مطلوبة في الكود — كل القيم اللي كانت enums اتعملها كـ strings متحقق منها في الكود (`zod`) عشان تفضل متوافقة مع SQLite و Postgres من غير تعديل.

## البنية

```
app/
  (app)/          صفحات النظام (تتطلب تسجيل دخول) — dashboard, clients, team, payroll...
  login/          صفحة تسجيل الدخول
  api/chat/       الشات بوت (Anthropic tool use)
  api/auth/       NextAuth
lib/
  actions/        Server Actions لكل عملية CRUD
  chat/           تعريف أدوات الشات بوت + تنفيذها الفعلي على قاعدة البيانات
  calculations.ts منطق الأرباح وتوزيع الشركاء وأولوية التنبيهات (server-only)
  queries.ts      قراءات مجمّعة تستخدمها الصفحات
prisma/
  schema.prisma
  seed.ts
```

## الشات بوت

كل أمر بيتبعت لـ `/api/chat`، Claude بيقرر يستخدم أي أداة (tool) من `lib/chat/tools.ts`، والتنفيذ الفعلي بيحصل في `lib/chat/executor.ts` مباشرة على قاعدة البيانات عن طريق Prisma. كل أمر بيتسجل في جدول `ChatCommandLog` للمراجعة، وظاهر في تاب "السجل" جوه الشات بوت نفسه.
