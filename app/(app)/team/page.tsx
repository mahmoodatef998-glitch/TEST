import { getTeamWithDues } from "@/lib/queries";
import { formatAED } from "@/lib/format";
import { AddTeamMemberForm } from "@/components/team/AddTeamMemberForm";

export default async function TeamPage() {
  const members = await getTeamWithDues();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">الفريق</h1>
          <p className="text-sm text-gray-500">الفريلانسرز والعملاء اللي شغالين عليهم</p>
        </div>
        <AddTeamMemberForm />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => {
          const clientNames = Array.from(
            new Map(member.costLines.map((l) => [l.client.id, l.client.name])).values()
          );
          return (
            <div key={member.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  {member.phone && <p className="text-xs text-gray-400">{member.phone}</p>}
                </div>
                {member.totalPendingDue > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                    مستحق {formatAED(member.totalPendingDue)}
                  </span>
                )}
              </div>

              {member.notes && <p className="mt-2 text-xs text-gray-500">{member.notes}</p>}

              <div className="mt-3">
                <p className="mb-1 text-xs font-medium text-gray-400">شغال مع</p>
                {clientNames.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {clientNames.map((name) => (
                      <span key={name} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-300">لا يوجد عملاء مرتبطين حاليًا</p>
                )}
              </div>
            </div>
          );
        })}
        {members.length === 0 && (
          <p className="text-sm text-gray-400">لا يوجد أعضاء فريق بعد.</p>
        )}
      </div>
    </div>
  );
}
