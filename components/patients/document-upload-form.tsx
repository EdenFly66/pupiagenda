"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import {
  patientDocumentTypeLabels,
  patientDocumentTypes,
  type PatientDocumentRow,
  type PatientDocumentType,
} from "@/lib/patient-document-types";
import { getAuthenticatedUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const bucketName = "patient-documents";
const maxFileSizeBytes = 10 * 1024 * 1024;
const allowedFileTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
]);

type DocumentUploadFormProps = {
  patientId: string;
  onUploaded: (document: PatientDocumentRow) => void;
};

export function DocumentUploadForm({
  patientId,
  onUploaded,
}: DocumentUploadFormProps) {
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] =
    useState<PatientDocumentType>("ficha_ingreso");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function updateFile(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateUpload(title, file);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!file) {
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const user = await getAuthenticatedUser();
    const documentId = crypto.randomUUID();
    const fileName = file.name;
    const filePath = `${patientId}/${documentId}/${sanitizeFileName(fileName)}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const payload: PatientDocumentRow = {
      id: documentId,
      patient_id: patientId,
      user_id: user.id,
      title: title.trim(),
      document_type: documentType,
      file_name: fileName,
      file_path: filePath,
      file_type: file.type,
      file_size_bytes: file.size,
      created_at: new Date().toISOString(),
    };

    const { data, error: insertError } = await supabase
      .from("patient_documents")
      .insert(payload)
      .select()
      .single();

    if (insertError) {
      await supabase.storage.from(bucketName).remove([filePath]);
      setError(insertError.message);
      setUploading(false);
      return;
    }

    onUploaded((data as PatientDocumentRow | null) ?? payload);
    setTitle("");
    setDocumentType("ficha_ingreso");
    setFile(null);
    setSuccess("Documento subido correctamente.");
    setUploading(false);
    event.currentTarget.reset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm"
      noValidate
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <label className="block">
          <span className="text-sm font-semibold text-foreground">
            Titulo <span className="text-brand">*</span>
          </span>
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setError(null);
              setSuccess(null);
            }}
            className={inputClassName}
            placeholder="Ej: Consentimiento firmado"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-foreground">Tipo</span>
          <select
            value={documentType}
            onChange={(event) =>
              setDocumentType(event.target.value as PatientDocumentType)
            }
            className={inputClassName}
          >
            {patientDocumentTypes.map((type) => (
              <option key={type} value={type}>
                {patientDocumentTypeLabels[type]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-foreground">
          Archivo <span className="text-brand">*</span>
        </span>
        <input
          onChange={updateFile}
          type="file"
          accept=".pdf,.docx,.png,.jpg,.jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg"
          className="mt-2 w-full rounded-2xl border border-dashed border-rose-200 bg-[#fffaf8] px-4 py-4 text-sm text-foreground file:mr-4 file:rounded-2xl file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-foreground hover:file:bg-[#87304a]"
        />
        <span className="mt-2 block text-xs leading-5 text-muted">
          PDF, DOCX, PNG o JPG. Maximo 10 MB.
        </span>
      </label>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-900">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
          {success}
        </div>
      ) : null}

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={uploading}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-[#87304a] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {uploading ? "Subiendo..." : "Subir documento"}
        </button>
      </div>
    </form>
  );
}

const inputClassName =
  "mt-2 h-11 w-full rounded-2xl border border-rose-100 bg-white/95 px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-stone-400 focus:border-brand focus:ring-4 focus:ring-rose-100";

function validateUpload(title: string, file: File | null) {
  if (!title.trim()) {
    return "El titulo es obligatorio.";
  }

  if (!file) {
    return "Selecciona un archivo para subir.";
  }

  if (!allowedFileTypes.has(file.type)) {
    return "Formato no permitido. Usa PDF, DOCX, PNG, JPG o JPEG.";
  }

  if (file.size > maxFileSizeBytes) {
    return "El archivo supera el maximo permitido de 10 MB.";
  }

  return null;
}

function sanitizeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
