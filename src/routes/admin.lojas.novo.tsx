import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { StoreForm } from "@/components/admin/StoreForm";
import { createStore, type StoreInput } from "@/lib/stores-api";

export const Route = createFileRoute("/admin/lojas/novo")({
  component: NewStore,
});

function NewStore() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: StoreInput) => {
    setSubmitting(true);
    try {
      await createStore(data);
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
      <h1 className="text-3xl font-display font-bold">Nova loja</h1>
      <StoreForm submitting={submitting} onSubmit={handleSubmit} onCancel={() => navigate({ to: "/admin/lojas" })} />
    </div>
  );
}
