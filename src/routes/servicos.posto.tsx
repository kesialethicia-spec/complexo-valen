import { createFileRoute } from "@tanstack/react-router";
import { ServiceTemplate } from "@/components/ServiceTemplate";
import postoImg from "@/assets/posto.jpg";

export const Route = createFileRoute("/servicos/posto")({
  head: () => ({ meta: [{ title: "Posto Valen — Combustível em São Luís" }, { name: "description", content: "Abasteça com confiança no Posto Valen: Diesel S10, S500, gasolina, ARLA, troca de óleo e promoções." }] }),
  component: () => (
    <ServiceTemplate
      eyebrow="Posto Valen"
      title="Abasteça com confiança no Valen"
      subtitle="Combustíveis, troca de óleo e estrutura completa para quem vive na estrada."
      image={postoImg}
      blocks={[
        { title: "Tipos de combustível", items: ["Diesel S10", "Diesel S500", "Gasolina", "ARLA 32"] },
        { title: "Serviços", items: ["Troca de óleo", "Conveniência 24h", "Calibragem", "Atendimento dedicado"] },
        { title: "Formas de pagamento", items: ["Cartões", "Pix", "Convênios", "Frota / corporativo"] },
      ]}
      benefits={[
        "Atendimento ágil para caminhoneiros",
        "Combustível de qualidade comprovada",
        "Promoções ativas para frotas",
        "Localização estratégica em São Luís",
        "Conveniência integrada ao posto",
        "Estrutura 24h",
      ]}
    />
  ),
});
