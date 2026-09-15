"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const payableSchema = z.object({
  who: z.string().min(1),
  reason: z.string().min(1),
  amount: z.coerce.number().positive(),
  status: z.string().min(1),
});

export type PayableInput = z.infer<typeof payableSchema>;

export async function createPayable(input: PayableInput) {
  const data = payableSchema.parse(input);
  const payable = await prisma.payable.create({ data });
  revalidatePath("/payables");
  revalidatePath("/");
  return payable;
}

export async function settlePayable(payableId: string) {
  const payable = await prisma.payable.update({
    where: { id: payableId },
    data: { isSettled: true },
  });
  revalidatePath("/payables");
  revalidatePath("/");
  return payable;
}
