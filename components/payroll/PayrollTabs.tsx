"use client";

import { useState, useTransition } from "react";
import { markPayrollPaid, markPayrollPending } from "@/lib/actions/payroll";
import { formatAED, formatArabicDate } from "@/lib/format";
import { ReminderBadge } from "@/components/ReminderBadge";
import type { Client, PayrollEntry, TeamMember } from "@prisma/client";

type Entry = PayrollEntry & { teamMember: TeamMember; client: Client | null };

export function PayrollTabs({ pending, history }: { pending: Entry[]; history: Entry[] }) {
  const [tab, setTab] = useState<"pending" | "history">("pending");
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <div className="mb-3 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab("pending")}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            tab === "pending" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400"
          }`}
        >
          لسه مستحقة ({pending.length})
        </button>
        <button
          onClick={() => setTab("history")}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            tab === "history" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400"
          }`}
        >
          السجل ({history.length})
        </button>
      </div>

      {tab === "pending" ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-right text-xs text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">عضو الفريق</th>
                <th className="px-3 py-2 font-medium">العميل</th>
                <th className="px-3 py-2 font-medium">المبلغ</th>
                <th className="px-3 py-2 font-medium">تاريخ الاستحقاق</th>
                <th className="px-3 py-2 font-medium">الحالة</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {pending.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 py-2 font-medium text-gray-900">{entry.teamMember.name}</td>
                  <td className="px-3 py-2 text-gray-600">{entry.client?.name ?? "—"}</td>
                  <td className="px-3 py-2">{formatAED(entry.amount)}</td>
                  <td className="px-3 py-2 text-gray-600">{formatArabicDate(entry.dueDate)}</td>
                  <td className="px-3 py-2">
                    <ReminderBadge date={entry.dueDate} isDone={false} />
                  </td>
                  <td className="px-3 py-2 text-left">
                    <button
                      disabled={isPending}
                      onClick={() => startTransition(async () => { await markPayrollPaid(entry.id); })}
                      className="text-xs text-green-700 hover:underline disabled:opacity-50"
                    >
                      تحديد كمدفوع
                    </button>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-xs text-gray-400">
                    لا توجد مستحقات معلّقة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-right text-xs text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">عضو الفريق</th>
                <th className="px-3 py-2 font-medium">العميل</th>
                <th className="px-3 py-2 font-medium">المبلغ</th>
                <th className="px-3 py-2 font-medium">تاريخ الدفع</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 py-2 font-medium text-gray-900">{entry.teamMember.name}</td>
                  <td className="px-3 py-2 text-gray-600">{entry.client?.name ?? "—"}</td>
                  <td className="px-3 py-2">{formatAED(entry.amount)}</td>
                  <td className="px-3 py-2 text-gray-600">
                    {entry.paidDate ? formatArabicDate(entry.paidDate) : "—"}
                  </td>
                  <td className="px-3 py-2 text-left">
                    <button
                      disabled={isPending}
                      onClick={() => startTransition(async () => { await markPayrollPending(entry.id); })}
                      className="text-xs text-gray-400 hover:underline disabled:opacity-50"
                    >
                      تراجع
                    </button>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-xs text-gray-400">
                    لا يوجد سجل مدفوعات بعد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
