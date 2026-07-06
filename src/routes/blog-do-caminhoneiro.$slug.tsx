import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Clock, MapPin, Tag } from "lucide-react";
import { marked } from "marked";
import { posts as fallbackPosts, banners, type Post } from "@/data/blog";
import { getPostBySlug, formatPublishedDate } from "@/lib/blog-api";

export const Route = createFileRoute("/blog-do-caminhoneiro/$slug")({
  notFoundComponent: () => (
    <div className="container-valen py-32 text-center">
      <h1 className="text-4xl font-display font-extrabold text-secondary">Artigo não encontrado</h1>
      <p className="mt-4 text-muted-foreground">O conteúdo que você procura pode ter sido movido.</p>
      <Link
        to="/blog-do-caminhoneiro"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-6 py-3 text-sm font-semibold text-primary-foreground"
      >
        Voltar para o blog <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  ),
  component: ArticlePage,
});

function looksLikeHtml(s: string) {
  return /<\w+[\s>]/.test(s);
}

function ArticlePage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notExists, setNotExists] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const row = await getPostBySlug(slug);
        if (row) {
          setPost({
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
            content: looksLikeHtml(row.content) ? row.content : (marked.parse(row.content) as string),
          });
        } else {
          const fb = fallbackPosts.find((p) => p.slug === slug);
          if (fb) setPost(fb);
          else setNotExists(true);
        }
      } catch {
        const fb = fallbackPosts.find((p) => p.slug === slug);
        if (fb) setPost(fb);
        else setNotExists(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  useEffect(() => {
    if (post) document.title = post.metaTitle ?? `${post.title} — Blog do Caminhoneiro Valen`;
  }, [post]);

  if (loading) {
    return <div className="container-valen py-32 text-center text-muted-foreground">Carregando…</div>;
  }
  if (notExists || !post) {
    throw notFound();
  }

  const related = fallbackPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);
  const fallback = fallbackPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const readAlso = related.length >= 3 ? related : [...related, ...fallback].slice(0, 3);

  const endBanner = banners.find((b) => b.placement === "article-end")!;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-hero text-white pt-20 pb-32">
        <div className="absolute inset-0 opacity-25">
          <img src={post.cover} alt="" className="h-full w-full object-cover mix-blend-overlay" />
        </div>
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-primary/40 blur-3xl" />

        <div className="container-valen relative">
          <nav className="text-xs text-white/70 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog-do-caminhoneiro" className="hover:text-white">Blog do Caminhoneiro</Link>
            <span className="mx-2">/</span>
            <span className="text-white/50">{post.category}</span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
            {post.category}
          </span>

          <h1 className="mt-5 max-w-4xl text-4xl md:text-6xl font-display font-extrabold tracking-tight leading-[1.1] text-balance">
            {post.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-white/85 leading-relaxed">{post.excerpt}</p>

          <div className="mt-8 flex flex-wrap gap-5 text-sm text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {post.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readingTime}
            </span>
            <span className="inline-flex items-center gap-1.5">por {post.author}</span>
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,90 1080,0 1440,50 L1440,80 L0,80 Z" fill="var(--background)" />
        </svg>
      </section>

      <section className="py-16 bg-background">
        <div className="container-valen grid gap-12 lg:grid-cols-[1fr_320px]">
          <article className="min-w-0">
            <div className="-mt-32 mb-12 overflow-hidden rounded-3xl shadow-glow">
              <img src={post.cover} alt={post.title} className="w-full aspect-[16/9] object-cover" />
            </div>

            <div className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} />

            {post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((t: string) => (
                  <span key={t} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-card border border-border p-6">
              <h4 className="font-display font-bold text-lg text-secondary">Artigos relacionados</h4>
              <ul className="mt-4 space-y-4">
                {readAlso.map((p) => (
                  <li key={p.slug}>
                    <Link to="/blog-do-caminhoneiro/$slug" params={{ slug: p.slug }} className="group grid grid-cols-[64px_1fr] gap-3">
                      <img src={p.cover} alt="" className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          {p.category}
                        </span>
                        <p className="text-sm font-semibold text-secondary line-clamp-2 group-hover:text-primary transition-colors">
                          {p.title}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="https://maps.google.com/?q=Complexo+Valen+São+Luís+MA"
              target="_blank"
              rel="noreferrer"
              className="block rounded-3xl bg-card border border-border p-6 hover:shadow-soft transition-all"
            >
              <span className="inline-flex items-center gap-2 text-primary font-bold text-sm">
                <MapPin className="h-4 w-4" /> Como chegar
              </span>
              <h4 className="mt-2 font-display font-bold text-secondary">Sua próxima parada é o Valen</h4>
              <p className="mt-1 text-sm text-muted-foreground">São Luís/MA — estrutura completa 24h.</p>
            </a>
          </aside>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container-valen">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-orange text-primary-foreground p-10 md:p-14 grid lg:grid-cols-[1fr_auto] items-center gap-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold leading-tight">{endBanner.title}</h3>
              <p className="mt-3 text-lg text-primary-foreground/85 max-w-xl">{endBanner.text}</p>
            </div>
            <a
              href={endBanner.buttonLink}
              target={endBanner.buttonLink.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-7 py-4 text-base font-bold text-secondary-foreground shadow-soft hover:scale-105 transition-transform"
            >
              {endBanner.buttonText} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
