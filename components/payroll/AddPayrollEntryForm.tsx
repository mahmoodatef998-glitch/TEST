"use client";

import { useRef, useState, useTransition } from "react";
import { createPayrollEntry } from "@/lib/actions/payroll";
import type { Client, TeamMember } from "@prisma/client";

export function AddPayrollEntryForm({
  teamMembers,
  clients,
}: {
  teamMembers: TeamMember[];
  clients: Client[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        + مستحق مرتب جديد
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await createPayrollEntry({
            teamMemberId: String(formData.get("teamMemberId")),
            clientId: String(formData.get("clientId") ?? "") || null,
            amount: Number(formData.get("amount")),
            dueDate: new Date(String(formData.get("dueDate"))),
            note: String(formData.get("note") ?? "") || null,
          });
          formRef.current?.reset();
          setOpen(false);
        });
      }}
      className="mb-4 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-3"
    >
      <select name="teamMemberId" required defaultValue="" className="input">
        <option value="" disabled>
          عضو الفريق *
        </option>
        {teamMembers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <select name="clientId" defaultValue="" className="input">
        <option value="">بدون عميل (مديونية عامة)</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input name="amount" type="number" step="0.01" required placeholder="المبلغ *" className="input" />
      <input name="dueDate" type="date" required className="input" />
      <input name="note" placeholder="ملاحظة (اختياري)" className="input sm:col-span-2" />
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
