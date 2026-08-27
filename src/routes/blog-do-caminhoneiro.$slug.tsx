import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { posts as fallbackPosts, type Post } from "@/data/blog";
import { SmartImage } from "@/components/SmartImage";
import {
  getPostBySlug,
  listPublishedPosts,
  formatPublishedDate,
  type BlogPostRow,
} from "@/lib/blog-api";

export const Route = createFileRoute("/blog-do-caminhoneiro/$slug")({
  loader: async ({ params }) => {
    try {
      const row = await getPostBySlug(params.slug);
      return { seo: row };
    } catch {
      return { seo: null };
    }
  },
  head: ({ params, loaderData }) => {
    const row = loaderData?.seo;
    const url = `https://valen-route-connect.lovable.app/blog-do-caminhoneiro/${params.slug}`;
    if (!row) {
      return {
        meta: [
          { title: "Artigo não encontrado | Blog do Caminhoneiro" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = row.meta_title || `${row.title} | Blog do Caminhoneiro Valen`;
    const description =
      row.meta_description || row.excerpt || `${row.title} — Blog do Caminhoneiro do Complexo Valen.`;
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 160) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 160) },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(row.cover_url ? [{ property: "og:image", content: row.cover_url }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
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

interface RelatedItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover: string;
  publishedAt: string;
}

function adaptRelated(row: BlogPostRow): RelatedItem {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    cover: row.cover_url || fallbackPosts[0].cover,
    publishedAt: formatPublishedDate(row.published_at),
  };
}

function ArticlePage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<RelatedItem[]>([]);
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
            content: DOMPurify.sanitize(
              looksLikeHtml(row.content) ? row.content : (marked.parse(row.content) as string),
            ),
          });

          // related from DB
          try {
            const all = await listPublishedPosts();
            const sameCat = all.filter((p) => p.slug !== row.slug && p.category === row.category);
            const others = all.filter((p) => p.slug !== row.slug && p.category !== row.category);
            const pool = [...sameCat, ...others].slice(0, 3).map(adaptRelated);
            setRelated(pool);
          } catch {
            setRelated([]);
          }
        } else {
          const fb = fallbackPosts.find((p) => p.slug === slug);
          if (fb) {
            setPost(fb);
            setRelated(
              fallbackPosts
                .filter((p) => p.slug !== fb.slug)
                .slice(0, 3)
                .map((p) => ({
                  slug: p.slug,
                  title: p.title,
                  excerpt: p.excerpt,
                  category: p.category,
                  cover: p.cover,
                  publishedAt: p.publishedAt,
                })),
            );
          } else {
            setNotExists(true);
          }
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

  return (
    <>
      {/* Editorial header */}
      <article className="bg-background pt-12 pb-16">
        <div className="mx-auto max-w-[900px] px-5">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog-do-caminhoneiro" className="hover:text-primary">Blog do Caminhoneiro</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground/70 line-clamp-1 inline">{post.title}</span>
          </nav>

          {/* Category */}
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="mt-5 text-4xl md:text-5xl font-display font-extrabold text-secondary leading-[1.1] tracking-tight text-balance">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground border-b border-border pb-6">
            <span className="font-semibold text-foreground">Por {post.author}</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {post.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readingTime}
            </span>
          </div>

          {/* Intro */}
          {post.excerpt && (
            <p className="mt-8 text-xl leading-relaxed text-foreground/80 font-medium">
              {post.excerpt}
            </p>
          )}

          {/* Cover */}
          <div className="mt-10 overflow-hidden rounded-3xl shadow-soft">
            <SmartImage src={post.cover} alt={post.title} rounded="rounded-none" className="w-full aspect-[16/9]" />
          </div>

          {/* Body */}
          <div
            className="article-body mt-12 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border pt-8">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {post.tags.map((t) => (
                <span key={t} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Back button */}
          <div className="mt-10">
            <Link
              to="/blog-do-caminhoneiro"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-secondary hover:bg-surface transition"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar para o blog
            </Link>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16 bg-surface/40 border-t border-border">
          <div className="container-valen">
            <h2 className="text-3xl font-display font-extrabold text-secondary">
              Matérias <span className="text-primary">relacionadas</span>
            </h2>
            <p className="mt-2 text-muted-foreground">Continue lendo o que o Valen preparou para você.</p>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to="/blog-do-caminhoneiro/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <SmartImage
                      src={p.cover}
                      alt={p.title}
                      rounded="rounded-none"
                      className="h-full w-full group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-bold text-primary">
                        {p.category}
                      </span>
                      <span className="text-muted-foreground">{p.publishedAt}</span>
                    </div>
                    <h3 className="mt-3 font-display font-bold text-lg text-secondary line-clamp-2 leading-snug">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
                      Ver mais <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="py-16 bg-background">
        <div className="container-valen">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-orange text-primary-foreground p-10 md:p-14 grid lg:grid-cols-[1fr_auto] items-center gap-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold leading-tight">
                Continue acompanhando o Blog do Caminhoneiro
              </h3>
              <p className="mt-3 text-lg text-primary-foreground/85 max-w-xl">
                Dicas, novidades e conteúdos para quem vive em movimento.
              </p>
            </div>
            <Link
              to="/blog-do-caminhoneiro"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-7 py-4 text-base font-bold text-secondary-foreground shadow-soft hover:scale-105 transition-transform"
            >
              Ver todos os artigos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
