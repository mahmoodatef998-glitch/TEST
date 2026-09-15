"use client";

import { useRef, useState, useTransition } from "react";
import { addClientCostLine } from "@/lib/actions/clients";
import type { TeamMember } from "@prisma/client";

export function AddCostLineForm({
  clientId,
  teamMembers,
}: {
  clientId: string;
  teamMembers: TeamMember[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-700"
      >
        + إضافة بند تكلفة
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await addClientCostLine({
            clientId,
            teamMemberId: String(formData.get("teamMemberId")),
            role: String(formData.get("role")),
            amount: Number(formData.get("amount")),
            isConfirmed: formData.get("isConfirmed") === "on",
            note: String(formData.get("note") ?? "") || null,
            payoutCondition: formData.get("payoutCondition") as
              | "fixed_monthly"
              | "after_client_collection",
          });
          formRef.current?.reset();
          setOpen(false);
        });
      }}
      className="grid grid-cols-1 gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:grid-cols-2"
    >
      <select name="teamMemberId" required className="input" defaultValue="">
        <option value="" disabled>
          اختر عضو الفريق
        </option>
        {teamMembers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <input name="role" required placeholder="الدور (تصوير / ديزاين ...)" className="input" />
      <input name="amount" type="number" step="0.01" required placeholder="المبلغ" className="input" />
      <select name="payoutCondition" className="input" defaultValue="fixed_monthly">
        <option value="fixed_monthly">تلقائي كل شهر</option>
        <option value="after_client_collection">بعد تحصيل العميل</option>
      </select>
      <input name="note" placeholder="ملاحظة (اختياري)" className="input sm:col-span-2" />
      <label className="flex items-center gap-2 text-xs text-gray-600">
        <input name="isConfirmed" type="checkbox" defaultChecked />
        مبلغ مؤكد (غير تقديري)
      </label>
      <div className="flex gap-2 sm:col-span-2">
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
      </div>
    </form>
  );
}
