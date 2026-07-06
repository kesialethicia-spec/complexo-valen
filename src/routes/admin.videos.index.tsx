import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Plus, Star, Search, X, Play } from "lucide-react";
import {
  listAllVideos,
  deleteVideo,
  youtubeThumbnail,
  VIDEO_CATEGORIES,
  type VideoRow,
} from "@/lib/videos-api";

export const Route = createFileRoute("/admin/videos/")({
  component: AdminVideosList,
});

function AdminVideosList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("todas");
  const [filter, setFilter] = useState<string>("todos");

  const reload = async () => {
    setLoading(true);
    try {
      setItems(await listAllVideos());
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao carregar vídeos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void reload(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((v) => {
      if (q && !v.title.toLowerCase().includes(q)) return false;
      if (category !== "todas" && v.category !== category) return false;
      if (filter === "publicados" && v.status !== "publicado") return false;
      if (filter === "rascunhos" && v.status !== "rascunho") return false;
      if (filter === "destaque" && !v.featured) return false;
      return true;
    });
  }, [items, query, category, filter]);

  const hasFilters = query !== "" || category !== "todas" || filter !== "todos";
  const clearFilters = () => { setQuery(""); setCategory("todas"); setFilter("todos"); };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Excluir o vídeo "${title}"?`)) return;
    try {
      await deleteVideo(id);
      await reload();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Falha ao excluir");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold">Vídeos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre vídeos do YouTube para exibir na seção "Vídeos para quem vive na estrada".
          </p>
        </div>
        <button
          onClick={() => navigate({ to: "/admin/videos/novo" })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Novo vídeo
        </button>
      </div>

      <div className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título…"
            className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
          <option value="todas">Todas as categorias</option>
          {VIDEO_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={selectCls}>
          <option value="todos">Todos</option>
          <option value="publicados">Publicados</option>
          <option value="rascunhos">Rascunhos</option>
          <option value="destaque">Destaque</option>
        </select>
        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasFilters}
          className="inline-flex items-center justify-center gap-1 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
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
            Nenhum vídeo cadastrado. Clique em <strong>Novo vídeo</strong> para começar.
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Nenhum vídeo encontrado com os filtros atuais.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Vídeo</th>
                <th className="px-4 py-3 font-semibold">Categoria</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Destaque</th>
                <th className="px-4 py-3 font-semibold">Ordem</th>
                <th className="px-4 py-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={youtubeThumbnail(v.youtube_id, "mq")} alt="" className="h-12 w-20 rounded object-cover" />
                      <div>
                        <div className="font-medium">{v.title}</div>
                        <a
                          href={v.youtube_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-muted-foreground hover:underline inline-flex items-center gap-1"
                        >
                          <Play className="h-3 w-3" /> Abrir no YouTube
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{v.category}</td>
                  <td className="px-4 py-3">
                    <span className={
                      "rounded-full px-2 py-0.5 text-xs font-semibold " +
                      (v.status === "publicado"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700")
                    }>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {v.featured ? <Star className="h-4 w-4 fill-primary text-primary" /> : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{v.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to="/admin/videos/$id"
                        params={{ id: v.id }}
                        className="rounded-md p-2 hover:bg-muted"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(v.id, v.title)}
                        className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                        title="Excluir"
                      >
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
