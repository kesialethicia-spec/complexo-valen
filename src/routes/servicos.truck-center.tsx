import { createFileRoute } from "@tanstack/react-router";
import { ServiceTemplate } from "@/components/ServiceTemplate";
import truckImg from "@/assets/truck-center.jpg";

export const Route = createFileRoute("/servicos/truck-center")({
  head: () => ({ meta: [{ title: "Truck Center Valen — Manutenção e peças" }, { name: "description", content: "Cuidado para o seu caminhão seguir em movimento: borracharia, peças, check-up e produtos automotivos." }] }),
  component: () => (
    <ServiceTemplate
      eyebrow="Truck Center"
      title="Cuidado para o seu caminhão seguir em movimento"
      subtitle="Serviços, peças e apoio para manter sua jornada segura."
      image={truckImg}
      blocks={[
        { title: "Serviços disponíveis", items: ["Borracharia", "Check-up preventivo", "Manutenção", "Pequenos reparos"] },
        { title: "Produtos", items: ["Peças e acessórios", "Óleos e lubrificantes", "Produtos automotivos", "Itens de cabine"] },
      ]}
      benefits={[
        "Equipe especializada",
        "Estrutura para caminhões pesados",
        "Atendimento ágil sem perder a rota",
        "Peças com procedência",
        "Apoio em emergências",
      ]}
    />
  ),
});
