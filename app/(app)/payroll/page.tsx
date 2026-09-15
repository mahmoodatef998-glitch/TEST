import { getPayrollPending, getPayrollHistory, getTeamMembers, getActiveClients } from "@/lib/queries";
import { AddPayrollEntryForm } from "@/components/payroll/AddPayrollEntryForm";
import { PayrollTabs } from "@/components/payroll/PayrollTabs";

export default async function PayrollPage() {
  const [pending, history, teamMembers, clients] = await Promise.all([
    getPayrollPending(),
    getPayrollHistory(),
    getTeamMembers(),
    getActiveClients(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">المرتبات</h1>
          <p className="text-sm text-gray-500">مستحقات الفريق ومدفوعاتهم</p>
        </div>
        <AddPayrollEntryForm teamMembers={teamMembers} clients={clients} />
      </div>

      <PayrollTabs pending={pending} history={history} />
    </div>
  );
}
