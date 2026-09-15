"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const clientSchema = z.object({
  name: z.string().min(1),
  companyName: z.string().optional().nullable(),
  monthlyRevenue: z.coerce.number().positive(),
  billingType: z.enum(["monthly_recurring", "fixed_term"]).default("monthly_recurring"),
  contractMonths: z.coerce.number().int().positive().optional().nullable(),
  startDate: z.coerce.date(),
  paymentTiming: z.string().optional().nullable(),
  status: z.enum(["active", "paused", "ended"]).default("active"),
});

export type ClientInput = z.infer<typeof clientSchema>;

export async function createClient(input: ClientInput) {
  const data = clientSchema.parse(input);
  const client = await prisma.client.create({ data });
  revalidatePath("/clients");
  revalidatePath("/");
  return client;
}

export async function updateClient(clientId: string, input: Partial<ClientInput>) {
  const data = clientSchema.partial().parse(input);
  const client = await prisma.client.update({ where: { id: clientId }, data });
  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/");
  return client;
}

export async function updateClientRevenue(clientId: string, newRevenue: number) {
  const client = await prisma.client.update({
    where: { id: clientId },
    data: { monthlyRevenue: newRevenue },
  });
  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/");
  return client;
}

export async function setClientStatus(clientId: string, status: "active" | "paused" | "ended") {
  const client = await prisma.client.update({ where: { id: clientId }, data: { status } });
  revalidatePath("/clients");
  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/");
  return client;
}

const costLineSchema = z.object({
  clientId: z.string(),
  teamMemberId: z.string(),
  role: z.string().min(1),
  amount: z.coerce.number().positive(),
  isConfirmed: z.boolean().default(true),
  note: z.string().optional().nullable(),
  payoutCondition: z.enum(["fixed_monthly", "after_client_collection"]).default("fixed_monthly"),
});

export type CostLineInput = z.infer<typeof costLineSchema>;

export async function addClientCostLine(input: CostLineInput) {
  const data = costLineSchema.parse(input);
  const line = await prisma.clientCostLine.create({ data });
  revalidatePath(`/clients/${data.clientId}`);
  revalidatePath("/clients");
  revalidatePath("/team");
  revalidatePath("/");
  return line;
}

export async function updateClientCostLine(costLineId: string, input: Partial<CostLineInput>) {
  const data = costLineSchema.partial().parse(input);
  const line = await prisma.clientCostLine.update({ where: { id: costLineId }, data });
  revalidatePath(`/clients/${line.clientId}`);
  revalidatePath("/clients");
  revalidatePath("/team");
  revalidatePath("/");
  return line;
}

export async function deleteClientCostLine(costLineId: string) {
  const line = await prisma.clientCostLine.delete({ where: { id: costLineId } });
  revalidatePath(`/clients/${line.clientId}`);
  revalidatePath("/clients");
  revalidatePath("/team");
  revalidatePath("/");
  return line;
}
