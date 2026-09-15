"use client";

import { useTransition } from "react";
import { markCollectionPaid } from "@/lib/actions/collections";
import { formatAED, formatArabicDate } from "@/lib/format";
import { ReminderBadge } from "@/components/ReminderBadge";
import type { CollectionEntry } from "@prisma/client";

export function CollectionRow({ entry }: { entry: CollectionEntry }) {
  const [isPending, startTransition] = useTransition();
  const isPaid = entry.status === "paid";

  return (
    <tr className="border-b border-gray-50 last:border-0">
      <td className="px-3 py-2">{formatAED(entry.amount)}</td>
      <td className="px-3 py-2 text-gray-600">{formatArabicDate(entry.dueDate)}</td>
      <td className="px-3 py-2">
        {isPaid ? (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
            مدفوع{entry.paidDate ? ` — ${formatArabicDate(entry.paidDate)}` : ""}
          </span>
        ) : (
          <ReminderBadge date={entry.dueDate} isDone={false} />
        )}
      </td>
      <td className="px-3 py-2 text-left">
        {!isPaid && (
          <button
            disabled={isPending}
            onClick={() => startTransition(async () => { await markCollectionPaid(entry.id); })}
            className="text-xs text-green-700 hover:underline disabled:opacity-50"
          >
            تحديد كمدفوع
          </button>
        )}
      </td>
    </tr>
  );
}
