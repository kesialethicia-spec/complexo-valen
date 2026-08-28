import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Fuel, Bed, UtensilsCrossed, Wrench, ShoppingBag, Sparkles,
  ParkingSquare, MapPin, ArrowRight, Tag, Newspaper, Coffee,
  Heart, Users, Baby, Mic, Calendar, Smartphone,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { SmartImage } from "@/components/SmartImage";
import mascotesAsset from "@/assets/tinos-novos.png.asset.json";
import appTelasAsset from "@/assets/clube/app-telas.png.asset.json";

import { listActivePromotions, type PromotionRow } from "@/lib/promotions-api";
import { getHomePageSettings } from "@/lib/home-settings-api";
import { getClubeSettings, DEFAULT_CLUBE_SETTINGS, type ClubeSettings } from "@/lib/clube-valen-api";
import { getExperienciasPageSettings, DEFAULT_EXPERIENCIAS_SETTINGS, type ExperienciasPageSettings } from "@/lib/experiencias-settings-api";
import { listPublishedPosts, formatPublishedDate, type BlogPostRow } from "@/lib/blog-api";
import { Img } from "@/components/Img";
import { RESPONSIVE_IMAGES } from "@/lib/images.generated";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Complexo Valen — Somos feitos de movimento | São Luís/MA" },
      { name: "description", content: "Parada completa em São Luís: posto, truck center, hotel, alimentação, lojas, eventos e experiências para quem vive em movimento." },
    ],
    links: [
      {
        rel: "preload",
        as: "image",
        href: mascotesAsset.url,
        imagesrcset: RESPONSIVE_IMAGES["tinos-novos.png"]?.srcSet,
        imagesizes: "(max-width: 1024px) 90vw, 520px",
        fetchpriority: "high",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [dbPromos, setDbPromos] = useState<PromotionRow[]>([]);
  const [heroBgDesktop, setHeroBgDesktop] = useState<string>("");
  const [heroBgMobile, setHeroBgMobile] = useState<string>("");
  const [latestPosts, setLatestPosts] = useState<BlogPostRow[]>([]);
  const [expSettings, setExpSettings] = useState<ExperienciasPageSettings>(DEFAULT_EXPERIENCIAS_SETTINGS);
  const [clube, setClube] = useState<ClubeSettings>(DEFAULT_CLUBE_SETTINGS);
  useEffect(() => {
    void (async () => {
      try { setDbPromos(await listActivePromotions()); } catch { /* fallback */ }
    })();
    void (async () => {
      try {
        const s = await getHomePageSettings();
        const desktop = s.hero_bg_image_desktop_url || s.hero_bg_image_url;
        if (desktop) setHeroBgDesktop(desktop);
        if (s.hero_bg_image_mobile_url) setHeroBgMobile(s.hero_bg_image_mobile_url);
      } catch { /* fallback */ }
    })();
    void (async () => {
      try { setLatestPosts((await listPublishedPosts()).slice(0, 3)); } catch { /* fallback */ }
    })();
    void (async () => {
      try { setExpSettings(await getExperienciasPageSettings()); } catch { /* fallback */ }
    })();
    void (async () => {
      try { setClube(await getClubeSettings()); } catch { /* fallback */ }
    })();
  }, []);

  const homePromos = useMemo(() => {
    if (dbPromos.length === 0) return null;
    return [...dbPromos].sort((a, b) => {
      const bs = (b.show_on_home ? 2 : 0) + (b.featured ? 1 : 0);
      const as = (a.show_on_home ? 2 : 0) + (a.featured ? 1 : 0);
      return bs - as;
    }).slice(0, 6);
  }, [dbPromos]);

  // Slides do hero: institucional + promoções (featured + show_on_home + status ativa)
  const heroPromos = useMemo(
    () => dbPromos.filter((p) => p.status === "ativa" && p.featured && p.show_on_home && p.cover_url),
    [dbPromos],
  );
  const totalSlides = 1 + heroPromos.length;
  const [slideIdx, setSlideIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => { if (slideIdx >= totalSlides) setSlideIdx(0); }, [totalSlides, slideIdx]);
  useEffect(() => {
    if (paused || totalSlides <= 1) return;
    const id = window.setInterval(() => setSlideIdx((i) => (i + 1) % totalSlides), 6000);
    return () => window.clearInterval(id);
  }, [paused, totalSlides]);
  const goPrev = () => setSlideIdx((i) => (i - 1 + totalSlides) % totalSlides);
  const goNext = () => setSlideIdx((i) => (i + 1) % totalSlides);

  return (
    <>
      {/* HERO */}
      <section
        className="relative overflow-hidden bg-secondary text-white"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slide institucional */}
        <div className={slideIdx === 0 ? "block relative" : "hidden"}>
          <div className="absolute inset-0 overflow-hidden bg-secondary">
            {(heroBgDesktop || heroBgMobile) && (
              <picture>
                {heroBgMobile && (
                  <source media="(max-width: 767px)" srcSet={heroBgMobile} />
                )}
                <Img
                  src={heroBgDesktop || heroBgMobile}
                  alt=""
                  aria-hidden="true"
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                  width={1920}
                  height={1080}
                />
              </picture>
            )}
            {/* Overlay azul escuro — mantém legibilidade e deixa a foto visível */}
            <div className="absolute inset-0 bg-secondary/75" />
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/60 via-secondary/40 to-secondary/70" />
          </div>
          <div className="absolute -bottom-32 -left-20 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />


          <div className="container-valen relative py-20 md:py-28 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className="relative z-10 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/90">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Complexo Valen · São Luís/MA
                </span>
                <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-display font-extrabold leading-[0.95] tracking-tight text-balance animate-fade-up">
                  Somos feitos<br />
                  de <span className="text-primary">movimento.</span>
                </h1>
                <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-white/85 leading-relaxed">
                  Mais do que uma parada, o Valen é um ponto de apoio para quem está em movimento. Um complexo completo para caminhoneiros, empresas e pessoas que seguem em rota.
                </p>
                <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link to="/o-valen" className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-4 text-base font-bold shadow-glow hover:scale-105 transition-transform">
                    Conheça o complexo <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href="https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-7 py-4 text-base font-semibold hover:bg-white/20">
                    <MapPin className="h-4 w-4" /> Como chegar
                  </a>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[520px] aspect-square">
                <div className="absolute inset-[-6%] rounded-full border-2 border-primary/30" />
                <div className="absolute inset-[-14%] rounded-full border border-primary/20" />
                <div className="absolute inset-[-22%] rounded-full border border-primary/10" />
                <div className="absolute inset-[6%] rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-glow" />
                <Img
                  src={mascotesAsset.url}
                  alt="Tino e Tina, mascotes do Complexo Valen"
                  fetchPriority="high"
                  sizes="(max-width: 1024px) 90vw, 520px"
                  className="absolute inset-0 h-full w-full object-contain object-center drop-shadow-2xl animate-fade-up p-2"
                  width={1320}
                  height={1380}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Slides de promoções — arte full-bleed, sem moldura */}
        {heroPromos.map((p, i) => (
          <div key={p.id} className={slideIdx === i + 1 ? "block" : "hidden"}>
            <Link
              to="/promocoes/$slug"
              params={{ slug: p.slug }}
              aria-label={`Ver promoção: ${p.title}`}
              className="relative block w-full min-h-[520px] md:min-h-[640px] lg:min-h-[720px] bg-secondary overflow-hidden"
            >
              <Img
                src={p.cover_url}
                alt={p.title}
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full object-cover [object-position:center_top] md:[object-position:center_center]"
              />
            </Link>
          </div>
        ))}


        {/* Controles do carrossel */}
        {totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Slide anterior"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Próximo slide"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlideIdx(i)}
                  aria-label={`Ir para slide ${i + 1}`}
                  className={
                    "h-2.5 rounded-full transition-all " +
                    (slideIdx === i ? "w-6 bg-primary" : "w-2.5 bg-white/40 hover:bg-white/70")
                  }
                />
              ))}
            </div>
          </>
        )}

        {/* Marquee strip */}
        <div className="relative border-t border-white/10 bg-secondary/60 backdrop-blur overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-3 text-sm font-bold uppercase tracking-widest text-white/50">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex shrink-0">
                {["Estrada", "Acolhimento", "Jornada", "Parada completa", "Experiência", "Confiança", "Movimento"].map((t, i) => (
                  <span key={i} className="flex items-center gap-6 px-6">
                    {t} <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JORNADA */}
      <section className="py-24 bg-background">
        <div className="container-valen">
          <SectionHeader
            eyebrow="Sua jornada completa"
            title="Tudo que move sua jornada, em um só lugar"
            subtitle="No Valen, o motorista faz a sua jornada completa. Oferecemos produtos de qualidade, estrutura diferenciada, conforto, segurança e serviços pensados para quem vive em movimento."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Fuel, title: "Abasteça", desc: "Combustível com confiança para sua rota.", to: "/servicos/posto-valen" },
              { icon: Bed, title: "Descanse", desc: "Hospedagem e estrutura para repor energias.", to: "/servicos/valen-porto-hotel" },
              { icon: UtensilsCrossed, title: "Coma bem", desc: "Restaurante, lanchonete e conveniência.", to: "/lojas", search: { categoria: "alimentacao" } as Record<string, string> | undefined },
              { icon: Wrench, title: "Cuide do caminhão", desc: "Truck Center completo e confiável.", to: "/lojas", search: { categoria: "truck-center" } as Record<string, string> | undefined },
              { icon: ShoppingBag, title: "Resolva serviços", desc: "Lojas, lotérica e conveniência.", to: "/lojas", hash: undefined as string | undefined },
              { icon: ParkingSquare, title: "Estacione", desc: "Pátio organizado e seguro.", to: "/servicos/valenlog", hash: undefined },
              { icon: Sparkles, title: "Viva experiências", desc: "Eventos, cinema e Clube do Caminhoneiro.", to: "/experiencias", hash: undefined },
              { icon: Coffee, title: "Acolhimento", desc: "Espaço Valentina para mulheres e crianças.", to: "/servicos/valenlog", hash: "espaco-valentina" },
            ].map((c) => (
              <Link key={c.title} to={c.to as string} hash={(c as { hash?: string }).hash} search={(c as { search?: Record<string, string> }).search as never} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-glow hover:border-primary/40">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-orange text-white shadow-glow">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-display font-bold text-secondary">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                <ArrowRight className="absolute top-6 right-6 h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* PROMOÇÕES carrossel */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="container-valen relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHeader
              eyebrow="Promoções em movimento"
              title="Promoções em movimento"
              subtitle="Campanhas, ofertas e vantagens especiais para quem passa pelo Valen."
            />
            <Link to="/promocoes" className="shrink-0 inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 -mx-5 px-5 overflow-x-auto pb-4">
            <div className="flex gap-5 w-max">
              {homePromos
                ? homePromos.map((p) => (
                    <Link
                      key={p.id}
                      to="/promocoes/$slug"
                      params={{ slug: p.slug }}
                      className="w-[320px] md:w-[360px] shrink-0 overflow-hidden rounded-3xl bg-card border border-border shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <SmartImage src={p.cover_url} alt={p.title} rounded="rounded-none" className="h-full w-full" />
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                          <Tag className="h-3 w-3" /> {p.category}
                        </span>
                      </div>
                      <div className="p-6">
                        <p className="text-xs font-semibold text-muted-foreground">{p.validity}</p>
                        <h3 className="mt-1.5 text-lg font-display font-bold text-secondary">{p.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.short_description}</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                          Ver promoção <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  ))
                : [
                    { cat: "Posto", title: "Diesel com preço especial", desc: "Condições exclusivas para abastecimento no Posto Valen.", date: "Até 31/12", img: "" },
                    { cat: "Conveniência", title: "Voucher na Conveniência", desc: "Abasteça e participe de campanhas especiais para aproveitar sua parada.", date: "Campanha ativa", img: "" },
                    { cat: "Estacionamento", title: "Estacionamento com condição especial", desc: "Confira as condições para garantir sua permanência no pátio.", date: "Promoção", img: "" },
                    { cat: "Truck Center", title: "Troca de óleo em promoção", desc: "Manutenção preventiva com condições especiais.", date: "Até esgotar", img: "" },
                  ].map((p) => (
                    <article key={p.title} className="w-[320px] md:w-[360px] shrink-0 overflow-hidden rounded-3xl bg-card border border-border shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all">
                      <div className="relative h-44 overflow-hidden">
                        <SmartImage src={p.img} alt={p.title} rounded="rounded-none" className="h-full w-full" />
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                          <Tag className="h-3 w-3" /> {p.cat}
                        </span>
                      </div>
                      <div className="p-6">
                        <p className="text-xs font-semibold text-muted-foreground">{p.date}</p>
                        <h3 className="mt-1.5 text-lg font-display font-bold text-secondary">{p.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.desc}</p>
                        <Link to="/promocoes" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
                          Ver promoção <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIÊNCIAS — vitrine visual */}
      {(() => {
        const firstEventImg = expSettings.events.find(
          (e) => e.status === "publicado" && e.image_url,
        )?.image_url;
        const cards = [
          {
            t: "Café da Manhã de Sábado",
            d: "Todo sábado, um momento de acolhimento para quem está na estrada.",
            hash: "cafe-da-manha",
            tag: "Tradição",
            icon: Coffee,
            img: expSettings.cafe_image_url || "",
          },
          {
            t: "Ações de Saúde",
            d: "Iniciativas pensadas para promover bem-estar e atenção a quem passa pelo Valen.",
            hash: "acoes-de-saude",
            tag: "Cuidado",
            icon: Heart,
            img: expSettings.saude_image_urls.filter(Boolean)[0] || "",
          },
          {
            t: "Clube do Caminhoneiro",
            d: "Um espaço criado para valorizar quem move o Brasil todos os dias.",
            hash: "clube-do-caminhoneiro",
            tag: "Comunidade",
            icon: Users,
            img: expSettings.clube_image_url || "",
          },
          {
            t: "Espaço Valentina",
            d: "Um ambiente pensado para trazer leveza, carinho e conexão para toda a família.",
            hash: "espaco-valentina",
            tag: "Família",
            icon: Baby,
            img: expSettings.valentina_image_urls.filter(Boolean)[0] || "",
          },
          {
            t: "Studio Valen",
            d: "Um espaço voltado para cuidado, autoestima e experiências que vão além da estrada.",
            hash: "studio-valen",
            tag: "Bem-estar",
            icon: Mic,
            img: expSettings.studio_image_url || "",
          },
          {
            t: "Eventos Valen",
            d: "Ações especiais, campanhas e encontros que tornam a experiência no Valen ainda mais marcante.",
            hash: "eventos",
            tag: "Eventos",
            icon: Calendar,
            img: firstEventImg || expSettings.festa_image_url || "",
          },
        ];
        const [featured, side, ...rest] = cards;

        const ExpCard = ({
          c,
          size,
        }: {
          c: (typeof cards)[number];
          size: "lg" | "md" | "sm";
        }) => (
          <Link
            to="/experiencias"
            hash={c.hash}
            className="group relative block h-full overflow-hidden rounded-3xl transition-transform duration-500 hover:-translate-y-1"
          >
            <SmartImage
              src={c.img}
              alt={c.t}
              rounded="rounded-none"
              className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-secondary/10" />
            <div
              className={`relative flex h-full flex-col justify-end text-white ${
                size === "lg" ? "p-8 lg:p-10" : "p-6"
              }`}
            >
              <span
                className={`inline-flex self-start items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                  size === "lg" ? "bg-primary text-primary-foreground" : "bg-white/15 backdrop-blur text-white"
                }`}
              >
                <c.icon className={`h-3 w-3 ${size === "lg" ? "" : "text-primary"}`} /> {c.tag}
              </span>
              <h3
                className={`mt-4 font-display font-extrabold text-balance leading-tight ${
                  size === "lg" ? "text-3xl lg:text-[2.4rem]" : size === "md" ? "text-2xl" : "text-xl"
                }`}
              >
                {c.t}
              </h3>
              <p
                className={`mt-2.5 text-white/85 leading-relaxed ${
                  size === "lg" ? "text-base max-w-md" : "text-sm line-clamp-2"
                }`}
              >
                {c.d}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary transition-all group-hover:gap-3.5">
                Ver mais <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        );

        return (
          <section className="py-24 lg:py-28 bg-surface">
            <div className="container-valen">
              <SectionHeader
                eyebrow="Experiências"
                title="Mais do que uma parada. Uma experiência em movimento."
                subtitle="No Valen, cada parada também é feita de cuidado, convivência, conteúdo e momentos que aproximam pessoas."
              />

              {/* Destaque + card lateral */}
              <div className="mt-14 grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-8 h-[380px] sm:h-[440px] lg:h-[520px]">
                  <ExpCard c={featured} size="lg" />
                </div>
                <div className="lg:col-span-4 h-[300px] lg:h-[520px]">
                  <ExpCard c={side} size="md" />
                </div>
              </div>

              {/* Cards complementares */}
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {rest.map((c) => (
                  <div key={c.t} className="h-[260px]">
                    <ExpCard c={c} size="sm" />
                  </div>
                ))}
              </div>

              <div className="mt-14 text-center">
                <Link
                  to="/experiencias"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-8 py-4 text-base font-bold text-primary-foreground shadow-glow hover:scale-105 transition-transform"
                >
                  Conheça nossas experiências <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        );
      })()}


      {/* CLUBE VALEN FIDELIDADE */}
      <section className="relative overflow-hidden bg-secondary text-white py-24 lg:py-28">
        <div className="absolute -top-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-[26rem] w-[26rem] rounded-full bg-white/5 blur-3xl" />
        <svg className="absolute inset-x-0 top-10 w-full h-40 opacity-[0.12]" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden>
          <path d="M0,120 Q360,20 720,120 T1440,120" fill="none" stroke="white" strokeWidth="2" />
          <path d="M0,160 Q360,60 720,160 T1440,160" fill="none" stroke="white" strokeWidth="2" />
        </svg>

        <div className="container-valen relative">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                <Smartphone className="h-3.5 w-3.5 text-primary" /> Clube Valen Fidelidade
              </span>
              <h2 className="mt-5 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-balance leading-[1.05]">
                Sua parada vale mais.
              </h2>
              <p className="mt-5 text-lg text-white/85 leading-relaxed max-w-xl">
                Abasteça, acumule pontos e troque por benefícios direto pelo aplicativo Clube Valen Fidelidade.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-primary-foreground">
                Abasteceu? Pontuou.
              </span>

              <div className="mt-10">
                <Link to="/clube-valen-fidelidade" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold backdrop-blur hover:bg-white/20 transition-colors">
                  Conheça o Clube Valen <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Mockup */}
            <div className="relative order-first lg:order-last">
              <div className="relative mx-auto max-w-md">
                <div className="absolute inset-0 m-auto h-64 w-64 sm:h-80 sm:w-80 rounded-full bg-gradient-orange opacity-90 blur-[2px]" aria-hidden />
                <Img
                  src={appTelasAsset.url}
                  alt="Telas do aplicativo Clube Valen Fidelidade"
                  sizes="(max-width: 1024px) 70vw, 420px"
                  className="relative mx-auto w-[82%] drop-shadow-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>





      {/* MANIFESTO */}
      <section className="relative py-32 bg-gradient-orange text-primary-foreground overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
        <svg className="absolute top-0 left-0 w-full h-32 opacity-20" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,100 Q360,0 720,100 T1440,100" fill="none" stroke="white" strokeWidth="2" />
          <path d="M0,140 Q360,40 720,140 T1440,140" fill="none" stroke="white" strokeWidth="2" />
        </svg>
        <div className="container-valen relative text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] opacity-80">Manifesto</p>
          <h2 className="mt-6 text-5xl md:text-7xl font-display font-extrabold tracking-tight text-balance leading-[0.95]">
            Movimento é o que<br />nos define.
          </h2>
          <p className="mt-8 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-white/90">
            Movimento de quem chega, de quem parte, de quem trabalha, de quem transporta, de quem faz a economia girar. No Valen, cada parada foi pensada para oferecer estrutura, conveniência e experiências para quem está sempre em rota.
          </p>
        </div>
      </section>

      {/* MAPA */}
      <section className="py-24 bg-background">
        <div className="container-valen">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <SectionHeader
                eyebrow="Localização"
                title="No caminho de quem move o Brasil"
                subtitle="Localizado em São Luís, o Valen é uma parada estratégica para caminhoneiros, empresas, viajantes e operações logísticas."
              />
              <a href="https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-4 text-base font-bold text-primary-foreground shadow-glow">
                <MapPin className="h-4 w-4" /> Abrir no Google Maps
              </a>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-border shadow-glow aspect-[4/3]">
              <iframe
                src="https://www.google.com/maps?q=São+Luís+MA&output=embed"
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                title="Localização Complexo Valen"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NOTÍCIAS — composição editorial */}
      {(() => {
        const posts = latestPosts.map((p) => ({
          slug: p.slug,
          cat: p.category,
          title: p.title,
          excerpt: p.excerpt,
          img: p.cover_url || "",
          date: formatPublishedDate(p.published_at),
        }));
        const [main, ...secondary] = posts;
        return (
          <section className="py-24 lg:py-28 bg-surface">
            <div className="container-valen">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <SectionHeader
                  eyebrow="Conteúdo"
                  title="O que movimenta o Valen"
                  subtitle="Notícias, dicas, experiências e histórias para quem vive a estrada com a gente."
                />
                <Link to="/blog-do-caminhoneiro" className="shrink-0 inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary/90 transition-colors">
                  Ver todas as notícias <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {posts.length === 0 ? (
                <div className="mt-12 rounded-3xl border border-border bg-card p-10 text-center">
                  <p className="text-muted-foreground">Em breve, novos conteúdos por aqui.</p>
                </div>
              ) : (
                <div className="mt-12 grid gap-6 lg:grid-cols-12">
                  {/* Matéria principal */}
                  <Link
                    to="/blog-do-caminhoneiro/$slug"
                    params={{ slug: main.slug }}
                    className="group lg:col-span-7 flex flex-col overflow-hidden rounded-3xl bg-card border border-border hover:-translate-y-1 hover:shadow-glow transition-all"
                  >
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <SmartImage src={main.img} alt={main.title} rounded="rounded-none" className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" />
                      <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                        <Newspaper className="h-3 w-3" /> {main.cat}
                      </span>
                    </div>
                    <div className="p-7 flex flex-col flex-1">
                      {main.date && <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{main.date}</span>}
                      <h3 className="mt-2 text-2xl md:text-3xl font-display font-extrabold text-secondary leading-tight text-balance group-hover:text-primary transition-colors">{main.title}</h3>
                      {main.excerpt && <p className="mt-3 text-base text-muted-foreground leading-relaxed line-clamp-3">{main.excerpt}</p>}
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition-all group-hover:gap-3.5">
                        Ler matéria <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>

                  {/* Matérias secundárias */}
                  <div className="lg:col-span-5 grid gap-6 content-start">
                    {secondary.map((n) => (
                      <Link
                        key={n.slug}
                        to="/blog-do-caminhoneiro/$slug"
                        params={{ slug: n.slug }}
                        className="group flex flex-col sm:flex-row overflow-hidden rounded-3xl bg-card border border-border hover:-translate-y-1 hover:shadow-glow transition-all"
                      >
                        <div className="relative overflow-hidden sm:w-2/5 aspect-[16/10] sm:aspect-auto sm:min-h-[170px]">
                          <SmartImage src={n.img} alt={n.title} rounded="rounded-none" className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-6 flex flex-col justify-center sm:w-3/5">
                          <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                            <Newspaper className="h-3 w-3" /> {n.cat}
                          </span>
                          <h3 className="mt-2.5 text-lg font-display font-bold text-secondary leading-snug line-clamp-3 group-hover:text-primary transition-colors">{n.title}</h3>
                          {n.date && <span className="mt-2 text-xs text-muted-foreground">{n.date}</span>}
                          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-all group-hover:gap-3">
                            Ler matéria <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })()}


      {/* CTA FINAL */}
      <section className="py-24 bg-background">
        <div className="container-valen">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-secondary p-10 md:p-16 text-white">
            <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-balance">
                Venha viver o Valen em <span className="text-primary">movimento</span>.
              </h2>
              <p className="mt-5 text-lg text-white/85">Estrutura, conveniência, acolhimento e experiências para transformar sua parada em algo completo.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-4 text-base font-bold shadow-glow hover:scale-105 transition-transform">
                  <MapPin className="h-4 w-4" /> Como chegar
                </a>
                <Link to="/contato" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-7 py-4 text-base font-semibold hover:bg-white/20">
                  Fale conosco <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
