"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/actions/clients";

export function AddClientForm() {
  const [open, setOpen] = useState(false);
  const [billingType, setBillingType] = useState<"monthly_recurring" | "fixed_term">(
    "monthly_recurring"
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        + عميل جديد
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(formData) => {
        setError(null);
        const name = String(formData.get("name") ?? "").trim();
        const monthlyRevenue = Number(formData.get("monthlyRevenue"));
        const startDate = String(formData.get("startDate") ?? "");
        if (!name || !monthlyRevenue || !startDate) {
          setError("الاسم والباقة الشهرية وتاريخ البدء مطلوبين");
          return;
        }
        startTransition(async () => {
          await createClient({
            name,
            companyName: String(formData.get("companyName") ?? "") || null,
            monthlyRevenue,
            billingType,
            contractMonths: formData.get("contractMonths")
              ? Number(formData.get("contractMonths"))
              : null,
            startDate: new Date(startDate),
            paymentTiming: String(formData.get("paymentTiming") ?? "") || null,
            status: "active",
          });
          formRef.current?.reset();
          setOpen(false);
        });
      }}
      className="mb-4 grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2"
    >
      <input name="name" required placeholder="اسم العميل *" className="input" />
      <input name="companyName" placeholder="اسم الشركة (اختياري)" className="input" />
      <input
        name="monthlyRevenue"
        type="number"
        step="0.01"
        required
        placeholder="الباقة الشهرية (درهم) *"
        className="input"
      />
      <select
        name="billingType"
        value={billingType}
        onChange={(e) => setBillingType(e.target.value as typeof billingType)}
        className="input"
      >
        <option value="monthly_recurring">شهري متكرر</option>
        <option value="fixed_term">مدة محددة بعقد</option>
      </select>
      {billingType === "fixed_term" && (
        <input name="contractMonths" type="number" placeholder="عدد الشهور" className="input" />
      )}
      <input name="startDate" type="date" required className="input" />
      <input name="paymentTiming" placeholder="طريقة الدفع (مقدم / دفعات...)" className="input" />

      {error && <p className="col-span-full text-sm text-red-600">{error}</p>}

      <div className="col-span-full flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          حفظ العميل
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
