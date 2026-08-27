import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Smartphone,
  IdCard,
  Gift,
  Plus,
  Fuel,
  MousePointerClick,
  PartyPopper,
  Wallet,
  Coffee,
  QrCode,
  ArrowRight,
} from "lucide-react";
import {
  getClubeSettings,
  listActiveBenefits,
  listActiveFaqs,
  DEFAULT_CLUBE_SETTINGS,
  type BenefitRow,
} from "@/lib/clube-valen-api";
import logoClube from "@/assets/clube/logo.png.asset.json";
import celularClube from "@/assets/clube/celular.png.asset.json";
import tinosClube from "@/assets/clube/tinos.png.asset.json";
import heroFallback from "@/assets/posto/hero.jpg.asset.json";
import experienciaFoto from "@/assets/o-valen/patio.jpg.asset.json";

export const Route = createFileRoute("/clube-valen-fidelidade")({
  head: () => ({
    meta: [
      { title: "Clube Valen Fidelidade — Seu abastecimento vale benefícios" },
      {
        name: "description",
        content:
          "Baixe o aplicativo Clube Valen Fidelidade, pontue no abastecimento e troque seus pontos por brindes, estacionamento e combos da conveniência.",
      },
      { property: "og:title", content: "Clube Valen Fidelidade — Seu abastecimento vale benefícios" },
      {
        property: "og:description",
        content:
          "Pontue a cada abastecimento no Complexo Valen e troque seus pontos por brindes, estacionamento e combos da conveniência.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClubeValenPage,
});

const anchors = [
  ["Como funciona", "#como-funciona"],
  ["Benefícios", "#beneficios"],
  ["Prêmios", "#premios"],
  ["Combos", "#combos"],
  ["Dúvidas", "#duvidas"],
] as const;

function ClubeValenPage() {
  const { data: settings = DEFAULT_CLUBE_SETTINGS } = useQuery({
    queryKey: ["clube-settings"],
    queryFn: getClubeSettings,
  });
  const { data: benefits = [] } = useQuery({
    queryKey: ["clube-benefits"],
    queryFn: listActiveBenefits,
  });
  const { data: faqs = [] } = useQuery({ queryKey: ["clube-faqs"], queryFn: listActiveFaqs });

  const combos = benefits.filter((b) => b.category === "Combo");
  const premios = benefits.filter((b) => b.category !== "Combo");

  return (
    <div className="overflow-x-hidden bg-background">
      <ClubeNav settings={settings} />
      <Hero settings={settings} />
      <ComoFunciona />
      <TinosCena benefits={benefits} />
      <Premios items={premios} />
      <Combos items={combos} />
      <ExperienciaValen />
      <Vantagens />
      <CtaFinal settings={settings} />
      <Faq faqs={faqs} />
    </div>
  );
}

/* ---------------- HERO ---------------- */


/* ---------------- HERO ---------------- */

function StoreButtons({
  google,
  apple,
  tone = "dark",
}: {
  google: string;
  apple: string;
  tone?: "dark" | "light";
}) {
  const cls =
    tone === "dark"
      ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
      : "bg-white text-secondary hover:bg-white/90";
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={google || "#"}
        target={google ? "_blank" : undefined}
        rel={google ? "noopener noreferrer" : undefined}
        className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 ${cls}`}
      >
        <Smartphone className="h-5 w-5" />
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-medium uppercase tracking-wider opacity-70">Baixe na</span>
          Google Play
        </span>
      </a>
      <a
        href={apple || "#"}
        target={apple ? "_blank" : undefined}
        rel={apple ? "noopener noreferrer" : undefined}
        className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 ${cls}`}
      >
        <Smartphone className="h-5 w-5" />
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-medium uppercase tracking-wider opacity-70">Baixe na</span>
          App Store
        </span>
      </a>
    </div>
  );
}

function Hero({ settings }: { settings: typeof DEFAULT_CLUBE_SETTINGS }) {
  const bg = settings.hero_bg_image_url || heroFallback.url;
  const phone = settings.phone_mockup_url || celularClube.url;
  const title = settings.hero_title || DEFAULT_CLUBE_SETTINGS.hero_title;
  const highlight = settings.hero_highlight;
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <section id="baixe-o-app" className="relative overflow-hidden bg-gradient-orange">
      <img src={bg} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary/90" />
      <svg
        aria-hidden
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
      >
        <path d="M-50 520 C 250 420, 400 250, 750 210 S 1150 120, 1300 40" fill="none" stroke="var(--secondary)" strokeWidth="90" strokeLinecap="round" opacity="0.35" />
        <path d="M-50 520 C 250 420, 400 250, 750 210 S 1150 120, 1300 40" fill="none" stroke="white" strokeWidth="4" strokeDasharray="26 26" opacity="0.8" />
      </svg>

      <div className="container-valen relative grid items-center gap-8 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-secondary shadow">
            {settings.hero_badge}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[1.08] text-white md:text-5xl">
            {parts[0]}
            {highlight && <span className="text-secondary">{highlight}</span>}
            {parts[1]}
          </h1>
          <p className="mt-4 max-w-lg text-base text-white/90 md:text-lg">{settings.hero_subtitle}</p>

          <div className="mt-7">
            <StoreButtons google={settings.google_play_url} apple={settings.app_store_url} />
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute -right-6 top-6 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
          <img
            src={phone}
            alt="Aplicativo Clube Valen Fidelidade no celular"
            className="relative w-full max-w-[16rem] object-contain drop-shadow-2xl md:max-w-[19rem]"
          />
        </div>
      </div>


      <div className="relative h-16 bg-background [clip-path:ellipse(75%_100%_at_50%_100%)]" />
    </section>
  );
}

/* ---------------- COMO FUNCIONA ---------------- */

const passos = [
  {
    n: "01",
    Icon: Smartphone,
    title: "Baixe e cadastre-se no aplicativo",
    text: "Faça seu cadastro no Clube Valen Fidelidade e tenha seus dados sempre à mão.",
  },
  {
    n: "02",
    Icon: IdCard,
    title: "Pontue pelo CPF",
    text: "Na hora de pagar o abastecimento, informe seu CPF no caixa. Cada litro vira ponto e o saldo é atualizado automaticamente no aplicativo.",
  },
  {
    n: "03",
    Icon: Gift,
    title: "Resgate e aproveite",
    text: "Escolha seu benefício pelo aplicativo, gere o voucher e apresente no caixa do posto ou da conveniência.",
  },
];

function ComoFunciona() {
  return (
    <section id="como-funciona" className="scroll-mt-40 bg-background py-20">
      <div className="container-valen">
        <div className="text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary">Abasteceu. Pontuou. Aproveitou.</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-secondary md:text-5xl">Como funciona</h2>
        </div>

        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-16 hidden h-1 rounded-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 md:block" />
          <div className="grid gap-8 md:grid-cols-3">
            {passos.map(({ n, Icon, title, text }) => (
              <div
                key={n}
                className="group relative rounded-3xl border border-border bg-card p-8 shadow-soft transition hover:-translate-y-1.5 hover:shadow-xl"
              >
                <span className="absolute -top-6 right-6 font-display text-6xl font-extrabold text-primary/15">{n}</span>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-orange text-primary-foreground shadow-glow">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-secondary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TINOS ---------------- */

function TinosCena({ benefits }: { benefits: BenefitRow[] }) {
  const chips = benefits.slice(0, 6);
  return (
    <section className="relative overflow-hidden bg-surface py-20">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      <div className="container-valen relative grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-secondary md:text-5xl">
            Aqui, seus pontos viram <span className="text-primary">vantagem na estrada.</span>
          </h2>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">
            Mais que pontos. São benefícios que acompanham você em cada parada.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {(chips.length ? chips.map((c) => c.name) : ["Bolsa Valen", "Boné Valen", "12h de estacionamento grátis"]).map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-primary/30 bg-card px-4 py-2 text-sm font-semibold text-secondary shadow-soft transition hover:-translate-y-0.5 hover:border-primary"
                >
                  {label}
                </span>
              ),
            )}
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute bottom-6 h-64 w-64 rounded-full bg-gradient-orange opacity-80 blur-[2px] md:h-80 md:w-80" />
          <img
            src={tinosClube.url}
            alt="Mascotes do Valen apresentando o app do Clube Valen Fidelidade"
            className="relative w-full max-w-md object-contain drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- CARDS ---------------- */

function Points({ points }: { points: number | null }) {
  if (!points) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-extrabold text-secondary-foreground">
      {points} pontos
    </span>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-primary">
      <span className="px-4 text-center font-display text-lg font-extrabold uppercase text-white/90">{label}</span>
    </div>
  );
}

function Premios({ items }: { items: BenefitRow[] }) {
  const destaque = items.find((i) => i.featured);
  const outros = items.filter((i) => i !== destaque);
  return (
    <section id="beneficios" className="scroll-mt-40 bg-background py-20">
      <div className="container-valen">
        <h2 className="font-display text-3xl font-extrabold text-secondary md:text-5xl">
          Seus pontos viram benefícios de verdade.
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">Escolha como aproveitar seus pontos no Valen.</p>

        <div id="premios" className="mt-10 grid scroll-mt-40 gap-6 lg:grid-cols-3">
          {destaque && (
            <article className="group relative overflow-hidden rounded-3xl bg-secondary text-secondary-foreground shadow-xl lg:col-span-3">
              <div className="grid items-center gap-2 md:grid-cols-2">
                <div className="flex items-center justify-center p-6 md:p-10">
                  {destaque.image_url ? (
                    <img
                      src={destaque.image_url}
                      alt={destaque.name}
                      className="max-h-64 w-full rounded-2xl object-contain md:max-h-72"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-56 w-full overflow-hidden rounded-2xl">
                      <Placeholder label={destaque.name} />
                    </div>
                  )}
                </div>
                <div className="p-8 md:py-12 md:pr-12">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-primary">{destaque.category}</span>
                  <h3 className="mt-3 max-w-md font-display text-2xl font-extrabold leading-tight md:text-4xl">{destaque.name}</h3>
                  <p className="mt-4 max-w-md text-white/80">{destaque.short_description}</p>
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <Points points={destaque.points} />
                    <a
                      href="#baixe-o-app"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-orange px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition hover:scale-105"
                    >
                      Resgatar no app <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </article>

          )}

          {outros.map((b) => (
            <article
              key={b.id}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="h-52 overflow-hidden">
                {b.image_url ? (
                  <img
                    src={b.image_url}
                    alt={b.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <Placeholder label={b.name} />
                )}
              </div>
              <div className="p-6">
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">{b.category}</span>
                <h3 className="mt-2 font-display text-xl font-bold text-secondary">{b.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.short_description}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <Points points={b.points} />
                  <a href="#baixe-o-app" className="text-sm font-bold text-primary hover:underline">
                    Resgatar no app
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Combos({ items }: { items: BenefitRow[] }) {
  return (
    <section id="combos" className="scroll-mt-40 bg-surface py-20">
      <div className="container-valen">
        <div className="flex items-start gap-4">
          <Coffee className="mt-1 hidden h-8 w-8 text-primary md:block" />
          <div>
            <h2 className="font-display text-3xl font-extrabold text-secondary md:text-5xl">
              Sua parada também pode virar recompensa.
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Troque seus pontos por combos selecionados da conveniência.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((c) => (
            <article
              key={c.id}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="h-48 overflow-hidden">
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={c.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <Placeholder label={c.name} />
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-extrabold uppercase leading-tight text-secondary">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.short_description}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <Points points={c.points} />
                  <a href="#baixe-o-app" className="text-sm font-bold text-primary hover:underline">
                    Resgatar no app
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- EXPERIÊNCIA ---------------- */

function ExperienciaValen() {
  const passos = [
    { Icon: Fuel, title: "ABASTEÇA", text: "Informe seu CPF e acumule pontos." },
    { Icon: MousePointerClick, title: "ESCOLHA", text: "Confira os benefícios disponíveis pelo aplicativo." },
    { Icon: PartyPopper, title: "APROVEITE", text: "Resgate e utilize sua recompensa no Valen." },
  ];
  return (
    <section className="relative overflow-hidden py-24">
      <img src={experienciaFoto.url} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-secondary/90" />
      <div className="container-valen relative text-secondary-foreground">
        <h2 className="max-w-3xl font-display text-3xl font-extrabold leading-tight md:text-5xl">
          Quanto mais você passa pelo Valen, mais vantagens leva com você.
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {passos.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-white/5 p-8 backdrop-blur-sm transition hover:-translate-y-1">
              <Icon className="h-9 w-9 text-primary" />
              <h3 className="mt-4 font-display text-xl font-extrabold tracking-wide">{title}</h3>
              <p className="mt-2 text-sm text-white/80">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- VANTAGENS ---------------- */

function Vantagens() {
  const cards = [
    { Icon: Wallet, title: "Economize durante a viagem", text: "Transforme seus abastecimentos do dia a dia em benefícios." },
    { Icon: Gift, title: "Faça sua parada render mais", text: "Use seus pontos em alimentação, estacionamento e brindes." },
    { Icon: Smartphone, title: "Tudo pelo aplicativo", text: "Consulte seus pontos, benefícios e resgates em um só lugar." },
  ];
  return (
    <section className="bg-background py-24">
      <div className="container-valen">
        <h2 className="mx-auto max-w-3xl text-center font-display text-3xl font-extrabold text-secondary md:text-4xl">
          Mais benefícios para quem está sempre em movimento.
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {cards.map(({ Icon, title, text }) => (
            <div key={title} className="text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-secondary">{title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA FINAL ---------------- */

function CtaFinal({ settings }: { settings: typeof DEFAULT_CLUBE_SETTINGS }) {
  return (
    <section className="relative overflow-hidden bg-secondary py-16 text-secondary-foreground md:py-20">
      <svg aria-hidden viewBox="0 0 1200 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-25">
        <path d="M-50 300 C 300 200, 600 340, 1250 120" fill="none" stroke="var(--primary)" strokeWidth="8" />
        <path d="M-50 360 C 350 260, 700 380, 1250 180" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="20 18" />
      </svg>
      <div className="container-valen relative grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">
            Sua próxima parada pode valer <span className="text-primary">muito mais.</span>
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/80">
            Baixe o Clube Valen Fidelidade e comece agora a pontuar.
          </p>
          <div className="mt-7">
            <StoreButtons google={settings.google_play_url} apple={settings.app_store_url} tone="light" />
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <img
            src={appTelas.url}
            alt="Telas do aplicativo Clube Valen Fidelidade"
            className="w-full max-w-[34rem] object-contain drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}


/* ---------------- FAQ ---------------- */

function Faq({ faqs }: { faqs: { id: string; question: string; answer: string }[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section id="duvidas" className="scroll-mt-40 bg-surface py-20">
      <div className="container-valen max-w-3xl">
        <h2 className="text-center font-display text-3xl font-extrabold text-secondary md:text-4xl">
          Ficou com alguma dúvida?
        </h2>
        <div className="mt-10 space-y-4">
          {faqs.map((f) => {
            const isOpen = open === f.id;
            return (
              <div key={f.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-bold text-secondary md:text-lg">{f.question}</span>
                  <Plus
                    className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="whitespace-pre-line px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
