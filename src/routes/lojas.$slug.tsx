import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Clock, MessageCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getStoreBySlug, PUBLIC_STORE_COLUMNS, type PublicStoreRow } from "@/lib/stores-api";

export const Route = createFileRoute("/lojas/$slug")({
  component: StoreDetail,
});

function buildWhatsappLink(store: PublicStoreRow): string | null {
  if (store.cta_url) return store.cta_url;
  return null;
}

function StoreDetail() {
  const { slug } = Route.useParams();
  const [store, setStore] = useState<StoreRow | null>(null);
  const [related, setRelated] = useState<StoreRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const data = await getStoreBySlug(slug);
        if (!data) {
          setMissing(true);
          return;
        }
        setStore(data);
        const { data: rel } = await supabase
          .from("stores")
          .select("*")
          .eq("status", "ativa")
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(3);
        setRelated((rel ?? []) as StoreRow[]);
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
        <p className="text-muted-foreground mb-6">A loja que você procura pode ter saído do ar.</p>
        <Link to="/lojas" className="inline-flex items-center gap-2 text-primary font-semibold"><ArrowLeft className="h-4 w-4" /> Ver todas as lojas</Link>
      </div>
    );
  }

  const waLink = buildWhatsappLink(store);

  return (
    <article className="bg-background">
      {store.cover_url && (
        <div className="w-full h-64 md:h-96 bg-muted overflow-hidden">
          <img src={store.cover_url} alt={store.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="container-valen py-12">
        <Link to="/lojas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Todas as lojas
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex items-start gap-4">
              {store.logo_url && (
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center overflow-hidden">
                  <img src={store.logo_url} alt={`Logo ${store.name}`} className="h-full w-full object-contain p-2" />
                </div>
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{store.category}</p>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary mt-1">{store.name}</h1>
                {store.short_description && <p className="mt-2 text-muted-foreground">{store.short_description}</p>}
              </div>
            </div>

            {store.full_description && (
              <div className="prose prose-neutral max-w-none mt-8 whitespace-pre-wrap">
                {store.full_description}
              </div>
            )}
          </div>

          <aside className="space-y-5 rounded-3xl border bg-card p-6 h-fit">
            <div className="space-y-3 text-sm">
              {store.hours && <p className="flex items-start gap-2"><Clock className="h-4 w-4 text-primary mt-0.5" /> {store.hours}</p>}
              {store.phone && <p className="flex items-start gap-2"><Phone className="h-4 w-4 text-primary mt-0.5" /> {store.phone}</p>}
              {(store.block || store.location) && (
                <p className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /> {[store.block, store.location].filter(Boolean).join(" • ")}</p>
              )}
            </div>
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-orange px-5 py-3 text-sm font-bold text-primary-foreground">
                <MessageCircle className="h-4 w-4" /> {store.cta_text || "WhatsApp"}
              </a>
            )}
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-display font-bold text-secondary mb-6">Outras lojas de {store.category}</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} to="/lojas/$slug" params={{ slug: r.slug }} className="rounded-3xl bg-card border border-border p-6 hover:border-primary/50 transition-all flex flex-col">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">{r.category}</p>
                  <h3 className="mt-2 text-lg font-display font-bold text-secondary">{r.name}</h3>
                  {r.short_description && <p className="mt-2 text-sm text-muted-foreground">{r.short_description}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
