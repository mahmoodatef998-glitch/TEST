import { notFound } from "next/navigation";
import { getClientWithFinancials } from "@/lib/queries";
import { prisma } from "@/lib/db";
import { formatAED, formatArabicDate } from "@/lib/format";
import { StatTile } from "@/components/StatTile";
import { StatusBadge } from "@/components/clients/StatusBadge";
import { EditClientBar } from "@/components/clients/EditClientBar";
import { AddCostLineForm } from "@/components/clients/AddCostLineForm";
import { CostLineRow } from "@/components/clients/CostLineRow";
import { AddCollectionForm } from "@/components/clients/AddCollectionForm";
import { CollectionRow } from "@/components/clients/CollectionRow";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [client, teamMembers] = await Promise.all([
    getClientWithFinancials(id),
    prisma.teamMember.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!client) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900">{client.name}</h1>
            <StatusBadge status={client.status} />
          </div>
          {client.companyName && <p className="text-sm text-gray-500">{client.companyName}</p>}
          <p className="mt-1 text-xs text-gray-400">
            بداية العقد: {formatArabicDate(client.startDate)}
            {client.billingType === "fixed_term" && client.contractMonths
              ? ` — عقد ${client.contractMonths} شهر`
              : " — شهري متكرر"}
            {client.paymentTiming ? ` — ${client.paymentTiming}` : ""}
          </p>
        </div>
      </div>

      <EditClientBar client={client} />

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="الإيراد الشهري" value={formatAED(client.monthlyRevenue)} />
        <StatTile label="إجمالي التكلفة" value={formatAED(client.totalCost)} />
        <StatTile
          label="صافي الربح"
          value={formatAED(client.netProfit)}
          tone={client.netProfit >= 0 ? "positive" : "negative"}
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700">بنود التكلفة</h2>
          <AddCostLineForm clientId={client.id} teamMembers={teamMembers} />
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-right text-xs text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">عضو الفريق</th>
                <th className="px-3 py-2 font-medium">الدور</th>
                <th className="px-3 py-2 font-medium">المبلغ</th>
                <th className="px-3 py-2 font-medium">شرط الدفع</th>
                <th className="px-3 py-2 font-medium">ملاحظة</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {client.costLines.map((line) => (
                <CostLineRow key={line.id} line={line} />
              ))}
              {client.costLines.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-xs text-gray-400">
                    لا توجد بنود تكلفة بعد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700">سجل التحصيل</h2>
          <AddCollectionForm clientId={client.id} />
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-right text-xs text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">المبلغ</th>
                <th className="px-3 py-2 font-medium">تاريخ الاستحقاق</th>
                <th className="px-3 py-2 font-medium">الحالة</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {client.collections.map((entry) => (
                <CollectionRow key={entry.id} entry={entry} />
              ))}
              {client.collections.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-xs text-gray-400">
                    لا توجد دفعات تحصيل مسجلة بعد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
