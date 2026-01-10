"use client";

import { useEffect, useState } from "react";
import { GPCard } from "../components/gp-card";
import Pagination from "../components/pagination";
import { listGPs } from "@/lib/services/gpService";
import type { GP } from "@/lib/models";
import { Card } from "../components/ui/card";

export default function GPListPage() {
  const [gps, setGps] = useState<GP[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await listGPs(page, size);
        setGps(res.items);
        setTotal(res.total);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetch();
  }, [page, size]);

  return (
    <main className="flex-1 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Agences GP</h1>

        {loading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : gps.length === 0 ? (
          <p className="text-muted-foreground">Aucun GP trouvé</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gps.map((g) => (
                <GPCard key={g.id} gp={g} />
              ))}
            </div>

            <div className="mt-6">
              <Pagination
                page={page}
                size={size}
                total={total}
                onPageChange={(p) => setPage(p)}
                onSizeChange={(s) => {
                  setSize(s);
                  setPage(1);
                }}
                pageSizeOptions={[10, 20, 50]}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
