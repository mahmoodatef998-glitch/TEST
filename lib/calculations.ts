import type { Client, ClientCostLine, Partner } from "@prisma/client";

// All money math lives here, server-side only, so the numbers on screen and
// the numbers the chat bot reports are always computed the same way.

export function totalClientCost(costLines: Pick<ClientCostLine, "amount">[]): number {
  return costLines.reduce((sum, line) => sum + line.amount, 0);
}

export function clientNetProfit(
  client: Pick<Client, "monthlyRevenue">,
  costLines: Pick<ClientCostLine, "amount">[]
): number {
  return client.monthlyRevenue - totalClientCost(costLines);
}

export interface PartnerShare {
  partnerId: string;
  partnerName: string;
  sharePercentage: number;
  amount: number;
}

export function partnerShares(
  netProfit: number,
  partners: Pick<Partner, "id" | "name" | "sharePercentage">[]
): PartnerShare[] {
  return partners.map((p) => ({
    partnerId: p.id,
    partnerName: p.name,
    sharePercentage: p.sharePercentage,
    amount: netProfit * (p.sharePercentage / 100),
  }));
}

export interface ClientFinancials {
  clientId: string;
  clientName: string;
  revenue: number;
  cost: number;
  netProfit: number;
}

export interface RunRate {
  totalRevenue: number;
  totalCost: number;
  totalNetProfit: number;
  partnerShares: PartnerShare[];
  clients: ClientFinancials[];
}

export function calculateRunRate(
  activeClients: (Client & { costLines: ClientCostLine[] })[],
  partners: Pick<Partner, "id" | "name" | "sharePercentage">[]
): RunRate {
  const clients: ClientFinancials[] = activeClients.map((c) => {
    const cost = totalClientCost(c.costLines);
    return {
      clientId: c.id,
      clientName: c.name,
      revenue: c.monthlyRevenue,
      cost,
      netProfit: c.monthlyRevenue - cost,
    };
  });

  const totalRevenue = clients.reduce((s, c) => s + c.revenue, 0);
  const totalCost = clients.reduce((s, c) => s + c.cost, 0);
  const totalNetProfit = totalRevenue - totalCost;

  return {
    totalRevenue,
    totalCost,
    totalNetProfit,
    partnerShares: partnerShares(totalNetProfit, partners),
    clients,
  };
}

// ---------------------------------------------------------------------------
// Reminder priority ladder
// ---------------------------------------------------------------------------

export type ReminderUrgency =
  | "planning" // 30+ days out
  | "prepare" // <=14 days
  | "soon" // <=7 days
  | "important" // <=3 days
  | "urgent_tomorrow" // 1 day
  | "due_today"
  | "overdue"
  | "done";

export interface ReminderPriority {
  urgency: ReminderUrgency;
  label: string;
  colorClass: string; // tailwind classes for badge
  sortRank: number; // lower = shown first
  daysUntil: number;
}

const URGENCY_META: Record<
  Exclude<ReminderUrgency, "done">,
  { label: string; colorClass: string; sortRank: number }
> = {
  overdue: {
    label: "متأخر",
    colorClass: "bg-red-900 text-white ring-1 ring-red-950",
    sortRank: 0,
  },
  due_today: {
    label: "مستحق النهاردة",
    colorClass: "bg-red-800 text-white",
    sortRank: 1,
  },
  urgent_tomorrow: {
    label: "عاجل — غدًا",
    colorClass: "bg-red-600 text-white",
    sortRank: 2,
  },
  important: {
    label: "مهم",
    colorClass: "bg-red-200 text-red-900",
    sortRank: 3,
  },
  soon: {
    label: "قريب",
    colorClass: "bg-orange-300 text-orange-950",
    sortRank: 4,
  },
  prepare: {
    label: "استعد للدفع",
    colorClass: "bg-orange-100 text-orange-800",
    sortRank: 5,
  },
  planning: {
    label: "مرحلة التخطيط",
    colorClass: "bg-green-100 text-green-800",
    sortRank: 6,
  },
};

export function getReminderPriority(date: Date | string, isDone: boolean): ReminderPriority {
  const target = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const daysUntil = Math.round(
    (startOfDay(target).getTime() - startOfDay(now).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (isDone) {
    return {
      urgency: "done",
      label: "تم ✅",
      colorClass: "bg-gray-100 text-gray-500",
      sortRank: 1000,
      daysUntil,
    };
  }

  let urgency: Exclude<ReminderUrgency, "done">;
  if (daysUntil < 0) urgency = "overdue";
  else if (daysUntil === 0) urgency = "due_today";
  else if (daysUntil === 1) urgency = "urgent_tomorrow";
  else if (daysUntil <= 3) urgency = "important";
  else if (daysUntil <= 7) urgency = "soon";
  else if (daysUntil <= 14) urgency = "prepare";
  else urgency = "planning";

  return { urgency, daysUntil, ...URGENCY_META[urgency] };
}

export function sortByPriority<T>(items: T[], getDate: (item: T) => Date | string, getDone: (item: T) => boolean): T[] {
  return [...items].sort((a, b) => {
    const pa = getReminderPriority(getDate(a), getDone(a));
    const pb = getReminderPriority(getDate(b), getDone(b));
    if (pa.sortRank !== pb.sortRank) return pa.sortRank - pb.sortRank;
    return new Date(getDate(a)).getTime() - new Date(getDate(b)).getTime();
  });
}
