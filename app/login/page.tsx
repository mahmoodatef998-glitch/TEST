import { signIn } from "@/auth";
import { AuthError } from "next-auth";

async function authenticate(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return;
    }
    throw error;
  }
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4" dir="rtl">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-gray-900">تسجيل الدخول</h1>
        <p className="mb-6 text-sm text-gray-500">دفتر حسابات الوكالة</p>

        <LoginForm action={authenticate} searchParams={searchParams} />
      </div>
    </div>
  );
}

async function LoginForm({
  action,
  searchParams,
}: {
  action: (formData: FormData) => Promise<void>;
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          placeholder="you@agency.com"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">كلمة المرور</label>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
          placeholder="••••••••"
        />
      </div>
      {params?.error && (
        <p className="text-sm text-red-600">البريد الإلكتروني أو كلمة المرور غير صحيحة</p>
      )}
      <button
        type="submit"
        className="mt-2 rounded-lg bg-gray-900 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        دخول
      </button>
    </form>
  );
}
