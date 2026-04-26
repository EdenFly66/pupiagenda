"use client";

import { useEffect, useState } from "react";
import { DocumentCard } from "@/components/patients/document-card";
import { DocumentUploadForm } from "@/components/patients/document-upload-form";
import {
  patientDocumentSelectColumns,
  type PatientDocumentRow,
} from "@/lib/patient-document-types";
import { getAuthenticatedUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const bucketName = "patient-documents";

export function PatientDocumentsSection({ patientId }: { patientId: string }) {
  const [documents, setDocuments] = useState<PatientDocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDocuments() {
      setLoading(true);
      setError(null);

      const user = await getAuthenticatedUser();
      const { data, error: queryError } = await supabase
        .from("patient_documents")
        .select(patientDocumentSelectColumns)
        .eq("patient_id", patientId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) {
        return;
      }

      if (queryError) {
        setDocuments([]);
        setError(queryError.message);
      } else {
        setDocuments((data as PatientDocumentRow[] | null) ?? []);
      }

      setLoading(false);
    }

    loadDocuments();

    return () => {
      active = false;
    };
  }, [patientId]);

  function handleUploaded(document: PatientDocumentRow) {
    setDocuments((current) => [document, ...current]);
    setSuccess("Documento agregado a la ficha.");
    setError(null);
  }

  async function downloadDocument(document: PatientDocumentRow) {
    if (!document.file_path) {
      setError("Este documento no tiene una ruta de archivo registrada.");
      return;
    }

    setDownloadingId(document.id);
    setError(null);
    setSuccess(null);

    await getAuthenticatedUser();
    const { data, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(document.file_path, 60);

    if (signedUrlError || !data?.signedUrl) {
      setError(signedUrlError?.message ?? "No se pudo generar el enlace de descarga.");
      setDownloadingId(null);
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    setDownloadingId(null);
  }

  async function deleteDocument(document: PatientDocumentRow) {
    const confirmed = window.confirm(
      `Eliminar "${document.title ?? document.file_name ?? "documento"}"? Esta accion no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(document.id);
    setError(null);
    setSuccess(null);

    const user = await getAuthenticatedUser();
    if (document.file_path) {
      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([document.file_path]);

      if (storageError) {
        setError(storageError.message);
        setDeletingId(null);
        return;
      }
    }

    const { error: deleteError } = await supabase
      .from("patient_documents")
      .delete()
      .eq("id", document.id)
      .eq("user_id", user.id);

    if (deleteError) {
      setError(deleteError.message);
      setDeletingId(null);
      return;
    }

    setDocuments((current) => current.filter((item) => item.id !== document.id));
    setSuccess("Documento eliminado.");
    setDeletingId(null);
  }

  return (
    <section className="rounded-3xl border border-rose-100 bg-[#fffaf8] p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-foreground">Documentos</h3>
        <p className="text-sm leading-6 text-muted">
          Adjuntos privados de la ficha. Los enlaces de descarga son temporales.
        </p>
      </div>

      <div className="mt-5">
        <DocumentUploadForm patientId={patientId} onUploaded={handleUploaded} />
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
          {success}
        </div>
      ) : null}

      <div className="mt-6">
        {loading ? (
          <DocumentsLoading />
        ) : documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                deleting={deletingId === document.id}
                downloading={downloadingId === document.id}
                onDelete={(item) => void deleteDocument(item)}
                onDownload={(item) => void downloadDocument(item)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-rose-200 bg-white/70 p-8 text-center">
            <p className="font-semibold">Sin documentos adjuntos.</p>
            <p className="mt-2 text-sm text-muted">
              Sube consentimientos, informes o material relevante para esta ficha.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function DocumentsLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="h-32 animate-pulse rounded-3xl border border-rose-100 bg-white/70"
        />
      ))}
    </div>
  );
}
