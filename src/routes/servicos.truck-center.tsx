import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SmartImage } from "@/components/SmartImage";
import { listActiveTruckCenters, type TruckCenterRow } from "@/lib/truck-centers-api";

export const Route = createFileRoute("/servicos/truck-center")({
  head: () => ({
    meta: [
      { title: "Truck Center Valen — Manutenção e peças" },
      { name: "description", content: "Cuidado para o seu caminhão seguir em movimento: borracharia, peças, check-up e produtos automotivos nos 3 Truck Centers do Complexo Valen." },
      { property: "og:title", content: "Truck Center Valen — Manutenção e peças" },
      { property: "og:description", content: "Serviços, peças e apoio para manter sua jornada segura nos Truck Centers Pátio 1, 3 e 5." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TruckCenterPage,
});

const SERVICOS = ["Borracharia", "Manutenção", "Check-up preventivo", "Pequenos reparos"];
const PRODUTOS = ["Peças e acessórios", "Produtos automotivos", "Óleos e lubrificantes", "Itens de cabine"];

function TruckCenterCarousel({ items }: { items: TruckCenterRow[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (paused || count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 5000);
    return () => clearInterval(t);
  }, [paused, count]);

  useEffect(() => {
    if (index >= count) setIndex(0);
  }, [count, index]);

  const current = items[index];

  return (
    <div
      className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl shadow-glow bg-surface"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {items.map((tc, i) => (
        <div
          key={tc.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          aria-hidden={i !== index}
        >
          <SmartImage
            src={tc.image_url}
            alt={tc.name}
            rounded="rounded-3xl"
            className="h-full w-full"
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {current && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-secondary/85 to-transparent p-5 pt-14 text-white">
          <p className="font-display text-lg font-bold">{current.name}</p>
          {current.location && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/80">
              <MapPin className="h-3.5 w-3.5" /> {current.location}
            </p>
          )}
        </div>
      )}

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Imagem anterior"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
            className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/70 text-secondary backdrop-blur transition hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Próxima imagem"
            onClick={() => setIndex((i) => (i + 1) % count)}
            className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/70 text-secondary backdrop-blur transition hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute left-1/2 top-4 flex -translate-x-1/2 gap-1.5">
            {items.map((tc, i) => (
              <button
                key={tc.id}
                type="button"
                aria-label={`Ver ${tc.name}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TruckCenterPage() {
  const { data } = useQuery({
    queryKey: ["truck-centers", "ativos"],
    queryFn: listActiveTruckCenters,
  });

  const items = useMemo<TruckCenterRow[]>(() => data ?? [], [data]);

  return (
    <>
      <PageHero
        eyebrow="Truck Center"
        title="Cuidado para o seu caminhão seguir em movimento"
        subtitle="Serviços, peças e apoio para manter sua jornada segura."
      />

      <section className="py-24 bg-background">
        <div className="container-valen grid gap-12 lg:grid-cols-2 items-start">
          <div>
            {items.length > 0 ? (
              <TruckCenterCarousel items={items} />
            ) : (
              <SmartImage src="" alt="" rounded="rounded-3xl" className="w-full aspect-[4/3] shadow-glow" />
            )}
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl border border-border bg-surface/60 p-6">
              <h2 className="text-lg font-display font-bold text-secondary">3 Truck Centers no Complexo Valen</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Contamos com três Truck Centers distribuídos pelo Complexo Valen para oferecer mais
                praticidade e apoio durante a sua jornada.
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                {(items.length > 0
                  ? items.map((i) => i.name)
                  : ["Truck Center Pátio 1", "Truck Center Pátio 3", "Truck Center Pátio 5"]
                ).map((n) => (
                  <li key={n} className="rounded-xl bg-card border border-border px-3 py-2 text-sm font-semibold text-secondary">
                    {n}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-display font-bold text-secondary">Serviços disponíveis</h3>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {SERVICOS.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-display font-bold text-secondary">Produtos</h3>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {PRODUTOS.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-valen">
          <div className="rounded-[2rem] bg-gradient-orange p-10 md:p-14 text-primary-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold text-balance">Venha conhecer o Truck Center</h3>
              <p className="mt-2 text-white/90">Estrutura, acolhimento e confiança para sua jornada.</p>
            </div>
            <Link
              to="/lojas"
              search={{ categoria: "truck-center" }}
              className="inline-flex items-center gap-2 rounded-full bg-white text-secondary px-6 py-3.5 font-bold"
            >
              Ver lojas do Truck Center <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
