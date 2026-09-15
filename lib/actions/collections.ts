"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const collectionSchema = z.object({
  clientId: z.string(),
  amount: z.coerce.number().positive(),
  dueDate: z.coerce.date(),
  status: z.enum(["pending", "paid"]).default("pending"),
});

export type CollectionInput = z.infer<typeof collectionSchema>;

function revalidateCollections(clientId: string) {
  revalidatePath("/collections");
  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/");
}

export async function createCollectionEntry(input: CollectionInput) {
  const data = collectionSchema.parse(input);
  const entry = await prisma.collectionEntry.create({ data });
  revalidateCollections(data.clientId);
  return entry;
}

export async function markCollectionPaid(collectionId: string, paidDate?: Date) {
  const entry = await prisma.collectionEntry.update({
    where: { id: collectionId },
    data: { status: "paid", paidDate: paidDate ?? new Date() },
  });
  revalidateCollections(entry.clientId);
  return entry;
}
