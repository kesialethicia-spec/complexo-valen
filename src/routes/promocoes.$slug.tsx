import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Tag, Calendar } from "lucide-react";
import { getPromotionBySlug, listActivePromotions, type PromotionRow } from "@/lib/promotions-api";

export const Route = createFileRoute("/promocoes/$slug")({
  component: PromotionDetail,
});

function PromotionDetail() {
  const { slug } = Route.useParams();
  const [item, setItem] = useState<PromotionRow | null>(null);
  const [related, setRelated] = useState<PromotionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const data = await getPromotionBySlug(slug);
        if (!data) {
          setError("Promoção não encontrada.");
        } else {
          setItem(data);
          if (data.meta_title) document.title = data.meta_title;
          else document.title = `${data.title} — Promoções Valen`;
          const all = await listActivePromotions();
          setRelated(all.filter((p) => p.category === data.category && p.id !== data.id).slice(0, 3));
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao carregar promoção");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return <div className="container-valen py-20 text-center text-sm text-muted-foreground">Carregando…</div>;
  }

  if (error || !item) {
    return (
      <div className="container-valen py-20 text-center">
        <h1 className="text-2xl font-display font-bold">Promoção não encontrada</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Link to="/promocoes" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar para promoções
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary text-white">
        <div className="absolute inset-0">
          {item.cover_url && (
            <img src={item.cover_url} alt={item.title} className="h-full w-full object-cover opacity-40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/90 to-secondary/60" />
        </div>
        <div className="container-valen relative py-20 md:py-28">
          <Link to="/promocoes" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Promoções
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              <Tag className="h-3 w-3" /> {item.category}
            </span>
            {item.validity && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs font-semibold">
                <Calendar className="h-3 w-3" /> {item.validity}
              </span>
            )}
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl md:text-6xl font-display font-extrabold leading-tight">
            {item.title}
          </h1>
          {item.short_description && (
            <p className="mt-5 max-w-2xl text-lg text-white/85">{item.short_description}</p>
          )}
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="py-16 bg-background">
        <div className="container-valen max-w-3xl">
          {item.full_description && (
            <>
              <h2 className="text-2xl font-display font-bold text-secondary">Como participar</h2>
              <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-foreground/90">
                {item.full_description}
              </div>
            </>
          )}

          {item.rules && (
            <div className="mt-12">
              <h2 className="text-2xl font-display font-bold text-secondary">Regulamento</h2>
              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {item.rules}
              </div>
            </div>
          )}

          {item.cta_url && (
            <div className="mt-12">
              <a
                href={item.cta_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-4 text-base font-bold text-primary-foreground shadow-glow hover:scale-105 transition-transform"
              >
                {item.cta_text || "Ver promoção"} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* RELACIONADAS */}
      {related.length > 0 && (
        <section className="py-16 bg-surface">
          <div className="container-valen">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary">Promoções relacionadas</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to="/promocoes/$slug"
                  params={{ slug: p.slug }}
                  className="block overflow-hidden rounded-3xl bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all"
                >
                  <div className="relative h-44 overflow-hidden">
                    {p.cover_url && <img src={p.cover_url} alt={p.title} className="h-full w-full object-cover" loading="lazy" />}
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                      <Tag className="h-3 w-3" /> {p.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold text-muted-foreground">{p.validity}</p>
                    <h3 className="mt-1.5 text-lg font-display font-bold text-secondary">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.short_description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
