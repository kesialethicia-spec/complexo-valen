import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { ArrowRight, ImageIcon } from "lucide-react";
import { listPublishedServices, type ServiceRow } from "@/lib/services-api";
import { getServiceIcon } from "@/lib/service-icons";
import postoImg from "@/assets/posto.jpg";

export const Route = createFileRoute("/servicos/")({
  head: () => ({
    meta: [
      { title: "Serviços — Complexo Valen" },
      { name: "description", content: "Posto, Conveniência, ValenBen, Truck Center, ValenLog, Valen Center, Hotel e mais. Estrutura completa para a sua jornada." },
    ],
  }),
  component: Servicos,
});

function Servicos() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services-public"],
    queryFn: listPublishedServices,
  });

  return (
    <>
      <PageHero
        eyebrow="Serviços"
        title="Tudo que move sua jornada, em um só lugar"
        subtitle="Conheça os serviços que fazem do Valen uma parada completa para quem vive em movimento."
        image={postoImg}
      />
      <section className="py-24 bg-background">
        <div className="container-valen">
          <SectionHeader eyebrow="Categorias" title="Estrutura completa para a sua rota" />
          {isLoading ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">Carregando serviços…</p>
          ) : services.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">Nenhum serviço publicado no momento.</p>
          ) : (
            <div className="mt-14 grid gap-8 lg:grid-cols-2">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ServiceCard({ service }: { service: ServiceRow }) {
  const Icon = getServiceIcon(service.icon);

  const inner = (
    <div className="group h-full overflow-hidden rounded-3xl bg-card border border-border hover:shadow-glow hover:-translate-y-1 transition-all">
      <div className="relative h-56 overflow-hidden bg-muted">
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full grid place-items-center bg-gradient-to-br from-secondary/10 to-primary/10 text-muted-foreground">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/40 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-orange text-white shadow-glow shrink-0">
            <Icon className="h-6 w-6" />
          </span>
          <h3 className="text-2xl font-display font-extrabold text-white drop-shadow">{service.name}</h3>
        </div>
      </div>
      <div className="p-7">
        {service.description && (
          <p className="text-muted-foreground leading-relaxed">{service.description}</p>
        )}
        {service.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {service.tags.map((t) => (
              <li key={t} className="rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-secondary">{t}</li>
            ))}
          </ul>
        )}
        {service.link_url && (
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-2.5 transition-all">
            Ver detalhes <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );

  if (!service.link_url) return <div>{inner}</div>;

  if (service.link_url.startsWith("http") || service.link_url.startsWith("mailto:")) {
    return <a href={service.link_url} target="_blank" rel="noopener noreferrer" className="block">{inner}</a>;
  }

  return <a href={service.link_url} className="block">{inner}</a>;
}
