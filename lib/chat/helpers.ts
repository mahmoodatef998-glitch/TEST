import { prisma } from "@/lib/db";

// Fuzzy-ish name lookups used by the chat tool executor. These return a
// tagged result instead of throwing so the caller can turn "not found" /
// "ambiguous" straight into an Arabic message Claude relays to the user
// instead of guessing.

export type LookupResult<T> =
  | { status: "found"; value: T }
  | { status: "not_found" }
  | { status: "ambiguous"; matches: string[] };

export async function findClientByName(name: string): Promise<LookupResult<{ id: string; name: string }>> {
  const matches = await prisma.client.findMany({
    where: {
      OR: [{ name: { contains: name } }, { companyName: { contains: name } }],
    },
    select: { id: true, name: true },
  });
  if (matches.length === 0) return { status: "not_found" };
  if (matches.length > 1) return { status: "ambiguous", matches: matches.map((m) => m.name) };
  return { status: "found", value: matches[0] };
}

export async function findTeamMemberByName(
  name: string
): Promise<LookupResult<{ id: string; name: string }>> {
  const matches = await prisma.teamMember.findMany({
    where: { name: { contains: name } },
    select: { id: true, name: true },
  });
  if (matches.length === 0) return { status: "not_found" };
  if (matches.length > 1) return { status: "ambiguous", matches: matches.map((m) => m.name) };
  return { status: "found", value: matches[0] };
}

export async function findOrCreateTeamMember(name: string): Promise<{ id: string; name: string }> {
  const result = await findTeamMemberByName(name);
  if (result.status === "found") return result.value;
  return prisma.teamMember.create({ data: { name } });
}

export async function findPartnerByName(
  name: string
): Promise<LookupResult<{ id: string; name: string }>> {
  const matches = await prisma.partner.findMany({
    where: { name: { contains: name } },
    select: { id: true, name: true },
  });
  if (matches.length === 0) return { status: "not_found" };
  if (matches.length > 1) return { status: "ambiguous", matches: matches.map((m) => m.name) };
  return { status: "found", value: matches[0] };
}
