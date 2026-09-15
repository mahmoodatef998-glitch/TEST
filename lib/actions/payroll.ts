"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const payrollEntrySchema = z.object({
  teamMemberId: z.string(),
  clientId: z.string().optional().nullable(),
  amount: z.coerce.number().positive(),
  dueDate: z.coerce.date(),
  note: z.string().optional().nullable(),
});

export type PayrollEntryInput = z.infer<typeof payrollEntrySchema>;

function revalidatePayroll() {
  revalidatePath("/payroll");
  revalidatePath("/team");
  revalidatePath("/");
}

export async function createPayrollEntry(input: PayrollEntryInput) {
  const data = payrollEntrySchema.parse(input);
  const entry = await prisma.payrollEntry.create({ data });
  revalidatePayroll();
  return entry;
}

export async function markPayrollPaid(payrollEntryId: string, paidDate?: Date) {
  const entry = await prisma.payrollEntry.update({
    where: { id: payrollEntryId },
    data: { status: "paid", paidDate: paidDate ?? new Date() },
  });
  revalidatePayroll();
  return entry;
}

export async function markPayrollPending(payrollEntryId: string) {
  const entry = await prisma.payrollEntry.update({
    where: { id: payrollEntryId },
    data: { status: "pending", paidDate: null },
  });
  revalidatePayroll();
  return entry;
}

export async function findPayrollEntry(teamMemberName: string, clientName?: string) {
  return prisma.payrollEntry.findFirst({
    where: {
      status: "pending",
      teamMember: { name: { contains: teamMemberName } },
      ...(clientName ? { client: { name: { contains: clientName } } } : {}),
    },
    include: { teamMember: true, client: true },
    orderBy: { dueDate: "asc" },
  });
}
