"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
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
      const { data } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      if (data.session) {
        router.replace("/dashboard");
        return;
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

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (loginError) {
      setError("Correo o contrasena incorrectos.");
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
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
        <p className="text-sm font-semibold uppercase tracking-normal text-brand">
          PupiAgenda
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
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
          <span className="text-sm font-semibold text-foreground">
            Contrasena
          </span>
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

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-[#87304a] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}

const inputClassName =
  "mt-2 h-12 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand focus:ring-4 focus:ring-rose-100";
