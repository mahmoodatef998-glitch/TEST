"use client";

import { useTransition } from "react";
import { updatePayrollSchedule } from "@/lib/actions/settings";
import type { PayrollSchedule } from "@prisma/client";

export function PayrollScheduleForm({ schedule }: { schedule: PayrollSchedule | null }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        const day = Number(formData.get("dayOfMonth"));
        const note = String(formData.get("note") ?? "") || undefined;
        startTransition(async () => {
          await updatePayrollSchedule(day, note);
        });
      }}
      className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-3"
    >
      <label className="text-sm">
        <span className="mb-1 block text-xs text-gray-500">يوم صرف المرتبات كل شهر</span>
        <input
          name="dayOfMonth"
          type="number"
          min={1}
          max={31}
          defaultValue={schedule?.dayOfMonth ?? 10}
          className="input w-24"
        />
      </label>
      <label className="flex-1 text-sm">
        <span className="mb-1 block text-xs text-gray-500">ملاحظة</span>
        <input name="note" defaultValue={schedule?.note ?? ""} className="input w-full" />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-gray-900 px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
      >
        حفظ
      </button>
    </form>
  );
}
