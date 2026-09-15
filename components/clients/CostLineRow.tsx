"use client";

import { useTransition } from "react";
import { deleteClientCostLine } from "@/lib/actions/clients";
import { formatAED } from "@/lib/format";
import type { ClientCostLine, TeamMember } from "@prisma/client";

export function CostLineRow({ line }: { line: ClientCostLine & { teamMember: TeamMember } }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className="border-b border-gray-50 last:border-0">
      <td className="px-3 py-2 font-medium text-gray-900">{line.teamMember.name}</td>
      <td className="px-3 py-2 text-gray-600">{line.role}</td>
      <td className="px-3 py-2">{formatAED(line.amount)}</td>
      <td className="px-3 py-2">
        {line.payoutCondition === "after_client_collection" ? (
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800">
            بعد التحصيل
          </span>
        ) : (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
            شهري تلقائي
          </span>
        )}
        {!line.isConfirmed && (
          <span className="ms-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
            تقديري
          </span>
        )}
      </td>
      <td className="px-3 py-2 text-xs text-gray-400">{line.note}</td>
      <td className="px-3 py-2 text-left">
        <button
          disabled={isPending}
          onClick={() => startTransition(async () => { await deleteClientCostLine(line.id); })}
          className="text-xs text-red-500 hover:underline disabled:opacity-50"
        >
          حذف
        </button>
      </td>
    </tr>
  );
}
