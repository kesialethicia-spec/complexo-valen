import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PromotionForm } from "@/components/admin/PromotionForm";
import { getPromotionById, updatePromotion, type PromotionInput, type PromotionRow } from "@/lib/promotions-api";

export const Route = createFileRoute("/admin/promocoes/$id")({
  component: EditPromotion,
});

function EditPromotion() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<PromotionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const data = await getPromotionById(id);
        if (!data) setError("Promoção não encontrada.");
        setItem(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao carregar promoção");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (data: PromotionInput) => {
    setSubmitting(true);
    try {
      await updatePromotion(id, data);
      alert("Promoção salva com sucesso!");
      navigate({ to: "/admin/promocoes" });
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Erro ao salvar promoção");
      setSubmitting(false);
    }
  };


  return (
    <div className="space-y-6">
      <Link to="/admin/promocoes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para lista
      </Link>
      <h1 className="text-3xl font-display font-bold">Editar promoção</h1>
      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : item ? (
        <PromotionForm
          initial={item}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate({ to: "/admin/promocoes" })}
        />
      ) : null}
    </div>
  );
}
