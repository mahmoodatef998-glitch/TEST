"use client";

import { useRef, useState, useTransition } from "react";
import { createCollectionEntry } from "@/lib/actions/collections";

export function AddCollectionForm({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-700"
      >
        + إضافة دفعة تحصيل
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await createCollectionEntry({
            clientId,
            amount: Number(formData.get("amount")),
            dueDate: new Date(String(formData.get("dueDate"))),
            status: "pending",
          });
          formRef.current?.reset();
          setOpen(false);
        });
      }}
      className="flex flex-wrap items-end gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
    >
      <input name="amount" type="number" step="0.01" required placeholder="المبلغ" className="input" />
      <input name="dueDate" type="date" required className="input" />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
      >
        إضافة
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600"
      >
        إلغاء
      </button>
    </form>
  );
}
