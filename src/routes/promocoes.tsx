import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Tag, ArrowRight, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import postoImg from "@/assets/posto.jpg";
import truckImg from "@/assets/truck-center.jpg";
import foodImg from "@/assets/alimentacao.jpg";
import parkImg from "@/assets/estacionamento.jpg";
import festaImg from "@/assets/festa.jpg";
import hotelImg from "@/assets/hotel.jpg";
import { listActivePromotions, PROMOTION_CATEGORIES, type PromotionRow } from "@/lib/promotions-api";

export const Route = createFileRoute("/promocoes")({
  head: () => ({ meta: [{ title: "Promoções — Complexo Valen" }, { name: "description", content: "Ofertas, campanhas e vantagens especiais para quem passa pelo Valen." }] }),
  component: Promocoes,
});

type PromoItem = {
  id: string;
  slug?: string;
  title: string;
  cat: string;
  validade: string;
  desc: string;
  img: string;
  featured?: boolean;
};

const fallback: PromoItem[] = [
  { id: "1", title: "Diesel com preço especial", cat: "Posto", validade: "Até 31/12", desc: "Condições exclusivas para abastecimento no Posto Valen.", img: postoImg, featured: true },
  { id: "2", title: "Voucher na Conveniência", cat: "Conveniência", validade: "Campanha ativa", desc: "Abasteça e participe de campanhas especiais.", img: foodImg, featured: true },
  { id: "3", title: "Estacionamento condição especial", cat: "Estacionamento", validade: "Promoção", desc: "Confira as condições para garantir sua permanência no pátio.", img: parkImg },
  { id: "4", title: "Troca de óleo em promoção", cat: "Truck Center", validade: "Até esgotar", desc: "Manutenção preventiva com condições especiais.", img: truckImg },
  { id: "5", title: "Promoção em lojas do complexo", cat: "Lojas", validade: "Mensal", desc: "Descontos exclusivos nas lojas do Complexo Valen.", img: hotelImg },
  { id: "6", title: "Sexta Valen", cat: "Eventos", validade: "Toda sexta", desc: "Música, promoções e relacionamento.", img: festaImg, featured: true },
];

function adapt(r: PromotionRow): PromoItem {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    cat: r.category,
    validade: r.validity || "Promoção",
    desc: r.short_description,
    img: r.cover_url || postoImg,
    featured: r.featured,
  };
}

const filtros = ["Todas", ...PROMOTION_CATEGORIES];

function FeaturedCarousel({ items }: { items: PromoItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);
  const [selected, setSelected] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  if (items.length === 0) return null;

  return (
    <section className="pt-10 md:pt-14 bg-background">
      <div className="container-valen">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
            <div className="flex">
              {items.map((p) => (
                <div key={p.id} className="min-w-0 flex-[0_0_100%]">
                  <div className="relative overflow-hidden rounded-3xl bg-secondary">
                    <div className="grid md:grid-cols-2">
                      <div className="relative h-64 md:h-[460px]">
                        <img src={p.img} alt={p.title} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent md:hidden" />
                      </div>
                      <div className="relative flex flex-col justify-center gap-4 p-8 md:p-12 text-white">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                            <Tag className="h-3 w-3" /> {p.cat}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                            <Calendar className="h-3 w-3" /> {p.validade}
                          </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-balance">
                          {p.title}
                        </h2>
                        <p className="max-w-lg text-base md:text-lg text-white/85 leading-relaxed">{p.desc}</p>
                        <div className="pt-2">
                          {p.slug ? (
                            <Link
                              to="/promocoes/$slug"
                              params={{ slug: p.slug }}
                              className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:opacity-90 transition"
                            >
                              Ver promoção <ArrowRight className="h-4 w-4" />
                            </Link>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow">
                              Ver promoção <ArrowRight className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Anterior"
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute left-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-secondary shadow hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Próximo"
                onClick={() => emblaApi?.scrollNext()}
                className="absolute right-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-secondary shadow hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="mt-5 flex justify-center gap-2">
                {scrollSnaps.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Ir para slide ${i + 1}`}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={`h-2.5 rounded-full transition-all ${i === selected ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Promocoes() {
  const [f, setF] = useState("Todas");
  const [items, setItems] = useState<PromoItem[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const rows = await listActivePromotions();
        setItems(rows.length ? rows.map(adapt) : fallback);
      } catch {
        setItems(fallback);
      }
    })();
  }, []);

  const destaques = useMemo(() => {
    const featured = items.filter((p) => p.featured);
    return featured.length ? featured : items.slice(0, 3);
  }, [items]);

  const lista = useMemo(() => items.filter((p) => f === "Todas" || p.cat === f), [items, f]);

  return (
    <>
      <PageHero eyebrow="Promoções" title="Promoções em movimento" subtitle="Ofertas, campanhas e vantagens especiais para quem passa pelo Valen." />

      <FeaturedCarousel items={destaques} />

      <section className="pt-12 pb-6 bg-background">
        <div className="container-valen">
          <div className="flex flex-wrap gap-2">
            {filtros.map((c) => (
              <button key={c} onClick={() => setF(c)} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${f === c ? "bg-gradient-orange text-primary-foreground" : "bg-surface text-muted-foreground hover:bg-surface/80"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 bg-background">
        <div className="container-valen">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lista.map((p) => {
              const Card = (
                <>
                  <div className="relative h-48 overflow-hidden">
                    <img src={p.img} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground"><Tag className="h-3 w-3" /> {p.cat}</span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold text-muted-foreground">{p.validade}</p>
                    <h3 className="mt-1.5 text-lg font-display font-bold text-secondary">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      Ver promoção <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </>
              );
              return p.slug ? (
                <Link key={p.id} to="/promocoes/$slug" params={{ slug: p.slug }} className="block overflow-hidden rounded-3xl bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all">
                  {Card}
                </Link>
              ) : (
                <article key={p.id} className="overflow-hidden rounded-3xl bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all">
                  {Card}
                </article>
              );
            })}
          </div>
          {lista.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-12">Nenhuma promoção encontrada nesta categoria.</p>
          )}
        </div>
      </section>
    </>
  );
}
