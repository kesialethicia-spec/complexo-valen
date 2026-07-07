import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import {
  Lightbulb,
  ShieldCheck,
  HeartHandshake,
  UserCheck,
  Users,
  ArrowRight,
  Fuel,
  Store,
  Truck,
  Wrench,
  BedDouble,
  Droplets,
  RefreshCw,
  Coffee,
  Sparkles,
  Instagram,
  MapPin,
} from "lucide-react";
import { getOValenPageSettings } from "@/lib/o-valen-settings-api";
import equipeAsset from "@/assets/equipe-valen.png.asset.json";
import heroAsset from "@/assets/o-valen/hero.jpg.asset.json";
import fachadaAsset from "@/assets/o-valen/fachada.jpg.asset.json";
import postoAsset from "@/assets/o-valen/posto.jpg.asset.json";
import patioAsset from "@/assets/o-valen/patio.jpg.asset.json";
import truckAsset from "@/assets/o-valen/truck.jpg.asset.json";
import cafeAsset from "@/assets/o-valen/cafe.jpg.asset.json";
import tinoAsset from "@/assets/o-valen/tino-amigo.png.asset.json";

const heroDefault = heroAsset.url;
const fachadaDefault = fachadaAsset.url;
const postoDefault = postoAsset.url;
const patioDefault = patioAsset.url;
const truckDefault = truckAsset.url;
const cafeDefault = cafeAsset.url;
const tinoDefault = tinoAsset.url;
const equipeDefault = equipeAsset.url;

export const Route = createFileRoute("/o-valen")({
  head: () => ({
    meta: [
      { title: "O Valen — Complexo em movimento | São Luís/MA" },
      {
        name: "description",
        content:
          "Conheça o Complexo Valen: estrutura, propósito, história, experiências e o cuidado com quem vive na estrada.",
      },
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

const numeros = [
  { n: "350.000 m²", t: "área total" },
  { n: "+2.000", t: "vagas" },
  { n: "+3 mil", t: "pessoas por dia" },
  { n: "80", t: "lojas comerciais" },
  { n: "115", t: "escritórios" },
  { n: "26", t: "galpões" },
  { n: "10", t: "restaurantes" },
  { n: "35", t: "boxes no Truck Center" },
];

type EstruturaCard = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  to?: string;
  href?: string;
};

const estrutura: EstruturaCard[] = [
  { icon: Fuel, title: "Posto Valen", desc: "Abastecimento leve e pesado, Arla, conveniência e atendimento 24h.", to: "/servicos/posto-valen" },
  { icon: Store, title: "Valen Center", desc: "Lojas, serviços, alimentação e conveniência em um só lugar.", to: "/lojas" },
  { icon: Truck, title: "ValenLog", desc: "Pátio, triagem, inspeção, classificação de grãos e apoio operacional.", to: "/servicos/valenlog" },
  { icon: Wrench, title: "Truck Center", desc: "Manutenção, borracharia, mecânica e serviços para caminhões.", to: "/lojas?categoria=truck-center" },
  { icon: BedDouble, title: "Valen Porto Hotel", desc: "Hospedagem estratégica para negócios, descanso e equipes.", to: "/servicos/valen-porto-hotel" },
  { icon: Droplets, title: "ValenLub", desc: "Lubrificantes, filtros, químicos, palhetas, Arla e automotivos.", to: "/servicos/valenlub" },
  { icon: RefreshCw, title: "ValenBen Super Troca de Óleo", desc: "Troca de óleo para veículos pesados com produtos homologados.", to: "/servicos/valenben-super-troca-de-oleo" },
  { icon: Coffee, title: "Clube do Caminhoneiro", desc: "Espaço de descanso, convivência e benefícios para a estrada.", to: "/experiencias" },
  { icon: Sparkles, title: "Espaço Valentina", desc: "Acolhimento para mulheres e crianças dentro do ValenLog.", to: "/servicos/valenlog#espaco-valentina" },
];

function OValen() {
  const { data: settings } = useQuery({
    queryKey: ["o-valen-page-settings"],
    queryFn: getOValenPageSettings,
  });

  const heroImg = settings?.hero_image_url || heroDefault;
  const presentationImg = settings?.presentation_image_url || fachadaDefault;
  const purposeImg = settings?.purpose_image_url || tinoDefault;
  const experienciasImg = settings?.experiencias_image_url || cafeDefault;
  const t2019 = settings?.timeline_2019_image_url || postoDefault;
  const t2022 = settings?.timeline_2022_image_url || patioDefault;
  const t2025 = settings?.timeline_2025_image_url || fachadaDefault;

  const galleryDefault = [patioDefault, postoDefault, fachadaDefault, cafeDefault, truckDefault, tinoDefault, equipeDefault, heroDefault];
  const gallery = settings?.gallery_urls?.length ? settings.gallery_urls : galleryDefault;

  const instagram = settings?.instagram_urls?.length
    ? settings.instagram_urls
    : [patioDefault, postoDefault, fachadaDefault, cafeDefault, truckDefault, tinoDefault].map((u) => ({
        image_url: u,
        link_url: "https://www.instagram.com/posto.valen/",
      }));

  const mapUrl = settings?.map_url || "https://maps.google.com/?q=Complexo+Valen+São+Luís+MA";

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
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              Sobre o Valen
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold text-secondary text-balance">
              Um complexo criado para mover o Brasil.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Localizado a 14 km do Porto do Itaqui, no coração da região industrial de São Luís, o Valen é um complexo criado para oferecer excelência na prestação de serviços ao caminhoneiro. Reunimos em um só lugar soluções que agregam valor em todos os pontos de contato da jornada: abastecimento, triagem, estacionamento, manutenção, alimentação, descanso, hospedagem, lojas, serviços e experiências.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={presentationImg} alt="Fachada do Complexo Valen" className="aspect-square w-full object-cover rounded-3xl" loading="lazy" />
            <img src={postoDefault} alt="Posto Valen" className="aspect-square w-full object-cover rounded-3xl mt-8" loading="lazy" />
            <img src={truckDefault} alt="Truck Center" className="aspect-square w-full object-cover rounded-3xl -mt-8" loading="lazy" />
            <img src={cafeDefault} alt="Café e alimentação" className="aspect-square w-full object-cover rounded-3xl" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Nosso propósito maior */}
      <section className="py-24 bg-surface">
        <div className="container-valen grid gap-12 lg:grid-cols-2 items-center">
          <div className="relative order-2 lg:order-1 flex justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-72 w-72 md:h-96 md:w-96 rounded-full bg-gradient-orange/25 blur-3xl" />
            </div>
            <img
              src={purposeImg}
              alt="Tino e amigo, mascotes do Valen, em pose de acolhimento"
              className="relative h-72 md:h-[28rem] w-auto object-contain drop-shadow-xl"
              loading="lazy"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              Nosso propósito maior
            </span>
            <p className="mt-5 text-3xl md:text-4xl font-display font-extrabold text-secondary leading-tight text-balance">
              Nós fazemos as pessoas que estão longe de casa se sentirem <span className="text-primary">entre amigos</span>.
            </p>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Mais do que oferecer estrutura, serviços e conveniência, o Valen existe para acolher quem vive em movimento. Caminhoneiros, famílias, clientes, parceiros e equipes encontram aqui um lugar de apoio, confiança, cuidado e proximidade durante a jornada.
            </p>
          </div>
        </div>
      </section>

      {/* Valen em números */}
      <section className="py-24 bg-background">
        <div className="container-valen">
          <SectionHeader eyebrow="Números" title="O Valen em números" subtitle="Estrutura, movimento e soluções em um só lugar." center />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {numeros.map((n) => (
              <div key={n.t} className="rounded-3xl bg-card border border-border p-8 text-center shadow-soft hover:border-primary/50 transition-colors">
                <div className="text-4xl md:text-5xl font-display font-extrabold text-primary">{n.n}</div>
                <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-secondary">{n.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa estrutura */}
      <section className="py-24 bg-surface">
        <div className="container-valen">
          <SectionHeader
            eyebrow="Nossa estrutura"
            title="Tudo que movimenta a jornada de quem passa pelo Valen"
            center
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {estrutura.map((c) => {
              const inner = (
                <>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-orange text-white shadow-glow">
                    <c.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-xl font-display font-extrabold text-secondary">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  {(c.to || c.href) && (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-2.5 transition-all">
                      Saiba mais <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </>
              );
              const cls =
                "group flex flex-col rounded-3xl bg-card border border-border p-7 hover:border-primary/50 hover:-translate-y-1 transition-all shadow-soft";
              if (c.to) {
                return (
                  <Link key={c.title} to={c.to} className={cls}>
                    {inner}
                  </Link>
                );
              }
              return (
                <div key={c.title} className={cls}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Propósito + Ambição */}
      <section className="py-24 bg-background">
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
      <section className="py-24 bg-surface">
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
      <section className="py-24 bg-background">
        <div className="container-valen">
          <SectionHeader eyebrow="História" title="Nossa história em movimento" center />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { year: "2019", title: "Início da jornada", text: "Em 05 de setembro de 2019, o Complexo Valen foi inaugurado com uma área inicial de 50 mil m².", img: t2019 },
              { year: "2022", title: "Expansão contínua", text: "Com a inauguração do Pátio de Triagem 03, o Valen alcançou mais de 250 mil m² de área total.", img: t2022 },
              { year: "2025/2026", title: "Mais avanços", text: "Com novos espaços e modernizações, o Complexo Valen chegou a mais de 400 vagas, consolidando sua presença estratégica na região.", img: t2025 },
            ].map((m) => (
              <div key={m.year} className="group rounded-3xl bg-card border border-border overflow-hidden shadow-soft hover:border-primary/50 transition-colors">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={m.img} alt={m.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-7">
                  <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground shadow-glow">
                    {m.year}
                  </span>
                  <h3 className="mt-4 text-2xl font-display font-extrabold text-secondary">{m.title}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mais que uma parada */}
      <section className="py-24 bg-surface">
        <div className="container-valen">
          <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-soft grid gap-0 md:grid-cols-2">
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary self-start">
                Experiências
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-display font-extrabold text-secondary text-balance">
                Mais que uma parada, uma experiência
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                No Valen, cada jornada pode ser mais completa. De eventos e ações especiais a espaços de descanso, convivência e acolhimento, criamos experiências para aproximar pessoas, marcas e histórias.
              </p>
              <Link
                to="/experiencias"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-3.5 text-sm md:text-base font-bold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform self-start"
              >
                Ver experiências <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-[280px] md:min-h-[420px]">
              <img src={experienciasImg} alt="Experiências no Complexo Valen" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="py-24 bg-background">
        <div className="container-valen">
          <SectionHeader
            eyebrow="Galeria"
            title="Valen em movimento"
            subtitle="Um pouco da nossa estrutura, das nossas pessoas e das histórias que passam por aqui."
            center
          />
          <div className="mt-14 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {gallery.map((img, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl group ${i % 5 === 0 ? "md:row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-square"}`}
              >
                <img src={img} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="py-24 bg-surface">
        <div className="container-valen">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Instagram className="h-3.5 w-3.5" /> Instagram
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-display font-extrabold text-secondary text-balance">
                Acompanhe o Valen em movimento
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Veja de perto as novidades, ações, promoções e histórias que movimentam o Complexo Valen todos os dias.
              </p>
              <a
                href="https://www.instagram.com/posto.valen/"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform"
              >
                <Instagram className="h-4 w-4" /> Seguir no Instagram
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {instagram.slice(0, 6).map((post, i) => {
                const inner = (
                  <div className="relative aspect-square overflow-hidden rounded-2xl group bg-muted">
                    <img src={post.image_url} alt="" className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/50 transition-colors flex items-center justify-center">
                      <Instagram className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
                if (post.link_url) {
                  return (
                    <a key={i} href={post.link_url} target="_blank" rel="noreferrer">
                      {inner}
                    </a>
                  );
                }
                return <div key={i}>{inner}</div>;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 bg-background">
        <div className="container-valen">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero text-white p-12 md:p-16 text-center shadow-glow">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-balance">
                Viva essa experiência no Complexo Valen
              </h2>
              <p className="mt-4 text-lg text-white/85 max-w-2xl mx-auto">
                Estrutura, acolhimento e movimento em um só lugar para quem segue em rota.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/servicos"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-3.5 text-sm md:text-base font-bold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform"
                >
                  Conheça nossos serviços <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-7 py-3.5 text-sm md:text-base font-bold text-white hover:bg-white/20 transition-colors backdrop-blur"
                >
                  <MapPin className="h-4 w-4" /> Como chegar
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trabalhe Conosco */}
      <section className="py-20 bg-surface">
        <div className="container-valen">
          <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-soft">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
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
                <img src={equipeDefault} alt="Equipe Valen uniformizada" className="relative h-56 md:h-72 w-auto object-contain drop-shadow-xl" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
