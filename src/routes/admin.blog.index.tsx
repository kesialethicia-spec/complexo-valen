import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Eye, Plus, Star, Search, X } from "lucide-react";
import {
  listAllPosts,
  deletePost,
  formatPublishedDate,
  BLOG_CATEGORIES,
  type BlogPostRow,
} from "@/lib/blog-api";

export const Route = createFileRoute("/admin/blog/")({
  component: AdminBlogList,
});

function AdminBlogList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("todas");
  const [status, setStatus] = useState<string>("todos");
  const [featured, setFeatured] = useState<string>("todos");

  const reload = async () => {
    setLoading(true);
    try {
      setPosts(await listAllPosts());
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao carregar artigos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void reload(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) return false;
      if (category !== "todas" && p.category !== category) return false;
      if (status !== "todos" && p.status !== status) return false;
      if (featured === "principal" && !p.main_featured) return false;
      if (featured === "destaque" && !p.featured) return false;
      if (featured === "sem" && (p.featured || p.main_featured)) return false;
      return true;
    });
  }, [posts, query, category, status, featured]);

  const hasFilters = query !== "" || category !== "todas" || status !== "todos" || featured !== "todos";
  const clearFilters = () => {
    setQuery(""); setCategory("todas"); setStatus("todos"); setFeatured("todos");
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Excluir o artigo "${title}"?`)) return;
    try {
      await deletePost(id);
      await reload();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Falha ao excluir");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold">Blog do Caminhoneiro</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie os artigos publicados no blog.</p>
        </div>
        <button
          onClick={() => navigate({ to: "/admin/blog/novo" })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Novo artigo
        </button>
      </div>

      <div className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-[1fr_auto_auto_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título ou slug…"
            className="w-full rounded-md border bg-background pl-9 pr-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls} aria-label="Filtrar por categoria">
          <option value="todas">Todas as categorias</option>
          {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls} aria-label="Filtrar por status">
          <option value="todos">Todos os status</option>
          <option value="publicado">Publicado</option>
          <option value="rascunho">Rascunho</option>
        </select>
        <select value={featured} onChange={(e) => setFeatured(e.target.value)} className={selectCls} aria-label="Filtrar por destaque">
          <option value="todos">Todos os destaques</option>
          <option value="principal">Artigo principal</option>
          <option value="destaque">Em destaque</option>
          <option value="sem">Sem destaque</option>
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
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Nenhum artigo cadastrado. Clique em <strong>Novo artigo</strong> para começar.
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Nenhum artigo encontrado com os filtros atuais.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Título</th>
                <th className="px-4 py-3 font-semibold">Categoria</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">Destaque</th>
                <th className="px-4 py-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground">/blog/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className={
                      "rounded-full px-2 py-0.5 text-xs font-semibold " +
                      (p.status === "publicado"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700")
                    }>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatPublishedDate(p.published_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {p.main_featured && <Star className="h-4 w-4 fill-primary text-primary" />}
                      {p.featured && !p.main_featured && <Star className="h-4 w-4 text-primary" />}
                      {!p.featured && !p.main_featured && <span className="text-xs text-muted-foreground">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {p.status === "publicado" && (
                        <Link
                          to="/blog/$slug"
                          params={{ slug: p.slug }}
                          target="_blank"
                          className="rounded-md p-2 hover:bg-muted"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        to="/admin/blog/$id"
                        params={{ id: p.id }}
                        className="rounded-md p-2 hover:bg-muted"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
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
