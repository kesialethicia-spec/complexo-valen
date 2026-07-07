import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { createService, type ServiceInput } from "@/lib/services-api";

export const Route = createFileRoute("/admin/servicos/novo")({
  component: NewService,
});

function NewService() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: ServiceInput) => {
    setSubmitting(true);
    try {
      await createService(data);
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
      <h1 className="text-3xl font-display font-bold">Novo serviço</h1>
      <ServiceForm submitting={submitting} onSubmit={handleSubmit} onCancel={() => navigate({ to: "/admin/servicos" })} />
    </div>
  );
}
