import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Clock, ArrowRight, Play, Mail, MapPin, X, Youtube } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { posts as fallbackPosts, categories, blogPromotions, type Post } from "@/data/blog";
import { listPublishedPosts, formatPublishedDate, type BlogPostRow } from "@/lib/blog-api";
import { listActivePromotions, type PromotionRow } from "@/lib/promotions-api";
import { listPublishedVideos, youtubeThumbnail, youtubeEmbedUrl, type VideoRow } from "@/lib/videos-api";


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

export const Route = createFileRoute("/blog")({
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

function BlogPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("Todos");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [dbPromos, setDbPromos] = useState<PromotionRow[]>([]);
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [openVideo, setOpenVideo] = useState<VideoRow | null>(null);


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
  }, []);


  const blogPromosList = useMemo(() => {
    if (dbPromos.length === 0) return null;
    const priority = [...dbPromos].sort((a, b) => {
      const bs = (b.show_on_blog ? 2 : 0) + (b.featured ? 1 : 0);
      const as = (a.show_on_blog ? 2 : 0) + (a.featured ? 1 : 0);
      return bs - as;
    });
    return priority;
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
  }, [query, cat]);

  if (!loaded || posts.length === 0) {
    return (
      <div className="container-valen py-32 text-center text-muted-foreground">
        {loaded ? "Nenhum artigo publicado ainda." : "Carregando…"}
      </div>
    );
  }

  const main = posts.find((p) => p.mainFeatured) ?? posts[0];
  const featured = posts.filter((p) => p.featured && p.slug !== main.slug).slice(0, 4);
  const recent = filtered.filter((p) => p.slug !== main.slug).slice(0, 9);

  const mainVideo = videos.find((v) => v.featured) ?? videos[0] ?? null;
  const otherVideos = mainVideo ? videos.filter((v) => v.id !== mainVideo.id) : [];


  

  return (
    <>
      <PageHero
        eyebrow="Blog do Caminhoneiro"
        title="Blog do Caminhoneiro"
        subtitle="Fique por dentro de tudo que acontece no Complexo Valen: eventos, ações especiais, novidades, dicas da estrada e experiências que movimentam o nosso dia a dia."
        image={main.cover}
      />

      {/* Busca + categorias */}
      <section className="bg-background py-10 border-b border-border">
        <div className="container-valen space-y-6">
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

          <div className="flex flex-wrap gap-2">
            {["Todos", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
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

      {/* Destaques */}
      {query === "" && cat === "Todos" && (
        <section className="py-20 bg-background">
          <div className="container-valen">
            <SectionHeader eyebrow="Em alta" title="Artigos em destaque" />

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
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
      <section className="py-20 bg-surface/40">
        <div className="container-valen">
          <SectionHeader
            eyebrow="Conteúdos recentes"
            title={query || cat !== "Todos" ? `Resultados (${filtered.length})` : "Mais recentes no Blog do Caminhoneiro"}
          />

          {recent.length === 0 ? (
            <p className="mt-10 text-center text-muted-foreground">
              Nenhum artigo encontrado. Tente outra busca ou categoria.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recent.map((p) => (
                <ArticleCardSmall key={p.slug} post={p} />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Vídeos */}
      {mainVideo && (
        <section className="py-20 bg-background">
          <div className="container-valen">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <SectionHeader
                eyebrow="Vídeos"
                title="Vídeos para quem vive na estrada"
                subtitle="Aprenda, atualize-se e descubra o que movimenta o complexo."
              />
              <a
                href="https://www.youtube.com/@complexovalen/videos"
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform"
              >
                <Youtube className="h-4 w-4" /> Ver canal no YouTube
              </a>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-5">
              <VideoCardLarge video={mainVideo} onPlay={() => setOpenVideo(mainVideo)} />
              <div className="lg:col-span-2 grid gap-4">
                {otherVideos.map((v) => (
                  <VideoCardSmall key={v.id} video={v} onPlay={() => setOpenVideo(v)} />
                ))}
              </div>
            </div>

            <div className="mt-8 md:hidden">
              <a
                href="https://www.youtube.com/@complexovalen/videos"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <Youtube className="h-4 w-4" /> Ver canal no YouTube
              </a>
            </div>
          </div>
        </section>
      )}

      <VideoModal video={openVideo} onClose={() => setOpenVideo(null)} />



      {/* Promoções */}
      <section className="py-20 bg-gradient-soft">
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
                    className="snap-start shrink-0 w-[280px] md:w-[320px] rounded-3xl overflow-hidden bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all"
                  >
                    <div className="h-44 overflow-hidden">
                      {p.cover_url && <img src={p.cover_url} alt={p.title} className="h-full w-full object-cover" loading="lazy" />}
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">{p.category}</span>
                      <h3 className="mt-2 font-display font-bold text-lg text-secondary line-clamp-2">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.short_description}</p>
                      <div className="mt-3 flex items-center justify-between">
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
                    className="snap-start shrink-0 w-[280px] md:w-[320px] rounded-3xl overflow-hidden bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all"
                  >
                    <div className="h-44 overflow-hidden">
                      <img src={p.image} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
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

/* -------------------- Cards -------------------- */

function ArticleCardLarge({ post }: { post: Post }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group block rounded-3xl overflow-hidden bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all"
    >
      <div className="aspect-[16/11] overflow-hidden">
        <img
          src={post.cover}
          alt={post.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="p-7">
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">{post.category}</span>
          <span className="text-muted-foreground">{post.publishedAt}</span>
          <span className="text-muted-foreground inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readingTime}
          </span>
        </div>
        <h3 className="mt-4 text-3xl font-display font-extrabold text-secondary leading-tight">{post.title}</h3>
        <p className="mt-3 text-muted-foreground line-clamp-3">{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-bold text-primary">
          Ler mais <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function ArticleCardSmall({ post }: { post: Post }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={post.cover}
          alt={post.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
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
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{post.publishedAt}</span>
          <span className="inline-flex items-center gap-1 font-bold text-primary">
            Ler mais <ArrowRight className="h-3.5 w-3.5" />
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
        <img
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
          <p className="mt-2 text-muted-foreground">{video.short_description}</p>
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
      className="group grid grid-cols-[140px_1fr] gap-4 rounded-2xl overflow-hidden bg-card border border-border hover:shadow-soft transition-all p-3 text-left w-full"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <img
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
      <div className="flex flex-col justify-center pr-2">
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
    <section className="py-20 bg-secondary text-white relative overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[120%] rounded-full bg-primary/20 blur-3xl" />
      <div className="container-valen relative grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
            <Mail className="h-3.5 w-3.5" /> Newsletter
          </span>
          <h3 className="mt-4 text-4xl md:text-5xl font-display font-extrabold leading-tight text-balance">
            Receba novidades do Valen
          </h3>
          <p className="mt-4 text-white/80 max-w-md leading-relaxed">
            Promoções, dicas da estrada e conteúdos úteis para quem vive em movimento.
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
