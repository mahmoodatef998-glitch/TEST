import Link from "next/link";
import { getAllClientsWithFinancials } from "@/lib/queries";
import { formatAED } from "@/lib/format";
import { AddClientForm } from "@/components/clients/AddClientForm";
import { StatusBadge } from "@/components/clients/StatusBadge";

export default async function ClientsPage() {
  const clients = await getAllClientsWithFinancials();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">العملاء</h1>
          <p className="text-sm text-gray-500">كل عملاء الوكالة وحالتهم المالية</p>
        </div>
        <AddClientForm />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-right text-xs text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">العميل</th>
              <th className="px-4 py-3 font-medium">الحالة</th>
              <th className="px-4 py-3 font-medium">الإيراد</th>
              <th className="px-4 py-3 font-medium">التكلفة</th>
              <th className="px-4 py-3 font-medium">صافي الربح</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/clients/${client.id}`} className="font-medium text-gray-900 hover:underline">
                    {client.name}
                  </Link>
                  {client.companyName && (
                    <p className="text-xs text-gray-400">{client.companyName}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={client.status} />
                </td>
                <td className="px-4 py-3">{formatAED(client.monthlyRevenue)}</td>
                <td className="px-4 py-3">{formatAED(client.totalCost)}</td>
                <td
                  className={`px-4 py-3 font-semibold ${
                    client.netProfit >= 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {formatAED(client.netProfit)}
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                  لا يوجد عملاء بعد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
