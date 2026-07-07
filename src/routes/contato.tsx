import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Phone, MessageCircle, Mail, MapPin, Briefcase, Hotel, Store, Calendar, Users, Sparkles } from "lucide-react";


export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [{ title: "Contato — Complexo Valen" }, { name: "description", content: "Fale com a equipe do Complexo Valen. Atendimento geral, comercial, lojas, hotel, eventos e trabalhe conosco." }] }),
  component: Contato,
});

function Contato() {
  const blocos = [
    { icon: Phone, t: "Atendimento geral", d: "(98) 0000-0000", link: "tel:+550000000000" },
    { icon: Briefcase, t: "Comercial", d: "comercial@valen.com.br", link: "mailto:comercial@valen.com.br" },
    { icon: Store, t: "Lojas", d: "(98) 0000-0001", link: "tel:+550000000001" },
    { icon: Users, t: "Trabalhe Conosco", d: "Portal de talentos", link: "https://complexovalen.portaldetalentos.senior.com.br/jobs" },
    { icon: Hotel, t: "Hotel", d: "reservas@valen.com.br", link: "mailto:reservas@valen.com.br" },
    { icon: Calendar, t: "Eventos", d: "eventos@valen.com.br", link: "mailto:eventos@valen.com.br" },
  ];

  return (
    <>
      <PageHero eyebrow="Contato" title="Fale com o Valen" subtitle="Escolha o melhor canal e fale com a nossa equipe." />

      <section className="py-24 bg-background">
        <div className="container-valen">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {blocos.map((b) => (
              <a key={b.t} href={b.link} className="group rounded-3xl bg-card border border-border p-7 hover:border-primary/50 hover:-translate-y-1 transition-all">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-orange text-white shadow-glow"><b.icon className="h-6 w-6" /></div>
                <h3 className="mt-5 text-lg font-display font-bold text-secondary">{b.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
              </a>
            ))}
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="group rounded-3xl bg-gradient-orange p-7 text-primary-foreground hover:-translate-y-1 transition-all">
              <MessageCircle className="h-7 w-7" />
              <h3 className="mt-5 text-lg font-display font-bold">WhatsApp Valen</h3>
              <p className="mt-2 text-sm text-white/90">Fale com a gente direto pelo WhatsApp.</p>
            </a>
          </div>
        </div>
      </section>

      <section className="pb-24 bg-background">
        <div className="container-valen grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-secondary text-balance">No caminho de quem move o Brasil</h2>
            <p className="mt-5 text-lg text-muted-foreground">Localizado em São Luís — MA, próximo ao Porto e ao Distrito Industrial.</p>
            <a href="https://maps.google.com/?q=Complexo+Valen+São+Luís+MA" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-4 text-base font-bold text-primary-foreground shadow-glow">
              <MapPin className="h-4 w-4" /> Como chegar
            </a>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border aspect-[4/3] shadow-glow">
            <iframe src="https://www.google.com/maps?q=São+Luís+MA&output=embed" className="absolute inset-0 h-full w-full" loading="lazy" title="Mapa" />
          </div>
        </div>
      </section>
    </>
  );
}
