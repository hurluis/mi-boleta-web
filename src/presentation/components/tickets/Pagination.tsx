"use client";

import type { PaginationMeta } from "@/domain/value-objects/Pagination";
import { Button } from "@/presentation/components/ui/Button";

type Props = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
};

export function Pagination({ meta, onPageChange }: Props) {
  if (meta.totalPages <= 1) return null;

  const canPrev = meta.page > 1;
  const canNext = meta.page < meta.totalPages;
  const start = (meta.page - 1) * meta.pageSize + 1;
  const end = Math.min(meta.page * meta.pageSize, meta.total);

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-col items-center justify-between gap-3 rounded-lg border border-soft bg-surface px-4 py-3 sm:flex-row"
    >
      <p className="text-xs text-muted">
        Mostrando <span className="font-semibold text-strong">{start}</span>-
        <span className="font-semibold text-strong">{end}</span> de{" "}
        <span className="font-semibold text-strong">{meta.total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(meta.page - 1)}
        >
          Anterior
        </Button>
        <span className="text-sm font-medium text-strong">
          {meta.page} / {meta.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </nav>
  );
}
