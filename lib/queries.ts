import { prisma } from "@/lib/db";
import { calculateRunRate, totalClientCost } from "@/lib/calculations";

export async function getRunRate() {
  const [clients, partners] = await Promise.all([
    prisma.client.findMany({
      where: { status: "active" },
      include: { costLines: true },
    }),
    prisma.partner.findMany(),
  ]);
  return calculateRunRate(clients, partners);
}

export async function getClientWithFinancials(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      costLines: { include: { teamMember: true }, orderBy: { createdAt: "asc" } },
      collections: { orderBy: { dueDate: "desc" } },
    },
  });
  if (!client) return null;
  const cost = totalClientCost(client.costLines);
  return { ...client, totalCost: cost, netProfit: client.monthlyRevenue - cost };
}

export async function getAllClientsWithFinancials() {
  const clients = await prisma.client.findMany({
    include: { costLines: true },
    orderBy: { createdAt: "desc" },
  });
  return clients.map((c) => {
    const cost = totalClientCost(c.costLines);
    return { ...c, totalCost: cost, netProfit: c.monthlyRevenue - cost };
  });
}

export async function getTeamWithDues() {
  const members = await prisma.teamMember.findMany({
    include: {
      costLines: { include: { client: true } },
      payrollEntries: { where: { status: "pending" } },
    },
    orderBy: { name: "asc" },
  });
  return members.map((m) => ({
    ...m,
    totalPendingDue: m.payrollEntries.reduce((s, p) => s + p.amount, 0),
  }));
}

export async function getUpcomingReminders() {
  return prisma.reminder.findMany({
    include: { relatedClient: true },
    orderBy: { date: "asc" },
  });
}

export async function getPayrollPending() {
  return prisma.payrollEntry.findMany({
    where: { status: "pending" },
    include: { teamMember: true, client: true },
    orderBy: { dueDate: "asc" },
  });
}

export async function getPayrollHistory() {
  return prisma.payrollEntry.findMany({
    where: { status: "paid" },
    include: { teamMember: true, client: true },
    orderBy: { paidDate: "desc" },
  });
}

export async function getPayables() {
  return prisma.payable.findMany({ orderBy: [{ isSettled: "asc" }, { createdAt: "desc" }] });
}

export async function getCollections() {
  return prisma.collectionEntry.findMany({
    include: { client: true },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });
}

export async function getPartnerDraws() {
  return prisma.partnerDraw.findMany({
    include: { partner: true },
    orderBy: { date: "desc" },
  });
}

export async function getPartners() {
  return prisma.partner.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getPayrollSchedule() {
  return prisma.payrollSchedule.findFirst({ orderBy: { appliesFrom: "desc" } });
}

export async function getTeamMembers() {
  return prisma.teamMember.findMany({ orderBy: { name: "asc" } });
}

export async function getActiveClients() {
  return prisma.client.findMany({ where: { status: "active" }, orderBy: { name: "asc" } });
}
