"use client";

import { useRef, useState, useTransition } from "react";
import { createPartnerDraw } from "@/lib/actions/draws";
import type { Partner } from "@prisma/client";

export function AddDrawForm({ partners }: { partners: Partner[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        + سحب أرباح جديد
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await createPartnerDraw({
            partnerId: String(formData.get("partnerId")),
            amount: Number(formData.get("amount")),
            date: new Date(String(formData.get("date"))),
            note: String(formData.get("note") ?? "") || null,
          });
          formRef.current?.reset();
          setOpen(false);
        });
      }}
      className="mb-4 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-3"
    >
      <select name="partnerId" required defaultValue="" className="input">
        <option value="" disabled>
          الشريك *
        </option>
        {partners.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <input name="amount" type="number" step="0.01" required placeholder="المبلغ *" className="input" />
      <input name="date" type="date" required className="input" />
      <input name="note" placeholder="ملاحظة (اختياري)" className="input sm:col-span-full" />
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
