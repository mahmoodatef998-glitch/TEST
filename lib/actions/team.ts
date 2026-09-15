"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const teamMemberSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

export async function createTeamMember(input: TeamMemberInput) {
  const data = teamMemberSchema.parse(input);
  const member = await prisma.teamMember.create({ data });
  revalidatePath("/team");
  return member;
}

export async function updateTeamMember(memberId: string, input: Partial<TeamMemberInput>) {
  const data = teamMemberSchema.partial().parse(input);
  const member = await prisma.teamMember.update({ where: { id: memberId }, data });
  revalidatePath("/team");
  return member;
}
