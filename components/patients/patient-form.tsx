"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent, InputHTMLAttributes } from "react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type PatientFormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

type PatientFormErrors = Partial<Record<keyof PatientFormState | "form", string>>;

const initialForm: PatientFormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
};

export function PatientForm() {
  const router = useRouter();
  const [form, setForm] = useState<PatientFormState>(initialForm);
  const [errors, setErrors] = useState<PatientFormErrors>({});
  const [loading, setLoading] = useState(false);

  function updateField(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validatePatient(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    const { error } = await supabase.from("patients").insert({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
    });

    if (error) {
      setErrors({ form: error.message });
      setLoading(false);
      return;
    }

    setForm(initialForm);
    router.push("/pacientes");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm sm:p-7"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <PatientInput
          label="Nombre"
          name="first_name"
          value={form.first_name}
          onChange={updateField}
          error={errors.first_name}
          autoComplete="given-name"
          required
        />
        <PatientInput
          label="Apellido"
          name="last_name"
          value={form.last_name}
          onChange={updateField}
          error={errors.last_name}
          autoComplete="family-name"
          required
        />
        <PatientInput
          label="Correo"
          name="email"
          value={form.email}
          onChange={updateField}
          error={errors.email}
          autoComplete="email"
          inputMode="email"
          placeholder="nombre@correo.cl"
        />
        <PatientInput
          label="Telefono"
          name="phone"
          value={form.phone}
          onChange={updateField}
          autoComplete="tel"
          placeholder="+56 9 1234 5678"
        />
      </div>

      {errors.form ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
          {errors.form}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Link
          href="/pacientes"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-100 bg-white px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-[#87304a] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Guardando..." : "Guardar paciente"}
        </button>
      </div>
    </form>
  );
}

function PatientInput({
  label,
  name,
  value,
  onChange,
  error,
  required,
  ...props
}: {
  label: string;
  name: keyof PatientFormState;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "value" | "onChange" | "required"
>) {
  const errorId = `${name}-error`;

  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">
        {label}
        {required ? <span className="text-brand"> *</span> : null}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 h-12 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand focus:ring-4 focus:ring-rose-100"
        {...props}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function validatePatient(form: PatientFormState) {
  const errors: PatientFormErrors = {};

  if (!form.first_name.trim()) {
    errors.first_name = "El nombre es obligatorio.";
  }

  if (!form.last_name.trim()) {
    errors.last_name = "El apellido es obligatorio.";
  }

  if (form.email.trim() && !isValidEmail(form.email.trim())) {
    errors.email = "Ingresa un correo valido.";
  }

  return errors;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
