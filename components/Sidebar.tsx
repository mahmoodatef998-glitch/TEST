"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Wallet,
  Receipt,
  HandCoins,
  PiggyBank,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/clients", label: "العملاء", icon: Users },
  { href: "/team", label: "الفريق", icon: UserRound },
  { href: "/payroll", label: "المرتبات", icon: Wallet },
  { href: "/payables", label: "المستحقات والمديونيات", icon: Receipt },
  { href: "/collections", label: "سجل التحصيلات", icon: HandCoins },
  { href: "/partner-draws", label: "توزيعات الأرباح", icon: PiggyBank },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-l border-gray-200 bg-white md:flex md:flex-col">
      <div className="border-b border-gray-100 px-5 py-5">
        <h1 className="text-base font-bold text-gray-900">دفتر حسابات الوكالة</h1>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
