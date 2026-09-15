import { auth, signOut } from "@/auth";

export async function Topbar() {
  const session = await auth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <span className="text-sm text-gray-500">
        مرحبًا، <span className="font-medium text-gray-900">{session?.user?.name}</span>
      </span>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button type="submit" className="text-sm text-gray-500 hover:text-gray-900">
          تسجيل الخروج
        </button>
      </form>
    </header>
  );
}
