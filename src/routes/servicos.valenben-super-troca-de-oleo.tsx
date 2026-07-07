import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  MessageCircle,
  Droplets,
  Truck,
  Users,
  Package,
  Snowflake,
  Leaf,
  ShieldCheck,
  Award,
  Clock,
} from "lucide-react";
import {
  getValenbenPageSettings,
  DEFAULT_VALENBEN_SETTINGS,
} from "@/lib/valenben-settings-api";
import heroFallback from "@/assets/posto/hero.jpg.asset.json";
import abastecimentoFallback from "@/assets/posto/abastecimento.jpg.asset.json";
import atendimentoFallback from "@/assets/posto/atendimento.jpg.asset.json";
import truckFallback from "@/assets/o-valen/truck.jpg.asset.json";
import patioFallback from "@/assets/o-valen/patio.jpg.asset.json";
import equipeFallback from "@/assets/equipe-valen.png.asset.json";

export const Route = createFileRoute("/servicos/valenben-super-troca-de-oleo")({
  head: () => ({
    meta: [
      { title: "ValenBen Super Troca de Óleo | Complexo Valen" },
      {
        name: "description",
        content:
          "Conheça a ValenBen Super Troca de Óleo, estrutura especializada para veículos pesados, com atendimento dedicado, produtos homologados e responsabilidade ambiental.",
      },
      { property: "og:title", content: "ValenBen Super Troca de Óleo | Complexo Valen" },
      {
        property: "og:description",
        content:
          "Troca de óleo especializada para veículos pesados no Complexo Valen: atendimento dedicado, sala de espera climatizada e produtos homologados.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://valen-route-connect.lovable.app/servicos/valenben-super-troca-de-oleo" },
    ],
  }),
  component: ValenbenPage,
});

const SERVICE_CARDS = [
  {
    Icon: Truck,
    title: "Troca de óleo para veículos pesados",
    desc: "Atendimento especializado para caminhões e veículos de grande porte.",
  },
  {
    Icon: Users,
    title: "Atendimento dedicado para frotistas",
    desc: "Estrutura pensada para empresas e operações que precisam de agilidade e confiança.",
  },
  {
    Icon: Clock,
    title: "Capacidade operacional",
    desc: "Estrutura com capacidade para até 12 trocas simultâneas.",
  },
  {
    Icon: Award,
    title: "Produtos originais e homologados",
    desc: "Uso de produtos de qualidade, originais e homologados pelas principais marcas.",
  },
  {
    Icon: Snowflake,
    title: "Sala de espera climatizada",
    desc: "Mais conforto para o motorista enquanto o serviço acontece.",
  },
  {
    Icon: Leaf,
    title: "Responsabilidade ambiental",
    desc: "Descarte seguro dos materiais utilizados durante o processo.",
  },
];

const BENEFITS = [
  "Atendimento dedicado",
  "Serviço exclusivo para frotistas",
  "Responsabilidade ambiental",
  "Descarte seguro dos materiais",
  "Sala de espera climatizada",
  "Conforto enquanto o serviço acontece",
  "Capacidade para 12 trocas simultâneas",
  "Produtos originais e homologados",
  "As maiores marcas de óleo do mercado",
];

function ValenbenPage() {
  const { data } = useQuery({
    queryKey: ["valenben-page-settings"],
    queryFn: getValenbenPageSettings,
    initialData: DEFAULT_VALENBEN_SETTINGS,
  });

  const hero = data.hero_image_url || heroFallback.url;
  const presentation = data.presentation_image_url || abastecimentoFallback.url;
  const oilChange = data.oil_change_area_image_url || abastecimentoFallback.url;
  const waitingRoom = data.waiting_room_image_url || atendimentoFallback.url;
  const team = data.team_image_url || equipeFallback.url;

  const galleryDefault = [
    heroFallback.url,
    abastecimentoFallback.url,
    truckFallback.url,
    atendimentoFallback.url,
    patioFallback.url,
    equipeFallback.url,
  ];
  const gallery = data.gallery_urls.length ? data.gallery_urls : galleryDefault;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <img src={hero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/95 via-secondary/85 to-secondary/70" />
        </div>
        <div className="container-valen relative py-24 md:py-32">
          <nav className="text-xs text-white/70 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/servicos" className="hover:text-white">Serviços</Link>
            <span className="mx-2">/</span>
            <span>ValenBen Super Troca de Óleo</span>
          </nav>
          {data.logo_url && (
            <img src={data.logo_url} alt="ValenBen" className="h-16 md:h-20 mb-6 object-contain object-left" />
          )}
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            <Droplets className="h-3.5 w-3.5" /> Especializada em veículos pesados
          </span>
          <h1 className="mt-4 max-w-3xl text-5xl md:text-6xl font-display font-extrabold tracking-tight text-balance">
            ValenBen Super Troca de Óleo
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90 leading-relaxed font-medium">
            Troca de óleo para veículos pesados com estrutura, qualidade e atendimento dedicado.
          </p>
          <p className="mt-3 max-w-2xl text-base text-white/80 leading-relaxed">
            Serviço especializado para caminhões, frotistas e empresas que precisam de agilidade, confiança e produtos homologados.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={data.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold hover:brightness-110"
            >
              <MessageCircle className="h-4 w-4" /> Falar com a equipe
            </a>
            <a
              href={data.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur px-6 py-3 font-semibold hover:bg-white/20"
            >
              <MapPin className="h-4 w-4" /> Como chegar
            </a>
          </div>
        </div>
      </section>

      {/* APRESENTAÇÃO */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container-valen grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <img
              src={presentation}
              alt="ValenBen Super Troca de Óleo"
              className="w-full aspect-[4/3] object-cover rounded-3xl shadow-glow"
              loading="lazy"
            />
          </div>
          <div className="rounded-3xl bg-card border border-border p-8 md:p-10 shadow-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> ValenBen
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Estrutura especializada para veículos pesados
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              A ValenBen Super Troca de Óleo oferece uma estrutura dedicada para veículos pesados, com atendimento especializado, conforto durante o serviço e compromisso com a qualidade dos produtos utilizados. É uma solução pensada para caminhoneiros, frotistas e empresas que precisam manter a operação em movimento com segurança e confiança.
            </p>
            <a
              href="#estrutura"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Ver estrutura →
            </a>
          </div>
        </div>
      </section>

      {/* SERVIÇOS E ESTRUTURA */}
      <section id="estrutura" className="py-20 bg-surface scroll-mt-24">
        <div className="container-valen">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Serviços e estrutura
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Tudo pensado para a sua operação
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICE_CARDS.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-card border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-orange text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-bold text-secondary">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-20 bg-background">
        <div className="container-valen">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] items-center">
            <div className="grid grid-cols-2 gap-4">
              <img src={oilChange} alt="Área de troca de óleo" className="aspect-[4/5] w-full object-cover rounded-3xl" loading="lazy" />
              <img src={waitingRoom} alt="Sala de espera climatizada" className="aspect-[4/5] w-full object-cover rounded-3xl mt-8" loading="lazy" />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> Diferenciais
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
                Compromisso e experiência
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Qualidade no serviço, conforto para o motorista e cuidado com cada etapa.
              </p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                    <span className="text-secondary/90">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="py-20 bg-surface">
        <div className="container-valen">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Package className="h-3.5 w-3.5" /> Galeria
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Conheça a ValenBen
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.slice(0, 6).map((img, i) => (
              <div
                key={i}
                className={
                  "overflow-hidden rounded-2xl bg-card group " +
                  (i === 0 ? "sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto" : "aspect-[4/3]")
                }
              >
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {team && (
            <div className="mt-8 rounded-3xl overflow-hidden">
              <img src={team} alt="Equipe ValenBen" className="w-full h-64 md:h-80 object-cover" loading="lazy" />
            </div>
          )}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-background">
        <div className="container-valen">
          <div className="rounded-[2rem] bg-gradient-orange p-10 md:p-14 text-primary-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold text-balance">
                Mantenha sua operação em movimento
              </h3>
              <p className="mt-2 text-white/90 max-w-xl">
                Conte com a ValenBen para uma troca de óleo especializada, ágil e segura para veículos pesados.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={data.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white text-secondary px-6 py-3 font-bold"
              >
                <MessageCircle className="h-4 w-4" /> Falar com a equipe
              </a>
              <a
                href={data.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur px-6 py-3 font-semibold"
              >
                <MapPin className="h-4 w-4" /> Como chegar
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
