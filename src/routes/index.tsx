import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Fuel, Bed, UtensilsCrossed, Wrench, ShoppingBag, Sparkles,
  ParkingSquare, MapPin, ArrowRight, Tag, Newspaper, Coffee,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import heroImg from "@/assets/hero-trucks.jpg";
import mascotesAsset from "@/assets/tinos.png.asset.json";
import postoImg from "@/assets/posto.jpg";
import truckImg from "@/assets/truck-center.jpg";
import hotelImg from "@/assets/hotel.jpg";
import foodImg from "@/assets/alimentacao.jpg";
import parkImg from "@/assets/estacionamento.jpg";
import festaImg from "@/assets/festa.jpg";
import { listActivePromotions, type PromotionRow } from "@/lib/promotions-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Complexo Valen — Somos feitos de movimento | São Luís/MA" },
      { name: "description", content: "Parada completa em São Luís: posto, truck center, hotel, alimentação, lojas, eventos e experiências para quem vive em movimento." },
    ],
  }),
  component: Home,
});

function Home() {
  const [dbPromos, setDbPromos] = useState<PromotionRow[]>([]);
  useEffect(() => {
    void (async () => {
      try { setDbPromos(await listActivePromotions()); } catch { /* fallback */ }
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
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary text-white">
        {/* Background com foto de caminhões + overlay azul forte */}
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-30"
            width={1920}
            height={1080}
          />
          {/* Overlay azul institucional forte */}
          <div className="absolute inset-0 bg-secondary/80" />
          {/* Gradiente escuro para profundidade e legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/90 to-secondary/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-secondary/40" />
        </div>
        <div className="absolute -bottom-32 -left-20 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

        <div className="container-valen relative py-20 md:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Coluna esquerda — texto */}
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
                <a href="https://maps.google.com/?q=Complexo+Valen+São+Luís+MA" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-7 py-4 text-base font-semibold hover:bg-white/20">
                  <MapPin className="h-4 w-4" /> Como chegar
                </a>
              </div>
            </div>

            {/* Coluna direita — mascotes */}
            <div className="relative mx-auto w-full max-w-[520px] aspect-square">
              {/* Linhas curvas de movimento (fora do círculo, sem cortar) */}
              <div className="absolute inset-[-6%] rounded-full border-2 border-primary/30" />
              <div className="absolute inset-[-14%] rounded-full border border-primary/20" />
              <div className="absolute inset-[-22%] rounded-full border border-primary/10" />
              {/* Círculo laranja */}
              <div className="absolute inset-[6%] rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-glow" />
              {/* Mascotes — contain para nunca cortar */}
              <img
                src={mascotesAsset.url}
                alt="Tino e Tina, mascotes do Complexo Valen"
                className="absolute inset-0 h-full w-full object-contain object-center drop-shadow-2xl animate-fade-up p-2"
                width={1320}
                height={1380}
              />
            </div>
          </div>
        </div>

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
              { icon: Fuel, title: "Abasteça", desc: "Combustível com confiança para sua rota.", to: "/servicos/posto" },
              { icon: Bed, title: "Descanse", desc: "Hospedagem e estrutura para repor energias.", to: "/servicos/valen-porto-hotel" },
              { icon: UtensilsCrossed, title: "Coma bem", desc: "Restaurante, lanchonete e conveniência.", to: "/servicos/alimentacao" },
              { icon: Wrench, title: "Cuide do caminhão", desc: "Truck Center completo e confiável.", to: "/servicos/truck-center" },
              { icon: ShoppingBag, title: "Resolva serviços", desc: "Lojas, lotérica e conveniência.", to: "/lojas" },
              { icon: ParkingSquare, title: "Estacione", desc: "Pátio organizado e seguro.", to: "/servicos" },
              { icon: Sparkles, title: "Viva experiências", desc: "Eventos, cinema e Clube do Caminhoneiro.", to: "/experiencias" },
              { icon: Coffee, title: "Acolhimento", desc: "Café de sábado e cuidado pessoal.", to: "/servicos/clube-do-caminhoneiro" },
            ].map((c) => (
              <Link key={c.title} to={c.to} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-glow hover:border-primary/40">
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
                        {p.cover_url && <img src={p.cover_url} alt={p.title} className="h-full w-full object-cover" loading="lazy" />}
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
                    { cat: "Posto", title: "Diesel com preço especial", desc: "Condições exclusivas para abastecimento no Posto Valen.", date: "Até 31/12", img: postoImg },
                    { cat: "Conveniência", title: "Voucher na Conveniência", desc: "Abasteça e participe de campanhas especiais para aproveitar sua parada.", date: "Campanha ativa", img: foodImg },
                    { cat: "Estacionamento", title: "Estacionamento com condição especial", desc: "Confira as condições para garantir sua permanência no pátio.", date: "Promoção", img: parkImg },
                    { cat: "Truck Center", title: "Troca de óleo em promoção", desc: "Manutenção preventiva com condições especiais.", date: "Até esgotar", img: truckImg },
                  ].map((p) => (
                    <article key={p.title} className="w-[320px] md:w-[360px] shrink-0 overflow-hidden rounded-3xl bg-card border border-border shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all">
                      <div className="relative h-44 overflow-hidden">
                        <img src={p.img} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
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

      {/* O QUE VOCÊ ENCONTRA */}
      <section className="py-24 bg-background">
        <div className="container-valen">
          <SectionHeader
            eyebrow="No complexo"
            title="O que você encontra no Valen"
            subtitle="Um complexo completo para caminhoneiros, empresas, viajantes e todos que vivem em movimento."
            center
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              { title: "Posto de Combustível", desc: "Abastecimento com confiança e estrutura completa.", to: "/servicos/posto" as const, icon: Fuel },
              { title: "ValenBen — Super Troca de Óleo", desc: "Troca de óleo especializada para leves e pesados.", to: "/servicos" as const, icon: Wrench },
              { title: "Valen Center", desc: "Lojas e salas comerciais dentro do complexo.", to: "/lojas" as const, icon: ShoppingBag },
              { title: "Valen Truck Center", desc: "Manutenção, borracharia e oficinas especializadas.", to: "/servicos/truck-center" as const, icon: Wrench },
              { title: "ValenLog — Triagem e Estacionamento", desc: "Triagem, pátio e app para organização logística.", to: "/servicos" as const, icon: ParkingSquare },
              { title: "Classificação de Grãos", desc: "Serviço exclusivo de apoio às operações agrícolas.", to: "/servicos" as const, icon: Sparkles },
              { title: "Espaço Valentina", desc: "Acolhimento e cuidado para quem passa pelo Valen.", to: "/experiencias" as const, icon: Coffee },
              { title: "Clube do Caminhoneiro", desc: "Convivência, lazer e bem-estar para o motorista.", to: "/servicos/clube-do-caminhoneiro" as const, icon: Sparkles },
              { title: "Valen Porto Hotel", desc: "Hospedagem estratégica para descanso e negócios.", to: "/servicos/valen-porto-hotel" as const, icon: Bed },
              { title: "ValenLub", desc: "Distribuidora de lubrificantes para a estrada.", to: "/servicos" as const, icon: Fuel },
              { title: "Lotérica Valen", desc: "Serviços financeiros sem sair do complexo.", to: "/lojas" as const, icon: Tag },
              { title: "Studio Valen", desc: "Conteúdo, comunicação e experiências do Valen.", to: "/blog" as const, icon: Newspaper },
            ].map((c) => (
              <Link key={c.title} to={c.to} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 hover:-translate-y-1 hover:shadow-glow hover:border-primary/40 transition-all flex flex-col">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-orange text-white shadow-glow">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-display font-bold text-secondary leading-snug">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{c.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                  Ver mais <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIÊNCIAS */}
      <section className="py-24 bg-surface">
        <div className="container-valen">
          <SectionHeader
            eyebrow="Experiências"
            title="Mais do que uma parada. Uma experiência em movimento."
            subtitle="No Valen, a estrada encontra acolhimento. Criamos experiências que fazem quem está longe de casa se sentir entre amigos."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Festa do Caminhoneiro", d: "Um dos maiores momentos de celebração do complexo." },
              { t: "Café de Sábado", d: "Acolhimento e conexão com quem vive na estrada." },
              { t: "Sexta Valen", d: "Música, promoções e relacionamento toda semana." },
              { t: "Clube do Caminhoneiro", d: "Benefícios e cuidado para a rotina na estrada." },
              { t: "Cinema gratuito", d: "Lazer para descontrair durante a parada." },
              { t: "Barbearia e cuidado pessoal", d: "Bem-estar para seguir em rota com energia." },
            ].map((e) => (
              <div key={e.t} className="rounded-3xl bg-card border border-border p-7 hover:border-primary/50 hover:-translate-y-1 transition-all">
                <Sparkles className="h-7 w-7 text-primary" />
                <h3 className="mt-4 text-xl font-display font-bold text-secondary">{e.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{e.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/experiencias" className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-4 text-base font-bold text-primary-foreground shadow-glow hover:scale-105 transition-transform">
              Conheça nossas experiências <ArrowRight className="h-4 w-4" />
            </Link>
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
              <a href="https://maps.google.com/?q=Complexo+Valen+São+Luís+MA" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-4 text-base font-bold text-primary-foreground shadow-glow">
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

      {/* NOTÍCIAS */}
      <section className="py-24 bg-surface">
        <div className="container-valen">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHeader eyebrow="Conteúdo" title="O que movimenta o Valen" subtitle="Notícias, dicas, campanhas e novidades para quem acompanha nosso complexo." />
            <Link to="/blog" className="shrink-0 inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { cat: "Dicas", title: "Dicas para quem vive na estrada", img: postoImg },
              { cat: "Eventos", title: "Experiências em movimento no Valen", img: festaImg },
              { cat: "Novidades", title: "Novidades do complexo Valen", img: hotelImg },
            ].map((n) => (
              <Link to="/blog" key={n.title} className="group overflow-hidden rounded-3xl bg-card border border-border hover:-translate-y-1 hover:shadow-glow transition-all">
                <div className="h-48 overflow-hidden">
                  <img src={n.img} alt={n.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                </div>
                <div className="p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"><Newspaper className="h-3 w-3" /> {n.cat}</span>
                  <h3 className="mt-3 text-lg font-display font-bold text-secondary group-hover:text-primary transition-colors">{n.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                <a href="https://maps.google.com/?q=Complexo+Valen+São+Luís+MA" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-7 py-4 text-base font-bold shadow-glow hover:scale-105 transition-transform">
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
