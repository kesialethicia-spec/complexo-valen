import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Tag, ArrowRight, ChevronLeft, ChevronRight, Calendar, Search, Sparkles, Share2, BadgePercent } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import postoImg from "@/assets/posto.jpg";
import truckImg from "@/assets/truck-center.jpg";
import foodImg from "@/assets/alimentacao.jpg";
import parkImg from "@/assets/estacionamento.jpg";
import festaImg from "@/assets/festa.jpg";
import hotelImg from "@/assets/hotel.jpg";
import caminhoneiroAsset from "@/assets/promocoes/caminhoneiro-promo.png.asset.json";
import tinosClubeAsset from "@/assets/promocoes/tinos-clube.png.asset.json";
import { listActivePromotions, PROMOTION_CATEGORIES, type PromotionRow } from "@/lib/promotions-api";



export const Route = createFileRoute("/promocoes/")({
  head: () => ({
    meta: [
      { title: "Promoções e ofertas Valen — campanhas e vantagens" },
      { name: "description", content: "Encontre campanhas, vantagens e oportunidades especiais em abastecimento, conveniência, alimentação, serviços e muito mais no Complexo Valen." },
      { property: "og:title", content: "Promoções e ofertas Valen para você aproveitar" },
      { property: "og:description", content: "Campanhas, vantagens e oportunidades especiais para quem vive em movimento." },
      { property: "og:type", content: "website" },
    ],
  }),
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
  updatedAt?: string;
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
    updatedAt: r.updated_at,
  };
}

const filtros = ["Todas", ...PROMOTION_CATEGORIES];

const ORDENACOES = [
  { value: "todas", label: "Todas as promoções" },
  { value: "ativas", label: "Promoções ativas" },
  { value: "destaque", label: "Promoções em destaque" },
  { value: "recentes", label: "Últimas promoções" },
] as const;

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* ---------------- HERO ---------------- */

function PromoHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-valen relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Campanhas imperdíveis
          </span>
          <h1 className="mt-5 text-4xl font-display font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl">
            Promoções e ofertas Valen para você aproveitar!
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-white/95">
            Encontre campanhas, vantagens e oportunidades especiais em abastecimento, conveniência, alimentação, serviços e muito mais.
          </p>
          <div className="mt-8">
            <a
              href="#promocoes"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-secondary/90 hover:shadow-xl"
            >
              Ver promoções <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* composição da imagem */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-glow ring-8 ring-white/30">
            <img
              src={caminhoneiroAsset.url}
              alt="Caminhoneiro sorrindo ao ver uma promoção do Valen no celular"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-secondary/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-2xl bg-white/95 px-4 py-3 backdrop-blur">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Vantagem na palma da mão</p>
                <p className="truncate text-sm font-display font-bold text-secondary">Promoções pensadas para a estrada</p>
              </div>
              <BadgePercent className="h-8 w-8 shrink-0 text-primary" />
            </div>
          </div>
          <span className="absolute -left-4 top-8 hidden rotate-[-6deg] rounded-2xl bg-secondary px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-white shadow-lg md:block">
            Oferta Valen
          </span>
        </div>
      </div>
    </section>
  );
}


/* ---------------- VITRINE ---------------- */

function PromoCard({ p, compact = false }: { p: PromoItem; compact?: boolean }) {
  const share = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = p.slug ? `${window.location.origin}/promocoes/${p.slug}` : window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: p.title, url }); } catch { /* cancelado */ }
    } else {
      void navigator.clipboard?.writeText(url);
    }
  };

  const body = (
    <>
      <div className={`relative overflow-hidden ${compact ? "h-40" : "h-52"}`}>
        <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-secondary">
          <Tag className="h-3 w-3 text-primary" /> {p.cat}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-orange px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-primary-foreground shadow">
          Promoção
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        {p.validade && (
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> {p.validade}
          </p>
        )}
        <h3 className="mt-2 text-lg font-display font-bold leading-snug text-secondary">{p.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.desc}</p>
        <div className="mt-5 flex items-center justify-between gap-3 pt-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition group-hover:bg-gradient-orange group-hover:text-primary-foreground">
            Ver promoção <ArrowRight className="h-4 w-4" />
          </span>
          <button
            type="button"
            onClick={share}
            aria-label={`Compartilhar ${p.title}`}
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-surface hover:text-primary"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );

  const cls = "group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-glow";
  return p.slug ? (
    <Link to="/promocoes/$slug" params={{ slug: p.slug }} className={cls}>{body}</Link>
  ) : (
    <article className={cls}>{body}</article>
  );
}

function Vitrine({ items }: { items: PromoItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6500, stopOnInteraction: false })]);
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    setSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  if (items.length === 0) return null;

  return (
    <section className="pb-14 pt-12 md:pb-20 md:pt-16">
      <div className="container-valen">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Vitrine de oportunidades</p>
            <h2 className="mt-1 text-2xl font-display font-extrabold text-white md:text-4xl">Destaques da vez</h2>
          </div>
        </div>

        <div className="mt-8">
          {/* banner-card principal (carrossel quando houver mais de um destaque) */}
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem]" ref={emblaRef}>
              <div className="flex">
                {items.map((p) => (
                  <div key={p.id} className="min-w-0 flex-[0_0_100%]">
                    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-secondary md:min-h-[520px]">
                      <img src={p.img} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-secondary/10" />
                      <div className="relative flex h-full min-h-[420px] flex-col justify-end gap-4 p-7 text-white md:min-h-[520px] md:p-12">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-orange px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary-foreground">
                            Promoção
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                            <Tag className="h-3 w-3" /> {p.cat}
                          </span>
                          {p.validade && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                              <Calendar className="h-3 w-3" /> {p.validade}
                            </span>
                          )}
                        </div>
                        <h3 className="max-w-2xl text-3xl font-display font-extrabold leading-tight md:text-5xl">{p.title}</h3>
                        <p className="max-w-xl text-base text-white/85">{p.desc}</p>
                        <div className="pt-1">
                          {p.slug ? (
                            <Link
                              to="/promocoes/$slug"
                              params={{ slug: p.slug }}
                              className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition hover:scale-[1.03]"
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
                ))}
              </div>
            </div>

            {items.length > 1 && (
              <>
                <button type="button" aria-label="Anterior" onClick={() => emblaApi?.scrollPrev()} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-secondary shadow hover:bg-white">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" aria-label="Próximo" onClick={() => emblaApi?.scrollNext()} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-secondary shadow hover:bg-white">
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="mt-5 flex justify-center gap-2">
                  {snaps.map((_, i) => (
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
      </div>
    </section>
  );
}

/* ---------------- CLUBE ---------------- */

function ClubeValen() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container-valen">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-secondary">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute left-1/2 top-0 hidden h-full w-[42%] -skew-x-12 bg-white/5 lg:block" />
          </div>
          <div className="relative grid items-center gap-8 p-8 md:p-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" /> Benefícios exclusivos
              </span>
              <h2 className="mt-5 text-3xl font-display font-extrabold leading-tight md:text-5xl">Clube Valen Fidelidade</h2>
              <p className="mt-4 max-w-lg text-lg text-white/85">
                Junte pontos, acompanhe benefícios e aproveite vantagens exclusivas no Valen.
              </p>
              <p className="mt-3 max-w-lg text-base text-white/70">
                Com o Clube Valen Fidelidade, você pode acessar benefícios especiais e aproveitar ainda mais a sua jornada com o Valen.
              </p>
              <Link
                to="/servicos/clube-do-caminhoneiro"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:scale-[1.03]"
              >
                Saiba mais <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative flex items-end justify-center">
              <div className="absolute bottom-0 h-56 w-56 rounded-full bg-gradient-orange opacity-90 blur-[2px] md:h-72 md:w-72" />
              <img
                src={tinosClubeAsset.url}
                alt="Mascotes Tino e Tina apresentando o app do Clube Valen Fidelidade"
                className="relative w-full max-w-sm object-contain drop-shadow-2xl"
                loading="lazy"
              />
              <span className="absolute right-0 top-4 rotate-3 rounded-2xl bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-secondary shadow-lg">
                Programa de fidelidade
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PÁGINA ---------------- */

function Promocoes() {
  const [cat, setCat] = useState("Todas");
  const [ordem, setOrdem] = useState<string>("todas");
  const [busca, setBusca] = useState("");
  const [termo, setTermo] = useState("");
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

  const lista = useMemo(() => {
    let out = items.filter((p) => cat === "Todas" || p.cat === cat);
    if (termo) {
      const q = normalize(termo);
      out = out.filter((p) => normalize(`${p.title} ${p.desc} ${p.cat}`).includes(q));
    }
    if (ordem === "destaque") out = out.filter((p) => p.featured);
    if (ordem === "recentes") {
      out = [...out].sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
    }
    return out;
  }, [items, cat, termo, ordem]);

  return (
    <>
      <div className="bg-gradient-orange">
      <PromoHero />

      {/* BUSCA E FILTROS */}
      <section id="promocoes" className="scroll-mt-24 pt-4 md:pt-6">
        <div className="container-valen">
          <h2 className="text-2xl font-display font-extrabold text-white md:text-4xl">
            Promoções e ofertas completas para você
          </h2>

          <div className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
            <form
              onSubmit={(e) => { e.preventDefault(); setTermo(busca.trim()); }}
              className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]"
            >
              <div className="relative min-w-0">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Qual promoção você está procurando?"
                  aria-label="Buscar promoções"
                  className="w-full rounded-full border border-border bg-surface py-3.5 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary"
                />
              </div>
              <select
                value={ordem}
                onChange={(e) => setOrdem(e.target.value)}
                aria-label="Filtrar promoções"
                className="rounded-full border border-border bg-surface px-5 py-3.5 text-sm font-semibold text-foreground outline-none transition focus:border-primary"
              >
                {ORDENACOES.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-full bg-gradient-orange px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:scale-[1.02]"
              >
                Buscar
              </button>
            </form>

            <div className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1">
              {filtros.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${cat === c ? "bg-gradient-orange text-primary-foreground shadow" : "bg-surface text-muted-foreground hover:bg-surface/70"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Vitrine items={destaques} />
      </div>

      {/* GRID */}
      <section className="bg-background py-14 md:py-20">
        <div className="container-valen">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-display font-extrabold text-secondary md:text-3xl">Todas as promoções</h2>
            <p className="text-sm text-muted-foreground">{lista.length} {lista.length === 1 ? "promoção" : "promoções"}</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lista.map((p) => <PromoCard key={p.id} p={p} />)}
          </div>
          {lista.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border py-16 text-center">
              <p className="text-sm text-muted-foreground">Nenhuma promoção encontrada com esses filtros.</p>
              <button
                onClick={() => { setCat("Todas"); setBusca(""); setTermo(""); setOrdem("todas"); }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-bold text-primary"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      <ClubeValen />
    </>
  );
}
