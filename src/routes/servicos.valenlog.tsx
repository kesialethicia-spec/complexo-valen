import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  MapPin, ArrowRight, ParkingSquare, ClipboardCheck, Wheat, ShieldCheck,
  Smartphone, HandHeart, Wifi, Baby, Snowflake, MonitorSmartphone, Bed, BedDouble,
  Sparkles, Check,
} from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getValenlogPageSettings } from "@/lib/valenlog-settings-api";
import patioAereoAsset from "@/assets/valenlog/patio-aereo.jpg.asset.json";
import patioTriagemAsset from "@/assets/valenlog/patio-triagem.png.asset.json";
import classificacaoAsset from "@/assets/valenlog/classificacao-graos.jpg.asset.json";
import caminhoesAsset from "@/assets/valenlog/caminhoes-cobertura.jpg.asset.json";

const FALLBACK_HERO = patioAereoAsset.url;
const FALLBACK_PRESENTATION = patioTriagemAsset.url;
const FALLBACK_CLASSIFICACAO = classificacaoAsset.url;
const FALLBACK_INSPECAO = caminhoesAsset.url;
const FALLBACK_GALLERY = [
  patioAereoAsset.url,
  patioTriagemAsset.url,
  classificacaoAsset.url,
  caminhoesAsset.url,
];
const FALLBACK_VALENTINA = [caminhoesAsset.url, patioTriagemAsset.url];

export const Route = createFileRoute("/servicos/valenlog")({
  head: () => ({
    meta: [
      { title: "ValenLog — Triagem, pátio e apoio logístico | Complexo Valen" },
      {
        name: "description",
        content:
          "Pátio, triagem, inspeção, classificação de grãos, app ValenLog e Espaço Valentina. Estrutura completa para o motorista e para a operação logística.",
      },
      { property: "og:title", content: "ValenLog — Complexo Valen" },
      {
        property: "og:description",
        content:
          "Estrutura logística completa: pátio, triagem, inspeção, classificação de grãos e Espaço Valentina.",
      },
    ],
  }),
  loader: async ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["valenlog-page-settings"],
      queryFn: getValenlogPageSettings,
    }),
  component: ValenlogPage,
});

function ValenlogPage() {
  const { data: settings } = useSuspenseQuery({
    queryKey: ["valenlog-page-settings"],
    queryFn: getValenlogPageSettings,
  });

  const heroImage = settings.hero_image_url || FALLBACK_HERO;
  const presentationImage = settings.presentation_image_url || FALLBACK_PRESENTATION;
  const classificacaoImage = settings.classificacao_image_url || FALLBACK_CLASSIFICACAO;
  const inspecaoImage = settings.inspecao_image_url || FALLBACK_INSPECAO;
  const valentinaImages =
    settings.valentina_image_urls.filter(Boolean).length > 0
      ? settings.valentina_image_urls.filter(Boolean)
      : FALLBACK_VALENTINA;
  const gallerySrc = settings.gallery_urls.filter(Boolean);
  const gallery = (gallerySrc.length > 0 ? gallerySrc : FALLBACK_GALLERY).slice(0, 6);
  const mapUrl = settings.map_url || "https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6";

  // Scroll to hash on load / hash change
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash?.replace("#", "");
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) {
        // small delay so images/layout settle
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      }
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Pátio ValenLog" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/95 via-secondary/85 to-secondary/70" />
        </div>

        <div className="container-valen relative py-24 md:py-36">
          <nav className="text-xs text-white/70 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/servicos" className="hover:text-white">Serviços</Link>
            <span className="mx-2">/</span>
            <span>ValenLog</span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> ValenLog
          </span>
          <h1 className="mt-6 max-w-3xl text-5xl md:text-6xl font-display font-extrabold tracking-tight text-balance">
            Estrutura logística completa para quem move o Brasil
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85 leading-relaxed">
            Pátio organizado, triagem, inspeção, classificação de grãos e o app ValenLog: tudo pensado
            para dar agilidade à operação e conforto ao motorista.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/30 px-6 py-3 font-semibold hover:bg-white/20 transition"
            >
              <MapPin className="h-4 w-4" /> Como chegar
            </a>
            <a
              href="#espaco-valentina"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-orange text-primary-foreground px-6 py-3 font-bold shadow-glow hover:shadow-lg transition"
            >
              Conheça o Espaço Valentina <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,90 1080,0 1440,50 L1440,80 L0,80 Z" fill="var(--background)" />
        </svg>
      </section>

      {/* APRESENTAÇÃO */}
      <section className="py-24 bg-background">
        <div className="container-valen grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Nossa operação
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              ValenLog — Triagem, pátio e apoio ao motorista
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              O ValenLog é o braço logístico do Complexo Valen. Aqui o motorista encontra pátio
              organizado, processo de triagem eficiente, inspeção, classificação de grãos e todo
              o suporte para uma parada tranquila e produtiva.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#solucoes"
                className="inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-5 py-2.5 font-semibold text-sm"
              >
                Ver soluções <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#espaco-valentina"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-semibold text-sm hover:bg-muted"
              >
                Espaço Valentina
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-orange opacity-20 blur-2xl" />
            <img
              src={presentationImage}
              alt="Pátio de Triagem ValenLog"
              className="relative w-full aspect-[4/3] object-cover rounded-3xl shadow-glow"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* SOLUÇÕES */}
      <section id="solucoes" className="py-20 bg-surface">
        <div className="container-valen">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Soluções ValenLog
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Tudo o que a operação e o motorista precisam
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: ParkingSquare, title: "Pátio e estacionamento", desc: "Espaço amplo, sinalizado e monitorado para caminhões." },
              { icon: ClipboardCheck, title: "Triagem operacional", desc: "Fluxo organizado para agilizar cargas e descargas." },
              { icon: Wheat, title: "Triagem de grãos e fertilizantes", desc: "Processos dedicados às operações agrícolas." },
              { icon: ShieldCheck, title: "Inspeção", desc: "Área específica com estrutura e apoio ao motorista." },
              { icon: Sparkles, title: "Classificação de Grãos", desc: "Serviço técnico com agilidade e qualidade." },
              { icon: Smartphone, title: "Aplicativo ValenLog", desc: "Acompanhamento e organização da fila e da operação." },
              { icon: HandHeart, title: "Apoio ao motorista", desc: "Conforto, informação e suporte durante a parada." },
            ].map((c) => (
              <div key={c.title} className="rounded-3xl bg-card border border-border p-7 hover:border-primary/40 hover:shadow-glow hover:-translate-y-1 transition">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-orange text-primary-foreground shadow-glow">
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-display font-bold text-secondary">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASSIFICAÇÃO DE GRÃOS */}
      <section className="py-24 bg-background">
        <div className="container-valen grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/15 blur-2xl" />
            <img
              src={classificacaoImage}
              alt="Classificação de Grãos ValenLog"
              className="relative w-full aspect-[4/3] object-cover rounded-3xl shadow-glow"
              loading="lazy"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Classificação de Grãos
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Agilidade e qualidade para operações agrícolas
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Estrutura técnica dedicada à classificação de grãos, com processos eficientes que
              beneficiam o motorista, o embarcador e a operação como um todo.
            </p>
            <ul className="mt-6 grid gap-3">
              {[
                "Agilidade no descarregamento",
                "Feedback rápido ao motorista",
                "Maior garantia de qualidade no produto",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-secondary font-medium">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ÁREA DE INSPEÇÃO */}
      <section className="py-24 bg-surface">
        <div className="container-valen grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Área de Inspeção
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Espaço pensado para o motorista aguardar com conforto
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Área coberta e organizada para inspeção, com estrutura de apoio para tornar o
              tempo de espera mais tranquilo.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Wifi, label: "Wi-Fi" },
                { icon: Snowflake, label: "Sala climatizada" },
                { icon: HandHeart, label: "Apoio ao motorista" },
              ].map((i) => (
                <div key={i.label} className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
                  <i.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-secondary">{i.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-orange opacity-15 blur-2xl" />
            <img
              src={inspecaoImage}
              alt="Área de Inspeção ValenLog"
              className="relative w-full aspect-[4/3] object-cover rounded-3xl shadow-glow"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ESPAÇO VALENTINA */}
      <section id="espaco-valentina" className="py-24 bg-background scroll-mt-24">
        <div className="container-valen">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Acolhimento
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
                Espaço Valentina
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                O Espaço Valentina foi pensado para oferecer conforto, segurança e acolhimento
                para mulheres e crianças que passam pelo Complexo Valen. Um ambiente de apoio
                para descanso, conectividade e cuidado durante a jornada.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Wifi, label: "Wi-Fi" },
                  { icon: MonitorSmartphone, label: "Lan House" },
                  { icon: Baby, label: "Berço" },
                  { icon: Sparkles, label: "Brinquedoteca" },
                  { icon: Snowflake, label: "Sala climatizada" },
                  { icon: Bed, label: "Espaço para descanso" },
                ].map((i) => (
                  <div key={i.label} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <i.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-secondary">{i.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-5 py-2.5 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-primary" />
                Disponível no Pátio 01 e Pátio 05
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {valentinaImages.slice(0, 4).map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className={`relative overflow-hidden rounded-3xl bg-muted ${
                    i === 0 ? "sm:col-span-2 aspect-[16/10]" : "aspect-[4/5]"
                  }`}
                >
                  <img
                    src={src}
                    alt={`Espaço Valentina ${i + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
              {valentinaImages.length === 1 && (
                <div className="rounded-3xl border-2 border-dashed border-border bg-muted/40 grid place-items-center aspect-[4/5] text-sm text-muted-foreground p-6 text-center">
                  <div>
                    <BedDouble className="mx-auto h-8 w-8 text-primary/60" />
                    <p className="mt-3">Novas fotos em breve</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section className="py-24 bg-surface">
        <div className="container-valen">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Galeria
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Conheça a estrutura ValenLog
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="group relative overflow-hidden rounded-3xl aspect-[4/3] bg-muted"
              >
                <img
                  src={src}
                  alt={`Estrutura ValenLog ${i + 1}`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-background">
        <div className="container-valen">
          <div className="rounded-[2rem] bg-gradient-orange p-10 md:p-14 text-primary-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-glow">
            <div>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold text-balance">
                Venha conhecer o ValenLog
              </h3>
              <p className="mt-2 text-white/90">Estrutura, agilidade e acolhimento para a sua operação.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white text-secondary px-6 py-3 font-bold"
              >
                <MapPin className="h-4 w-4" /> Como chegar
              </a>
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur px-6 py-3 font-semibold"
              >
                Fale conosco <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
