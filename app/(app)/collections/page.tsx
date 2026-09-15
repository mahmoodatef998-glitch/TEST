import { getCollections } from "@/lib/queries";
import { formatAED, formatArabicDate } from "@/lib/format";
import { ReminderBadge } from "@/components/ReminderBadge";
import { CollectionActionCell } from "@/components/collections/CollectionActionCell";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">سجل التحصيلات</h1>
        <p className="text-sm text-gray-500">كل دفعات التحصيل من جميع العملاء</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-right text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 font-medium">العميل</th>
              <th className="px-3 py-2 font-medium">المبلغ</th>
              <th className="px-3 py-2 font-medium">تاريخ الاستحقاق</th>
              <th className="px-3 py-2 font-medium">الحالة</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {collections.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-50 last:border-0">
                <td className="px-3 py-2 font-medium text-gray-900">{entry.client.name}</td>
                <td className="px-3 py-2">{formatAED(entry.amount)}</td>
                <td className="px-3 py-2 text-gray-600">{formatArabicDate(entry.dueDate)}</td>
                <td className="px-3 py-2">
                  {entry.status === "paid" ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                      مدفوع
                    </span>
                  ) : (
                    <ReminderBadge date={entry.dueDate} isDone={false} />
                  )}
                </td>
                <td className="px-3 py-2 text-left">
                  <CollectionActionCell id={entry.id} status={entry.status} />
                </td>
              </tr>
            ))}
            {collections.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-sm text-gray-400">
                  لا توجد دفعات تحصيل مسجلة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
