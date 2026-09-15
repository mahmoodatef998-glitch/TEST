import Link from "next/link";
import { formatAED } from "@/lib/format";
import type { Client, ClientCostLine, TeamMember } from "@prisma/client";

type CostLine = ClientCostLine & { teamMember?: TeamMember };

export function ClientCard({
  client,
}: {
  client: Client & { costLines: CostLine[]; totalCost: number; netProfit: number };
}) {
  return (
    <Link
      href={`/clients/${client.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-gray-900">{client.name}</h3>
          {client.companyName && <p className="text-xs text-gray-500">{client.companyName}</p>}
        </div>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          {client.costLines.length} بند تكلفة
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-gray-400">الإيراد</p>
          <p className="text-sm font-semibold text-gray-900">{formatAED(client.monthlyRevenue)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">التكلفة</p>
          <p className="text-sm font-semibold text-gray-900">{formatAED(client.totalCost)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">صافي الربح</p>
          <p className={`text-sm font-bold ${client.netProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
            {formatAED(client.netProfit)}
          </p>
        </div>
      </div>
    </Link>
  );
}
