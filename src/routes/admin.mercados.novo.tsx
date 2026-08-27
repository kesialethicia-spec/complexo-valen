import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { MarketForm } from "@/components/admin/MarketForm";
import { createMarket, type MarketInput } from "@/lib/markets-api";

export const Route = createFileRoute("/admin/mercados/novo")({
  component: NewMarket,
});

function NewMarket() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: MarketInput) => {
    setSubmitting(true);
    try {
      await createMarket(data);
      navigate({ to: "/admin/mercados" });
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro ao salvar mercado");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/mercados" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para lista
      </Link>
      <h1 className="text-3xl font-display font-bold">Novo mercado</h1>
      <MarketForm submitting={submitting} onSubmit={handleSubmit} onCancel={() => navigate({ to: "/admin/mercados" })} />
    </div>
  );
}
