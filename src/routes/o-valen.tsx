import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { Lightbulb, ShieldCheck, HeartHandshake, UserCheck, Users, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-valen.jpg";
import hotelImg from "@/assets/hotel.jpg";
import postoImg from "@/assets/posto.jpg";
import truckImg from "@/assets/truck-center.jpg";
import foodImg from "@/assets/alimentacao.jpg";
import equipeAsset from "@/assets/equipe-valen.png.asset.json";
const equipeImg = equipeAsset.url;

export const Route = createFileRoute("/o-valen")({
  head: () => ({
    meta: [
      { title: "O Valen — Complexo em movimento | São Luís/MA" },
      { name: "description", content: "Conheça o Complexo Valen: propósito, ambição, valores e história. Mais que uma parada, um ponto de apoio para quem vive a estrada." },
    ],
  }),
  component: OValen,
});

const valores = [
  { icon: Lightbulb, t: "Inovação na prestação de serviços" },
  { icon: ShieldCheck, t: "Ética, transparência e segurança" },
  { icon: HeartHandshake, t: "Acolher para melhor servir" },
  { icon: UserCheck, t: "Reconhecimento e desenvolvimento do colaborador Valen" },
  { icon: Users, t: "Valorização da comunidade local" },
];

const timeline = [
  {
    year: "2019",
    title: "Início da jornada",
    text: "Em 05 de setembro de 2019, o Complexo Valen foi inaugurado com uma área inicial de 150 mil m².",
  },
  {
    year: "2023",
    title: "Expansão contínua",
    text: "Com a inauguração do Pátio de Triagem 03, o Valen alcançou mais de 250 mil m² de área total, ampliando sua capacidade operacional.",
  },
  {
    year: "2025/2026",
    title: "Mais avanços",
    text: "Com uma nova expansão, o complexo alcança 350 mil m² de área total e mais de 400 vagas, consolidando o Valen como o maior complexo logístico da região.",
  },
];

function OValen() {
  return (
    <>
      <PageHero
        eyebrow="O Valen"
        title="O Valen é feito de movimento"
        subtitle="Mais do que uma parada, somos um ponto de apoio para quem vive a estrada, movimenta negócios e conecta jornadas."
        image={heroImg}
      />

      {/* Sobre o Valen */}
      <section className="py-24 bg-background">
        <div className="container-valen grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">Sobre o Valen</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold text-secondary text-balance">Um complexo criado para mover o Brasil.</h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Localizado a 14 km do Porto do Itaqui, no coração da região industrial de São Luís, o Valen é um complexo criado para oferecer excelência na prestação de serviços ao caminhoneiro. Reunimos em um só lugar soluções que agregam valor em todos os pontos de contato da jornada: abastecimento, triagem, estacionamento, manutenção, alimentação, descanso, hospedagem, lojas, serviços e experiências.
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

      {/* Propósito + Ambição */}
      <section className="py-24 bg-surface">
        <div className="container-valen grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-card border border-border p-10 shadow-soft">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Nosso propósito</span>
            <p className="mt-5 text-2xl md:text-3xl font-display font-bold text-secondary leading-snug text-balance">
              Proporcionar a melhor experiência para que as pessoas que estão longe de casa se sintam entre amigos.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-orange text-primary-foreground p-10 shadow-glow">
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
            <span className="relative text-xs font-bold uppercase tracking-[0.25em] text-white/90">Nossa ambição</span>
            <p className="relative mt-5 text-2xl md:text-3xl font-display font-bold leading-snug text-balance">
              Ser referência em serviços de qualidade no Brasil até 2029.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-24 bg-background">
        <div className="container-valen">
          <SectionHeader eyebrow="Valores" title="Valores que nos movem" center />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {valores.map((v) => (
              <div key={v.t} className="rounded-3xl bg-card border border-border p-7 hover:border-primary/50 transition-colors flex items-start gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-orange text-white shadow-glow">
                  <v.icon className="h-6 w-6" />
                </span>
                <p className="text-lg font-display font-bold text-secondary leading-snug">{v.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* História — timeline */}
      <section className="py-24 bg-surface">
        <div className="container-valen">
          <SectionHeader eyebrow="História" title="Nossa história em movimento" center />
          <div className="mt-16 relative">
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border" aria-hidden />
            <div className="space-y-12 md:space-y-0">
              {timeline.map((item, i) => (
                <div key={item.year} className={`relative md:grid md:grid-cols-2 md:gap-12 md:items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div className={`md:px-8 ${i % 2 === 0 ? "md:text-right" : ""}`}>
                    <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground shadow-glow">{item.year}</span>
                    <h3 className="mt-4 text-2xl md:text-3xl font-display font-extrabold text-secondary">{item.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                  <div className="hidden md:flex justify-center">
                    <span className="relative z-10 inline-flex h-5 w-5 rounded-full bg-primary border-4 border-background shadow-glow" aria-hidden />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trabalhe Conosco */}
      <section className="py-20 bg-background">
        <div className="container-valen">
          <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-soft">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
            <svg className="absolute inset-0 h-full w-full text-secondary/5" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden>
              <path d="M0,250 C200,180 400,320 800,200 L800,400 L0,400 Z" fill="currentColor" />
            </svg>
            <div className="relative grid gap-8 md:grid-cols-2 items-center p-8 md:p-14">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Trabalhe Conosco
                </span>
                <h2 className="mt-4 text-3xl md:text-4xl font-display font-extrabold text-secondary text-balance">
                  Faça parte de um time em movimento
                </h2>
                <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                  Quer crescer com o Valen? Acesse nossa plataforma de talentos, confira as vagas disponíveis e cadastre seu currículo.
                </p>
                <a
                  href="https://complexovalen.portaldetalentos.senior.com.br/jobs"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-3.5 text-sm md:text-base font-bold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform"
                >
                  Ver vagas e cadastrar currículo <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="relative flex justify-center md:justify-end">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-56 w-56 md:h-72 md:w-72 rounded-full bg-gradient-orange/20 blur-2xl" />
                </div>
                <img src={equipeImg} alt="Equipe Valen uniformizada" className="relative h-56 md:h-72 w-auto object-contain drop-shadow-xl" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
