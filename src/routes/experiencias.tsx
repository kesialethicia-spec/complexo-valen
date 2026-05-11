import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import festaImg from "@/assets/festa.jpg";
import foodImg from "@/assets/alimentacao.jpg";
import hotelImg from "@/assets/hotel.jpg";
import postoImg from "@/assets/posto.jpg";

export const Route = createFileRoute("/experiencias")({
  head: () => ({ meta: [{ title: "Experiências — Complexo Valen" }, { name: "description", content: "Festa do Caminhoneiro, Café de Sábado, Sexta Valen, Clube do Caminhoneiro. Experiências que movimentam pessoas." }] }),
  component: Experiencias,
});

function Experiencias() {
  const exps = [
    { t: "Festa do Caminhoneiro", d: "Um dos maiores momentos de celebração do Valen, criado para homenagear quem movimenta o Brasil.", img: festaImg },
    { t: "Café de Sábado", d: "Um momento de acolhimento, cuidado e conexão com os caminhoneiros.", img: foodImg },
    { t: "Sexta Valen", d: "Experiências, música, promoções e relacionamento para movimentar o complexo.", img: festaImg },
    { t: "Clube do Caminhoneiro", d: "Benefícios, cuidado e experiências para quem vive na estrada.", img: hotelImg },
  ];

  return (
    <>
      <PageHero eyebrow="Experiências" title="Experiências que movimentam pessoas" subtitle="No Valen, cada ação é pensada para aproximar pessoas, acolher quem está longe de casa e transformar a parada em um momento especial." image={festaImg} />

      <section className="py-24 bg-background">
        <div className="container-valen space-y-20">
          {exps.map((e, i) => (
            <div key={e.t} className={`grid gap-10 lg:grid-cols-2 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <img src={e.img} alt={e.t} className="aspect-[4/3] w-full object-cover rounded-3xl shadow-glow" loading="lazy" />
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">Experiência</span>
                <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold text-secondary text-balance">{e.t}</h2>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{e.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container-valen">
          <SectionHeader eyebrow="Galeria" title="Momentos em movimento" center />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[festaImg, foodImg, hotelImg, postoImg, festaImg, foodImg, hotelImg, postoImg].map((src, i) => (
              <img key={i} src={src} alt="" className="aspect-square w-full object-cover rounded-2xl hover:scale-105 transition-transform" loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container-valen text-center">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-secondary">Acompanhe nossas próximas ações</h2>
          <Link to="/noticias" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-4 text-base font-bold text-primary-foreground shadow-glow">Ver novidades</Link>
        </div>
      </section>
    </>
  );
}
