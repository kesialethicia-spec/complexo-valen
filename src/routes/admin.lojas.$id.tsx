import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { StoreForm } from "@/components/admin/StoreForm";
import { getStoreById, updateStore, type StoreInput, type StoreRow } from "@/lib/stores-api";

export const Route = createFileRoute("/admin/lojas/$id")({
  component: EditStore,
});

function EditStore() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<StoreRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await getStoreById(id);
        if (!data) setError("Loja não encontrada.");
        setItem(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao carregar loja");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (data: StoreInput) => {
    setSubmitting(true);
    try {
      await updateStore(id, data);
      navigate({ to: "/admin/lojas" });
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro ao salvar loja");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/lojas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para lista
      </Link>
      <h1 className="text-3xl font-display font-bold">Editar loja</h1>
      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : item ? (
        <StoreForm initial={item} submitting={submitting} onSubmit={handleSubmit} onCancel={() => navigate({ to: "/admin/lojas" })} />
      ) : null}
    </div>
  );
}
