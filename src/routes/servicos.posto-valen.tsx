import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, MessageCircle, Fuel, Truck, Droplets, ShoppingBag, CreditCard, Clock, Sparkles, Coffee, Package, Building2, ArrowRight, Check } from "lucide-react";
import { getPostoPageSettings, DEFAULT_POSTO_SETTINGS } from "@/lib/posto-settings-api";
import heroFallback from "@/assets/posto/hero.jpg.asset.json";
import abastecimentoFallback from "@/assets/posto/abastecimento.jpg.asset.json";
import atendimentoFallback from "@/assets/posto/atendimento.jpg.asset.json";
import paymentStripFallback from "@/assets/posto/formas-de-pagamento.png.asset.json";
import { Img } from "@/components/Img";

export const Route = createFileRoute("/servicos/posto-valen")({
  head: () => ({
    meta: [
      { title: "Posto Valen — Abastecimento e Conveniência em São Luís" },
      {
        name: "description",
        content:
          "Posto Valen: abastecimento 24h para linha leve e pesada, Arla, conveniência e diversas formas de pagamento no Complexo Valen em São Luís.",
      },
      { property: "og:title", content: "Posto Valen — Abastecimento e Conveniência" },
      { property: "og:description", content: "Combustíveis, Arla e conveniência para quem vive em movimento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PostoValenPage,
});

const PAYMENT_METHODS = [
  "Pix", "Visa", "Mastercard", "Elo", "PagBem", "TMOV", "E-Frete", "Alelo",
  "Ticket Log", "TruckPag", "Rede Frota", "Pró-Frotas", "Hipercard",
  "Diners Club", "American Express", "eFleet", "X7 Bank", "TIO", "Pamcard",
];

function PostoValenPage() {
  const { data } = useQuery({
    queryKey: ["posto-page-settings"],
    queryFn: getPostoPageSettings,
    initialData: DEFAULT_POSTO_SETTINGS,
  });

  const hero = data.hero_image_url || heroFallback.url;
  const posto = data.posto_image_url || heroFallback.url;
  const abastecimento = data.abastecimento_image_url || abastecimentoFallback.url;
  const conveniencia = data.conveniencia_image_url || atendimentoFallback.url;
  const paymentStrip = data.payment_strip_url || paymentStripFallback.url;
  const hasIndividualLogos = (data.payment_logos ?? []).filter(Boolean).length > 0;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Img src={hero} alt="" fetchPriority="high" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 via-secondary/80 to-secondary/70" />
        </div>
        <div className="container-valen relative py-24 md:py-32">
          <nav className="text-xs text-white/70 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/servicos" className="hover:text-white">Serviços</Link>
            <span className="mx-2">/</span>
            <span>Posto Valen</span>
          </nav>
          {data.logo_url && (
            <Img src={data.logo_url} alt="Posto Valen" className="h-16 md:h-20 mb-6 object-contain object-left" />
          )}
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/40 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">
            <Clock className="h-3.5 w-3.5" /> Abastecimento 24h
          </span>
          <h1 className="mt-4 max-w-3xl text-5xl md:text-6xl font-display font-extrabold tracking-tight text-balance">
            Abastecimento e conveniência para sua jornada
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85 leading-relaxed">
            Combustíveis de confiança, atendimento 24h no posto e conveniência para quem precisa de praticidade dentro do Complexo Valen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={data.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold hover:brightness-110"
            >
              <MapPin className="h-4 w-4" /> Como chegar
            </a>
            <a
              href={data.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur px-6 py-3 font-semibold hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* APRESENTAÇÃO */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container-valen grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <Img src={posto} alt="Posto Valen" className="w-full aspect-[4/3] object-cover rounded-3xl shadow-glow" loading="lazy" />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Posto Valen
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Estrutura completa para sua parada
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              O Posto Valen oferece uma estrutura completa para motoristas, caminhoneiros, frotistas e empresas que passam pelo Complexo Valen. Com atendimento 24h no abastecimento, combustíveis para linha leve e pesada, Arla e conveniência, é uma parada estratégica para quem vive em movimento.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-secondary/5 border border-secondary/10 px-5 py-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-secondary">Posto com atendimento 24h</p>
                <p className="text-sm text-muted-foreground">Abasteça a qualquer hora, todos os dias.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section className="py-20 bg-surface">
        <div className="container-valen">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Produtos disponíveis
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Combustíveis para toda a sua rota
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <ProductCard
              icon={Fuel}
              title="Abastecimento linha leve"
              items={["Etanol", "Gasolina Comum", "Gasolina aditivada ENERGY"]}
            />
            <ProductCard
              icon={Truck}
              title="Abastecimento linha pesada"
              items={["Diesel S-10", "Diesel S500", "Arla balde / granel"]}
            />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-card border border-border p-5 flex items-start gap-3">
              <Droplets className="h-6 w-6 text-primary shrink-0" />
              <div><p className="font-bold text-secondary">Arla 32</p><p className="text-sm text-muted-foreground">Balde e granel</p></div>
            </div>
            <div className="rounded-2xl bg-card border border-border p-5 flex items-start gap-3">
              <Clock className="h-6 w-6 text-primary shrink-0" />
              <div><p className="font-bold text-secondary">24h todos os dias</p><p className="text-sm text-muted-foreground">Abastecimento sem parar</p></div>
            </div>
            <div className="rounded-2xl bg-card border border-border p-5 flex items-start gap-3">
              <Building2 className="h-6 w-6 text-primary shrink-0" />
              <div><p className="font-bold text-secondary">Frotas e empresas</p><p className="text-sm text-muted-foreground">Atendimento dedicado</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* CONVENIÊNCIA */}
      <section id="conveniencia" className="py-20 md:py-24 bg-background scroll-mt-24">

        <div className="container-valen">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="lg:order-2">
              <Img src={conveniencia} alt="Conveniência Valen" className="w-full aspect-[4/3] object-cover rounded-3xl shadow-glow" loading="lazy" />
            </div>
            <div className="lg:order-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Conveniência Valen
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
                Praticidade para sua parada render mais
              </h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                Na Conveniência Valen, o cliente encontra produtos para o dia a dia, lanches, bebidas e itens essenciais para seguir viagem com mais conforto e praticidade.
              </p>
              <div className="mt-6 rounded-2xl bg-secondary text-white p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Horário da Conveniência</p>
                <ul className="mt-2 text-sm space-y-1 text-white/90">
                  <li><strong>Segunda a sábado:</strong> 06h às 01h20</li>
                  <li><strong>Domingo:</strong> 06h às 19h</li>
                </ul>
                <p className="mt-3 text-xs text-white/70">O abastecimento do posto funciona 24h. A Conveniência possui horário específico de funcionamento.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Coffee, title: "Lanches e bebidas", desc: "Opções rápidas para o dia a dia." },
              { Icon: Package, title: "Produtos rápidos para viagem", desc: "Itens essenciais para a estrada." },
              { Icon: ShoppingBag, title: "Itens de conveniência", desc: "Higiene, snacks e utilidades." },
              { Icon: Building2, title: "Dentro do complexo", desc: "Praticidade sem sair do Valen." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-card border border-border p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-bold text-secondary">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMAS DE PAGAMENTO */}
      <section className="py-20 bg-surface">
        <div className="container-valen">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <CreditCard className="h-3.5 w-3.5" /> Formas de pagamento
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Diversas formas de pagar
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Aceitamos as principais bandeiras, Pix e cartões-frete das principais transportadoras.
            </p>
          </div>

          <div className="mt-10 rounded-3xl bg-white border border-border p-6 md:p-8">
            {hasIndividualLogos ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {data.payment_logos.filter(Boolean).map((url, i) => (
                  <div key={i} className="aspect-[3/2] grid place-items-center rounded-xl border bg-white p-3">
                    <Img src={url} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
                  </div>
                ))}
              </div>
            ) : (
              <Img src={paymentStrip} alt="Formas de pagamento aceitas" className="w-full h-auto object-contain" loading="lazy" />
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => (
                <span key={m} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-secondary">{m}</span>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground text-center">
            <strong className="text-secondary">Aceitamos cartão-frete de transportadoras participantes.</strong> Consulte a lista de transportadoras.
          </p>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-20 bg-background">
        <div className="container-valen">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Diferenciais
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Feito para quem vive em movimento
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { Icon: Clock, title: "Abastecimento 24h", desc: "Estrutura disponível todos os dias para quem está na estrada." },
              { Icon: Truck, title: "Linha leve e pesada", desc: "Combustíveis para carros, utilitários, caminhões e frotas." },
              { Icon: Droplets, title: "Arla disponível", desc: "Arla em balde e granel para mais praticidade na operação." },
              { Icon: ShoppingBag, title: "Conveniência Valen", desc: "Produtos, lanches e itens essenciais para sua parada." },
              { Icon: CreditCard, title: "Pagamento facilitado", desc: "Diversas formas de pagamento e cartão-frete de transportadoras participantes." },
              { Icon: Building2, title: "Estrutura Valen", desc: "Abasteça, faça sua parada e tenha acesso aos serviços do Complexo Valen em um só lugar." },
            ].map(({ Icon, title, desc }) => (
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

      {/* CTA FINAL */}
      <section className="py-20 bg-background">
        <div className="container-valen">
          <div className="rounded-[2rem] bg-gradient-orange p-10 md:p-14 text-primary-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold text-balance">
                Abasteça e faça sua parada no Posto Valen
              </h3>
              <p className="mt-2 text-white/90">
                Combustível, conveniência e estrutura para seguir sua jornada com confiança.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={data.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white text-secondary px-6 py-3 font-bold"
              >
                <MapPin className="h-4 w-4" /> Como chegar
              </a>
              <a
                href={data.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur px-6 py-3 font-semibold"
              >
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProductCard({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Fuel;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl bg-card border border-border p-8">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-orange text-primary-foreground">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-display font-bold text-secondary">{title}</h3>
      </div>
      <ul className="mt-5 space-y-2.5">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span className="text-secondary/90">{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
