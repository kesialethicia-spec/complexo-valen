import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { getServiceById, updateService, type ServiceInput, type ServiceRow } from "@/lib/services-api";

export const Route = createFileRoute("/admin/servicos/$id")({
  component: EditService,
});

function EditService() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<ServiceRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await getServiceById(id);
        if (!data) setError("Serviço não encontrado.");
        setItem(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao carregar serviço");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (data: ServiceInput) => {
    setSubmitting(true);
    try {
      await updateService(id, data);
      navigate({ to: "/admin/servicos" });
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro ao salvar serviço");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/servicos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para lista
      </Link>
      <h1 className="text-3xl font-display font-bold">Editar serviço</h1>
      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : item ? (
        <ServiceForm initial={item} submitting={submitting} onSubmit={handleSubmit} onCancel={() => navigate({ to: "/admin/servicos" })} />
      ) : null}
    </div>
  );
}
