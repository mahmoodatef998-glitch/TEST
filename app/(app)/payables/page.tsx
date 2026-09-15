import { getPayables } from "@/lib/queries";
import { AddPayableForm } from "@/components/payables/AddPayableForm";
import { PayableRow } from "@/components/payables/PayableRow";

export default async function PayablesPage() {
  const payables = await getPayables();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">المستحقات والمديونيات</h1>
          <p className="text-sm text-gray-500">مستحقات عامة غير مرتبطة بدورة المرتبات المعتادة</p>
        </div>
        <AddPayableForm />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-right text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 font-medium">لمين</th>
              <th className="px-3 py-2 font-medium">السبب</th>
              <th className="px-3 py-2 font-medium">المبلغ</th>
              <th className="px-3 py-2 font-medium">الحالة</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {payables.map((p) => (
              <PayableRow key={p.id} payable={p} />
            ))}
            {payables.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-sm text-gray-400">
                  لا توجد مستحقات مسجلة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
