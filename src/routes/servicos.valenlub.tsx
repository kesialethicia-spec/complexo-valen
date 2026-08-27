import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  MessageCircle,
  Droplets,
  Filter,
  FlaskConical,
  Wind,
  Sparkles,
  Package,
  Truck,
  Users,
  Building2,
  Store,
  Headset,
  Award,
  MapPinned,
  Boxes,
} from "lucide-react";
import {
  getValenlubPageSettings,
  DEFAULT_VALENLUB_SETTINGS,
} from "@/lib/valenlub-settings-api";
import heroFallback from "@/assets/posto/hero.jpg.asset.json";
import abastecimentoFallback from "@/assets/posto/abastecimento.jpg.asset.json";
import truckFallback from "@/assets/o-valen/truck.jpg.asset.json";
import equipeFallback from "@/assets/equipe-valen.png.asset.json";

export const Route = createFileRoute("/servicos/valenlub")({
  head: () => ({
    meta: [
      { title: "ValenLub Lubrificantes | Complexo Valen" },
      {
        name: "description",
        content:
          "Conheça a ValenLub, distribuidora de lubrificantes, filtros, químicos, Arla e produtos automotivos com atendimento ágil no Maranhão.",
      },
      { property: "og:title", content: "ValenLub Lubrificantes | Complexo Valen" },
      {
        property: "og:description",
        content:
          "Distribuidora de lubrificantes, filtros, químicos e produtos automotivos com atendimento em todo o Maranhão.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://complexovalen.com.br/servicos/valenlub" },
    ],
  }),
  component: ValenlubPage,
});

const SOLUTIONS = [
  { Icon: Droplets, title: "Lubrificantes", desc: "Produtos para caminhões, máquinas, motos, carros, frotas e operações diversas." },
  { Icon: Filter, title: "Filtros", desc: "Linha de filtros para manutenção e cuidado com veículos e equipamentos." },
  { Icon: FlaskConical, title: "Químicos automotivos", desc: "Soluções para limpeza, manutenção e desempenho automotivo." },
  { Icon: Wind, title: "Arla", desc: "Produto essencial para veículos a diesel com sistema SCR." },
  { Icon: Sparkles, title: "Palhetas", desc: "Itens automotivos para reposição e segurança no dia a dia." },
  { Icon: Package, title: "Estética automotiva", desc: "Produtos para cuidado, limpeza e conservação de veículos." },
];

const HIGHLIGHTS = [
  { number: "+1.000", label: "produtos cadastrados", Icon: Boxes },
  { number: "+80", label: "cidades atendidas no Maranhão", Icon: MapPinned },
  { number: "+900", label: "clientes cadastrados", Icon: Users },
  { number: "24h", label: "processo logístico ágil de entrega", Icon: Truck },
];

const DIFFERENTIALS = [
  "Consultores comerciais experientes em cidades polo",
  "Representante exclusivo de grandes marcas",
  "Portfólio completo para diversos segmentos",
  "Atendimento próximo e consultivo",
];

const SERVICE_CARDS = [
  { Icon: Truck, title: "Atendimento para frotistas", desc: "Soluções para empresas com frota e operações contínuas." },
  { Icon: Store, title: "Atendimento para oficinas e lojas", desc: "Portfólio ideal para revenda e manutenção especializada." },
  { Icon: Headset, title: "Consultores comerciais", desc: "Equipe dedicada em cidades polo do Maranhão." },
  { Icon: Truck, title: "Entrega ágil", desc: "Processo logístico com entrega em até 24h." },
  { Icon: Award, title: "Suporte na escolha dos produtos", desc: "Ajudamos a escolher a melhor solução para cada operação." },
  { Icon: Building2, title: "Atendimento empresarial", desc: "Estrutura preparada para grandes contas e operações complexas." },
];

const DEFAULT_BRANDS = [
  "GT-Oil", "Repsol", "Lubrax", "Uni", "Atron", "Koube", "Bosch",
  "Orbi Química", "Car80", "Hi Tech", "Tek Bond", "Loctite", "Vonixx",
  "Central Sul", "Areon", "Wega", "Hengst", "Ipê", "Auto Impact",
];

function ValenlubPage() {
  const { data } = useQuery({
    queryKey: ["valenlub-page-settings"],
    queryFn: getValenlubPageSettings,
    initialData: DEFAULT_VALENLUB_SETTINGS,
  });

  const hero = data.hero_image_url || heroFallback.url;
  const presentation = data.presentation_image_url || abastecimentoFallback.url;
  const team = data.team_image_url || equipeFallback.url;
  const delivery = data.delivery_image_url || truckFallback.url;

  const brandLogos = (data.brand_logos ?? []).filter(Boolean);

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
            <span>ValenLub</span>
          </nav>
          {data.logo_url && (
            <img src={data.logo_url} alt="ValenLub" className="h-16 md:h-20 mb-6 object-contain object-left" />
          )}
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            <Droplets className="h-3.5 w-3.5" /> Distribuidora de lubrificantes
          </span>
          <h1 className="mt-4 max-w-3xl text-5xl md:text-6xl font-display font-extrabold tracking-tight text-balance">
            ValenLub Lubrificantes
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90 leading-relaxed font-medium">
            Soluções em lubrificantes, filtros, químicos e produtos automotivos para quem movimenta o Maranhão.
          </p>
          <p className="mt-3 max-w-2xl text-base text-white/80 leading-relaxed">
            Distribuição ágil, portfólio completo e atendimento especializado para frotas, empresas e clientes em todo o estado.
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
              href="#solucoes"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur px-6 py-3 font-semibold hover:bg-white/20"
            >
              <Package className="h-4 w-4" /> Conhecer produtos
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
              alt="ValenLub"
              className="w-full aspect-[4/3] object-cover rounded-3xl shadow-glow"
              loading="lazy"
            />
          </div>
          <div className="rounded-3xl bg-card border border-border p-8 md:p-10 shadow-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> ValenLub
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-display font-extrabold tracking-tight text-secondary text-balance">
              A distribuidora de lubrificantes que mais cresce no Maranhão
            </h2>
            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              A ValenLub reúne um portfólio completo de lubrificantes, filtros, químicos, palhetas, Arla e produtos automotivos para atender empresas, frotistas, caminhoneiros, oficinas, lojas e clientes que precisam de qualidade, variedade e agilidade na entrega.
            </p>
          </div>
        </div>
      </section>

      {/* SOLUÇÕES */}
      <section id="solucoes" className="py-20 bg-surface scroll-mt-24">
        <div className="container-valen">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Nossas soluções
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Portfólio completo para cada operação
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map(({ Icon, title, desc }) => (
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
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Award className="h-3.5 w-3.5" /> Diferenciais ValenLub
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Por que escolher a ValenLub?
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map(({ number, label, Icon }) => (
              <div key={label} className="rounded-3xl bg-secondary text-white p-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                <Icon className="h-6 w-6 text-primary relative" />
                <p className="mt-5 text-4xl font-display font-extrabold text-gold relative" style={{ color: "hsl(43 92% 62%)" }}>{number}</p>
                <p className="mt-2 text-sm text-white/80 relative">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {DIFFERENTIALS.map((d) => (
              <div key={d} className="flex items-start gap-3 rounded-2xl bg-card border border-border p-5">
                <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <p className="text-sm font-medium text-secondary">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARCAS */}
      <section className="py-20 bg-surface">
        <div className="container-valen">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Award className="h-3.5 w-3.5" /> Marcas parceiras
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Grandes marcas no nosso portfólio
            </h2>
          </div>

          <div className="mt-10 rounded-3xl bg-white border border-border p-6 md:p-8">
            {brandLogos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {brandLogos.map((url, i) => (
                  <div key={i} className="aspect-[3/2] grid place-items-center rounded-xl border bg-white p-3">
                    <img src={url} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {DEFAULT_BRANDS.map((name) => (
                  <div key={name} className="aspect-[3/2] grid place-items-center rounded-xl border bg-white p-3">
                    <span className="font-display font-bold text-secondary text-sm md:text-base text-center">{name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Envie logos oficiais das marcas pelo painel para substituir os nomes acima.
          </p>
        </div>
      </section>

      {/* ATENDIMENTO */}
      <section className="py-20 bg-background">
        <div className="container-valen">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Headset className="h-3.5 w-3.5" /> Atendimento
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
                Atendimento para empresas, frotas e operações
              </h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                A ValenLub atende clientes que precisam de produtos confiáveis, variedade de estoque e suporte comercial próximo. Nossa equipe auxilia na escolha das melhores soluções para cada tipo de veículo, operação ou necessidade.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {SERVICE_CARDS.map(({ Icon, title, desc }) => (
                  <div key={title} className="rounded-2xl bg-card border border-border p-5">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="mt-3 font-bold text-secondary text-sm">{title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src={team} alt="Equipe comercial" className="aspect-[4/5] w-full object-cover rounded-3xl" loading="lazy" />
              <img src={delivery} alt="Entrega e logística" className="aspect-[4/5] w-full object-cover rounded-3xl mt-8" loading="lazy" />
            </div>
          </div>
        </div>
      </section>


      {/* CTA FINAL */}
      <section className="py-20 bg-background">
        <div className="container-valen">
          <div className="rounded-[2rem] bg-gradient-orange p-10 md:p-14 text-primary-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold text-balance">
                Precisa de lubrificantes e produtos automotivos?
              </h3>
              <p className="mt-2 text-white/90 max-w-xl">
                Fale com a ValenLub e encontre as melhores soluções para sua frota, loja, oficina ou operação.
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
