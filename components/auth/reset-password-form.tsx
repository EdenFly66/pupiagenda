"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { AppLogo } from "@/components/brand/AppLogo";
import { supabase } from "@/lib/supabase";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!active) {
        return;
      }

      setHasSession(Boolean(data.session));
      setCheckingSession(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setHasSession(Boolean(session));
        setCheckingSession(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (password.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Las contraseñas deben coincidir.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError("No pudimos cambiar la contraseña. Vuelve a abrir el enlace o inicia sesión nuevamente.");
      return;
    }

    setPassword("");
    setPasswordConfirmation("");
    setSuccess(true);

    window.setTimeout(() => {
      router.replace(hasSession ? "/dashboard" : "/login");
      router.refresh();
    }, 1400);
  }

  if (checkingSession) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white/90 p-6 text-sm text-muted shadow-sm">
        Verificando enlace seguro...
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
          Cambiar contraseña
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Elige una contraseña nueva, privada y fácil de recordar solo para ti.
        </p>
      </div>

      {!hasSession ? (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Abre esta pantalla desde el enlace enviado a tu correo o inicia sesión para cambiar la contraseña.
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-foreground">
            Nueva contraseña
          </span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="new-password"
            className={inputClassName}
            required
            minLength={8}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-foreground">
            Confirmar nueva contraseña
          </span>
          <input
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            type="password"
            autoComplete="new-password"
            className={inputClassName}
            required
            minLength={8}
          />
        </label>
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-5 rounded-2xl border border-leaf bg-leaf-soft p-4 text-sm leading-6 text-leaf-strong">
          Tu contraseña fue actualizada correctamente. Redirigiendo...
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading || !hasSession}
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active disabled:cursor-not-allowed disabled:bg-rose-soft disabled:text-brand-active"
      >
        {loading ? "Guardando..." : "Guardar nueva contraseña"}
      </button>
    </form>
  );
}

const inputClassName =
  "mt-2 h-12 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-placeholder focus:border-brand focus:ring-4 focus:ring-rose-soft";
