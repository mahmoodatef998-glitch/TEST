"use client";

import { useRef, useState, useTransition } from "react";
import { createTeamMember } from "@/lib/actions/team";

export function AddTeamMemberForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        + عضو فريق جديد
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        const name = String(formData.get("name") ?? "").trim();
        if (!name) return;
        startTransition(async () => {
          await createTeamMember({
            name,
            phone: String(formData.get("phone") ?? "") || null,
            notes: String(formData.get("notes") ?? "") || null,
          });
          formRef.current?.reset();
          setOpen(false);
        });
      }}
      className="mb-4 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-3"
    >
      <input name="name" required placeholder="الاسم *" className="input" />
      <input name="phone" placeholder="رقم الهاتف (اختياري)" className="input" />
      <input name="notes" placeholder="ملاحظات (اختياري)" className="input" />
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
