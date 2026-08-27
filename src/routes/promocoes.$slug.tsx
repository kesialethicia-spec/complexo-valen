import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Tag, Calendar } from "lucide-react";
import { getPromotionBySlug, listActivePromotions, type PromotionRow } from "@/lib/promotions-api";
import { SmartImage } from "@/components/SmartImage";

const promotionQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["promotion", slug],
    queryFn: async () => {
      const item = await getPromotionBySlug(slug);
      if (!item) throw notFound();
      const all = await listActivePromotions();
      const related = all.filter((p) => p.category === item.category && p.id !== item.id).slice(0, 3);
      return { item, related };
    },
  });

export const Route = createFileRoute("/promocoes/$slug")({
  loader: ({ params, context }) => context.queryClient.ensureQueryData(promotionQueryOptions(params.slug)),
  head: ({ params, loaderData }) => {
    const url = `https://valen-route-connect.lovable.app/promocoes/${params.slug}`;
    if (!loaderData) {
      return { meta: [{ title: "Promoção não encontrada | Promoções Valen" }, { name: "robots", content: "noindex" }] };
    }
    const { item } = loaderData as { item: PromotionRow };
    const title = item.meta_title || `${item.title} | Promoções Valen`;
    const description =
      item.meta_description ||
      `Confira os detalhes da promoção ${item.title} no Complexo Valen.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(item.cover_url ? [{ property: "og:image", content: item.cover_url }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: PromotionDetail,
  errorComponent: ({ error }) => (
    <div className="container-valen py-20 text-center">
      <h1 className="text-2xl font-display font-bold">Erro ao carregar promoção</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <Link to="/promocoes" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-valen py-20 text-center">
      <h1 className="text-2xl font-display font-bold">Promoção não encontrada</h1>
      <p className="mt-2 text-sm text-muted-foreground">Esta promoção pode ter sido encerrada ou ainda não foi publicada.</p>
      <Link to="/promocoes" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar para promoções
      </Link>
    </div>
  ),
});

function PromotionDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(promotionQueryOptions(slug));
  const { item, related } = data;
  const cover = item.cover_url || "";

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary text-white">
        <div className="absolute inset-0">
          <SmartImage src={cover} alt={item.title} rounded="rounded-none" className="h-full w-full opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/90 to-secondary/60" />
        </div>
        <div className="container-valen relative py-20 md:py-28">
          <nav className="text-xs text-white/70">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/promocoes" className="hover:text-white">Promoções</Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{item.title}</span>
          </nav>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-gradient-orange px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary-foreground">
              Promoção
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-bold text-white">
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

      {/* IMAGEM DESTAQUE */}
      {item.cover_url && (
        <section className="bg-background pt-12">
          <div className="container-valen max-w-4xl">
            <div className="overflow-hidden rounded-3xl shadow-glow">
              <SmartImage src={item.cover_url} alt={item.title} rounded="rounded-none" className="w-full aspect-[16/9]" />
            </div>
          </div>
        </section>
      )}

      {/* CONTEÚDO */}
      <section className="py-16 bg-background">
        <div className="container-valen max-w-3xl">
          {item.full_description && (
            <>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary">Descrição</h2>
              <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-foreground/90">
                {item.full_description}
              </div>
            </>
          )}

          {item.how_to_participate && (
            <div className="mt-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary">Como participar</h2>
              <div className="mt-4 whitespace-pre-line rounded-2xl border border-border bg-surface p-6 text-base leading-relaxed text-foreground/90">
                {item.how_to_participate}
              </div>
            </div>
          )}

          {item.validity && (
            <div className="mt-10 flex items-center gap-3 rounded-2xl border border-border bg-surface p-5">
              <Calendar className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Validade</p>
                <p className="text-sm font-semibold text-secondary">{item.validity}</p>
              </div>
            </div>
          )}

          {item.rules && (
            <div className="mt-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary">Regulamento e regras</h2>
              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {item.rules}
              </div>
            </div>
          )}

          {item.cta_url && (
            <div className="mt-12">
              <a
                href={item.cta_url}
                target={item.cta_url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
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
                    <SmartImage src={p.cover_url} alt={p.title} rounded="rounded-none" className="h-full w-full" />
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
