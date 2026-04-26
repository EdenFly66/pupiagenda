"use client";

import {
  getPatientDocumentTypeLabel,
  type PatientDocumentRow,
} from "@/lib/patient-document-types";

type DocumentCardProps = {
  document: PatientDocumentRow;
  deleting: boolean;
  downloading: boolean;
  onDelete: (document: PatientDocumentRow) => void;
  onDownload: (document: PatientDocumentRow) => void;
};

export function DocumentCard({
  document,
  deleting,
  downloading,
  onDelete,
  onDownload,
}: DocumentCardProps) {
  return (
    <article className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-base font-semibold text-foreground">
              {displayValue(document.title)}
            </h4>
            <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-900">
              {getPatientDocumentTypeLabel(document.document_type)}
            </span>
          </div>
          <dl className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-3">
            <Detail label="Archivo" value={displayValue(document.file_name)} />
            <Detail label="Tamano" value={formatFileSize(document.file_size_bytes)} />
            <Detail label="Subido" value={formatDocumentDate(document.created_at)} />
          </dl>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          <button
            type="button"
            onClick={() => onDownload(document)}
            disabled={downloading || !document.file_path}
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-rose-100 bg-white px-4 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {downloading ? "Preparando..." : "Descargar"}
          </button>
          <button
            type="button"
            onClick={() => onDelete(document)}
            disabled={deleting}
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-900 shadow-sm transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-normal text-muted">
        {label}
      </dt>
      <dd className="mt-1 break-words text-foreground">{value}</dd>
    </div>
  );
}

function displayValue(value: string | null | undefined) {
  return value?.trim() || "No registrado";
}

function formatFileSize(value: number | null) {
  if (!value) {
    return "No registrado";
  }

  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDocumentDate(value: string | null) {
  if (!value) {
    return "No registrado";
  }

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
