"use client";

import { useTransition } from "react";
import { setReminderDone } from "@/lib/actions/reminders";

export function ReminderDoneToggle({ reminderId, isDone }: { reminderId: string; isDone: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await setReminderDone(reminderId, !isDone);
        })
      }
      className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-50"
      title={isDone ? "إعادة فتح" : "تحديد كمنجز"}
    >
      {isDone ? "↺" : "✓"}
    </button>
  );
}
