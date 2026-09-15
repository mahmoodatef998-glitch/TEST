import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { ChatWidget } from "@/components/chat/ChatWidget";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
      <ChatWidget />
    </div>
  );
}
