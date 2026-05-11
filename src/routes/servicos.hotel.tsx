import { createFileRoute, Link } from "@tanstack/react-router";
import { ServiceTemplate } from "@/components/ServiceTemplate";
import hotelImg from "@/assets/hotel.jpg";

export const Route = createFileRoute("/servicos/hotel")({
  head: () => ({ meta: [{ title: "Valen Porto Hotel — Hospedagem em São Luís" }, { name: "description", content: "Hospedagem estratégica a 7 km do Porto e Distrito Industrial. Conforto, café da manhã, auditório e sala de reunião." }] }),
  component: HotelPage,
});

function HotelPage() {
  return (
    <>
      <ServiceTemplate
        eyebrow="Valen Porto Hotel"
        title="Hospedagem estratégica para negócios e descanso"
        subtitle="Conforto, localização e estrutura para quem viaja a trabalho ou precisa estar próximo ao Porto e ao Distrito Industrial."
        image={hotelImg}
        blocks={[
          { title: "Localização", items: ["A 7 km do Porto", "A 7 km do Distrito Industrial", "Próximo a rodovias", "Fácil acesso"] },
          { title: "Acomodações", items: ["Quartos completos", "Café da manhã incluso", "Wi-Fi", "Ar-condicionado"] },
          { title: "Negócios", items: ["Auditório", "Sala de reunião", "Eventos corporativos", "Coffee break"] },
        ]}
        benefits={["Localização privilegiada", "Estrutura para negócios", "Conforto após a estrada", "Atendimento dedicado"]}
      />
      <section className="pb-24 bg-background">
        <div className="container-valen flex flex-wrap gap-3">
          <Link to="/contato" className="rounded-full bg-secondary text-secondary-foreground px-6 py-3 font-bold">Conhecer o hotel</Link>
          <Link to="/contato" className="rounded-full bg-gradient-orange text-primary-foreground px-6 py-3 font-bold">Fazer reserva</Link>
        </div>
      </section>
    </>
  );
}
