import { getReminderPriority } from "@/lib/calculations";

export function ReminderBadge({ date, isDone }: { date: Date | string; isDone: boolean }) {
  const priority = getReminderPriority(date, isDone);
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${priority.colorClass}`}>
      {priority.label}
    </span>
  );
}
