import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ArrowRight, Building2, BedDouble, Briefcase, Sparkles, Heart } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getHotelPageSettings } from "@/lib/hotel-settings-api";
import fachadaAsset from "@/assets/hotel/fachada.jpg.asset.json";
import quartoAsset from "@/assets/hotel/quarto.jpg.asset.json";
import cafeAsset from "@/assets/hotel/cafe.jpg.asset.json";
import auditorioAsset from "@/assets/hotel/auditorio.jpg.asset.json";
import logoAsset from "@/assets/hotel/logo-valen-porto-hotel.png.asset.json";
import { Img } from "@/components/Img";

const FALLBACK_HERO = fachadaAsset.url;
const FALLBACK_PRESENTATION = quartoAsset.url;
const FALLBACK_LOGO = logoAsset.url;
const FALLBACK_GALLERY = [fachadaAsset.url, quartoAsset.url, cafeAsset.url, auditorioAsset.url];

export const Route = createFileRoute("/servicos/valen-porto-hotel")({
  head: () => ({
    meta: [
      { title: "Valen Porto Hotel — Hospedagem estratégica em São Luís" },
      {
        name: "description",
        content:
          "Conforto, localização e praticidade. Hospede-se próximo ao Porto e ao Distrito Industrial, com estrutura ideal para negócios e descanso.",
      },
      { property: "og:title", content: "Valen Porto Hotel — Hospedagem em São Luís" },
      {
        property: "og:description",
        content:
          "Hospedagem estratégica para negócios e descanso, próximo ao Porto e ao Distrito Industrial de São Luís.",
      },
    ],
  }),
  loader: async ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["hotel-page-settings"],
      queryFn: getHotelPageSettings,
    }),
  component: HotelPage,
});

function HotelPage() {
  const { data: settings } = useSuspenseQuery({
    queryKey: ["hotel-page-settings"],
    queryFn: getHotelPageSettings,
  });

  const heroImage = settings.hero_image_url || FALLBACK_HERO;
  const presentationImage = settings.presentation_image_url || FALLBACK_PRESENTATION;
  const logo = settings.logo_url || FALLBACK_LOGO;
  const gallerySrc = settings.gallery_urls.filter(Boolean);
  const gallery = (gallerySrc.length > 0 ? gallerySrc : FALLBACK_GALLERY).slice(0, 4);
  const mapUrl = settings.map_url || "https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6";
  const reservationUrl = settings.reservation_url || "/contato";
  const reservationExternal = /^https?:\/\//i.test(reservationUrl);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Img src={heroImage} alt="Valen Porto Hotel" fetchPriority="high" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/95 via-secondary/85 to-secondary/70" />
        </div>

        <div className="container-valen relative py-24 md:py-36">
          <nav className="text-xs text-white/70 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/servicos" className="hover:text-white">Serviços</Link>
            <span className="mx-2">/</span>
            <span>Valen Porto Hotel</span>
          </nav>

          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 mb-6">
            <Img src={logo} alt="Logo Valen Porto Hotel" className="h-9 w-auto" />
          </div>

          <h1 className="max-w-3xl text-5xl md:text-6xl font-display font-extrabold tracking-tight text-balance">
            Hospedagem estratégica para negócios e descanso
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85 leading-relaxed">
            Conforto, localização e praticidade para quem precisa estar próximo ao Porto e ao Distrito Industrial.
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
              href={reservationUrl}
              {...(reservationExternal ? { target: "_blank", rel: "noreferrer" } : {})}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-orange text-primary-foreground px-6 py-3 font-bold shadow-glow hover:shadow-lg transition"
            >
              Fazer reserva <ArrowRight className="h-4 w-4" />
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
            <Img
              src={logo}
              alt="Valen Porto Hotel"
              className="h-14 w-auto mb-6"
            />
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Nosso hotel
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Valen Porto Hotel
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              O Valen Porto Hotel é uma opção de hospedagem pensada para quem busca praticidade, conforto e localização estratégica em São Luís. Ideal para viagens corporativas, equipes em deslocamento, clientes do complexo e visitantes da região logística.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-orange opacity-20 blur-2xl" />
            <Img
              src={presentationImage}
              alt="Ambiente do Valen Porto Hotel"
              className="relative w-full aspect-[4/3] object-cover rounded-3xl shadow-glow"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* CARDS PRINCIPAIS */}
      <section className="py-20 bg-surface">
        <div className="container-valen grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Building2,
              title: "Localização",
              items: ["Próximo ao Porto", "Próximo ao Distrito Industrial", "Fácil acesso às principais rotas"],
            },
            {
              icon: BedDouble,
              title: "Acomodações",
              items: ["Quartos confortáveis", "Wi-Fi", "Ar-condicionado", "Café da manhã"],
            },
            {
              icon: Briefcase,
              title: "Negócios",
              items: [
                "Ideal para viagens corporativas",
                "Atendimento para empresas",
                "Estrutura para equipes em deslocamento",
              ],
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group rounded-3xl bg-card border border-border p-8 hover:border-primary/40 hover:shadow-glow transition"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-orange text-primary-foreground shadow-glow">
                <card.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-2xl font-display font-bold text-secondary">{card.title}</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                {card.items.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* GALERIA */}
      <section className="py-24 bg-background">
        <div className="container-valen">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Galeria
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Conheça o Valen Porto Hotel
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gallery.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="group relative overflow-hidden rounded-3xl aspect-[4/5] bg-muted"
              >
                <Img
                  src={src}
                  alt={`Foto ${i + 1} do Valen Porto Hotel`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-20 bg-surface">
        <div className="container-valen">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Diferenciais
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Pensado para quem vive em movimento
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, title: "Localização privilegiada" },
              { icon: Briefcase, title: "Estrutura para negócios" },
              { icon: Sparkles, title: "Conforto após a estrada" },
              { icon: Heart, title: "Estrutura para eventos" },
            ].map((d) => (
              <div key={d.title} className="rounded-2xl bg-card border border-border p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <d.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-semibold text-secondary">{d.title}</p>
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
                Venha conhecer o Valen Porto Hotel
              </h3>
              <p className="mt-2 text-white/90">Estrutura, acolhimento e confiança para sua jornada.</p>
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
              <a
                href={reservationUrl}
                {...(reservationExternal ? { target: "_blank", rel: "noreferrer" } : {})}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 backdrop-blur px-6 py-3 font-semibold"
              >
                Fazer reserva <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
