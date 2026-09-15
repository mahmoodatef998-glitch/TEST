const STATUS_LABELS: Record<string, string> = {
  active: "نشط",
  paused: "متوقف",
  ended: "منتهي",
};

const STATUS_CLASSES: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  ended: "bg-gray-200 text-gray-600",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
        STATUS_CLASSES[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
