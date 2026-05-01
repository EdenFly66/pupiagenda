import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,var(--theme-soft-bg)_0,transparent_32rem)] px-4 py-10">
      <LoginForm />
    </main>
  );
}
