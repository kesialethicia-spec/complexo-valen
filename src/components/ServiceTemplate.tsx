import { Link } from "@tanstack/react-router";
import { PageHero } from "./PageHero";
import { SectionHeader } from "./SectionHeader";
import { Check, MapPin, ArrowRight } from "lucide-react";
import { SmartImage } from "@/components/SmartImage";

export interface ServiceBlock {
  title: string;
  items: string[];
}

export function ServiceTemplate({
  eyebrow,
  title,
  subtitle,
  image,
  blocks,
  benefits,
  galleryImages = [],
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  blocks: ServiceBlock[];
  benefits?: string[];
  galleryImages?: string[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} image={image} />

      <section className="py-24 bg-background">
        <div className="container-valen grid gap-12 lg:grid-cols-2">
          <div>
            <SmartImage src={image} alt={title} rounded="rounded-3xl" className="w-full aspect-[4/3] shadow-glow" />
          </div>
          <div className="space-y-8">
            {blocks.map((b) => (
              <div key={b.title}>
                <h3 className="text-2xl font-display font-bold text-secondary">{b.title}</h3>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {b.items.map((i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {benefits && benefits.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="container-valen">
            <SectionHeader eyebrow="Diferenciais" title="Pensado para quem vive em movimento" />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <div key={b} className="rounded-2xl bg-card border border-border p-6">
                  <Check className="h-6 w-6 text-primary" />
                  <p className="mt-3 font-medium text-secondary">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {galleryImages.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container-valen">
            <SectionHeader eyebrow="Galeria" title="Conheça o ambiente" center />
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img, i) => (
                <SmartImage key={i} src={img} alt="" className="aspect-[4/3] w-full" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-background">
        <div className="container-valen">
          <div className="rounded-[2rem] bg-gradient-orange p-10 md:p-14 text-primary-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold text-balance">Venha conhecer o {eyebrow}</h3>
              <p className="mt-2 text-white/90">Estrutura, acolhimento e confiança para sua jornada.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white text-secondary px-6 py-3 font-bold">
                <MapPin className="h-4 w-4" /> Como chegar
              </a>
              <Link to="/contato" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur px-6 py-3 font-semibold">
                Fale conosco <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
