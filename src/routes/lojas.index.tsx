import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Search, MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { listActiveStores, STORE_CATEGORIES, type PublicStoreRow } from "@/lib/stores-api";

export const Route = createFileRoute("/lojas/")({
  validateSearch: (search: Record<string, unknown>): { categoria?: string } =>
    typeof search.categoria === "string" ? { categoria: search.categoria } : {},
  head: () => ({
    meta: [
      { title: "Lojas — Complexo Valen" },
      { name: "description", content: "Lojas, serviços e conveniência no Complexo Valen. Encontre o que precisa sem sair da sua rota." },
    ],
  }),
  component: Lojas,
});

const CATEGORY_SLUGS: Record<string, string> = {
  "alimentacao": "Alimentação",
  "truck-center": "Truck Center",
  "conveniencia": "Conveniência",
  "autopecas": "Autopeças",
  "transportadoras": "Transportadoras",
};

function slugifyCategory(cat: string): string {
  return cat
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}


const categoriaFiltros = ["Todas", ...STORE_CATEGORIES] as const;

interface LojaUI {
  id: string;
  slug?: string;
  name: string;
  category: string;
  short_description: string;
  hours: string;
  phone: string;
  whatsapp: string;
  location: string;
  block: string;
  logo_url: string;
  cta_text: string;
  cta_url: string;
  featured: boolean;
}


function toUI(s: PublicStoreRow): LojaUI {
  return {
    id: s.id, slug: s.slug, name: s.name, category: s.category, short_description: s.short_description,
    hours: s.hours, phone: s.phone ?? "", whatsapp: s.whatsapp ?? "", location: s.location, block: s.block,
    logo_url: s.logo_url, cta_text: s.cta_text, cta_url: s.cta_url, featured: s.featured,
  };
}

function waHref(l: LojaUI): string {
  if (l.cta_url) return l.cta_url;
  const digits = (l.whatsapp || "").replace(/\D/g, "");
  if (digits) return `https://wa.me/${digits}?text=${encodeURIComponent(`Olá! Vi a ${l.name} no Valen.`)}`;
  return `https://wa.me/?text=${encodeURIComponent(`Olá! Vi a ${l.name} no Valen.`)}`;
}

function Lojas() {
  const navigate = Route.useNavigate();
  const { categoria } = Route.useSearch();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Todas");
  const [items, setItems] = useState<LojaUI[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Sync selected filter with URL ?categoria=
  useEffect(() => {
    if (!categoria) {
      setCat("Todas");
      return;
    }
    const match = CATEGORY_SLUGS[categoria]
      ?? STORE_CATEGORIES.find((c) => slugifyCategory(c) === categoria);
    setCat(match ?? "Todas");
  }, [categoria]);

  const handleSelectCategory = (c: string) => {
    setCat(c);
    void navigate({
      search: c === "Todas" ? {} : { categoria: slugifyCategory(c) },
      replace: true,
    });
  };

  useEffect(() => {
    void (async () => {
      try {
        const rows = await listActiveStores();
        setItems(rows.map(toUI));
      } catch {
        setItems([]);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);


  const filtradas = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((l) =>
      (cat === "Todas" || l.category === cat) &&
      (term === "" ||
        l.name.toLowerCase().includes(term) ||
        l.category.toLowerCase().includes(term) ||
        l.location.toLowerCase().includes(term) ||
        l.block.toLowerCase().includes(term))
    );
  }, [items, q, cat]);

  return (
    <>
      <PageHero
        eyebrow="Lojas"
        title="Lojas, serviços e conveniência para facilitar sua rotina"
        subtitle="Encontre no Valen opções para resolver o que precisa sem sair da sua rota."
      />

      <section className="py-12 bg-background sticky top-[72px] z-30">
        <div className="container-valen">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome, categoria ou localização..."
              className="w-full rounded-full border border-border bg-card pl-12 pr-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {categoriaFiltros.map((c) => (
              <button
                key={c}
                onClick={() => handleSelectCategory(c)}

                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  cat === c ? "bg-secondary text-secondary-foreground" : "bg-surface text-muted-foreground hover:bg-surface/80"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 bg-background">
        <div className="container-valen">
          {!loaded ? (
            <p className="text-center text-muted-foreground py-12">Carregando…</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtradas.map((l) => (
                <article key={l.id} className="rounded-3xl bg-card border border-border p-6 hover:border-primary/50 hover:-translate-y-1 transition-all flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary pt-1">{l.category}</span>
                    <div className="h-16 w-16 shrink-0 rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center overflow-hidden">
                      {l.logo_url ? (
                        <img src={l.logo_url} alt={`Logo ${l.name}`} className="h-full w-full object-contain p-2" />
                      ) : (
                        <span className="font-display font-bold text-secondary text-lg">
                          {l.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="mt-3 text-xl font-display font-bold text-secondary">{l.name}</h3>
                  {l.short_description && <p className="mt-2 text-sm text-muted-foreground">{l.short_description}</p>}
                  <div className="mt-4 space-y-1.5 text-sm">
                    {l.hours && <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {l.hours}</p>}
                    {(l.phone || l.whatsapp) && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {l.whatsapp || l.phone}</p>}
                    {(l.block || l.location) && <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {[l.block, l.location].filter(Boolean).join(" • ")}</p>}
                  </div>
                  <div className="mt-5 flex gap-2">
                    {(l.whatsapp || l.cta_url) && (
                      <a href={waHref(l)} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1 rounded-full bg-gradient-orange px-4 py-2.5 text-sm font-bold text-primary-foreground">
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </a>
                    )}
                    {l.slug && (
                      <Link to="/lojas/$slug" params={{ slug: l.slug }} className="flex-1 inline-flex items-center justify-center rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted">
                        Ver detalhes
                      </Link>
                    )}
                  </div>
                </article>
              ))}
              {filtradas.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-12">
                  {items.length === 0 ? "Nenhuma loja cadastrada no momento." : "Nenhuma loja encontrada."}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
