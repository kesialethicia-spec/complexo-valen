import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Eye, Plus, Star, Search, X } from "lucide-react";
import { listAllStores, deleteStore, STORE_CATEGORIES, type StoreRow } from "@/lib/stores-api";

export const Route = createFileRoute("/admin/lojas/")({
  component: AdminStoresList,
});

function AdminStoresList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<StoreRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");
  const [filter, setFilter] = useState("todas");

  const reload = async () => {
    setLoading(true);
    try {
      setItems(await listAllStores());
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao carregar lojas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void reload(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.slug.toLowerCase().includes(q) && !s.location.toLowerCase().includes(q)) return false;
      if (category !== "todas" && s.category !== category) return false;
      if (filter === "ativas" && s.status !== "ativa") return false;
      if (filter === "inativas" && s.status !== "inativa") return false;
      if (filter === "rascunhos" && s.status !== "rascunho") return false;
      if (filter === "destaque" && !s.featured) return false;
      return true;
    });
  }, [items, query, category, filter]);

  const hasFilters = query !== "" || category !== "todas" || filter !== "todas";
  const clearFilters = () => { setQuery(""); setCategory("todas"); setFilter("todas"); };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir a loja "${name}"?`)) return;
    try {
      await deleteStore(id);
      await reload();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Falha ao excluir");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold">Lojas do Complexo</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie as lojas, serviços e operações do Complexo Valen.</p>
        </div>
        <button
          onClick={() => navigate({ to: "/admin/lojas/novo" })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Nova loja
        </button>
      </div>

      <div className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, slug ou localização…"
            className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
          <option value="todas">Todas as categorias</option>
          {STORE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={selectCls}>
          <option value="todas">Todas</option>
          <option value="ativas">Ativas</option>
          <option value="inativas">Inativas</option>
          <option value="rascunhos">Rascunhos</option>
          <option value="destaque">Destaque</option>
        </select>
        <button type="button" onClick={clearFilters} disabled={!hasFilters} className="inline-flex items-center justify-center gap-1 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50">
          <X className="h-4 w-4" /> Limpar
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Carregando…</div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-destructive">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Nenhuma loja cadastrada. Clique em <strong>Nova loja</strong> para começar.
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Nenhuma loja encontrada com os filtros atuais.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">Categoria</th>
                <th className="px-4 py-3 font-semibold">Bloco/Localização</th>
                <th className="px-4 py-3 font-semibold">Contato</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Destaque</th>
                <th className="px-4 py-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">/lojas/{s.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{[s.block, s.location].filter(Boolean).join(" • ") || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.whatsapp || s.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={
                      "rounded-full px-2 py-0.5 text-xs font-semibold " +
                      (s.status === "ativa" ? "bg-emerald-100 text-emerald-700"
                        : s.status === "inativa" ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700")
                    }>{s.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {s.featured ? <Star className="h-4 w-4 fill-primary text-primary" /> : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {s.status === "ativa" && (
                        <Link to="/lojas/$slug" params={{ slug: s.slug }} target="_blank" className="rounded-md p-2 hover:bg-muted" title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                      <Link to="/admin/lojas/$id" params={{ id: s.id }} className="rounded-md p-2 hover:bg-muted" title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDelete(s.id, s.name)} className="rounded-md p-2 text-destructive hover:bg-destructive/10" title="Excluir">
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

const selectCls = "rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30";
