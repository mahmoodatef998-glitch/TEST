import { getPartners, getPayrollSchedule } from "@/lib/queries";
import { PartnerShareForm } from "@/components/settings/PartnerShareForm";
import { AddPartnerForm } from "@/components/settings/AddPartnerForm";
import { PayrollScheduleForm } from "@/components/settings/PayrollScheduleForm";

export default async function SettingsPage() {
  const [partners, schedule] = await Promise.all([getPartners(), getPayrollSchedule()]);

  const totalShare = partners.reduce((s, p) => s + p.sharePercentage, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-sm text-gray-500">نسبة تقسيم الأرباح وتوقيت صرف المرتبات</p>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700">نسبة تقسيم الأرباح بين الشركاء</h2>
          <AddPartnerForm />
        </div>
        <div className="flex flex-col gap-2">
          {partners.map((p) => (
            <PartnerShareForm key={p.id} partner={p} />
          ))}
        </div>
        {totalShare !== 100 && (
          <p className="mt-2 text-xs text-amber-600">
            تنبيه: مجموع النسب حاليًا {totalShare}% (المفروض يكون 100%)
          </p>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold text-gray-700">جدول صرف المرتبات</h2>
        <PayrollScheduleForm schedule={schedule} />
      </div>
    </div>
  );
}
