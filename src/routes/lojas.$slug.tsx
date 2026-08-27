import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Clock, MessageCircle, ArrowLeft, Phone, Tag, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getStoreBySlug, PUBLIC_STORE_COLUMNS, type PublicStoreRow } from "@/lib/stores-api";
import { SmartImage } from "@/components/SmartImage";

export const Route = createFileRoute("/lojas/$slug")({
  loader: async ({ params }) => {
    try {
      const row = await getStoreBySlug(params.slug);
      return { seo: row };
    } catch {
      return { seo: null };
    }
  },
  head: ({ params, loaderData }) => {
    const row = loaderData?.seo;
    const url = `https://complexovalen.com.br/lojas/${params.slug}`;
    if (!row) {
      return {
        meta: [
          { title: "Loja não encontrada | Complexo Valen" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = row.meta_title || `${row.name} | Lojas do Complexo Valen`;
    const description =
      row.meta_description || row.short_description || `Conheça ${row.name} no Complexo Valen.`;
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 160) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 160) },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(row.cover_url
          ? [
              { property: "og:image", content: row.cover_url },
              { name: "twitter:image", content: row.cover_url },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: StoreDetail,
});

function whatsappHref(store: PublicStoreRow): string | null {
  const digits = (store.whatsapp || "").replace(/\D/g, "");
  if (digits.length >= 10) return `https://wa.me/${digits.length <= 11 ? `55${digits}` : digits}`;
  if (store.cta_url) return store.cta_url;
  return null;
}

function StoreDetail() {
  const { slug } = Route.useParams();
  const [store, setStore] = useState<PublicStoreRow | null>(null);
  const [related, setRelated] = useState<PublicStoreRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setLoading(true);
    setMissing(false);
    void (async () => {
      try {
        const data = await getStoreBySlug(slug);
        if (!data) {
          setMissing(true);
          setStore(null);
          return;
        }
        setStore(data);
        const { data: rel } = await supabase
          .from("stores")
          .select(PUBLIC_STORE_COLUMNS)
          .eq("status", "ativa")
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(3);
        setRelated((rel ?? []) as PublicStoreRow[]);
      } catch {
        setMissing(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return <div className="container-valen py-24 text-center text-muted-foreground">Carregando…</div>;
  }

  if (missing || !store) {
    return (
      <div className="container-valen py-24 text-center">
        <h1 className="text-3xl font-display font-bold mb-2">Loja não encontrada</h1>
        <p className="text-muted-foreground mb-6">A loja que você procura não está disponível no momento.</p>
        <Link
          to="/lojas"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-6 py-3 text-sm font-bold text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para Lojas
        </Link>
      </div>
    );
  }

  const waLink = whatsappHref(store);
  const localizacao = [store.block, store.location].filter(Boolean).join(" • ");

  return (
    <article className="bg-background">
      {/* HERO */}
      <header className="bg-secondary text-white">
        <div className="container-valen py-12 md:py-16">
          <Link
            to="/lojas"
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para Lojas
          </Link>

          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{store.category}</p>
              <h1 className="mt-2 text-3xl md:text-5xl font-display font-bold">{store.name}</h1>
              {store.short_description && (
                <p className="mt-4 text-base md:text-lg text-white/80 max-w-prose">{store.short_description}</p>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-orange px-6 py-3 text-sm font-bold text-primary-foreground"
                  >
                    <MessageCircle className="h-4 w-4" /> {store.cta_text || "Falar no WhatsApp"}
                  </a>
                )}
                {store.phone && (
                  <a
                    href={`tel:${store.phone.replace(/\D/g, "")}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10"
                  >
                    <Phone className="h-4 w-4" /> Ligar
                  </a>
                )}
              </div>
            </div>

            <div className="relative">
              {store.cover_url ? (
                <SmartImage
                  src={store.cover_url}
                  alt={`Imagem da loja ${store.name} no Complexo Valen`}
                  rounded="rounded-3xl"
                  className="w-full aspect-[4/3] shadow-xl"
                />
              ) : (
                <div className="w-full aspect-[4/3] rounded-3xl bg-white/10 flex items-center justify-center">
                  {store.logo_url ? (
                    <img
                      src={store.logo_url}
                      alt={`Logo ${store.name}`}
                      className="max-h-40 max-w-[70%] object-contain"
                    />
                  ) : (
                    <span className="font-display text-4xl font-bold text-white/70">
                      {store.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                  )}
                </div>
              )}
              {store.cover_url && store.logo_url && (
                <div className="absolute -bottom-6 left-6 h-20 w-20 rounded-2xl bg-white border border-border shadow-lg flex items-center justify-center overflow-hidden">
                  <img src={store.logo_url} alt={`Logo ${store.name}`} className="h-full w-full object-contain p-2" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container-valen py-14 md:py-16">
        {/* INFORMAÇÕES RÁPIDAS */}
        <section aria-labelledby="info-rapidas">
          <h2 id="info-rapidas" className="sr-only">Informações rápidas</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickCard icon={<Tag className="h-5 w-5" />} label="Categoria" value={store.category} />
            <QuickCard icon={<Clock className="h-5 w-5" />} label="Horário" value={store.hours || "Consulte a loja"} />
            <QuickCard icon={<MapPin className="h-5 w-5" />} label="Localização" value={localizacao || "Complexo Valen"} />
            <QuickCard
              icon={<Phone className="h-5 w-5" />}
              label="Contato"
              value={store.whatsapp || store.phone || "Consulte a loja"}
            />
          </div>
        </section>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="space-y-10">
            {store.full_description && (
              <section aria-labelledby="sobre-loja">
                <h2 id="sobre-loja" className="text-2xl font-display font-bold text-secondary">Sobre a loja</h2>
                <div className="mt-4 text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {store.full_description}
                </div>
              </section>
            )}

            <section aria-labelledby="localizacao-loja">
              <h2 id="localizacao-loja" className="text-2xl font-display font-bold text-secondary">Localização</h2>
              <div className="mt-4 rounded-3xl border border-border bg-card p-6 space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  {store.location || "Complexo Valen"}
                </p>
                {store.block && (
                  <p className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-primary mt-0.5" />
                    {store.block}
                  </p>
                )}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-3xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-xl font-display font-bold text-secondary">Contato</h2>
            <div className="space-y-3 text-sm">
              {store.hours && (
                <p className="flex items-start gap-2"><Clock className="h-4 w-4 text-primary mt-0.5" /> {store.hours}</p>
              )}
              {store.phone && (
                <p className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-primary mt-0.5" />
                  <a href={`tel:${store.phone.replace(/\D/g, "")}`} className="hover:text-primary">{store.phone}</a>
                </p>
              )}
              {store.whatsapp && (
                <p className="flex items-start gap-2">
                  <MessageCircle className="h-4 w-4 text-primary mt-0.5" /> {store.whatsapp}
                </p>
              )}
              {localizacao && (
                <p className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /> {localizacao}</p>
              )}
            </div>
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-orange px-5 py-3 text-sm font-bold text-primary-foreground"
              >
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </a>
            )}
            <Link
              to="/lojas"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar para Lojas
            </Link>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="lojas-relacionadas">
            <h2 id="lojas-relacionadas" className="text-2xl font-display font-bold text-secondary mb-6">
              Outras lojas do Complexo Valen
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <article key={r.id} className="rounded-3xl bg-card border border-border overflow-hidden flex flex-col hover:border-primary/50 transition-all">
                  <SmartImage
                    src={r.cover_url || r.logo_url}
                    alt={`Loja ${r.name}`}
                    rounded="rounded-none"
                    className="w-full aspect-[16/9]"
                  />
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">{r.category}</p>
                    <h3 className="mt-1 text-lg font-display font-bold text-secondary">{r.name}</h3>
                    {[r.block, r.location].filter(Boolean).length > 0 && (
                      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" /> {[r.block, r.location].filter(Boolean).join(" • ")}
                      </p>
                    )}
                    <Link
                      to="/lojas/$slug"
                      params={{ slug: r.slug }}
                      className="mt-4 inline-flex items-center justify-center rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

function QuickCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-primary">{icon}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-secondary break-words">{value}</p>
    </div>
  );
}
