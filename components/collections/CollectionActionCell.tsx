"use client";

import { useTransition } from "react";
import { markCollectionPaid } from "@/lib/actions/collections";

export function CollectionActionCell({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();
  if (status === "paid") return null;

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(async () => { await markCollectionPaid(id); })}
      className="text-xs text-green-700 hover:underline disabled:opacity-50"
    >
      تحديد كمدفوع
    </button>
  );
}
