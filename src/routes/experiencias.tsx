import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { Film, Gamepad2, Baby, Wifi, BedDouble, Coffee, Scissors } from "lucide-react";
import festaImg from "@/assets/festa.jpg";
import foodImg from "@/assets/alimentacao.jpg";
import hotelImg from "@/assets/hotel.jpg";
import postoImg from "@/assets/posto.jpg";

export const Route = createFileRoute("/experiencias")({
  head: () => ({
    meta: [
      { title: "Experiências — Complexo Valen" },
      { name: "description", content: "Festa do Caminhoneiro, Café da Manhã de Sábado, Sextou no Valen e Clube do Caminhoneiro. Experiências que movimentam pessoas." },
    ],
  }),
  component: Experiencias,
});

const exps = [
  {
    t: "Festa do Caminhoneiro",
    d: "Um momento especial para celebrar quem move o Brasil pelas estradas. A Festa do Caminhoneiro reúne música, confraternização, homenagens e experiências pensadas para acolher nossos clientes como parte da família. Mais do que um evento, é uma forma de agradecer a confiança de quem faz do Valen uma parada de amizade e cuidado.",
    img: festaImg,
  },
  {
    t: "Café da Manhã de Sábado",
    d: "Todo sábado começa com sabor e acolhimento no Complexo Valen. Nosso café da manhã é preparado para proporcionar uma pausa agradável na rotina, reunindo clientes, parceiros e amigos em um ambiente leve, confortável e cheio de boas conversas.",
    img: foodImg,
  },
  {
    t: "Sextou no Valen",
    d: "Música, descontração e experiências que transformam a parada em um momento de lazer e conexão. Um convite para relaxar, encontrar amigos e aproveitar o melhor do Valen.",
    img: festaImg,
  },
];

const clubeItens = [
  { icon: Film, t: "Cinema" },
  { icon: Gamepad2, t: "Sala de jogos" },
  { icon: Baby, t: "Brinquedoteca" },
  { icon: Wifi, t: "Lan house" },
  { icon: BedDouble, t: "Área de descanso" },
  { icon: Coffee, t: "Copa" },
  { icon: Scissors, t: "Barbearia" },
];

function Experiencias() {
  return (
    <>
      <PageHero
        eyebrow="Experiências"
        title="Experiências que movimentam pessoas"
        subtitle="A experiência Valen está em todo o complexo. Cada ação é pensada para aproximar pessoas, acolher quem está longe de casa e transformar a parada em um momento especial."
        image={festaImg}
      />

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

      {/* Clube do Caminhoneiro com itens */}
      <section className="py-24 bg-surface">
        <div className="container-valen">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">Experiência</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold text-secondary text-balance">Clube do Caminhoneiro</h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                O Clube do Caminhoneiro foi pensado para valorizar quem está sempre na estrada. É um espaço de convivência e lazer gratuito projetado para oferecer conforto, suporte e bem-estar aos motoristas.
              </p>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {clubeItens.map((i) => (
                  <div key={i.t} className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3.5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-orange text-white">
                      <i.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-secondary">{i.t}</span>
                  </div>
                ))}
              </div>
            </div>
            <img src={hotelImg} alt="Clube do Caminhoneiro" className="aspect-[4/3] w-full object-cover rounded-3xl shadow-glow" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container-valen">
          <SectionHeader eyebrow="Galeria" title="Momentos em movimento" center />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[festaImg, foodImg, hotelImg, postoImg, festaImg, foodImg, hotelImg, postoImg].map((src, i) => (
              <img key={i} src={src} alt="" className="aspect-square w-full object-cover rounded-2xl hover:scale-105 transition-transform" loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="container-valen text-center">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-secondary">Acompanhe nossas próximas ações</h2>
          <Link to="/blog" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-4 text-base font-bold text-primary-foreground shadow-glow">Ver novidades</Link>
        </div>
      </section>
    </>
  );
}
