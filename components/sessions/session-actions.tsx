type SessionActionsProps = {
  autoSaveLabel: string;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDraft: () => void;
};

export function SessionActions({
  autoSaveLabel,
  isDirty,
  isSaving,
  onSave,
  onDraft,
}: SessionActionsProps) {
  return (
    <div className="sticky bottom-20 z-10 rounded-3xl border border-rose-100 bg-white/90 p-4 shadow-lg shadow-rose-100/50 backdrop-blur lg:bottom-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {autoSaveLabel}
          {isDirty ? " / cambios sin guardar" : ""}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onDraft}
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-100 bg-white px-5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "Guardando..." : "Guardar como borrador"}
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-[#87304a] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? "Guardando..." : "Guardar sesion"}
          </button>
        </div>
      </div>
    </div>
  );
}
