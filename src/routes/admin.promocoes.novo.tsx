import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PromotionForm } from "@/components/admin/PromotionForm";
import { createPromotion, type PromotionInput } from "@/lib/promotions-api";

export const Route = createFileRoute("/admin/promocoes/novo")({
  component: NewPromotion,
});

function NewPromotion() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: PromotionInput) => {
    setSubmitting(true);
    try {
      await createPromotion(data);
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
      <h1 className="text-3xl font-display font-bold">Nova promoção</h1>
      <PromotionForm
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate({ to: "/admin/promocoes" })}
      />
    </div>
  );
}
