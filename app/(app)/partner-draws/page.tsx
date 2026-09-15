import { getPartnerDraws, getPartners } from "@/lib/queries";
import { formatAED, formatArabicDate } from "@/lib/format";
import { AddDrawForm } from "@/components/draws/AddDrawForm";

export default async function PartnerDrawsPage() {
  const [draws, partners] = await Promise.all([getPartnerDraws(), getPartners()]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">توزيعات الأرباح</h1>
          <p className="text-sm text-gray-500">سحوبات الشركاء من صافي الأرباح</p>
        </div>
        <AddDrawForm partners={partners} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-right text-xs text-gray-500">
            <tr>
              <th className="px-3 py-2 font-medium">الشريك</th>
              <th className="px-3 py-2 font-medium">المبلغ</th>
              <th className="px-3 py-2 font-medium">التاريخ</th>
              <th className="px-3 py-2 font-medium">ملاحظة</th>
            </tr>
          </thead>
          <tbody>
            {draws.map((draw) => (
              <tr key={draw.id} className="border-b border-gray-50 last:border-0">
                <td className="px-3 py-2 font-medium text-gray-900">{draw.partner.name}</td>
                <td className="px-3 py-2">{formatAED(draw.amount)}</td>
                <td className="px-3 py-2 text-gray-600">{formatArabicDate(draw.date)}</td>
                <td className="px-3 py-2 text-xs text-gray-400">{draw.note}</td>
              </tr>
            ))}
            {draws.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-sm text-gray-400">
                  لا توجد سحوبات مسجلة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
