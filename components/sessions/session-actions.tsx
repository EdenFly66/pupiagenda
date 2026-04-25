import type { ReactNode } from "react";
import type { ClinicalSessionStatus } from "@/lib/clinical-session-types";

type SessionActionsProps = {
  autoSaveLabel: string;
  isDirty: boolean;
  mode?: "create" | "edit";
  savingStatus: ClinicalSessionStatus | null;
  savingChanges: boolean;
  onSave: (status: ClinicalSessionStatus) => void;
  onSaveChanges?: () => void;
};

export function SessionActions({
  autoSaveLabel,
  isDirty,
  mode = "create",
  savingStatus,
  savingChanges,
  onSave,
  onSaveChanges,
}: SessionActionsProps) {
  const isSaving = savingStatus !== null || savingChanges;

  return (
    <div className="sticky bottom-20 z-10 rounded-3xl border border-rose-100 bg-white/90 p-4 shadow-lg shadow-rose-100/50 backdrop-blur lg:bottom-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {autoSaveLabel}
          {isDirty ? " / cambios sin guardar" : ""}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-row">
          {mode === "edit" && onSaveChanges ? (
            <ActionButton
              disabled={isSaving}
              loading={savingChanges}
              onClick={onSaveChanges}
              variant="secondary"
            >
              Guardar cambios
            </ActionButton>
          ) : null}
          <ActionButton
            disabled={isSaving}
            loading={savingStatus === "draft"}
            onClick={() => onSave("draft")}
            variant="secondary"
          >
            {mode === "edit" ? "Guardar como borrador" : "Guardar borrador"}
          </ActionButton>
          <ActionButton
            disabled={isSaving}
            loading={savingStatus === "cancelled"}
            onClick={() => onSave("cancelled")}
            variant="softDanger"
          >
            Cancelar sesion
          </ActionButton>
          <ActionButton
            disabled={isSaving}
            loading={savingStatus === "no_show"}
            onClick={() => onSave("no_show")}
            variant="outline"
          >
            No asistio
          </ActionButton>
          <ActionButton
            disabled={isSaving}
            loading={savingStatus === "completed"}
            onClick={() => onSave("completed")}
            variant="primary"
          >
            Finalizar sesion
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  disabled,
  loading,
  onClick,
  variant,
}: {
  children: ReactNode;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
  variant: "primary" | "secondary" | "softDanger" | "outline";
}) {
  const styles: Record<typeof variant, string> = {
    primary:
      "bg-brand text-brand-foreground shadow-sm hover:bg-[#87304a] hover:text-white",
    secondary:
      "border border-rose-100 bg-white text-foreground shadow-sm hover:bg-rose-50",
    softDanger:
      "border border-rose-200 bg-rose-50 text-rose-900 shadow-sm hover:bg-rose-100",
    outline:
      "border border-violet-200 bg-white text-violet-900 shadow-sm hover:bg-violet-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${styles[variant]}`}
    >
      {loading ? "Guardando..." : children}
    </button>
  );
}
