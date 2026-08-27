import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import { listAllMarkets, deleteMarket, type MarketRow } from "@/lib/markets-api";

export const Route = createFileRoute("/admin/mercados/")({
  component: AdminMarketsList,
});

function AdminMarketsList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MarketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      setItems(await listAllMarkets());
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao carregar mercados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void reload(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir o mercado "${name}"?`)) return;
    try {
      await deleteMarket(id);
      await reload();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Falha ao excluir");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold">Mercados</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie os mercados exibidos em /servicos/mercado.</p>
        </div>
        <button
          onClick={() => navigate({ to: "/admin/mercados/novo" })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Novo mercado
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Carregando…</div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-destructive">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Nenhum mercado cadastrado. Clique em <strong>Novo mercado</strong>.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Ordem</th>
                <th className="px-4 py-3 font-semibold">Mercado</th>
                <th className="px-4 py-3 font-semibold">Localização</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="px-4 py-3 text-muted-foreground">{m.order_index}</td>
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.location || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={
                      "rounded-full px-2 py-0.5 text-xs font-semibold " +
                      (m.status === "publicado" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")
                    }>{m.status === "publicado" ? "ativo" : "inativo"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to="/servicos/mercado" className="rounded-md p-2 hover:bg-muted" title="Visualizar no site">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link to="/admin/mercados/$id" params={{ id: m.id }} className="rounded-md p-2 hover:bg-muted" title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDelete(m.id, m.name)} className="rounded-md p-2 text-destructive hover:bg-destructive/10" title="Excluir">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
