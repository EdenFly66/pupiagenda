"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { StrawberryLogo } from "@/components/brand/StrawberryLogo";
import { supabase } from "@/lib/supabase";

const successMessage =
  "Si el correo existe, recibirás instrucciones para restablecer tu contraseña.";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim();
    setMessage(null);
    setError(null);

    if (!isValidEmail(normalizedEmail)) {
      setError("Ingresa un correo válido para enviar las instrucciones.");
      return;
    }

    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      },
    );

    setLoading(false);

    if (resetError) {
      setError("No pudimos enviar las instrucciones en este momento. Inténtalo nuevamente.");
      return;
    }

    setMessage(successMessage);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-xl shadow-rose-100/50 sm:p-8"
      noValidate
    >
      <div>
        <div className="flex items-center gap-3">
          <StrawberryLogo className="shrink-0" size="md" />
          <p className="text-sm font-semibold uppercase tracking-normal text-brand-active">
            PupiAgenda
          </p>
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">
          Recuperar contraseña
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Te enviaremos un enlace seguro para crear una nueva contraseña.
        </p>
      </div>

      <label className="mt-6 block">
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

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="mt-5 rounded-2xl border border-leaf bg-leaf-soft p-4 text-sm leading-6 text-leaf-strong">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active disabled:cursor-not-allowed disabled:bg-rose-soft disabled:text-brand-active"
      >
        {loading ? "Enviando..." : "Enviar instrucciones"}
      </button>

      <Link
        href="/login"
        className="mt-4 inline-flex w-full items-center justify-center text-sm font-semibold text-brand-active transition hover:text-brand-hover"
      >
        Volver al login
      </Link>
    </form>
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const inputClassName =
  "mt-2 h-12 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-placeholder focus:border-brand focus:ring-4 focus:ring-rose-soft";
