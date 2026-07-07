import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { listAllServices, deleteService, type ServiceRow } from "@/lib/services-api";
import { getServiceIcon } from "@/lib/service-icons";

export const Route = createFileRoute("/admin/servicos/")({
  component: AdminServicesList,
});

function AdminServicesList() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      setItems(await listAllServices());
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void reload(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir o serviço "${name}"?`)) return;
    try {
      await deleteService(id);
      await reload();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Falha ao excluir");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-bold">Serviços</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie os cards da página /servicos.</p>
        </div>
        <button
          onClick={() => navigate({ to: "/admin/servicos/novo" })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Novo serviço
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Carregando…</div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-destructive">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Nenhum serviço cadastrado. Clique em <strong>Novo serviço</strong>.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Ordem</th>
                <th className="px-4 py-3 font-semibold">Serviço</th>
                <th className="px-4 py-3 font-semibold">Link</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => {
                const Icon = getServiceIcon(s.icon);
                return (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-3 text-muted-foreground">{s.order_index}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-orange text-primary-foreground shrink-0">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.link_url || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={
                        "rounded-full px-2 py-0.5 text-xs font-semibold " +
                        (s.status === "publicado" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")
                      }>{s.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to="/admin/servicos/$id" params={{ id: s.id }} className="rounded-md p-2 hover:bg-muted" title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(s.id, s.name)} className="rounded-md p-2 text-destructive hover:bg-destructive/10" title="Excluir">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
