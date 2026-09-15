import { prisma } from "@/lib/db";
import { formatAED, formatArabicDate } from "@/lib/format";
import { getRunRate } from "@/lib/queries";
import {
  findClientByName,
  findTeamMemberByName,
  findOrCreateTeamMember,
  findPartnerByName,
} from "@/lib/chat/helpers";

export interface ToolResult {
  success: boolean;
  message: string;
  data?: unknown;
}

function parseDate(input: unknown): Date | null {
  if (typeof input !== "string" || !input.trim()) return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

function ambiguousMessage(entity: string, matches: string[]): string {
  return `في أكتر من ${entity} بالاسم ده: ${matches.join("، ")}. حدد أي واحد بالظبط.`;
}

export async function executeTool(name: string, input: Record<string, unknown>): Promise<ToolResult> {
  switch (name) {
    case "mark_payroll_paid":
      return markPayrollPaid(input);
    case "add_payroll_entry":
      return addPayrollEntry(input);
    case "update_client_cost_line":
      return updateClientCostLine(input);
    case "add_client":
      return addClient(input);
    case "update_client_revenue":
      return updateClientRevenue(input);
    case "add_payable":
      return addPayable(input);
    case "add_collection_entry":
      return addCollectionEntry(input);
    case "add_partner_draw":
      return addPartnerDraw(input);
    case "add_reminder":
      return addReminder(input);
    case "mark_reminder_done":
      return markReminderDone(input);
    case "get_financial_summary":
      return getFinancialSummary();
    case "list_upcoming_payments":
      return listUpcomingPayments(input);
    default:
      return { success: false, message: `أداة غير معروفة: ${name}` };
  }
}

async function markPayrollPaid(input: Record<string, unknown>): Promise<ToolResult> {
  const payrollEntryId = input.payrollEntryId as string | undefined;

  if (payrollEntryId) {
    const entry = await prisma.payrollEntry.findUnique({
      where: { id: payrollEntryId },
      include: { teamMember: true, client: true },
    });
    if (!entry) return { success: false, message: "المستحق ده مش موجود." };
    if (entry.status === "paid") {
      return { success: false, message: `${entry.teamMember.name} — ${formatAED(entry.amount)} — متسجل مدفوع بالفعل.` };
    }
    const updated = await prisma.payrollEntry.update({
      where: { id: payrollEntryId },
      data: { status: "paid", paidDate: new Date() },
    });
    return {
      success: true,
      message: `تم تسجيل: ${entry.teamMember.name} — ${formatAED(entry.amount)} — مدفوع`,
      data: updated,
    };
  }

  const teamMemberName = input.teamMemberName as string;
  const clientName = input.clientName as string | undefined;
  if (!teamMemberName) return { success: false, message: "محتاج اسم عضو الفريق." };

  const member = await findTeamMemberByName(teamMemberName);
  if (member.status === "not_found") {
    return { success: false, message: `مفيش عضو فريق اسمه "${teamMemberName}".` };
  }
  if (member.status === "ambiguous") {
    return { success: false, message: ambiguousMessage("عضو فريق", member.matches) };
  }

  let clientId: string | undefined;
  if (clientName) {
    const client = await findClientByName(clientName);
    if (client.status === "not_found") {
      return { success: false, message: `مفيش عميل اسمه "${clientName}".` };
    }
    if (client.status === "ambiguous") {
      return { success: false, message: ambiguousMessage("عميل", client.matches) };
    }
    clientId = client.value.id;
  }

  const pendingEntries = await prisma.payrollEntry.findMany({
    where: { teamMemberId: member.value.id, status: "pending", ...(clientId ? { clientId } : {}) },
    include: { client: true },
    orderBy: { dueDate: "asc" },
  });

  if (pendingEntries.length === 0) {
    return { success: false, message: `مفيش مستحقات معلّقة لـ ${member.value.name}.` };
  }

  if (pendingEntries.length > 1) {
    const list = pendingEntries
      .map((e) => `${formatAED(e.amount)} (${e.client?.name ?? "بدون عميل"}, استحقاق ${formatArabicDate(e.dueDate)})`)
      .join(" — ");
    return {
      success: false,
      message: `${member.value.name} عنده أكتر من مستحق معلّق: ${list}. حدد أي واحد أو اذكر اسم العميل.`,
    };
  }

  const entry = pendingEntries[0];
  await prisma.payrollEntry.update({ where: { id: entry.id }, data: { status: "paid", paidDate: new Date() } });
  return {
    success: true,
    message: `تم تسجيل: ${member.value.name} — ${formatAED(entry.amount)} — مدفوع`,
    data: entry,
  };
}

async function addPayrollEntry(input: Record<string, unknown>): Promise<ToolResult> {
  const teamMemberName = input.teamMemberName as string;
  const amount = Number(input.amount);
  const dueDate = parseDate(input.dueDate);
  const clientName = input.clientName as string | undefined;
  const note = (input.note as string | undefined) ?? null;

  if (!teamMemberName) return { success: false, message: "محتاج اسم عضو الفريق." };
  if (!amount || amount <= 0) return { success: false, message: "محتاج المبلغ (رقم أكبر من صفر)." };
  if (!dueDate) return { success: false, message: "محتاج تاريخ استحقاق صحيح." };

  const member = await findOrCreateTeamMember(teamMemberName);

  let clientId: string | null = null;
  if (clientName) {
    const client = await findClientByName(clientName);
    if (client.status === "not_found") return { success: false, message: `مفيش عميل اسمه "${clientName}".` };
    if (client.status === "ambiguous") return { success: false, message: ambiguousMessage("عميل", client.matches) };
    clientId = client.value.id;
  }

  const entry = await prisma.payrollEntry.create({
    data: { teamMemberId: member.id, clientId, amount, dueDate, note },
  });

  return {
    success: true,
    message: `تم تسجيل مستحق جديد: ${member.name} — ${formatAED(amount)} — استحقاق ${formatArabicDate(dueDate)}`,
    data: entry,
  };
}

async function updateClientCostLine(input: Record<string, unknown>): Promise<ToolResult> {
  const clientName = input.clientName as string;
  const teamMemberName = input.teamMemberName as string;
  const role = input.role as string | undefined;
  const amount = Number(input.amount);

  if (!clientName || !teamMemberName) return { success: false, message: "محتاج اسم العميل واسم عضو الفريق." };
  if (!amount || amount <= 0) return { success: false, message: "محتاج المبلغ الجديد (رقم أكبر من صفر)." };

  const client = await findClientByName(clientName);
  if (client.status === "not_found") return { success: false, message: `مفيش عميل اسمه "${clientName}".` };
  if (client.status === "ambiguous") return { success: false, message: ambiguousMessage("عميل", client.matches) };

  const member = await findOrCreateTeamMember(teamMemberName);

  const existing = await prisma.clientCostLine.findFirst({
    where: {
      clientId: client.value.id,
      teamMemberId: member.id,
      ...(role ? { role: { contains: role } } : {}),
    },
  });

  if (existing) {
    const updated = await prisma.clientCostLine.update({
      where: { id: existing.id },
      data: { amount, ...(role ? { role } : {}) },
    });
    return {
      success: true,
      message: `تم تحديث: ${member.name} على ${client.value.name} — ${formatAED(amount)}`,
      data: updated,
    };
  }

  if (!role) {
    return {
      success: false,
      message: `مفيش بند تكلفة موجود لـ ${member.name} على ${client.value.name}. محتاج أعرف الدور (تصوير/ديزاين/...) عشان أضيف بند جديد.`,
    };
  }

  const created = await prisma.clientCostLine.create({
    data: { clientId: client.value.id, teamMemberId: member.id, role, amount, isConfirmed: true, payoutCondition: "fixed_monthly" },
  });

  return {
    success: true,
    message: `تم إضافة بند تكلفة جديد: ${member.name} — ${role} — ${formatAED(amount)} على ${client.value.name}`,
    data: created,
  };
}

async function addClient(input: Record<string, unknown>): Promise<ToolResult> {
  const name = input.name as string;
  const monthlyRevenue = Number(input.monthlyRevenue);
  const billingType = (input.billingType as string) ?? "monthly_recurring";
  const contractMonths = input.contractMonths ? Number(input.contractMonths) : null;
  const startDate = parseDate(input.startDate) ?? new Date();
  const costLines = (input.costLines as Array<{ teamMemberName: string; role: string; amount: number; note?: string }>) ?? [];

  if (!name) return { success: false, message: "محتاج اسم العميل." };
  if (!monthlyRevenue || monthlyRevenue <= 0) return { success: false, message: "محتاج قيمة الباقة الشهرية." };
  if (billingType === "fixed_term" && !contractMonths) {
    return { success: false, message: "العميل ده بعقد مدة محددة — محتاج أعرف عدد الشهور." };
  }

  const client = await prisma.client.create({
    data: { name, monthlyRevenue, billingType, contractMonths, startDate, status: "active" },
  });

  const createdLines: string[] = [];
  for (const line of costLines) {
    if (!line.teamMemberName || !line.amount || !line.role) continue;
    const member = await findOrCreateTeamMember(line.teamMemberName);
    await prisma.clientCostLine.create({
      data: {
        clientId: client.id,
        teamMemberId: member.id,
        role: line.role,
        amount: line.amount,
        note: line.note ?? null,
        isConfirmed: true,
        payoutCondition: "fixed_monthly",
      },
    });
    createdLines.push(`${member.name} (${formatAED(line.amount)})`);
  }

  return {
    success: true,
    message: `تم إضافة عميل جديد: ${name} — ${formatAED(monthlyRevenue)}/شهر${
      createdLines.length ? ` — بنود التكلفة: ${createdLines.join("، ")}` : ""
    }`,
    data: client,
  };
}

async function updateClientRevenue(input: Record<string, unknown>): Promise<ToolResult> {
  const clientName = input.clientName as string;
  const newRevenue = Number(input.newRevenue);

  if (!clientName) return { success: false, message: "محتاج اسم العميل." };
  if (!newRevenue || newRevenue <= 0) return { success: false, message: "محتاج القيمة الجديدة للباقة." };

  const client = await findClientByName(clientName);
  if (client.status === "not_found") return { success: false, message: `مفيش عميل اسمه "${clientName}".` };
  if (client.status === "ambiguous") return { success: false, message: ambiguousMessage("عميل", client.matches) };

  await prisma.client.update({ where: { id: client.value.id }, data: { monthlyRevenue: newRevenue } });

  return {
    success: true,
    message: `تم تحديث باقة ${client.value.name} لـ ${formatAED(newRevenue)}/شهر`,
  };
}

async function addPayable(input: Record<string, unknown>): Promise<ToolResult> {
  const who = input.who as string;
  const reason = input.reason as string;
  const amount = Number(input.amount);
  const statusNote = input.statusNote as string;

  if (!who || !reason || !statusNote) return { success: false, message: "محتاج أعرف لمين، السبب، وإمتى هيتدفع." };
  if (!amount || amount <= 0) return { success: false, message: "محتاج المبلغ." };

  const payable = await prisma.payable.create({ data: { who, reason, amount, status: statusNote } });

  return {
    success: true,
    message: `تم تسجيل مستحق: ${who} — ${formatAED(amount)} — ${reason}`,
    data: payable,
  };
}

async function addCollectionEntry(input: Record<string, unknown>): Promise<ToolResult> {
  const clientName = input.clientName as string;
  const amount = Number(input.amount);
  const dueDate = parseDate(input.dueDate);
  const status = (input.status as string) ?? "pending";

  if (!clientName) return { success: false, message: "محتاج اسم العميل." };
  if (!amount || amount <= 0) return { success: false, message: "محتاج المبلغ." };
  if (!dueDate) return { success: false, message: "محتاج تاريخ الاستحقاق." };

  const client = await findClientByName(clientName);
  if (client.status === "not_found") return { success: false, message: `مفيش عميل اسمه "${clientName}".` };
  if (client.status === "ambiguous") return { success: false, message: ambiguousMessage("عميل", client.matches) };

  const entry = await prisma.collectionEntry.create({
    data: { clientId: client.value.id, amount, dueDate, status, paidDate: status === "paid" ? new Date() : null },
  });

  return {
    success: true,
    message: `تم تسجيل تحصيل: ${client.value.name} — ${formatAED(amount)} — ${status === "paid" ? "مدفوع" : "مستحق " + formatArabicDate(dueDate)}`,
    data: entry,
  };
}

async function addPartnerDraw(input: Record<string, unknown>): Promise<ToolResult> {
  const partnerName = input.partnerName as string;
  const amount = Number(input.amount);
  const date = parseDate(input.date) ?? new Date();

  if (!partnerName) return { success: false, message: "محتاج اسم الشريك." };
  if (!amount || amount <= 0) return { success: false, message: "محتاج المبلغ." };

  const partner = await findPartnerByName(partnerName);
  if (partner.status === "not_found") return { success: false, message: `مفيش شريك اسمه "${partnerName}".` };
  if (partner.status === "ambiguous") return { success: false, message: ambiguousMessage("شريك", partner.matches) };

  const draw = await prisma.partnerDraw.create({ data: { partnerId: partner.value.id, amount, date } });

  return {
    success: true,
    message: `تم تسجيل سحب أرباح: ${partner.value.name} — ${formatAED(amount)} — ${formatArabicDate(date)}`,
    data: draw,
  };
}

async function addReminder(input: Record<string, unknown>): Promise<ToolResult> {
  const title = input.title as string;
  const date = parseDate(input.date);
  const type = (input.type as string) ?? "other";
  const relatedClientName = input.relatedClientName as string | undefined;

  if (!title) return { success: false, message: "محتاج عنوان التذكير." };
  if (!date) return { success: false, message: "محتاج تاريخ صحيح للتذكير." };

  let relatedClientId: string | null = null;
  if (relatedClientName) {
    const client = await findClientByName(relatedClientName);
    if (client.status === "found") relatedClientId = client.value.id;
    if (client.status === "ambiguous") return { success: false, message: ambiguousMessage("عميل", client.matches) };
  }

  const reminder = await prisma.reminder.create({ data: { title, date, type, relatedClientId } });

  return {
    success: true,
    message: `تم إضافة تذكير: ${title} — ${formatArabicDate(date)}`,
    data: reminder,
  };
}

async function markReminderDone(input: Record<string, unknown>): Promise<ToolResult> {
  const matchingText = input.matchingText as string;
  const done = Boolean(input.done);

  if (!matchingText) return { success: false, message: "محتاج جزء من نص التذكير عشان أعرف أدور عليه." };

  const matches = await prisma.reminder.findMany({ where: { title: { contains: matchingText } } });
  if (matches.length === 0) return { success: false, message: `مفيش تذكير فيه "${matchingText}".` };
  if (matches.length > 1) {
    return { success: false, message: ambiguousMessage("تذكير", matches.map((m) => m.title)) };
  }

  const reminder = matches[0];
  await prisma.reminder.update({ where: { id: reminder.id }, data: { isDone: done } });

  return {
    success: true,
    message: `تم تحديث: ${reminder.title} — ${done ? "تم ✅" : "لسه مش متسدد"}`,
    data: reminder,
  };
}

async function getFinancialSummary(): Promise<ToolResult> {
  const runRate = await getRunRate();
  const [pendingPayroll, pendingCollections, unsettledPayables] = await Promise.all([
    prisma.payrollEntry.aggregate({ where: { status: "pending" }, _sum: { amount: true } }),
    prisma.collectionEntry.aggregate({ where: { status: "pending" }, _sum: { amount: true } }),
    prisma.payable.aggregate({ where: { isSettled: false }, _sum: { amount: true } }),
  ]);

  const shares = runRate.partnerShares.map((p) => `${p.partnerName}: ${formatAED(p.amount)}`).join("، ");

  return {
    success: true,
    message: `الإيراد الشهري: ${formatAED(runRate.totalRevenue)} — التكلفة: ${formatAED(
      runRate.totalCost
    )} — صافي الربح: ${formatAED(runRate.totalNetProfit)} — أنصبة الشركاء: ${shares || "لا يوجد شركاء"}. مستحقات مرتبات معلّقة: ${formatAED(
      pendingPayroll._sum.amount ?? 0
    )}. تحصيلات معلّقة: ${formatAED(pendingCollections._sum.amount ?? 0)}. مديونيات غير مسددة: ${formatAED(
      unsettledPayables._sum.amount ?? 0
    )}.`,
    data: runRate,
  };
}

async function listUpcomingPayments(input: Record<string, unknown>): Promise<ToolResult> {
  const daysAhead = Number(input.daysAhead) || 14;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + daysAhead);

  const [payroll, collections, reminders] = await Promise.all([
    prisma.payrollEntry.findMany({
      where: { status: "pending", dueDate: { lte: cutoff } },
      include: { teamMember: true, client: true },
      orderBy: { dueDate: "asc" },
    }),
    prisma.collectionEntry.findMany({
      where: { status: "pending", dueDate: { lte: cutoff } },
      include: { client: true },
      orderBy: { dueDate: "asc" },
    }),
    prisma.reminder.findMany({
      where: { isDone: false, date: { lte: cutoff } },
      orderBy: { date: "asc" },
    }),
  ]);

  const lines = [
    ...payroll.map(
      (p) => `مرتب: ${p.teamMember.name} — ${formatAED(p.amount)} — ${formatArabicDate(p.dueDate)}`
    ),
    ...collections.map(
      (c) => `تحصيل: ${c.client.name} — ${formatAED(c.amount)} — ${formatArabicDate(c.dueDate)}`
    ),
    ...reminders.map((r) => `تذكير: ${r.title} — ${formatArabicDate(r.date)}`),
  ];

  return {
    success: true,
    message:
      lines.length > 0
        ? `المستحقات خلال ${daysAhead} يوم:\n${lines.join("\n")}`
        : `مفيش أي مستحقات خلال ${daysAhead} يوم القادمة.`,
    data: { payroll, collections, reminders },
  };
}
