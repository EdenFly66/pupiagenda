"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { AppLogo } from "@/components/brand/AppLogo";
import { supabase } from "@/lib/supabase";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession();

        if (!active) {
          return;
        }

        if (data.session?.user) {
          const destination = await getPostLoginDestination(data.session.user.id);

          if (!active) {
            return;
          }

          router.replace(destination);
          return;
        }
      } catch {
        if (!active) {
          return;
        }
      }

      setCheckingSession(false);
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (loginError) {
      setError("Correo o contrasena incorrectos.");
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    const destination = userId
      ? await getPostLoginDestination(userId)
      : "/dashboard";

    router.replace(destination);
    router.refresh();
  }

  if (checkingSession) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-white/90 p-6 text-sm text-muted shadow-sm">
        Verificando sesion...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-xl shadow-rose-100/50 sm:p-8"
      noValidate
    >
      <div>
        <div className="flex items-center gap-3">
          <AppLogo className="shrink-0" size={48} />
          <p className="text-sm font-semibold uppercase tracking-normal text-brand-active">
            PupiAgenda
          </p>
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">
          Ingresar
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Accede a tu espacio clinico privado.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-foreground">Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
            className={inputClassName}
            placeholder="tu@email.cl"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-foreground">Contraseña</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            className={inputClassName}
            required
          />
        </label>
      </div>

      <div className="mt-3 text-right">
        <Link
          href="/auth/forgot-password"
          className="text-sm font-semibold text-brand-active transition hover:text-brand-hover"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active disabled:cursor-not-allowed disabled:bg-rose-soft disabled:text-brand-active"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}

const inputClassName =
  "mt-2 h-12 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-placeholder focus:border-brand focus:ring-4 focus:ring-rose-soft";

async function getPostLoginDestination(userId: string) {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return "/dashboard";
    }

    return data ? "/admin" : "/dashboard";
  } catch {
    return "/dashboard";
  }
}
