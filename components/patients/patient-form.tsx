"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  ChangeEvent,
  FormEvent,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useState } from "react";
import { getAuthenticatedUser } from "@/lib/auth";
import type { PatientRow } from "@/lib/patient-types";
import { supabase } from "@/lib/supabase";

export type PatientFormState = {
  first_name: string;
  last_name: string;
  pronouns: string;
  birth_date: string;
  gender: string;
  civil_status: string;
  email: string;
  phone: string;
  address: string;
  health_insurance: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  appointment_schedule: string;
  therapist_consultation_reason: string;
  client_consultation_reason: string;
  co_constructed_goal: string;
  guardian_name: string;
  guardian_email: string;
  guardian_phone: string;
  family_composition: string;
  primary_support_group: string;
  social_environment: string;
  education_context: string;
  judicial_context: string;
  substance_use: string;
  violence_history: string;
  suicide_risk: string;
  previous_treatment: string;
  status: string;
};

type PatientFormErrors = Partial<Record<keyof PatientFormState | "form", string>>;

const initialForm: PatientFormState = {
  first_name: "",
  last_name: "",
  pronouns: "",
  birth_date: "",
  gender: "",
  civil_status: "",
  email: "",
  phone: "",
  address: "",
  health_insurance: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  appointment_schedule: "",
  therapist_consultation_reason: "",
  client_consultation_reason: "",
  co_constructed_goal: "",
  guardian_name: "",
  guardian_email: "",
  guardian_phone: "",
  family_composition: "",
  primary_support_group: "",
  social_environment: "",
  education_context: "",
  judicial_context: "",
  substance_use: "",
  violence_history: "",
  suicide_risk: "",
  previous_treatment: "",
  status: "active",
};

const genderOptions = [
  "Femenino",
  "Masculino",
  "No binario",
  "Otro",
  "Prefiere no decir",
];

const healthInsuranceOptions = [
  "Fonasa",
  "Isapre",
  "Particular",
  "Otra",
  "No informado",
];

const civilStatusOptions = [
  "Soltera/o",
  "Casada/o",
  "Conviviente",
  "Separada/o",
  "Divorciada/o",
  "Viuda/o",
  "No informado",
];

const pronounOptions = [
  "Él / lo",
  "Ella / la",
  "Elle / le",
  "Prefiere no decir",
];

const customPronounsOption = "Otro";

export function PatientForm({
  cancelHref = "/pacientes",
  initialValues,
  mode = "create",
  patientId,
}: {
  cancelHref?: string;
  initialValues?: PatientFormState;
  mode?: "create" | "edit";
  patientId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<PatientFormState>(
    initialValues ?? initialForm,
  );
  const [pronounsMode, setPronounsMode] = useState(() =>
    getPronounsMode(initialValues?.pronouns ?? initialForm.pronouns),
  );
  const [errors, setErrors] = useState<PatientFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function updateField(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
  }

  function updatePronounsOption(event: ChangeEvent<HTMLSelectElement>) {
    const { value } = event.target;
    setPronounsMode(value);
    setForm((current) => ({
      ...current,
      pronouns: value === customPronounsOption ? "" : value,
    }));
    setErrors((current) => ({ ...current, pronouns: undefined, form: undefined }));
  }

  function updateCustomPronouns(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setForm((current) => ({ ...current, pronouns: value }));
    setErrors((current) => ({ ...current, pronouns: undefined, form: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "edit" && !patientId) {
      setErrors({ form: "No se encontro el id del paciente a editar." });
      return;
    }

    const validationErrors = validatePatient(form, pronounsMode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage(null);

    const user = await getAuthenticatedUser();
    const payload = toPatientPayload(form);
    const { error } =
      mode === "edit" && patientId
        ? await supabase
            .from("patients")
            .update(payload)
            .eq("id", patientId)
            .eq("user_id", user.id)
        : await supabase
            .from("patients")
            .insert({ ...payload, user_id: user.id });

    if (error) {
      setErrors({ form: error.message });
      setLoading(false);
      return;
    }

    if (mode === "create") {
      setForm(initialForm);
      setPronounsMode(getPronounsMode(initialForm.pronouns));
    }

    setSuccessMessage(
      mode === "edit" ? "Paciente actualizado correctamente." : "Paciente guardado.",
    );
    setLoading(false);

    window.setTimeout(() => {
      router.push(
        mode === "edit" && patientId ? `/pacientes/${patientId}` : "/pacientes",
      );
      router.refresh();
    }, 450);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6" noValidate>
      <FormSection title="Identificacion">
        <PatientInput label="Nombre" name="first_name" value={form.first_name} onChange={updateField} error={errors.first_name} required />
        <PatientInput label="Apellido" name="last_name" value={form.last_name} onChange={updateField} error={errors.last_name} required />
        <PatientPronounsField
          customValue={form.pronouns}
          error={errors.pronouns}
          mode={pronounsMode}
          onCustomChange={updateCustomPronouns}
          onModeChange={updatePronounsOption}
        />
        <PatientInput label="Fecha de nacimiento" name="birth_date" type="date" value={form.birth_date} onChange={updateField} />
        <PatientSelect label="Genero" name="gender" value={form.gender} onChange={updateField} options={genderOptions} placeholder="Seleccionar genero" />
        <PatientSelect label="Estado civil" name="civil_status" value={form.civil_status} onChange={updateField} options={civilStatusOptions} placeholder="Seleccionar estado civil" />
        <label className="block">
          <span className="text-sm font-semibold text-foreground">Estado</span>
          <select name="status" value={form.status} onChange={updateField} className={inputClassName}>
            <option value="active">Activo</option>
            <option value="paused">Pausado</option>
            <option value="discharged">Alta</option>
            <option value="inactive">Inactivo</option>
          </select>
        </label>
      </FormSection>

      <FormSection title="Contacto">
        <PatientInput label="Correo" name="email" value={form.email} onChange={updateField} error={errors.email} inputMode="email" placeholder="nombre@correo.cl" />
        <PatientInput label="Telefono" name="phone" value={form.phone} onChange={updateField} placeholder="+56 9 1234 5678" />
        <PatientInput label="Direccion" name="address" value={form.address} onChange={updateField} />
        <PatientSelect label="Prevision / seguro" name="health_insurance" value={form.health_insurance} onChange={updateField} options={healthInsuranceOptions} placeholder="Seleccionar prevision" />
        <PatientTimeInput label="Horario de atencion" name="appointment_schedule" value={form.appointment_schedule} onChange={updateField} />
        <PatientInput label="Contacto emergencia" name="emergency_contact_name" value={form.emergency_contact_name} onChange={updateField} />
        <PatientInput label="Telefono emergencia" name="emergency_contact_phone" value={form.emergency_contact_phone} onChange={updateField} />
      </FormSection>

      <FormSection title="Apoderado">
        <PatientInput label="Nombre apoderado" name="guardian_name" value={form.guardian_name} onChange={updateField} />
        <PatientInput label="Correo apoderado" name="guardian_email" value={form.guardian_email} onChange={updateField} error={errors.guardian_email} inputMode="email" />
        <PatientInput label="Telefono apoderado" name="guardian_phone" value={form.guardian_phone} onChange={updateField} />
      </FormSection>

      <FormSection title="Motivo de consulta">
        <PatientTextarea label="Motivo segun terapeuta" name="therapist_consultation_reason" value={form.therapist_consultation_reason} onChange={updateField} />
        <PatientTextarea label="Motivo segun paciente/consultante" name="client_consultation_reason" value={form.client_consultation_reason} onChange={updateField} />
        <PatientTextarea label="Objetivo co-construido" name="co_constructed_goal" value={form.co_constructed_goal} onChange={updateField} />
        <PatientTextarea label="Tratamiento previo" name="previous_treatment" value={form.previous_treatment} onChange={updateField} />
      </FormSection>

      <FormSection title="Area psicosocial">
        <PatientTextarea label="Composicion familiar" name="family_composition" value={form.family_composition} onChange={updateField} />
        <PatientTextarea label="Grupo de apoyo principal" name="primary_support_group" value={form.primary_support_group} onChange={updateField} />
        <PatientTextarea label="Entorno social" name="social_environment" value={form.social_environment} onChange={updateField} />
        <PatientTextarea label="Contexto educativo" name="education_context" value={form.education_context} onChange={updateField} />
        <PatientTextarea label="Contexto judicial" name="judicial_context" value={form.judicial_context} onChange={updateField} />
        <PatientTextarea label="Consumo de sustancias" name="substance_use" value={form.substance_use} onChange={updateField} />
        <PatientTextarea label="Historia de violencia" name="violence_history" value={form.violence_history} onChange={updateField} />
        <PatientTextarea label="Riesgo suicida" name="suicide_risk" value={form.suicide_risk} onChange={updateField} />
      </FormSection>

      {errors.form ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
          {errors.form}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
          {successMessage}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Link href={cancelHref} className="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-100 bg-white px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50">
          Cancelar
        </Link>
        <button type="submit" disabled={loading} className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-[#87304a] hover:text-white disabled:cursor-not-allowed disabled:opacity-70">
          {loading
            ? "Guardando..."
            : mode === "edit"
              ? "Guardar cambios"
              : "Guardar paciente"}
        </button>
      </div>
    </form>
  );
}

export function patientRowToFormState(patient: PatientRow): PatientFormState {
  return {
    first_name: patient.first_name ?? "",
    last_name: patient.last_name ?? "",
    pronouns: patient.pronouns ?? "",
    birth_date: patient.birth_date ?? "",
    gender: patient.gender ?? "",
    civil_status: patient.civil_status ?? "",
    email: patient.email ?? "",
    phone: patient.phone ?? "",
    address: patient.address ?? "",
    health_insurance: patient.health_insurance ?? "",
    emergency_contact_name: patient.emergency_contact_name ?? "",
    emergency_contact_phone: patient.emergency_contact_phone ?? "",
    appointment_schedule: patient.appointment_schedule ?? "",
    therapist_consultation_reason:
      patient.therapist_consultation_reason ?? "",
    client_consultation_reason: patient.client_consultation_reason ?? "",
    co_constructed_goal: patient.co_constructed_goal ?? "",
    guardian_name: patient.guardian_name ?? "",
    guardian_email: patient.guardian_email ?? "",
    guardian_phone: patient.guardian_phone ?? "",
    family_composition: patient.family_composition ?? "",
    primary_support_group: patient.primary_support_group ?? "",
    social_environment: patient.social_environment ?? "",
    education_context: patient.education_context ?? "",
    judicial_context: patient.judicial_context ?? "",
    substance_use: patient.substance_use ?? "",
    violence_history: patient.violence_history ?? "",
    suicide_risk: patient.suicide_risk ?? "",
    previous_treatment: patient.previous_treatment ?? "",
    status: patient.status ?? "active",
  };
}

const inputClassName =
  "mt-2 h-12 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand focus:ring-4 focus:ring-rose-100";

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm sm:p-7">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2">{children}</div>
    </section>
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
        className={inputClassName}
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

function PatientSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  name: keyof PatientFormState;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
}) {
  const hasLegacyValue = value.trim() && !options.includes(value);

  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={inputClassName}
      >
        <option value="">{placeholder}</option>
        {hasLegacyValue ? (
          <option value={value}>{value} (valor actual)</option>
        ) : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function PatientPronounsField({
  customValue,
  error,
  mode,
  onCustomChange,
  onModeChange,
}: {
  customValue: string;
  error?: string;
  mode: string;
  onCustomChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onModeChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}) {
  const errorId = "pronouns-error";

  return (
    <div className="block">
      <label className="block">
        <span className="text-sm font-semibold text-foreground">Pronombres</span>
        <select
          name="pronounsMode"
          value={mode}
          onChange={onModeChange}
          className={inputClassName}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        >
          <option value="">Seleccionar pronombres</option>
          {pronounOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          <option value={customPronounsOption}>{customPronounsOption}</option>
        </select>
      </label>

      {mode === customPronounsOption ? (
        <label className="mt-3 block">
          <span className="text-sm font-semibold text-foreground">
            Pronombres personalizados
          </span>
          <input
            name="pronouns"
            value={customValue}
            onChange={onCustomChange}
            placeholder="Ej: ella/elle, el/le..."
            className={inputClassName}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
          />
        </label>
      ) : null}

      {error ? (
        <p id={errorId} className="mt-2 text-sm text-rose-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PatientTimeInput({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: keyof PatientFormState;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const timeValue = getTimeInputValue(value);
  const hasLegacyValue = value.trim() && !timeValue;

  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <input
        name={name}
        type="time"
        value={timeValue}
        onChange={onChange}
        className={inputClassName}
      />
      {hasLegacyValue ? (
        <p className="mt-2 text-xs leading-5 text-muted">
          Valor actual: {value}. Selecciona una hora para normalizarlo.
        </p>
      ) : null}
    </label>
  );
}

function PatientTextarea({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: keyof PatientFormState;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "value" | "onChange">) {
  return (
    <label className="block md:col-span-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="mt-2 w-full resize-y rounded-2xl border border-rose-100 bg-white/95 px-4 py-3 text-sm leading-6 text-foreground shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand focus:ring-4 focus:ring-rose-100"
      />
    </label>
  );
}

function validatePatient(form: PatientFormState, pronounsMode: string) {
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

  if (form.guardian_email.trim() && !isValidEmail(form.guardian_email.trim())) {
    errors.guardian_email = "Ingresa un correo valido.";
  }

  if (pronounsMode === customPronounsOption && !form.pronouns.trim()) {
    errors.pronouns = "Escribe los pronombres personalizados o elige otra opcion.";
  }

  return errors;
}

function toPatientPayload(form: PatientFormState) {
  return Object.fromEntries(
    Object.entries(form).map(([key, value]) => [key, value.trim() || null]),
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getTimeInputValue(value: string) {
  const trimmedValue = value.trim();

  if (/^\d{2}:\d{2}$/.test(trimmedValue)) {
    return trimmedValue;
  }

  const timeWithSeconds = /^(\d{2}:\d{2}):\d{2}$/.exec(trimmedValue);
  return timeWithSeconds?.[1] ?? "";
}

function getPronounsMode(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  return pronounOptions.includes(trimmedValue)
    ? trimmedValue
    : customPronounsOption;
}
