"use client";

import { useRef, useState } from "react";
import { SessionPDFView } from "@/components/pdf/session-pdf-view";
import type { ClinicalTimelineSession } from "@/lib/clinical-session-types";

type SessionPDFExportButtonProps = {
  session: ClinicalTimelineSession;
  variant?: "primary" | "secondary";
};

export function SessionPDFExportButton({
  session,
  variant = "secondary",
}: SessionPDFExportButtonProps) {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    if (!pdfRef.current) {
      setError("No se pudo preparar el PDF.");
      return;
    }

    setExporting(true);
    setError(null);

    try {
      await exportSessionToPdf(pdfRef.current, session);
    } catch (exportError) {
      setError(
        exportError instanceof Error
          ? exportError.message
          : "No se pudo generar el PDF.",
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <div className="fixed left-[-10000px] top-0 -z-10 bg-white">
        <div ref={pdfRef}>
          <SessionPDFView session={session} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className={
            variant === "primary"
              ? "inline-flex h-10 items-center justify-center rounded-2xl bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-[#87304a] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
              : "inline-flex h-10 items-center justify-center rounded-2xl border border-rose-100 bg-white px-4 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
          }
        >
          {exporting ? "Generando..." : "Exportar PDF"}
        </button>
        {error ? <p className="text-xs leading-5 text-rose-800">{error}</p> : null}
      </div>
    </>
  );
}

export async function exportSessionToPdf(
  element: HTMLElement,
  session: ClinicalTimelineSession,
) {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
  });

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;
  const pixelsPerMm = canvas.width / contentWidth;
  const pageCanvasHeight = Math.floor(contentHeight * pixelsPerMm);
  let sourceY = 0;
  let pageIndex = 0;

  while (sourceY < canvas.height) {
    const sliceHeight = Math.min(pageCanvasHeight, canvas.height - sourceY);
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    const context = pageCanvas.getContext("2d");
    if (!context) {
      throw new Error("No se pudo preparar el canvas del PDF.");
    }

    context.drawImage(
      canvas,
      0,
      sourceY,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight,
    );

    if (pageIndex > 0) {
      pdf.addPage();
    }

    const imageHeight = sliceHeight / pixelsPerMm;
    pdf.addImage(
      pageCanvas.toDataURL("image/png"),
      "PNG",
      margin,
      margin,
      contentWidth,
      imageHeight,
    );

    sourceY += sliceHeight;
    pageIndex += 1;
  }

  pdf.save(getSessionPdfFileName(session));
}

function getSessionPdfFileName(session: ClinicalTimelineSession) {
  const patientName = sanitizeFilePart(session.patientName);
  const sessionDate = sanitizeFilePart(session.sessionDate ?? "sin-fecha");

  return `${patientName}_${sessionDate}.pdf`;
}

function sanitizeFilePart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
