"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updatePartnerShare(partnerId: string, sharePercentage: number) {
  const partner = await prisma.partner.update({
    where: { id: partnerId },
    data: { sharePercentage },
  });
  revalidatePath("/settings");
  revalidatePath("/");
  return partner;
}

const partnerSchema = z.object({ name: z.string().min(1), sharePercentage: z.coerce.number() });

export async function createPartner(input: z.infer<typeof partnerSchema>) {
  const data = partnerSchema.parse(input);
  const partner = await prisma.partner.create({ data });
  revalidatePath("/settings");
  revalidatePath("/partner-draws");
  revalidatePath("/");
  return partner;
}

export async function updatePayrollSchedule(dayOfMonth: number, note?: string) {
  const schedule = await prisma.payrollSchedule.create({
    data: { dayOfMonth, note, appliesFrom: new Date() },
  });
  revalidatePath("/settings");
  return schedule;
}
