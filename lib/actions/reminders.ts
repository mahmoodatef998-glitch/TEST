"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const reminderSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  type: z.enum(["payroll", "collection", "other"]).default("other"),
  relatedClientId: z.string().optional().nullable(),
});

export type ReminderInput = z.infer<typeof reminderSchema>;

export async function createReminder(input: ReminderInput) {
  const data = reminderSchema.parse(input);
  const reminder = await prisma.reminder.create({ data });
  revalidatePath("/");
  return reminder;
}

export async function setReminderDone(reminderId: string, done: boolean) {
  const reminder = await prisma.reminder.update({
    where: { id: reminderId },
    data: { isDone: done },
  });
  revalidatePath("/");
  return reminder;
}

export async function findReminderByText(text: string) {
  return prisma.reminder.findFirst({
    where: { title: { contains: text } },
    orderBy: { date: "asc" },
  });
}
