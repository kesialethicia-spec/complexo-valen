import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Clock,
  ArrowRight,
  Play,
  Mail,
  MapPin,
  X,
  Youtube,
  Route as RouteIcon,
  Wrench,
  Fuel,
  ShieldCheck,
  UtensilsCrossed,
  Sparkles,
  CreditCard,
  Gift,
  BadgeCheck,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { posts as fallbackPosts, categories, blogPromotions, type Post } from "@/data/blog";
import { listPublishedPosts, formatPublishedDate, type BlogPostRow } from "@/lib/blog-api";
import { listActivePromotions, type PromotionRow } from "@/lib/promotions-api";
import { listPublishedVideos, youtubeThumbnail, youtubeEmbedUrl, type VideoRow } from "@/lib/videos-api";
import { getClubeSettings, DEFAULT_CLUBE_SETTINGS, type ClubeSettings } from "@/lib/clube-valen-api";
import { SmartImage } from "@/components/SmartImage";
import { Img } from "@/components/Img";
import celularClube from "@/assets/clube/celular.png.asset.json";
import appTelas from "@/assets/clube/app-telas.png.asset.json";

function adaptRow(row: BlogPostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category as Post["category"],
    cover: row.cover_url || fallbackPosts[0].cover,
    author: row.author,
    publishedAt: formatPublishedDate(row.published_at),
    readingTime: row.reading_time,
    featured: row.featured,
    mainFeatured: row.main_featured,
    tags: row.tags,
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
    content: row.content,
  };
}

export const Route = createFileRoute("/blog-do-caminhoneiro/")({
  head: () => ({
    meta: [
      { title: "Blog do Caminhoneiro — Complexo Valen" },
      {
        name: "description",
        content:
          "Dicas, novidades, promoções e conteúdos úteis para quem vive em movimento. Blog oficial do Complexo Valen.",
      },
      { property: "og:title", content: "Blog do Caminhoneiro — Complexo Valen" },
      {
        property: "og:description",
        content: "Dicas, manutenção, segurança e bem-estar para quem vive na estrada.",
      },
    ],
  }),
  component: BlogPage,
});

/* Temas da fileira "Na estrada com o Valen" */
const THEMES: { label: string; category: string; icon: typeof RouteIcon }[] = [
  { label: "Dicas de estrada", category: "Dicas da Estrada", icon: RouteIcon },
  { label: "Manutenção", category: "Manutenção Preventiva", icon: Wrench },
  { label: "Economia", category: "Economia de Diesel", icon: Fuel },
  { label: "Segurança", category: "Segurança", icon: ShieldCheck },
  { label: "Alimentação", category: "Alimentação e Bem-estar", icon: UtensilsCrossed },
  { label: "Experiências Valen", category: "Experiências Valen", icon: Sparkles },
];

function BlogPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("Todos");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [dbPromos, setDbPromos] = useState<PromotionRow[]>([]);
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [openVideo, setOpenVideo] = useState<VideoRow | null>(null);
  const [clube, setClube] = useState<ClubeSettings>(DEFAULT_CLUBE_SETTINGS);

  useEffect(() => {
    void (async () => {
      try {
        const rows = await listPublishedPosts();
        setPosts(rows.length > 0 ? rows.map(adaptRow) : fallbackPosts);
      } catch {
        setPosts(fallbackPosts);
      } finally {
        setLoaded(true);
      }
    })();
    void (async () => {
      try {
        const rows = await listActivePromotions();
        setDbPromos(rows);
      } catch { /* keep fallback */ }
    })();
    void (async () => {
      try {
        setVideos(await listPublishedVideos());
      } catch {
        setVideos([]);
      }
    })();
    void (async () => {
      try {
        setClube(await getClubeSettings());
      } catch { /* defaults */ }
    })();
  }, []);

  const blogPromosList = useMemo(() => {
    if (dbPromos.length === 0) return null;
    return [...dbPromos].sort((a, b) => {
      const bs = (b.show_on_blog ? 2 : 0) + (b.featured ? 1 : 0);
      const as = (a.show_on_blog ? 2 : 0) + (a.featured ? 1 : 0);
      return bs - as;
    });
  }, [dbPromos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchCat = cat === "Todos" || p.category === cat;
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [query, cat, posts]);

  if (!loaded || posts.length === 0) {
    return (
      <div className="container-valen py-32 text-center text-muted-foreground">
        {loaded ? "Nenhum artigo publicado ainda." : "Carregando…"}
      </div>
    );
  }

  const main = posts.find((p) => p.mainFeatured) ?? posts[0];
  const featured = posts.filter((p) => p.featured && p.slug !== main.slug).slice(0, 4);
  const isFiltering = query !== "" || cat !== "Todos";
  const recent = filtered.filter((p) => (isFiltering ? true : p.slug !== main.slug)).slice(0, 9);

  const mainVideo = videos.find((v) => v.featured) ?? videos[0] ?? null;
  const otherVideos = mainVideo ? videos.filter((v) => v.id !== mainVideo.id).slice(0, 3) : [];

  const themeCover = (category: string) =>
    posts.find((p) => p.category === category)?.cover ?? "";

  return (
    <>
      <PageHero
        compact
        eyebrow="Blog do Caminhoneiro"
        title="Blog do Caminhoneiro"
        subtitle="Fique por dentro de tudo que acontece no Complexo Valen: eventos, ações especiais, novidades, dicas da estrada e experiências que movimentam o nosso dia a dia."
        image={main.cover}
      />

      {/* Busca + categorias */}
      <section className="bg-background py-8 md:py-10 border-b border-border">
        <div className="container-valen space-y-5">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar artigos, dicas, manutenção, segurança..."
              className="w-full rounded-full border border-border bg-card pl-12 pr-5 py-3.5 text-base outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              aria-label="Buscar no blog"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
            {["Todos", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  cat === c
                    ? "bg-gradient-orange text-primary-foreground shadow-glow"
                    : "bg-surface text-muted-foreground hover:bg-surface/70 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Na estrada com o Valen */}
      <section className="py-14 md:py-16 bg-background">
        <div className="container-valen">
          <SectionHeader
            eyebrow="Conteúdos para você"
            title="Na estrada com o Valen"
            subtitle="Informação rápida para deixar sua viagem mais segura, econômica e tranquila."
          />

          <div className="mt-8 flex gap-5 overflow-x-auto pb-3 -mx-5 px-5 md:mx-0 md:px-0 md:overflow-visible md:justify-between">
            {THEMES.map((t) => {
              const Icon = t.icon;
              const active = cat === t.category;
              const cover = themeCover(t.category);
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => {
                    setCat(active ? "Todos" : t.category);
                    setQuery("");
                  }}
                  className="group shrink-0 w-[104px] md:w-auto flex flex-col items-center gap-3 text-center"
                >
                  <span
                    className={`relative grid place-items-center h-24 w-24 md:h-28 md:w-28 rounded-full p-1 transition-all ${
                      active ? "bg-gradient-orange shadow-glow" : "bg-primary/25 group-hover:bg-gradient-orange"
                    }`}
                  >
                    <span className="h-full w-full rounded-full overflow-hidden bg-surface grid place-items-center">
                      {cover ? (
                        <SmartImage
                          src={cover}
                          alt={t.label}
                          rounded="rounded-full"
                          className="h-full w-full"
                          imgClassName="group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <Icon className="h-8 w-8 text-secondary/50" />
                      )}
                    </span>
                  </span>
                  <span
                    className={`text-xs md:text-sm font-semibold leading-tight ${
                      active ? "text-primary" : "text-secondary"
                    }`}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Destaques */}
      {!isFiltering && (
        <section className="py-16 md:py-20 bg-surface/40">
          <div className="container-valen">
            <SectionHeader eyebrow="Em alta" title="Artigos em destaque" />

            <div className="mt-10 grid gap-6 lg:grid-cols-2 items-start">
              <ArticleCardLarge post={main} />
              <div className="grid gap-6 sm:grid-cols-2">
                {featured.map((p) => (
                  <ArticleCardSmall key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recentes */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container-valen">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <SectionHeader
              eyebrow="Conteúdos recentes"
              title={isFiltering ? `Resultados (${filtered.length})` : "Mais recentes no Blog do Caminhoneiro"}
            />
            {isFiltering && (
              <button
                type="button"
                onClick={() => { setCat("Todos"); setQuery(""); }}
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground hover:scale-105 transition-transform"
              >
                Ver todos os artigos <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {recent.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-8 text-center">
              <p className="font-display font-bold text-secondary">Nenhum conteúdo encontrado nessa categoria.</p>
              <p className="mt-1 text-sm text-muted-foreground">Tente selecionar outra categoria.</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((p) => (
                <ArticleCardSmall key={p.slug} post={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Vídeos */}
      {mainVideo && (
        <section className="py-16 md:py-20 bg-surface/40">
          <div className="container-valen">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <SectionHeader
                eyebrow="Vídeos"
                title="Vídeos para quem vive na estrada"
                subtitle="Aprenda, atualize-se e descubra o que movimenta o Complexo Valen."
              />
              <a
                href="https://www.youtube.com/@complexovalen/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform"
              >
                <Youtube className="h-4 w-4" /> Ver canal no YouTube
              </a>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-5 items-start">
              <VideoCardLarge video={mainVideo} onPlay={() => setOpenVideo(mainVideo)} />
              <div className="lg:col-span-2 flex flex-col gap-4 self-start">
                {otherVideos.map((v) => (
                  <VideoCardSmall key={v.id} video={v} onPlay={() => setOpenVideo(v)} />
                ))}
              </div>
            </div>

            <div className="mt-8 md:hidden">
              <a
                href="https://www.youtube.com/@complexovalen/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <Youtube className="h-4 w-4" /> Ver canal no YouTube
              </a>
            </div>
          </div>
        </section>
      )}

      <VideoModal video={openVideo} onClose={() => setOpenVideo(null)} />

      {/* Clube Valen */}
      <ClubeSection settings={clube} />

      {/* Promoções */}
      <section className="py-16 md:py-20 bg-gradient-soft">
        <div className="container-valen">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <SectionHeader
              eyebrow="Promoções"
              title="Promoções em movimento"
              subtitle="Campanhas e vantagens especiais para quem passa pelo Valen."
            />
            <Link
              to="/promocoes"
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:scale-105 transition-transform"
            >
              Ver todas as promoções <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0">
            {blogPromosList
              ? blogPromosList.map((p) => (
                  <Link
                    key={p.id}
                    to="/promocoes/$slug"
                    params={{ slug: p.slug }}
                    className="group snap-start shrink-0 w-[280px] md:w-[calc(33.333%-0.834rem)] xl:w-[calc(25%-0.94rem)] rounded-3xl overflow-hidden bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all"
                  >
                    <div className="h-44 overflow-hidden">
                      <SmartImage
                        src={p.cover_url}
                        alt={p.title}
                        rounded="rounded-none"
                        className="h-full w-full"
                        imgClassName="group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">{p.category}</span>
                      <h3 className="mt-2 font-display font-bold text-lg text-secondary line-clamp-2">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.short_description}</p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-xs text-muted-foreground">{p.validity}</span>
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                          Ver promoção <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              : blogPromotions.map((p) => (
                  <article
                    key={p.id}
                    className="snap-start shrink-0 w-[280px] md:w-[calc(33.333%-0.834rem)] xl:w-[calc(25%-0.94rem)] rounded-3xl overflow-hidden bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all"
                  >
                    <div className="h-44 overflow-hidden">
                      <SmartImage src={p.image} alt={p.title} rounded="rounded-none" className="h-full w-full" />
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">{p.category}</span>
                      <h3 className="mt-2 font-display font-bold text-lg text-secondary line-clamp-2">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.shortDescription}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{p.validity}</span>
                        <Link
                          to={p.link as "/promocoes"}
                          className="inline-flex items-center gap-1 text-sm font-bold text-primary"
                        >
                          Ver promoção <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
          </div>

          <Link
            to="/promocoes"
            className="md:hidden mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground"
          >
            Ver todas as promoções <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}

/* -------------------- Clube Valen -------------------- */

const CLUBE_STEPS = [
  {
    number: "01",
    icon: CreditCard,
    title: "Abasteça",
    subtitle: "Informe seu CPF na hora do pagamento.",
    text: "Ao abastecer no Valen, informe seu CPF ao caixa para começar a acumular pontos.",
  },
  {
    number: "02",
    icon: BadgeCheck,
    title: "Ganhe pontos",
    subtitle: "Seus pontos entram automaticamente.",
    text: "Assim que a venda é finalizada, seus pontos são atualizados no aplicativo.",
  },
  {
    number: "03",
    icon: Gift,
    title: "Aproveite",
    subtitle: "Troque seus pontos por benefícios.",
    text: "Escolha um benefício pelo aplicativo, gere seu voucher e aproveite.",
  },
];

function ClubeSection({ settings }: { settings: ClubeSettings }) {
  const phone = settings.phone_mockup_url || celularClube.url;
  const google = settings.google_play_url;
  const apple = settings.app_store_url;

  return (
    <section className="relative overflow-hidden bg-gradient-hero text-white py-16 md:py-24">
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      <svg aria-hidden className="absolute inset-x-0 top-1/3 w-full opacity-10" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path d="M0,160 C360,20 1080,220 1440,60" stroke="white" strokeWidth="2" fill="none" strokeDasharray="14 12" />
      </svg>

      <div className="container-valen relative grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Clube Valen
          </span>
          <h2 className="mt-5 text-4xl md:text-5xl font-display font-extrabold leading-tight text-balance">
            Seu abastecimento vale muito mais.
          </h2>
          <p className="mt-5 max-w-xl text-white/80 leading-relaxed">
            A cada abastecimento, você acumula pontos e transforma sua passagem pelo Valen em benefícios.
            Tudo pelo aplicativo Clube Valen Fidelidade.
          </p>
          <p className="mt-5 text-xl md:text-2xl font-display font-extrabold text-primary">
            Acumule. Troque. Aproveite.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={apple || "#"}
              target={apple ? "_blank" : undefined}
              rel={apple ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-secondary shadow-lg transition hover:-translate-y-0.5"
            >
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-medium uppercase tracking-wider opacity-70">Baixar na</span>
                App Store
              </span>
            </a>
            <a
              href={google || "#"}
              target={google ? "_blank" : undefined}
              rel={google ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-secondary shadow-lg transition hover:-translate-y-0.5"
            >
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-medium uppercase tracking-wider opacity-70">Baixar no</span>
                Google Play
              </span>
            </a>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute inset-0 -z-0 m-auto h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <Img
            src={phone}
            alt="Aplicativo Clube Valen Fidelidade"
            sizes="(max-width: 1024px) 80vw, 40vw"
            className="relative z-10 w-[260px] md:w-[340px] lg:w-[400px] drop-shadow-2xl"
            loading="lazy"
          />
          <Img
            src={appTelas.url}
            alt=""
            aria-hidden
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="hidden md:block absolute z-20 -left-2 bottom-0 w-[210px] lg:w-[260px] drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </div>

      <div className="container-valen relative mt-14 grid gap-5 md:grid-cols-3">
        {CLUBE_STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.number}
              className="rounded-3xl bg-white/10 backdrop-blur border border-white/15 p-6 transition hover:-translate-y-1 hover:bg-white/15"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-orange">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </span>
                <span className="font-display text-2xl font-extrabold text-white/40">{s.number}</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-1 text-sm font-semibold text-primary">{s.subtitle}</p>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">{s.text}</p>
            </div>
          );
        })}
      </div>

      <div className="container-valen relative mt-10">
        <Link
          to="/clube-valen-fidelidade"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-4 text-base font-bold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform"
        >
          Conheça o Clube Valen <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

/* -------------------- Cards -------------------- */

function ArticleCardLarge({ post }: { post: Post }) {
  return (
    <Link
      to="/blog-do-caminhoneiro/$slug"
      params={{ slug: post.slug }}
      className="group block rounded-3xl overflow-hidden bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all"
    >
      <div className="aspect-[16/11] overflow-hidden">
        <SmartImage
          src={post.cover}
          alt={post.title}
          rounded="rounded-none"
          className="h-full w-full"
          imgClassName="group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="p-6 md:p-7">
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">{post.category}</span>
          <span className="text-muted-foreground">{post.publishedAt}</span>
          <span className="text-muted-foreground inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readingTime}
          </span>
        </div>
        <h3 className="mt-4 text-2xl md:text-3xl font-display font-extrabold text-secondary leading-tight">
          {post.title}
        </h3>
        <p className="mt-3 text-muted-foreground line-clamp-3">{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-bold text-primary">
          Ler artigo <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

function ArticleCardSmall({ post }: { post: Post }) {
  return (
    <Link
      to="/blog-do-caminhoneiro/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <SmartImage
          src={post.cover}
          alt={post.title}
          rounded="rounded-none"
          className="h-full w-full"
          imgClassName="group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-bold text-primary">{post.category}</span>
          <span className="text-muted-foreground inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readingTime}
          </span>
        </div>
        <h3 className="mt-3 font-display font-bold text-lg text-secondary line-clamp-2 leading-snug">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{post.publishedAt}</span>
          <span className="inline-flex items-center gap-1 font-bold text-primary">
            Ler mais <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* -------------------- Vídeos -------------------- */

function VideoCardLarge({ video, onPlay }: { video: VideoRow; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="lg:col-span-3 group text-left block rounded-3xl overflow-hidden bg-card border border-border hover:shadow-glow transition-all"
    >
      <div className="relative aspect-video overflow-hidden">
        <Img
          src={youtubeThumbnail(video.youtube_id, "max")}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = youtubeThumbnail(video.youtube_id, "hq"); }}
          alt={video.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-secondary/30 group-hover:bg-secondary/10 transition" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-gradient-orange flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
            <Play className="h-8 w-8 text-primary-foreground fill-current" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">{video.category}</span>
        <h3 className="mt-2 text-2xl font-display font-bold text-secondary">{video.title}</h3>
        {video.short_description && (
          <p className="mt-2 text-muted-foreground line-clamp-2">{video.short_description}</p>
        )}
      </div>
    </button>
  );
}

function VideoCardSmall({ video, onPlay }: { video: VideoRow; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="group flex items-center gap-4 rounded-2xl overflow-hidden bg-card border border-border hover:shadow-soft hover:-translate-y-0.5 transition-all p-3 text-left w-full"
    >
      <div className="relative w-[140px] shrink-0 aspect-video overflow-hidden rounded-xl">
        <Img
          src={youtubeThumbnail(video.youtube_id, "mq")}
          alt={video.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-gradient-orange flex items-center justify-center">
            <Play className="h-4 w-4 text-primary-foreground fill-current" />
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center pr-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{video.category}</span>
        <h4 className="mt-1 font-display font-bold text-sm text-secondary line-clamp-2 leading-snug">
          {video.title}
        </h4>
      </div>
    </button>
  );
}

function VideoModal({ video, onClose }: { video: VideoRow | null; onClose: () => void }) {
  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [video, onClose]);

  if (!video) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute -top-12 right-0 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" /> Fechar
        </button>
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-glow">
          <iframe
            src={youtubeEmbedUrl(video.youtube_id)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="mt-4 text-white">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">{video.category}</span>
          <h3 className="mt-1 text-xl font-display font-bold">{video.title}</h3>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Newsletter -------------------- */

function Newsletter() {
  return (
    <section className="py-16 md:py-20 bg-secondary text-white relative overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[120%] rounded-full bg-primary/20 blur-3xl" />
      <div className="container-valen relative grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
            <Mail className="h-3.5 w-3.5" /> Newsletter
          </span>
          <h3 className="mt-4 text-4xl md:text-5xl font-display font-extrabold leading-tight text-balance">
            Não perca a próxima parada.
          </h3>
          <p className="mt-4 text-white/80 max-w-md leading-relaxed">
            Receba promoções, novidades, conteúdos de estrada e experiências do Valen direto no seu WhatsApp ou e-mail.
          </p>
          <p className="mt-2 text-xs text-white/50 inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> Complexo Valen — São Luís/MA
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLFormElement).reset();
            alert("Obrigado! Em breve entraremos em contato.");
          }}
          className="grid gap-3 bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6"
        >
          <input
            required
            type="text"
            placeholder="Seu nome"
            className="rounded-full border border-white/20 bg-white/10 px-5 py-3.5 placeholder:text-white/50 outline-none focus:ring-2 focus:ring-primary/40"
          />
          <input
            required
            type="text"
            placeholder="E-mail ou WhatsApp"
            className="rounded-full border border-white/20 bg-white/10 px-5 py-3.5 placeholder:text-white/50 outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-orange px-7 py-4 text-base font-bold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform"
          >
            Quero receber
          </button>
        </form>
      </div>
    </section>
  );
}
