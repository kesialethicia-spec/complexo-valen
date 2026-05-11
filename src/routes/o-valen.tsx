import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { CheckCircle2, MapPin, Building2, Users, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-valen.jpg";
import hotelImg from "@/assets/hotel.jpg";
import postoImg from "@/assets/posto.jpg";
import truckImg from "@/assets/truck-center.jpg";
import foodImg from "@/assets/alimentacao.jpg";
import parkImg from "@/assets/estacionamento.jpg";
import festaImg from "@/assets/festa.jpg";

export const Route = createFileRoute("/o-valen")({
  head: () => ({
    meta: [
      { title: "O Valen — Complexo em movimento | São Luís/MA" },
      { name: "description", content: "Conheça o Complexo Valen: história, estrutura e posicionamento. Mais que uma parada, um ponto de apoio para quem está em movimento." },
    ],
  }),
  component: OValen,
});

function OValen() {
  return (
    <>
      <PageHero
        eyebrow="O Valen"
        title="O Valen é feito de movimento"
        subtitle="Um complexo completo em São Luís, criado para acompanhar o ritmo da estrada, das pessoas e dos negócios."
        image={heroImg}
      />

      <section className="py-24 bg-background">
        <div className="container-valen grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">Sobre o complexo</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold text-secondary text-balance">Um complexo, infinitas jornadas.</h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              O Valen reúne em um só lugar serviços essenciais, conveniência, alimentação, descanso, hospedagem, lojas, estacionamento, eventos e experiências. Mais do que uma parada, é um ponto de apoio para quem está em movimento.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={postoImg} alt="" className="aspect-square w-full object-cover rounded-3xl" loading="lazy" />
            <img src={hotelImg} alt="" className="aspect-square w-full object-cover rounded-3xl mt-8" loading="lazy" />
            <img src={truckImg} alt="" className="aspect-square w-full object-cover rounded-3xl -mt-8" loading="lazy" />
            <img src={foodImg} alt="" className="aspect-square w-full object-cover rounded-3xl" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Posicionamento */}
      <section className="py-24 bg-gradient-orange text-primary-foreground relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="container-valen relative text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] opacity-80">Novo posicionamento</p>
          <h2 className="mt-6 text-5xl md:text-7xl font-display font-extrabold text-balance leading-[0.95]">Somos feitos de movimento.</h2>
          <p className="mt-8 max-w-3xl mx-auto text-lg leading-relaxed">
            Movimento é chegada, partida, trabalho, descanso, cuidado e conexão. O Valen nasceu para acompanhar o ritmo de quem vive na estrada, oferecendo estrutura, conveniência e acolhimento em uma só parada.
          </p>
        </div>
      </section>

      {/* Números */}
      <section className="py-24 bg-background">
        <div className="container-valen">
          <SectionHeader eyebrow="Números" title="Números do Valen" center />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { v: "+35 mil m²", l: "de estrutura" },
              { v: "24h", l: "Posto de combustível" },
              { v: "Truck", l: "Center completo" },
              { v: "Hotel", l: "executivo" },
              { v: "Lojas", l: "e serviços" },
              { v: "Eventos", l: "e experiências" },
              { v: "7 km", l: "do Porto e Distrito Industrial" },
              { v: "São Luís", l: "MA — Brasil" },
            ].map((s) => (
              <div key={s.l} className="rounded-3xl border border-border bg-card p-7 text-center hover:border-primary/50 transition-colors">
                <p className="text-3xl font-display font-extrabold text-primary">{s.v}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pilares */}
      <section className="py-24 bg-surface">
        <div className="container-valen">
          <SectionHeader eyebrow="Pilares" title="Os pilares que movem o Valen" />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CheckCircle2, t: "Completo", d: "Tudo que o caminhoneiro precisa em uma só parada." },
              { icon: MapPin, t: "Estratégico", d: "Localização pensada para quem movimenta São Luís, o Porto e o Distrito Industrial." },
              { icon: Users, t: "Humano", d: "Acolhimento para quem passa dias longe de casa." },
              { icon: Sparkles, t: "Dinâmico", d: "Serviços, lojas, eventos e experiências em constante movimento." },
            ].map((p) => (
              <div key={p.t} className="rounded-3xl bg-card border border-border p-7">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-orange text-white shadow-glow">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-display font-bold text-secondary">{p.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="py-24 bg-background">
        <div className="container-valen">
          <SectionHeader eyebrow="Galeria" title="O Valen em imagens" center />
          <div className="mt-12 grid gap-4 grid-cols-2 md:grid-cols-4">
            {[heroImg, postoImg, truckImg, hotelImg, foodImg, parkImg, festaImg, heroImg].map((src, i) => (
              <div key={i} className={`overflow-hidden rounded-2xl ${i % 3 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"}`}>
                <img src={src} alt="" className="h-full w-full object-cover hover:scale-110 transition-transform duration-700" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
