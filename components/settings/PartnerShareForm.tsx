"use client";

import { useTransition } from "react";
import { updatePartnerShare } from "@/lib/actions/settings";
import type { Partner } from "@prisma/client";

export function PartnerShareForm({ partner }: { partner: Partner }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        const value = Number(formData.get("share"));
        startTransition(async () => {
          await updatePartnerShare(partner.id, value);
        });
      }}
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3"
    >
      <span className="flex-1 text-sm font-medium text-gray-900">{partner.name}</span>
      <input
        name="share"
        type="number"
        step="0.01"
        defaultValue={partner.sharePercentage}
        className="input w-24"
      />
      <span className="text-sm text-gray-400">%</span>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        حفظ
      </button>
    </form>
  );
}
