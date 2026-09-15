"use client";

import { useRef, useState, useTransition } from "react";
import { createPartner } from "@/lib/actions/settings";

export function AddPartnerForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-gray-500 hover:text-gray-900"
      >
        + إضافة شريك
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await createPartner({
            name: String(formData.get("name")),
            sharePercentage: Number(formData.get("sharePercentage")),
          });
          formRef.current?.reset();
          setOpen(false);
        });
      }}
      className="flex items-center gap-2"
    >
      <input name="name" required placeholder="اسم الشريك" className="input" />
      <input
        name="sharePercentage"
        type="number"
        step="0.01"
        required
        placeholder="النسبة %"
        className="input w-24"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
      >
        حفظ
      </button>
    </form>
  );
}
