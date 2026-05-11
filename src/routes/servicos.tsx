import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { Fuel, Wrench, ParkingSquare, UtensilsCrossed, Coffee, Hotel, ArrowRight } from "lucide-react";
import postoImg from "@/assets/posto.jpg";
import truckImg from "@/assets/truck-center.jpg";
import hotelImg from "@/assets/hotel.jpg";
import foodImg from "@/assets/alimentacao.jpg";
import parkImg from "@/assets/estacionamento.jpg";
import festaImg from "@/assets/festa.jpg";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — Complexo Valen" },
      { name: "description", content: "Posto, Truck Center, Estacionamento, Alimentação, Hotel e Clube do Caminhoneiro. Tudo que move sua jornada em um só lugar." },
    ],
  }),
  component: Servicos,
});

const servicos = [
  { to: "/servicos/posto" as const, icon: Fuel, title: "Posto de Combustível", desc: "Abastecimento com confiança para quem segue em rota.", items: ["Diesel S10", "Diesel S500", "Gasolina", "Troca de óleo", "ARLA", "Formas de pagamento"], img: postoImg },
  { to: "/servicos/truck-center" as const, icon: Wrench, title: "Truck Center", desc: "Cuidado para o seu caminhão seguir em movimento.", items: ["Borracharia", "Peças e acessórios", "Check-up", "Manutenção", "Produtos automotivos"], img: truckImg },
  { to: "/servicos" as const, icon: ParkingSquare, title: "Estacionamento e pátio", desc: "Estrutura de apoio, organização e segurança.", items: ["Caminhões", "Pátio de triagem", "Apoio ao motorista", "Controle de fluxo"], img: parkImg },
  { to: "/servicos/alimentacao" as const, icon: UtensilsCrossed, title: "Alimentação", desc: "Uma parada para comer bem e seguir viagem.", items: ["Restaurante", "Lanchonete", "Conveniência", "Café da manhã", "Refeições"], img: foodImg },
  { to: "/servicos/clube-do-caminhoneiro" as const, icon: Coffee, title: "Descanso e cuidado", desc: "Acolhimento para quem passa dias longe de casa.", items: ["Banho", "Lavanderia", "Barbearia", "Cinema", "Clube do Caminhoneiro"], img: festaImg },
  { to: "/servicos/hotel" as const, icon: Hotel, title: "Hotel e negócios", desc: "Hospedagem estratégica para descanso, reuniões e negócios.", items: ["Valen Porto Hotel", "Auditório", "Sala de reunião", "Café da manhã incluso"], img: hotelImg },
];

function Servicos() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId !== "__root__" && m.routeId !== "/servicos" && m.routeId.startsWith("/servicos/"));
  if (isChild) return <Outlet />;

  return (
    <>
      <PageHero
        eyebrow="Serviços"
        title="Tudo que move sua jornada, em um só lugar"
        subtitle="Conheça os serviços que fazem do Valen uma parada completa para quem vive em movimento."
        image={postoImg}
      />
      <section className="py-24 bg-background">
        <div className="container-valen">
          <SectionHeader eyebrow="Categorias" title="Estrutura completa para a sua rota" />
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {servicos.map((s) => (
              <Link key={s.title} to={s.to} className="group overflow-hidden rounded-3xl bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all">
                <div className="relative h-56 overflow-hidden">
                  <img src={s.img} alt={s.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                  <div className="absolute bottom-5 left-5 flex items-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-orange text-white shadow-glow"><s.icon className="h-6 w-6" /></span>
                    <h3 className="text-2xl font-display font-extrabold text-white">{s.title}</h3>
                  </div>
                </div>
                <div className="p-7">
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.items.map((i) => (
                      <li key={i} className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-secondary">{i}</li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-2.5 transition-all">
                    Ver detalhes <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
