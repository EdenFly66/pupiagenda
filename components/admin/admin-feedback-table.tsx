"use client";

import { Inbox, LayoutDashboard, ListChecks, Map, Plus, ShieldCheck, Trash2, TriangleAlert } from "lucide-react";
import type { DragEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminFeedbackNotes } from "@/components/admin/admin-feedback-notes";
import { AdminFeedbackStatusSelect } from "@/components/admin/admin-feedback-status-select";
import { SectionCard } from "@/components/ui/section-card";
import {
  createProductVersion,
  deleteProductVersion,
  getAdminFeedback,
  getProductVersions,
  updateAdminFeedbackPriority,
  updateAdminFeedbackStatus,
  updateAdminFeedbackVersion,
} from "@/lib/admin";
import {
  adminFeedbackPriorities,
  adminFeedbackStatuses,
  adminFeedbackPriorityLabels,
  adminFeedbackStatusLabels,
  formatAdminFeedbackDate,
  type AdminFeedbackItem,
  type AdminFeedbackPriority,
  type AdminFeedbackStatus,
  type ProductVersion,
} from "@/lib/admin-types";
import { cn } from "@/lib/utils";

type AdminFeedbackView = "kanban" | "roadmap" | "manage";

export function AdminFeedbackTable() {
  const [items, setItems] = useState<AdminFeedbackItem[]>([]);
  const [versions, setVersions] = useState<ProductVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<AdminFeedbackView>("kanban");

  useEffect(() => {
    let active = true;

    async function loadFeedback() {
      setLoading(true);
      setError(null);

      try {
        const [feedback, productVersions] = await Promise.all([
          getAdminFeedback(),
          getProductVersions(),
        ]);

        if (!active) {
          return;
        }

        setItems(feedback);
        setVersions(productVersions);
      } catch {
        if (!active) {
          return;
        }

        setItems([]);
        setError("No pudimos cargar las sugerencias del panel admin.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFeedback();

    return () => {
      active = false;
    };
  }, []);

  const refreshFeedback = useCallback(async () => {
    try {
      const feedback = await getAdminFeedback();
      setItems(feedback);
    } catch {
      throw new Error("El cambio se guardo, pero no pudimos refrescar la lista.");
    }
  }, []);

  const refreshVersions = useCallback(async () => {
    const productVersions = await getProductVersions();
    setVersions(productVersions);
  }, []);

  if (loading) {
    return <AdminFeedbackLoading />;
  }

  if (error) {
    return <AdminFeedbackError message={error} />;
  }

  if (items.length === 0) {
    return <AdminFeedbackEmpty />;
  }

  return (
    <div className="space-y-4">
      <ViewSwitcher value={view} onChange={setView} />

      {view === "kanban" ? (
        <AdminFeedbackKanban items={items} setItems={setItems} versions={versions} />
      ) : view === "roadmap" ? (
        <AdminFeedbackRoadmap
          items={items}
          setItems={setItems}
          versions={versions}
          onVersionsChanged={refreshVersions}
        />
      ) : (
        <AdminFeedbackManage
          items={items}
          refreshFeedback={refreshFeedback}
          versions={versions}
        />
      )}
    </div>
  );
}

function ViewSwitcher({
  onChange,
  value,
}: {
  onChange: (view: AdminFeedbackView) => void;
  value: AdminFeedbackView;
}) {
  const options: Array<{
    icon: typeof LayoutDashboard;
    label: string;
    value: AdminFeedbackView;
  }> = [
    { icon: LayoutDashboard, label: "Kanban", value: "kanban" },
    { icon: Map, label: "Roadmap", value: "roadmap" },
    { icon: ListChecks, label: "Gestion", value: "manage" },
  ];

  return (
    <div className="inline-grid w-full grid-cols-3 gap-1 rounded-2xl border border-border bg-background p-1 sm:w-auto">
      {options.map((option) => {
        const active = value === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-rose-soft",
              active
                ? "bg-brand text-brand-foreground shadow-sm"
                : "text-muted hover:bg-leaf-soft hover:text-leaf-strong",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function AdminFeedbackKanban({
  items,
  setItems,
  versions,
}: {
  items: AdminFeedbackItem[];
  setItems: (items: AdminFeedbackItem[]) => void;
  versions: ProductVersion[];
}) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [prioritySavingId, setPrioritySavingId] = useState<string | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);
  const groupedItems = useMemo(() => groupByStatus(items), [items]);

  async function moveFeedback(feedbackId: string, nextStatus: AdminFeedbackStatus) {
    const currentItem = items.find((item) => item.id === feedbackId);

    if (!currentItem || currentItem.status === nextStatus) {
      return;
    }

    const previousItems = items;
    setMoveError(null);
    setMovingId(feedbackId);
    setItems(
      items.map((item) =>
        item.id === feedbackId ? { ...item, status: nextStatus } : item,
      ),
    );

    try {
      await updateAdminFeedbackStatus(feedbackId, nextStatus);
      const feedback = await getAdminFeedback();
      setItems(feedback);
    } catch (error) {
      setItems(previousItems);
      setMoveError(
        error instanceof Error
          ? error.message
          : "No se pudo mover la sugerencia.",
      );
    } finally {
      setMovingId(null);
      setDraggedId(null);
    }
  }

  async function changePriority(
    feedbackId: string,
    nextPriority: AdminFeedbackPriority,
  ) {
    const currentItem = items.find((item) => item.id === feedbackId);

    if (!currentItem || currentItem.priority === nextPriority) {
      return;
    }

    const previousItems = items;
    setMoveError(null);
    setPrioritySavingId(feedbackId);
    setItems(
      items.map((item) =>
        item.id === feedbackId ? { ...item, priority: nextPriority } : item,
      ),
    );

    try {
      await updateAdminFeedbackPriority(feedbackId, nextPriority);
      const feedback = await getAdminFeedback();
      setItems(feedback);
    } catch (error) {
      setItems(previousItems);
      setMoveError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la prioridad.",
      );
    } finally {
      setPrioritySavingId(null);
    }
  }

  function handleDrop(event: DragEvent<HTMLElement>, status: AdminFeedbackStatus) {
    event.preventDefault();
    const feedbackId = event.dataTransfer.getData("text/plain") || draggedId;

    if (feedbackId) {
      void moveFeedback(feedbackId, status);
    }
  }

  return (
    <div className="space-y-3">
      {moveError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
          {moveError}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-6">
        {adminFeedbackStatuses.map((status) => (
          <section
            key={status}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, status)}
            className="min-h-80 rounded-3xl border border-rose-100 bg-white/80 p-3 shadow-sm"
            aria-label={`Columna ${adminFeedbackStatusLabels[status]}`}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-foreground">
                {adminFeedbackStatusLabels[status]}
              </h2>
              <span className="rounded-full bg-rose-soft px-2.5 py-1 text-xs font-semibold text-brand-active">
                {groupedItems[status].length}
              </span>
            </div>

            <div className="space-y-3">
              {groupedItems[status].length === 0 ? (
                <div className="rounded-2xl border border-dashed border-rose-100 bg-background p-4 text-center text-xs leading-5 text-muted">
                  Sin sugerencias
                </div>
              ) : (
                groupedItems[status].map((item) => (
                  <FeedbackKanbanCard
                    key={item.id}
                    item={item}
                    moving={movingId === item.id}
                    prioritySaving={prioritySavingId === item.id}
                    versions={versions}
                    onPriorityChange={(priority) => {
                      void changePriority(item.id, priority);
                    }}
                    onDragStart={(event) => {
                      setDraggedId(item.id);
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", item.id);
                    }}
                  />
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function FeedbackKanbanCard({
  item,
  moving,
  onDragStart,
  onPriorityChange,
  prioritySaving,
  versions,
}: {
  item: AdminFeedbackItem;
  moving: boolean;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onPriorityChange: (priority: AdminFeedbackPriority) => void;
  prioritySaving: boolean;
  versions: ProductVersion[];
}) {
  return (
    <article
      draggable
      onDragStart={onDragStart}
      className={cn(
        "cursor-grab rounded-2xl border border-rose-100 bg-background p-3 shadow-sm transition active:cursor-grabbing",
        moving && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">
          {item.title}
        </h3>
        <KanbanPrioritySelect
          disabled={prioritySaving}
          value={item.priority}
          onChange={onPriorityChange}
        />
      </div>
      <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted">
        {item.message || "Sin descripcion."}
      </p>
      <div className="mt-3 space-y-1.5 border-t border-rose-100 pt-3 text-xs text-muted">
        <p className="truncate">{item.email}</p>
        <p className="truncate">Categoria: {item.category}</p>
        <p className="truncate">
          Version: {getVersionLabel(item.versionId, versions)}
        </p>
        <p>{formatAdminFeedbackDate(item.createdAt)}</p>
      </div>
    </article>
  );
}

function KanbanPrioritySelect({
  disabled,
  onChange,
  value,
}: {
  disabled: boolean;
  onChange: (priority: AdminFeedbackPriority) => void;
  value: string;
}) {
  return (
    <label
      className="shrink-0"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <span className="sr-only">Prioridad</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value as AdminFeedbackPriority)
        }
        className="h-8 rounded-full border border-rose-100 bg-white px-2 text-[11px] font-semibold text-brand-active shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-rose-soft disabled:cursor-wait disabled:opacity-70"
      >
        {adminFeedbackPriorities.some((option) => option === value) ? null : (
          <option value={value} disabled>
            {value}
          </option>
        )}
        {adminFeedbackPriorities.map((priority) => (
          <option key={priority} value={priority}>
            {adminFeedbackPriorityLabels[priority]}
          </option>
        ))}
      </select>
    </label>
  );
}

function AdminFeedbackRoadmap({
  items,
  onVersionsChanged,
  setItems,
  versions,
}: {
  items: AdminFeedbackItem[];
  onVersionsChanged: () => Promise<void>;
  setItems: (items: AdminFeedbackItem[]) => void;
  versions: ProductVersion[];
}) {
  const [newVersionName, setNewVersionName] = useState("");
  const [savingVersion, setSavingVersion] = useState(false);
  const [versionSavingId, setVersionSavingId] = useState<string | null>(null);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);
  const groupedItems = useMemo(
    () => groupByVersionId(items, versions),
    [items, versions],
  );
  const backlogItems = useMemo(
    () => items.filter((item) => item.status !== "done" && item.status !== "rejected"),
    [items],
  );

  async function handleCreateVersion() {
    setRoadmapError(null);
    setSavingVersion(true);

    try {
      await createProductVersion(newVersionName);
      setNewVersionName("");
      await onVersionsChanged();
    } catch (error) {
      setRoadmapError(
        error instanceof Error ? error.message : "No se pudo crear la version.",
      );
    } finally {
      setSavingVersion(false);
    }
  }

  async function handleDeleteVersion(versionId: string) {
    setRoadmapError(null);
    setSavingVersion(true);

    try {
      await deleteProductVersion(versionId);
      setItems(
        items.map((item) =>
          item.versionId === versionId ? { ...item, versionId: null } : item,
        ),
      );
      await onVersionsChanged();
    } catch (error) {
      setRoadmapError(
        error instanceof Error ? error.message : "No se pudo eliminar la version.",
      );
    } finally {
      setSavingVersion(false);
    }
  }

  async function handleAssignVersion(feedbackId: string, versionId: string | null) {
    const previousItems = items;

    setRoadmapError(null);
    setVersionSavingId(feedbackId);
    setItems(
      items.map((item) =>
        item.id === feedbackId ? { ...item, versionId } : item,
      ),
    );

    try {
      await updateAdminFeedbackVersion(feedbackId, versionId);
      const feedback = await getAdminFeedback();
      setItems(feedback);
    } catch (error) {
      setItems(previousItems);
      setRoadmapError(
        error instanceof Error
          ? error.message
          : "No se pudo asignar la version.",
      );
    } finally {
      setVersionSavingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-rose-100 bg-white/90 p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block flex-1">
            <span className="text-sm font-semibold text-foreground">
              Nueva version
            </span>
            <input
              value={newVersionName}
              onChange={(event) => setNewVersionName(event.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-rose-100 bg-white px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-placeholder focus:border-brand focus:ring-4 focus:ring-rose-soft"
              placeholder="Ej: V2.3 Agenda"
            />
          </label>
          <button
            type="button"
            onClick={handleCreateVersion}
            disabled={savingVersion || newVersionName.trim().length < 2}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover hover:text-brand-foreground active:bg-brand-active disabled:cursor-not-allowed disabled:bg-rose-soft disabled:text-brand-active"
          >
            <Plus className="size-4" aria-hidden="true" />
            Crear version
          </button>
        </div>
        {roadmapError ? (
          <p className="mt-3 text-sm leading-6 text-rose-900">{roadmapError}</p>
        ) : null}
      </div>

      <section className="rounded-3xl border border-rose-100 bg-white/90 p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Backlog
            </h2>
            <p className="text-sm leading-6 text-muted">
              Todo lo pendiente: features que aun no estan completadas ni rechazadas.
            </p>
          </div>
          <span className="w-fit rounded-full bg-rose-soft px-2.5 py-1 text-xs font-semibold text-brand-active">
            {backlogItems.length}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {backlogItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-100 bg-background p-5 text-center text-sm leading-6 text-muted">
              No hay features pendientes
            </div>
          ) : (
            backlogItems.map((item) => (
              <RoadmapFeedbackCard
                key={`backlog-${item.id}`}
                item={item}
                saving={versionSavingId === item.id}
                versions={versions}
                onAssignVersion={handleAssignVersion}
              />
            ))
          )}
        </div>
      </section>

      <div>
        <h2 className="mb-3 text-base font-semibold text-foreground">
          Roadmap por version
        </h2>
        <p className="mb-4 text-sm leading-6 text-muted">
          Planificacion concreta por version. Las features sin version quedan pendientes de planificacion.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <RoadmapColumn
          items={groupedItems.unassigned}
          description="Pendiente de planificacion"
          title="Sin version"
          versions={versions}
          versionSavingId={versionSavingId}
          onAssignVersion={handleAssignVersion}
        />

        {versions.map((version) => (
          <RoadmapColumn
            key={version.id}
            items={groupedItems.byVersion[version.id] ?? []}
            title={version.name}
            version={version}
            versions={versions}
            versionSavingId={versionSavingId}
            onAssignVersion={handleAssignVersion}
            onDeleteVersion={handleDeleteVersion}
          />
        ))}
      </div>
    </div>
  );
}

function RoadmapColumn({
  description,
  items,
  onAssignVersion,
  onDeleteVersion,
  title,
  version,
  versionSavingId,
  versions,
}: {
  description?: string;
  items: AdminFeedbackItem[];
  onAssignVersion: (feedbackId: string, versionId: string | null) => void;
  onDeleteVersion?: (versionId: string) => void;
  title: string;
  version?: ProductVersion;
  versionSavingId: string | null;
  versions: ProductVersion[];
}) {
  return (
    <section className="rounded-3xl border border-rose-100 bg-white/90 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-foreground">
            {title}
          </h2>
          {description || version?.description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
              {description ?? version?.description}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-rose-soft px-2.5 py-1 text-xs font-semibold text-brand-active">
            {items.length}
          </span>
          {version && onDeleteVersion ? (
            <button
              type="button"
              onClick={() => onDeleteVersion(version.id)}
              className="inline-flex size-8 items-center justify-center rounded-full border border-rose-100 bg-white text-muted transition hover:border-rose-200 hover:text-rose-900"
              aria-label={`Eliminar version ${version.name}`}
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-rose-100 bg-background p-5 text-center text-sm leading-6 text-muted">
            Sin items planificados
          </div>
        ) : (
          items.map((item) => (
            <RoadmapFeedbackCard
              key={item.id}
              item={item}
              saving={versionSavingId === item.id}
              versions={versions}
              onAssignVersion={onAssignVersion}
            />
          ))
        )}
      </div>
    </section>
  );
}

function RoadmapFeedbackCard({
  item,
  onAssignVersion,
  saving,
  versions,
}: {
  item: AdminFeedbackItem;
  onAssignVersion: (feedbackId: string, versionId: string | null) => void;
  saving: boolean;
  versions: ProductVersion[];
}) {
  return (
    <article className="rounded-2xl border border-rose-100 bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-5 text-foreground">
          {item.title}
        </h3>
        <StatusPill status={item.status} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
        {item.message || "Sin descripcion."}
      </p>
      <label className="mt-3 block">
        <span className="text-xs font-semibold uppercase tracking-normal text-muted">
          Version
        </span>
        <select
          value={item.versionId ?? ""}
          disabled={saving}
          onChange={(event) =>
            onAssignVersion(item.id, event.target.value || null)
          }
          className="mt-2 h-10 w-full rounded-2xl border border-rose-100 bg-white px-3 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-rose-soft disabled:cursor-wait disabled:bg-neutral-soft"
        >
          <option value="">Sin version</option>
          {versions.map((version) => (
            <option key={version.id} value={version.id}>
              {version.name}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <PriorityPill priority={item.priority} />
        <span className="rounded-full border border-rose-100 bg-white px-3 py-1 text-xs font-semibold text-muted">
          {item.category}
        </span>
      </div>
      {item.adminDecision ? (
        <p className="mt-3 rounded-2xl bg-leaf-soft p-3 text-xs leading-5 text-leaf-strong">
          {item.adminDecision}
        </p>
      ) : null}
    </article>
  );
}

function AdminFeedbackManage({
  items,
  refreshFeedback,
  versions,
}: {
  items: AdminFeedbackItem[];
  refreshFeedback: () => Promise<void>;
  versions: ProductVersion[];
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-sm"
        >
          <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
            <div className="min-w-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted">{item.email}</p>
                  <h2 className="mt-1 text-lg font-semibold leading-7 text-foreground">
                    {item.title}
                  </h2>
                </div>
                <StatusPill status={item.status} />
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted">
                {item.message}
              </p>

              <dl className="mt-5 grid gap-3 border-t border-rose-100 pt-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
                <Metadata label="Categoria" value={item.category} />
                <Metadata label="Prioridad" value={formatPriority(item.priority)} />
                <Metadata
                  label="Version"
                  value={getVersionLabel(item.versionId, versions)}
                />
                <Metadata
                  label="Creada"
                  value={formatAdminFeedbackDate(item.createdAt)}
                />
              </dl>
            </div>

            <div className="space-y-4 rounded-3xl border border-rose-100 bg-background p-4">
              <AdminFeedbackStatusSelect
                key={`${item.id}-${item.status}-${item.priority}-${item.versionId ?? "none"}`}
                feedbackId={item.id}
                priority={item.priority}
                status={item.status}
                versionId={item.versionId}
                versions={versions}
                onSaved={refreshFeedback}
              />
              <AdminFeedbackNotes
                key={`${item.id}-${item.adminNotes}-${item.adminDecision}`}
                adminDecision={item.adminDecision}
                adminNotes={item.adminNotes}
                feedbackId={item.id}
                onSaved={refreshFeedback}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const label =
    adminFeedbackStatusLabels[status as AdminFeedbackStatus] ?? status;

  return (
    <span className="inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-full border border-leaf bg-leaf-soft px-3 text-xs font-semibold text-leaf-strong">
      <ShieldCheck className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

function PriorityPill({ priority }: { priority: string }) {
  return (
    <span className="shrink-0 rounded-full border border-rose-100 bg-white px-2 py-1 text-[11px] font-semibold text-brand-active">
      {formatPriority(priority)}
    </span>
  );
}

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/70 px-3 py-2">
      <dt className="text-xs font-semibold uppercase tracking-normal text-muted">
        {label}
      </dt>
      <dd className="mt-1 truncate font-medium text-foreground">{value}</dd>
    </div>
  );
}

function formatPriority(value: string) {
  return adminFeedbackPriorityLabels[value as AdminFeedbackPriority] ?? value;
}

function groupByStatus(items: AdminFeedbackItem[]) {
  return adminFeedbackStatuses.reduce(
    (groups, status) => {
      groups[status] = items.filter((item) => item.status === status);
      return groups;
    },
    {} as Record<AdminFeedbackStatus, AdminFeedbackItem[]>,
  );
}

function getVersionLabel(versionId: string | null, versions: ProductVersion[]) {
  if (!versionId) return "Sin version";
  return versions.find((version) => version.id === versionId)?.name ?? "Sin version";
}

function groupByVersionId(items: AdminFeedbackItem[], versions: ProductVersion[]) {
  const versionIds = new Set(versions.map((version) => version.id));

  return {
    unassigned: items.filter(
      (item) => !item.versionId || !versionIds.has(item.versionId),
    ),
    byVersion: versions.reduce(
      (groups, version) => {
        groups[version.id] = items.filter((item) => item.versionId === version.id);
        return groups;
      },
      {} as Record<string, AdminFeedbackItem[]>,
    ),
  };
}

function AdminFeedbackLoading() {
  return (
    <div className="space-y-4" aria-label="Cargando sugerencias admin">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-3xl border border-rose-100 bg-white/70"
        />
      ))}
    </div>
  );
}

function AdminFeedbackEmpty() {
  return (
    <SectionCard className="rounded-3xl border-dashed border-rose-200 bg-white/80">
      <div className="py-6 text-center">
        <Inbox className="mx-auto size-9 text-brand-active" aria-hidden="true" />
        <h2 className="mt-3 text-base font-semibold text-foreground">
          No hay sugerencias
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          Cuando las usuarias envien sugerencias, apareceran en este panel.
        </p>
      </div>
    </SectionCard>
  );
}

function AdminFeedbackError({ message }: { message: string }) {
  return (
    <SectionCard className="rounded-3xl border-rose-200 bg-white/90">
      <div className="py-6 text-center">
        <TriangleAlert className="mx-auto size-9 text-brand-active" aria-hidden="true" />
        <h2 className="mt-3 text-base font-semibold text-foreground">
          No se pudo cargar el panel
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          {message}
        </p>
      </div>
    </SectionCard>
  );
}
