import { getRunRate, getUpcomingReminders, getAllClientsWithFinancials } from "@/lib/queries";
import { formatAED } from "@/lib/format";
import { formatArabicDate, } from "@/lib/format";
import { sortByPriority } from "@/lib/calculations";
import { StatTile } from "@/components/StatTile";
import { ReminderBadge } from "@/components/ReminderBadge";
import { ClientCard } from "@/components/ClientCard";
import { ReminderDoneToggle } from "@/components/ReminderDoneToggle";
import { QuickAddReminder } from "@/components/QuickAddReminder";

export default async function DashboardPage() {
  const [runRate, reminders, clients] = await Promise.all([
    getRunRate(),
    getUpcomingReminders(),
    getAllClientsWithFinancials(),
  ]);

  const activeClients = clients.filter((c) => c.status === "active");
  const sortedReminders = sortByPriority(
    reminders,
    (r) => r.date,
    (r) => r.isDone
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-sm text-gray-500">نظرة عامة على أداء الوكالة الشهري</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="إجمالي الإيراد الشهري" value={formatAED(runRate.totalRevenue)} />
        <StatTile label="إجمالي التكلفة" value={formatAED(runRate.totalCost)} />
        <StatTile
          label="صافي الربح"
          value={formatAED(runRate.totalNetProfit)}
          tone={runRate.totalNetProfit >= 0 ? "positive" : "negative"}
        />
        {runRate.partnerShares.map((p) => (
          <StatTile
            key={p.partnerId}
            label={`نصيب ${p.partnerName} (${p.sharePercentage}%)`}
            value={formatAED(p.amount)}
            tone={p.amount >= 0 ? "positive" : "negative"}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-bold text-gray-700">
            العملاء النشطون ({activeClients.length})
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {activeClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
            {activeClients.length === 0 && (
              <p className="text-sm text-gray-400">لا يوجد عملاء نشطون بعد.</p>
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700">التنبيهات</h2>
          </div>
          <div className="mb-3">
            <QuickAddReminder />
          </div>
          <div className="flex flex-col gap-2">
            {sortedReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 ${
                  reminder.isDone ? "opacity-60" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{reminder.title}</p>
                  <p className="text-xs text-gray-400">
                    {formatArabicDate(reminder.date)}
                    {reminder.relatedClient ? ` — ${reminder.relatedClient.name}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ReminderBadge date={reminder.date} isDone={reminder.isDone} />
                  <ReminderDoneToggle reminderId={reminder.id} isDone={reminder.isDone} />
                </div>
              </div>
            ))}
            {sortedReminders.length === 0 && (
              <p className="text-sm text-gray-400">لا توجد تنبيهات حاليًا.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
