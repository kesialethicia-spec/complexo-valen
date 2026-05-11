import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import {
  Fuel, Wrench, ParkingSquare, ShoppingBag, Coffee, Hotel, Droplet,
  Sparkles, Wallet, Mic, Building2, ArrowRight,
} from "lucide-react";
import postoImg from "@/assets/posto.jpg";
import truckImg from "@/assets/truck-center.jpg";
import hotelImg from "@/assets/hotel.jpg";
import parkImg from "@/assets/estacionamento.jpg";
import festaImg from "@/assets/festa.jpg";

export const Route = createFileRoute("/servicos/")({
  head: () => ({
    meta: [
      { title: "Serviços — Complexo Valen" },
      { name: "description", content: "Posto, ValenBen, Truck Center, ValenLog, Valen Center, Clube do Caminhoneiro, Hotel e mais. Estrutura completa para a sua jornada." },
    ],
  }),
  component: Servicos,
});

interface ServicoBloco {
  to?: "/servicos/posto" | "/servicos/truck-center" | "/servicos/hotel" | "/servicos/clube-do-caminhoneiro" | "/lojas" | "/blog";
  icon: typeof Fuel;
  title: string;
  desc: string;
  items?: string[];
  support?: string;
  img: string;
}

const servicos: ServicoBloco[] = [
  {
    to: "/servicos/posto",
    icon: Fuel,
    title: "Posto de Combustível",
    desc: "Abastecimento com confiança, equipe treinada e estrutura para atender até 22 veículos simultaneamente.",
    items: [
      "Abastecimentos simultâneos para até 22 veículos",
      "Equipe treinada e focada",
      "Mix de produtos e acessórios para caminhões",
      "Super Troca de Óleo com capacidade para 19 trocas",
    ],
    img: postoImg,
  },
  {
    icon: Droplet,
    title: "ValenBen — Super Troca de Óleo",
    desc: "Serviço especializado de troca de óleo para veículos leves e pesados, com praticidade e qualidade.",
    img: truckImg,
  },
  {
    to: "/servicos/truck-center",
    icon: Wrench,
    title: "Valen Truck Center",
    desc: "Estrutura completa para manutenção, borracharia e serviços especializados.",
    items: [
      "3 Truck Centers",
      "Mais de 25 oficinas especializadas",
      "Borracharia",
      "Mecânica",
      "Peças e acessórios",
    ],
    img: truckImg,
  },
  {
    icon: ParkingSquare,
    title: "ValenLog — Triagem e Estacionamento",
    desc: "Operação estruturada para organização, triagem e estacionamento de caminhões.",
    items: [
      "5 pátios para triagem e estacionamento",
      "Sistema de marcação automática nas cancelas",
      "Área de inspeção",
      "Aplicativo ValenLog",
    ],
    img: parkImg,
  },
  {
    icon: Sparkles,
    title: "Classificação de Grãos",
    desc: "Serviço exclusivo voltado ao apoio das operações logísticas e agrícolas.",
    img: parkImg,
  },
  {
    to: "/lojas",
    icon: Building2,
    title: "Valen Center",
    desc: "Espaço comercial com lojas e salas para atender às necessidades de quem passa pelo complexo.",
    support: "250 lojas/salas comerciais.",
    img: hotelImg,
  },
  {
    to: "/servicos/clube-do-caminhoneiro",
    icon: Coffee,
    title: "Clube do Caminhoneiro",
    desc: "Espaço gratuito de convivência, lazer, conforto e cuidado para quem vive na estrada.",
    img: festaImg,
  },
  {
    to: "/servicos/hotel",
    icon: Hotel,
    title: "Valen Porto Hotel",
    desc: "Hospedagem estratégica para descanso, negócios e eventos corporativos.",
    img: hotelImg,
  },
  {
    icon: Fuel,
    title: "ValenLub",
    desc: "Distribuidora de lubrificantes com soluções para quem movimenta a estrada.",
    img: postoImg,
  },
  {
    icon: Wallet,
    title: "Lotérica Valen",
    desc: "Facilidade e conveniência para resolver serviços financeiros sem sair do complexo.",
    img: hotelImg,
  },
  {
    to: "/blog",
    icon: Mic,
    title: "Studio Valen",
    desc: "Canal de comunicação, conteúdo e experiências do Complexo Valen.",
    img: festaImg,
  },
  {
    to: "/lojas",
    icon: ShoppingBag,
    title: "Lojas do Complexo",
    desc: "Conveniência, serviços e parceiros que tornam a sua parada mais prática.",
    img: hotelImg,
  },
];

function Servicos() {
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
            {servicos.map((s) => {
              const Card = (
                <div className="group h-full overflow-hidden rounded-3xl bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all">
                  <div className="relative h-56 overflow-hidden">
                    <img src={s.img} alt={s.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                    <div className="absolute bottom-5 left-5 flex items-center gap-3">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-orange text-white shadow-glow">
                        <s.icon className="h-6 w-6" />
                      </span>
                      <h3 className="text-2xl font-display font-extrabold text-white">{s.title}</h3>
                    </div>
                  </div>
                  <div className="p-7">
                    <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                    {s.items && (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {s.items.map((i) => (
                          <li key={i} className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-secondary">{i}</li>
                        ))}
                      </ul>
                    )}
                    {s.support && <p className="mt-4 text-sm font-semibold text-primary">{s.support}</p>}
                    {s.to && (
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-2.5 transition-all">
                        Ver detalhes <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </div>
              );
              return s.to ? (
                <Link key={s.title} to={s.to} className="block">{Card}</Link>
              ) : (
                <div key={s.title}>{Card}</div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
