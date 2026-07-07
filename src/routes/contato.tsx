import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Phone, MessageCircle, Mail, MapPin, Hotel, Store, Users } from "lucide-react";


export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [{ title: "Contato — Complexo Valen" }, { name: "description", content: "Fale com a equipe do Complexo Valen. Atendimento geral, comercial, lojas, hotel, eventos e trabalhe conosco." }] }),
  component: Contato,
});

function Contato() {
  const blocos = [
    { icon: MessageCircle, t: "WhatsApp Valen", d: "+55 98 8445-8884", link: "https://wa.me/559884458884", featured: true },
    { icon: Phone, t: "Comercial Posto", d: "+55 98 8520-2800", link: "https://wa.me/559885202800" },
    { icon: Store, t: "Comercial Lojas", d: "+55 98 8485-4901", link: "https://wa.me/559884854901" },
    { icon: Users, t: "Trabalhe Conosco", d: "Portal de talentos", link: "https://complexovalen.portaldetalentos.senior.com.br/" },
    { icon: Hotel, t: "Hotel", d: "+55 98 2016-7000", link: "tel:+559820167000" },
    { icon: Mail, t: "Eventos", d: "marketing@redevalen.com", link: "mailto:marketing@redevalen.com" },
  ];

  return (
    <>
      <PageHero eyebrow="Contato" title="Fale com o Valen" subtitle="Escolha o melhor canal e fale com a nossa equipe." />

      <section className="py-24 bg-background">
        <div className="container-valen">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {blocos.map((b) =>
              b.featured ? (
                <a
                  key={b.t}
                  href={b.link}
                  target={b.link.startsWith("http") ? "_blank" : undefined}
                  rel={b.link.startsWith("http") ? "noreferrer" : undefined}
                  className="group md:col-span-2 lg:col-span-1 rounded-3xl bg-gradient-orange p-8 text-primary-foreground hover:-translate-y-1 transition-all shadow-glow flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
                      <b.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-2xl font-display font-bold">{b.t}</h3>
                    <p className="mt-2 text-base text-white/90">{b.d}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">
                    <MessageCircle className="h-4 w-4" /> Fale agora
                  </span>
                </a>
              ) : (
                <a
                  key={b.t}
                  href={b.link}
                  target={b.link.startsWith("http") ? "_blank" : undefined}
                  rel={b.link.startsWith("http") ? "noreferrer" : undefined}
                  className="group rounded-3xl bg-card border border-border p-7 hover:border-primary/50 hover:-translate-y-1 transition-all"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-orange text-white shadow-glow">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-display font-bold text-secondary">{b.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
                </a>
              )
            )}
          </div>
        </div>
      </section>

      <section className="pb-24 bg-background">
        <div className="container-valen grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-secondary text-balance">No caminho de quem move o Brasil</h2>
            <p className="mt-5 text-lg text-muted-foreground">Localizado em São Luís – MA, próximo ao Porto e ao Distrito Industrial.</p>
            <p className="mt-3 text-base text-muted-foreground">Av. Eng. Emiliano Macieira, Km 02, São Luís - MA, 65091-320</p>
            <a
              href="https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-4 text-base font-bold text-primary-foreground shadow-glow"
            >
              <MapPin className="h-4 w-4" /> Como chegar
            </a>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border aspect-[4/3] shadow-glow">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.8930821433!2d-44.3333!3d-2.5167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7f18b4c5a4a4a4b%3A0x123456789abcdef!2sComplexo+Valen!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              title="Mapa Complexo Valen"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
