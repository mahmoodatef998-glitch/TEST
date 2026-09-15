"use client";

import { useRef, useState, useTransition } from "react";
import { createReminder } from "@/lib/actions/reminders";

export function QuickAddReminder() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-dashed border-gray-300 py-2 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-700"
      >
        + إضافة تنبيه
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await createReminder({
            title: String(formData.get("title") ?? ""),
            date: new Date(String(formData.get("date"))),
            type: "other",
          });
          formRef.current?.reset();
          setOpen(false);
        });
      }}
      className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3"
    >
      <input
        name="title"
        required
        placeholder="عنوان التنبيه"
        className="rounded-md border border-gray-300 px-2 py-1 text-sm"
      />
      <input
        name="date"
        type="date"
        required
        className="rounded-md border border-gray-300 px-2 py-1 text-sm"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-md bg-gray-900 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          حفظ
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-md border border-gray-200 py-1.5 text-xs text-gray-600"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
