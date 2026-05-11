import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock, MapPin, Tag } from "lucide-react";
import { posts, banners } from "@/data/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Artigo — Blog do Caminhoneiro" }] };
    const { post } = loaderData;
    return {
      meta: [
        { title: post.metaTitle ?? `${post.title} — Blog do Caminhoneiro Valen` },
        { name: "description", content: post.metaDescription ?? post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.metaDescription ?? post.excerpt },
        { property: "og:image", content: post.cover },
        { property: "og:type", content: "article" },
        { name: "twitter:image", content: post.cover },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-valen py-32 text-center">
      <h1 className="text-4xl font-display font-extrabold text-secondary">Artigo não encontrado</h1>
      <p className="mt-4 text-muted-foreground">O conteúdo que você procura pode ter sido movido.</p>
      <Link
        to="/blog"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-6 py-3 text-sm font-semibold text-primary-foreground"
      >
        Voltar para o blog <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { post } = Route.useLoaderData();

  const related = posts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);
  const fallback = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const readAlso = related.length >= 3 ? related : [...related, ...fallback].slice(0, 3);

  const endBanner = banners.find((b) => b.placement === "article-end")!;

  return (
    <>
      {/* Hero da matéria */}
      <section className="relative overflow-hidden bg-gradient-hero text-white pt-20 pb-32">
        <div className="absolute inset-0 opacity-25">
          <img src={post.cover} alt="" className="h-full w-full object-cover mix-blend-overlay" />
        </div>
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-primary/40 blur-3xl" />

        <div className="container-valen relative">
          <nav className="text-xs text-white/70 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-white">Blog do Caminhoneiro</Link>
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

      {/* Conteúdo + Sidebar */}
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
                {post.tags.map((t) => (
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
                    <Link to="/blog/$slug" params={{ slug: p.slug }} className="group grid grid-cols-[64px_1fr] gap-3">
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

            <div className="rounded-3xl bg-gradient-hero text-white p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/40 blur-3xl" />
              <span className="text-xs font-bold uppercase tracking-wider">App ValenLog</span>
              <h4 className="mt-2 text-xl font-display font-bold">Sua operação em movimento</h4>
              <p className="mt-2 text-sm text-white/80">
                Agilidade, controle e praticidade na palma da mão.
              </p>
              <a
                href="#"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Conhecer o app <ArrowRight className="h-4 w-4" />
              </a>
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

      {/* Leia também */}
      <section className="py-20 bg-surface/40">
        <div className="container-valen">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-secondary">Leia também</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {readAlso.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={p.cover}
                    alt={p.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">{p.category}</span>
                  <h3 className="mt-2 font-display font-bold text-secondary line-clamp-2">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner final */}
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
