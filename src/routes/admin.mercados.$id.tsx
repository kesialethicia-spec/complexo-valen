import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { MarketForm } from "@/components/admin/MarketForm";
import { getMarketById, updateMarket, type MarketInput, type MarketRow } from "@/lib/markets-api";

export const Route = createFileRoute("/admin/mercados/$id")({
  component: EditMarket,
});

function EditMarket() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<MarketRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await getMarketById(id);
        if (!data) setError("Mercado não encontrado.");
        setItem(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao carregar mercado");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (data: MarketInput) => {
    setSubmitting(true);
    try {
      await updateMarket(id, data);
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
      <h1 className="text-3xl font-display font-bold">Editar mercado</h1>
      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : item ? (
        <MarketForm initial={item} submitting={submitting} onSubmit={handleSubmit} onCancel={() => navigate({ to: "/admin/mercados" })} />
      ) : null}
    </div>
  );
}
