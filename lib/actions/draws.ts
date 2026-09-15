"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const drawSchema = z.object({
  partnerId: z.string(),
  amount: z.coerce.number().positive(),
  date: z.coerce.date(),
  note: z.string().optional().nullable(),
});

export type PartnerDrawInput = z.infer<typeof drawSchema>;

export async function createPartnerDraw(input: PartnerDrawInput) {
  const data = drawSchema.parse(input);
  const draw = await prisma.partnerDraw.create({ data });
  revalidatePath("/partner-draws");
  revalidatePath("/");
  return draw;
}
