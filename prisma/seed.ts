import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Demo/test data only — obviously fake names and numbers so nobody mistakes
// this for real client or financial records once the app is running.

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding demo data...");

  const passwordHash = await bcrypt.hash("demo1234", 10);

  const partner1 = await prisma.partner.create({
    data: { name: "الشريك الأول (تجريبي)", sharePercentage: 50 },
  });
  const partner2 = await prisma.partner.create({
    data: { name: "الشريك الثاني (تجريبي)", sharePercentage: 50 },
  });

  await prisma.user.create({
    data: {
      name: "الشريك الأول (تجريبي)",
      email: "sales@ataswg.com",
      passwordHash,
      role: "ADMIN",
      partnerId: partner1.id,
    },
  });
  await prisma.user.create({
    data: {
      name: "الشريك الثاني (تجريبي)",
      email: "partner2@demo.test",
      passwordHash,
      role: "ADMIN",
      partnerId: partner2.id,
    },
  });

  const [designer, editor, moderator, photographer] = await Promise.all([
    prisma.teamMember.create({
      data: { name: "أحمد مصمم (تجريبي)", phone: "0500000001", notes: "فريلانسر ديزاين — بيانات تجريبية" },
    }),
    prisma.teamMember.create({
      data: { name: "سارة مونتاج (تجريبي)", phone: "0500000002", notes: "بيانات تجريبية" },
    }),
    prisma.teamMember.create({
      data: { name: "محمد موديريشن (تجريبي)", phone: "0500000003", notes: "بيانات تجريبية" },
    }),
    prisma.teamMember.create({
      data: { name: "ليلى تصوير (تجريبي)", phone: "0500000004", notes: "بيانات تجريبية" },
    }),
  ]);

  const clientA = await prisma.client.create({
    data: {
      name: "مطعم الأصالة (تجريبي)",
      companyName: "Al Asala F&B LLC (Demo)",
      monthlyRevenue: 8000,
      billingType: "monthly_recurring",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 4, 1),
      paymentTiming: "مقدم بالكامل",
      status: "active",
    },
  });

  const clientB = await prisma.client.create({
    data: {
      name: "عيادة النور (تجريبي)",
      companyName: "Al Noor Clinic (Demo)",
      monthlyRevenue: 5500,
      billingType: "fixed_term",
      contractMonths: 6,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 15),
      paymentTiming: "نص مقدم ونص بعد أول شهر",
      status: "active",
    },
  });

  const clientC = await prisma.client.create({
    data: {
      name: "متجر لمسة (تجريبي)",
      companyName: "Lamsa Store (Demo)",
      monthlyRevenue: 3000,
      billingType: "monthly_recurring",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 8, 1),
      paymentTiming: "دفعات شهرية",
      status: "paused",
    },
  });

  await prisma.clientCostLine.createMany({
    data: [
      { clientId: clientA.id, teamMemberId: designer.id, role: "ديزاين", amount: 1500, isConfirmed: true, payoutCondition: "fixed_monthly" },
      { clientId: clientA.id, teamMemberId: photographer.id, role: "تصوير", amount: 2000, isConfirmed: true, payoutCondition: "fixed_monthly", note: "+50 لو فيه كاروسيل إضافي" },
      { clientId: clientA.id, teamMemberId: moderator.id, role: "موديريشن", amount: 800, isConfirmed: true, payoutCondition: "after_client_collection", note: "بيتصرف بعد التحصيل من العميل" },
      { clientId: clientB.id, teamMemberId: editor.id, role: "مونتاج", amount: 1200, isConfirmed: true, payoutCondition: "fixed_monthly" },
      { clientId: clientB.id, teamMemberId: designer.id, role: "ديزاين", amount: 900, isConfirmed: false, note: "مبلغ تقديري لسه محتاج تأكيد" },
      { clientId: clientC.id, teamMemberId: moderator.id, role: "موديريشن", amount: 600, isConfirmed: true, payoutCondition: "fixed_monthly" },
    ],
  });

  const today = new Date();
  const daysFromNow = (n: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);

  await prisma.payrollEntry.createMany({
    data: [
      { teamMemberId: designer.id, clientId: clientA.id, amount: 1500, dueDate: daysFromNow(1), status: "pending" },
      { teamMemberId: photographer.id, clientId: clientA.id, amount: 2000, dueDate: daysFromNow(-2), status: "pending", note: "متأجل من الشهر اللي فات" },
      { teamMemberId: editor.id, clientId: clientB.id, amount: 1200, dueDate: daysFromNow(7), status: "pending" },
      { teamMemberId: moderator.id, clientId: clientC.id, amount: 600, dueDate: daysFromNow(-20), status: "paid", paidDate: daysFromNow(-19) },
      { teamMemberId: designer.id, clientId: clientB.id, amount: 900, dueDate: daysFromNow(-35), status: "paid", paidDate: daysFromNow(-34) },
    ],
  });

  await prisma.payable.createMany({
    data: [
      { who: "محمد موديريشن (تجريبي)", reason: "مديونية قديمة من مشروع سابق", amount: 400, status: "هيتدفع مع أول تحصيل من عميل جديد" },
      { who: "مورد استضافة (تجريبي)", reason: "فاتورة استضافة سنوية", amount: 250, status: "مستحق نهاية الشهر" },
    ],
  });

  await prisma.collectionEntry.createMany({
    data: [
      { clientId: clientA.id, amount: 8000, dueDate: daysFromNow(0), status: "pending" },
      { clientId: clientB.id, amount: 2750, dueDate: daysFromNow(-3), status: "paid", paidDate: daysFromNow(-3) },
      { clientId: clientB.id, amount: 2750, dueDate: daysFromNow(14), status: "pending" },
    ],
  });

  await prisma.partnerDraw.createMany({
    data: [
      { partnerId: partner1.id, amount: 3000, date: daysFromNow(-15), note: "سحب شهر سابق" },
      { partnerId: partner2.id, amount: 3000, date: daysFromNow(-15), note: "سحب شهر سابق" },
    ],
  });

  await prisma.reminder.createMany({
    data: [
      { title: "تجديد عقد مطعم الأصالة", date: daysFromNow(28), type: "other", relatedClientId: clientA.id },
      { title: "متابعة دفعة عيادة النور", date: daysFromNow(13), type: "collection", relatedClientId: clientB.id },
      { title: "صرف مرتب سارة مونتاج", date: daysFromNow(6), type: "payroll" },
      { title: "تأكيد تجديد باقة متجر لمسة", date: daysFromNow(2), type: "other", relatedClientId: clientC.id },
      { title: "دفع فاتورة الاستضافة", date: daysFromNow(0), type: "other" },
      { title: "متابعة مستحق قديم", date: daysFromNow(-5), type: "payroll" },
      { title: "اجتماع مراجعة شهري", date: daysFromNow(-10), type: "other", isDone: true },
    ],
  });

  await prisma.payrollSchedule.create({
    data: { dayOfMonth: 10, note: "صرف المرتبات يوم 10 من كل شهر (تجريبي)" },
  });

  console.log("Done. Demo login: sales@ataswg.com / demo1234 (and partner2@demo.test / demo1234)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
