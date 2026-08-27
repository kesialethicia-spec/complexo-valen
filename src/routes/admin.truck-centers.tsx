import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  listAllTruckCenters,
  updateTruckCenter,
  type TruckCenterRow,
  type TruckCenterStatus,
} from "@/lib/truck-centers-api";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/admin/truck-centers")({
  component: AdminTruckCenters,
});

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30";

function AdminTruckCenters() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ["admin-truck-centers"], queryFn: listAllTruckCenters });
  const [rows, setRows] = useState<TruckCenterRow[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && !rows) setRows(data);
  }, [data, rows]);

  if (isLoading || !rows) return <div className="text-sm text-muted-foreground">Carregando…</div>;

  const update = (id: string, patch: Partial<TruckCenterRow>) =>
    setRows((r) => (r ? r.map((x) => (x.id === id ? { ...x, ...patch } : x)) : r));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      for (const r of rows) {
        await updateTruckCenter(r.id, {
          name: r.name,
          image_url: r.image_url,
          location: r.location,
          status: r.status,
          order_index: r.order_index,
        });
      }
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate({ to: "/admin" })}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <h1 className="mt-2 text-3xl font-display font-bold">Truck Centers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Imagens do carrossel da página /servicos/truck-center.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {rows.map((r) => (
          <div key={r.id} className="grid gap-5 rounded-xl border bg-card p-6 md:grid-cols-[280px_1fr]">
            <ImageUploadField
              label="Imagem"
              hint="Foto real do Truck Center (horizontal, ex.: 1200×900px)."
              value={r.image_url}
              onChange={(url) => update(r.id, { image_url: url })}
              aspect="landscape"
            />
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold">Nome</span>
                <input value={r.name} onChange={(e) => update(r.id, { name: e.target.value })} className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold">Localização</span>
                <input value={r.location} onChange={(e) => update(r.id, { location: e.target.value })} className={inputCls} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold">Status</span>
                  <select
                    value={r.status}
                    onChange={(e) => update(r.id, { status: e.target.value as TruckCenterStatus })}
                    className={inputCls}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold">Ordem</span>
                  <input
                    type="number"
                    value={r.order_index}
                    onChange={(e) => update(r.id, { order_index: Number(e.target.value) })}
                    className={inputCls}
                  />
                </label>
              </div>
            </div>
          </div>
        ))}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
          {savedAt && (
            <span className="inline-flex items-center gap-1 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" /> Salvo
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
