import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, ShoppingBasket, Croissant, Store, ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { SmartImage } from "@/components/SmartImage";
import { listPublishedMarkets, type MarketRow } from "@/lib/markets-api";

export const Route = createFileRoute("/servicos/mercado")({
  head: () => ({
    meta: [
      { title: "Mercado | Complexo Valen" },
      {
        name: "description",
        content:
          "Mercados, conveniência, padaria e itens essenciais no Complexo Valen: Armazzem Container, Armazzem e Valen Mix.",
      },
      { property: "og:title", content: "Mercado | Complexo Valen" },
      {
        property: "og:description",
        content:
          "Conheça os mercados do Complexo Valen: Armazzem Container, Armazzem e Valen Mix — conveniência, padaria e produtos essenciais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MercadoPage,
});

const HIGHLIGHTS = [
  { Icon: Store, title: "Mercados", desc: "Opções completas e mini mercados dentro do complexo." },
  { Icon: Croissant, title: "Padaria", desc: "Pães, lanches e itens fresquinhos para a sua parada." },
  { Icon: ShoppingBasket, title: "Essenciais", desc: "Produtos básicos e itens de conveniência sempre por perto." },
];

function MercadoPage() {
  const { data: markets = [], isLoading } = useQuery({
    queryKey: ["markets-public"],
    queryFn: listPublishedMarkets,
  });

  return (
    <>
      <PageHero
        eyebrow="Mercado"
        title="Mercado"
        subtitle="No Valen, você encontra opções de mercado, conveniência, padaria e itens essenciais para tornar sua parada mais prática e completa."
      />

      <section className="py-16 bg-background">
        <div className="container-valen grid gap-6 md:grid-cols-3">
          {HIGHLIGHTS.map(({ Icon, title, desc }) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-7 shadow-sm">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-orange text-primary-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-display font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="container-valen">
          <SectionHeader eyebrow="Onde comprar" title="Mercados do Complexo Valen" />
          {isLoading ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">Carregando mercados…</p>
          ) : markets.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">Nenhum mercado publicado no momento.</p>
          ) : (
            <div className="mt-14 space-y-10">
              {markets.map((m, i) => (
                <MarketCard key={m.id} market={m} reverse={i % 2 === 1} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-valen">
          <div className="rounded-3xl bg-gradient-hero px-8 py-12 text-center text-white md:px-16">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold">Tudo o que você precisa, na mesma parada</h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/85 leading-relaxed">
              Além dos mercados, o Complexo Valen reúne lojas, serviços e conveniência para deixar a sua rota mais simples.
            </p>
            <Link
              to="/lojas"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Conhecer as lojas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function MarketCard({ market, reverse }: { market: MarketRow; reverse: boolean }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className={`grid lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <SmartImage
          src={market.image_url}
          alt={market.name}
          rounded="rounded-none"
          className="min-h-[260px] lg:min-h-full"
        />
        <div className="p-8 md:p-10">
          <h3 className="text-2xl md:text-3xl font-display font-extrabold text-secondary">{market.name}</h3>
          {market.location && (
            <p className="mt-3 inline-flex items-start gap-2 text-sm font-semibold text-primary">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {market.location}
            </p>
          )}
          {market.description && (
            <p className="mt-4 text-muted-foreground leading-relaxed">{market.description}</p>
          )}
          {market.full_description && (
            <p className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-line">{market.full_description}</p>
          )}
          {market.features.length > 0 && (
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {market.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
          )}
          {market.gallery_urls?.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-3">
              {market.gallery_urls.map((url) => (
                <SmartImage key={url} src={url} alt={market.name} className="aspect-[4/3]" rounded="rounded-xl" />
              ))}
            </div>
          )}
          {market.cta_url && (
            <a
              href={market.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-secondary/20 px-6 py-2.5 text-sm font-bold text-secondary hover:bg-surface transition-colors"
            >
              <MapPin className="h-4 w-4" /> {market.cta_text || "Ver localização"}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
