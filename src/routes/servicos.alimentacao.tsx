import { createFileRoute } from "@tanstack/react-router";
import { ServiceTemplate } from "@/components/ServiceTemplate";

export const Route = createFileRoute("/servicos/alimentacao")({
  head: () => ({ meta: [{ title: "Alimentação no Valen — Restaurante, lanchonete e conveniência" }, { name: "description", content: "Restaurante, lanchonete, conveniência e café da manhã para todos os momentos da sua jornada." }] }),
  component: () => (
    <ServiceTemplate
      eyebrow="Alimentação"
      title="Uma parada para comer bem e seguir viagem"
      subtitle="Opções de alimentação, conveniência e refeições para todos os momentos da sua jornada."
      image=""
      blocks={[
        { title: "Restaurante", items: ["Almoço e jantar", "Self-service", "Pratos do dia", "Comida caseira"] },
        { title: "Lanchonete & Café", items: ["Café da manhã", "Lanches rápidos", "Cafés especiais", "Sucos e bebidas"] },
        { title: "Conveniência", items: ["Bebidas", "Snacks de viagem", "Itens de higiene", "Acessórios automotivos"] },
      ]}
      benefits={["Pratos preparados todos os dias", "Atendimento rápido", "Ambiente acolhedor", "Promoções na conveniência"]}
      />
  ),
});
