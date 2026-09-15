"use client";

import { useTransition } from "react";
import { setClientStatus, updateClientRevenue } from "@/lib/actions/clients";
import type { Client } from "@prisma/client";

export function EditClientBar({ client }: { client: Client }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-sm">
      <label className="flex items-center gap-2">
        الحالة:
        <select
          defaultValue={client.status}
          disabled={isPending}
          onChange={(e) =>
            startTransition(async () => {
              await setClientStatus(client.id, e.target.value as "active" | "paused" | "ended");
            })
          }
          className="input"
        >
          <option value="active">نشط</option>
          <option value="paused">متوقف</option>
          <option value="ended">منتهي</option>
        </select>
      </label>

      <form
        action={(formData) => {
          const value = Number(formData.get("revenue"));
          if (!value) return;
          startTransition(async () => {
            await updateClientRevenue(client.id, value);
          });
        }}
        className="flex items-center gap-2"
      >
        الباقة الشهرية:
        <input
          name="revenue"
          type="number"
          step="0.01"
          defaultValue={client.monthlyRevenue}
          className="input w-32"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          تحديث
        </button>
      </form>
    </div>
  );
}
