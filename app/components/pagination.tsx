"use client";

import React from "react";

export default function Pagination({
  page,
  size,
  total,
  onPageChange,
  onSizeChange,
  pageSizeOptions = [2, 10, 20, 50],
}: {
  page: number;
  size: number;
  total: number;
  onPageChange: (p: number) => void;
  onSizeChange: (s: number) => void;
  pageSizeOptions?: number[];
}) {
  const totalPages = Math.max(1, Math.ceil(total / size));

  const go = (p: number) => {
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    if (p !== page) onPageChange(p);
  };

  const renderPages = () => {
    const pages: (number | "dots")[] = [];
    const maxButtons = 7;
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(2, page - 2);
      const right = Math.min(totalPages - 1, page + 2);
      pages.push(1);
      if (left > 2) pages.push("dots");
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages - 1) pages.push("dots");
      pages.push(totalPages);
    }
    return pages;
  };

  const start = (page - 1) * size + 1;
  const end = Math.min(total, page * size);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {total === 0 ? (
          "Aucun résultat"
        ) : (
          <>
            Affichage <span className="font-medium">{start}</span>–
            <span className="font-medium">{end}</span> sur{" "}
            <span className="font-medium">{total}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Afficher</label>
          <select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="bg-transparent border rounded px-2 py-1 text-sm"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <nav className="inline-flex items-center">
          <button
            onClick={() => go(page - 1)}
            disabled={page <= 1}
            className="px-2 py-1 rounded disabled:opacity-50"
            aria-label="Page précédente"
          >
            ‹
          </button>

          {renderPages().map((p, i) => (
            <React.Fragment key={i}>
              {p === "dots" ? (
                <span className="px-2">…</span>
              ) : (
                <button
                  onClick={() => go(p as number)}
                  className={`mx-1 px-3 py-1 rounded ${p === page ? "bg-primary text-primary-foreground font-medium" : "text-sm"}`}
                >
                  {p}
                </button>
              )}
            </React.Fragment>
          ))}

          <button
            onClick={() => go(page + 1)}
            disabled={page >= totalPages}
            className="px-2 py-1 rounded disabled:opacity-50"
            aria-label="Page suivante"
          >
            ›
          </button>
        </nav>
      </div>
    </div>
  );
}
