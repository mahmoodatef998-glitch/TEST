const aedFormatter = new Intl.NumberFormat("ar-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
});

export function formatAED(amount: number): string {
  return aedFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("ar-AE", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatArabicDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return dateFormatter.format(d);
}
