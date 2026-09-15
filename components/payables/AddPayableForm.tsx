"use client";

import { useRef, useState, useTransition } from "react";
import { createPayable } from "@/lib/actions/payables";

export function AddPayableForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        + مستحق جديد
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await createPayable({
            who: String(formData.get("who")),
            reason: String(formData.get("reason")),
            amount: Number(formData.get("amount")),
            status: String(formData.get("status")),
          });
          formRef.current?.reset();
          setOpen(false);
        });
      }}
      className="mb-4 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2"
    >
      <input name="who" required placeholder="لمين (موظف / مورد) *" className="input" />
      <input name="amount" type="number" step="0.01" required placeholder="المبلغ *" className="input" />
      <input name="reason" required placeholder="السبب *" className="input sm:col-span-2" />
      <input name="status" required placeholder="هيتدفع إمتى / ملاحظة *" className="input sm:col-span-2" />
      <div className="col-span-full flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          حفظ
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
