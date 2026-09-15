"use client";

import { useTransition } from "react";
import { settlePayable } from "@/lib/actions/payables";
import { formatAED } from "@/lib/format";
import type { Payable } from "@prisma/client";

export function PayableRow({ payable }: { payable: Payable }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className={`border-b border-gray-50 last:border-0 ${payable.isSettled ? "opacity-50" : ""}`}>
      <td className="px-3 py-2 font-medium text-gray-900">{payable.who}</td>
      <td className="px-3 py-2 text-gray-600">{payable.reason}</td>
      <td className="px-3 py-2">{formatAED(payable.amount)}</td>
      <td className="px-3 py-2 text-gray-600">{payable.status}</td>
      <td className="px-3 py-2 text-left">
        {!payable.isSettled && (
          <button
            disabled={isPending}
            onClick={() => startTransition(async () => { await settlePayable(payable.id); })}
            className="text-xs text-green-700 hover:underline disabled:opacity-50"
          >
            تم السداد
          </button>
        )}
      </td>
    </tr>
  );
}
