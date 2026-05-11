import { createFileRoute } from "@tanstack/react-router";
import { ServiceTemplate } from "@/components/ServiceTemplate";
import festaImg from "@/assets/festa.jpg";

export const Route = createFileRoute("/servicos/clube-do-caminhoneiro")({
  head: () => ({ meta: [{ title: "Clube do Caminhoneiro — Valen" }, { name: "description", content: "Cuidado e acolhimento para quem vive na estrada: cinema, barbearia, banho, lavanderia e ações especiais." }] }),
  component: () => (
    <ServiceTemplate
      eyebrow="Clube do Caminhoneiro"
      title="Cuidado e acolhimento para quem vive na estrada"
      subtitle="Benefícios e experiências pensadas para fazer o caminhoneiro se sentir entre amigos."
      image={festaImg}
      blocks={[
        { title: "Estrutura", items: ["Cinema gratuito", "Barbearia", "Banho", "Lavanderia"] },
        { title: "Ações", items: ["Café de Sábado", "Sexta Valen", "Festa do Caminhoneiro", "Campanhas especiais"] },
      ]}
      benefits={["Acolhimento humano", "Experiências exclusivas", "Cuidado pessoal", "Comunidade ativa"]}
      galleryImages={[festaImg, festaImg, festaImg]}
    />
  ),
});
