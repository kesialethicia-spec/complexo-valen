import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import {
  Film,
  Gamepad2,
  Baby,
  Wifi,
  BedDouble,
  Coffee,
  Scissors,
  Instagram,
  Youtube,
  Calendar,
  Heart,
  Shield,
  Stethoscope,
  Syringe,
  Users,
  MapPin,
  ArrowRight,
  Play,
  Sparkles,
} from "lucide-react";
import {
  getExperienciasPageSettings,
  DEFAULT_EXPERIENCIAS_SETTINGS,
  type ExperienciasEvent,
} from "@/lib/experiencias-settings-api";
import { extractYoutubeId, youtubeThumbnail } from "@/lib/videos-api";
import { X } from "lucide-react";


export const Route = createFileRoute("/experiencias")({
  head: () => ({
    meta: [
      { title: "Experiências — Complexo Valen" },
      {
        name: "description",
        content:
          "Festa do Caminhoneiro, Café de Sábado, ações de saúde, Clube do Caminhoneiro, Espaço Valentina e Studio Valen. Experiências que movimentam pessoas.",
      },
    ],
  }),
  component: Experiencias,
});

const INSTAGRAM_URL = "https://www.instagram.com/posto.valen/";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@complexovalen/videos";

const clubeItens = [
  { icon: Film, t: "Cinema" },
  { icon: Gamepad2, t: "Sala de jogos" },
  { icon: Baby, t: "Brinquedoteca" },
  { icon: Wifi, t: "Lan house" },
  { icon: BedDouble, t: "Área de descanso" },
  { icon: Coffee, t: "Copa" },
  { icon: Scissors, t: "Barbearia" },
];

const valentinaItens = [
  { icon: Wifi, t: "Wi-Fi" },
  { icon: Gamepad2, t: "Lan House" },
  { icon: Baby, t: "Berço" },
  { icon: Sparkles, t: "Brinquedoteca" },
  { icon: BedDouble, t: "Sala climatizada" },
  { icon: Coffee, t: "Espaço para descanso" },
];

const saudeItens = [
  { icon: Syringe, t: "Vacinação" },
  { icon: Stethoscope, t: "Aferição de pressão" },
  { icon: Heart, t: "Orientação de saúde" },
  { icon: Shield, t: "Prevenção e cuidado" },
  { icon: Users, t: "Apoio ao caminhoneiro" },
  { icon: Calendar, t: "Ações mensais no complexo" },
];

function Experiencias() {
  const { data = DEFAULT_EXPERIENCIAS_SETTINGS } = useQuery({
    queryKey: ["experiencias-page-settings"],
    queryFn: getExperienciasPageSettings,
  });

  void data.festa_image_url;
  const cafeImage = data.cafe_image_url || "";
  const clubeImage = data.clube_image_url || "";
  const studioImage = data.studio_image_url || "";
  const saudeImages = data.saude_image_urls.filter(Boolean);
  const valentinaImages = data.valentina_image_urls.filter(Boolean);
  const gallery =
    data.gallery_urls.filter(Boolean).length > 0
      ? data.gallery_urls.filter(Boolean)
      : ["", "", "", "", "", "", "", ""];
  const publishedEvents = data.events
    .filter((e) => e.status === "publicado")
    .sort((a, b) => {
      const oa = a.order ?? 999;
      const ob = b.order ?? 999;
      if (oa !== ob) return oa - ob;
      return Number(b.featured) - Number(a.featured);
    });

  return (
    <>
      <PageHero
        eyebrow="Experiências"
        title="Experiências que movimentam pessoas"
        subtitle="A experiência Valen está em todo o complexo. Cada ação é pensada para aproximar pessoas, acolher quem está longe de casa e transformar a parada em um momento especial."
        image={cafeImage}
      />


      {/* 3. Café da Manhã de Sábado */}
      <section id="cafe-da-manha" className="py-24 bg-surface scroll-mt-24">
        <div className="container-valen space-y-12">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="lg:order-2">
              <img
                src={cafeImage}
                alt="Café da Manhã de Sábado"
                className="aspect-[4/3] w-full object-cover rounded-3xl shadow-glow"
                loading="lazy"
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                Toda semana
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold text-secondary text-balance">
                Café da Manhã de Sábado
              </h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                Todo sábado, o Complexo Valen recebe caminhoneiros, clientes e
                visitantes com um café da manhã especial. Um momento simples,
                acolhedor e cheio de significado para começar o dia com
                energia, conversa boa e o cuidado de quem entende a estrada.
              </p>
            </div>
          </div>

          {(() => {
            const videos = [
              ...data.cafe_instagram_videos.filter((v) => v.url),
              ...data.cafe_instagram_urls
                .filter(Boolean)
                .filter(
                  (u) => !data.cafe_instagram_videos.some((v) => v.url === u),
                )
                .map((url) => ({ url, thumbnail_url: "" })),
            ];
            if (videos.length === 0) return null;
            return (
              <div>
                <h3 className="text-xl font-display font-bold text-secondary mb-4">
                  No Instagram
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {videos.map((v, i) => (
                    <InstagramCard
                      key={i}
                      url={v.url}
                      thumbnail={v.thumbnail_url}
                      title={`Café de Sábado #${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 4. Ações de Saúde */}
      <section id="acoes-de-saude" className="py-24 bg-background scroll-mt-24">
        <div className="container-valen space-y-12">
          <SectionHeader
            eyebrow="Ações de Saúde"
            title="Cuidado todos os meses para quem vive em movimento"
            subtitle="Todos os meses, o Complexo Valen realiza ações de saúde voltadas para caminhoneiros, clientes e pessoas que passam pelo complexo. São momentos de orientação, prevenção e cuidado, reforçando o compromisso do Valen com quem está longe de casa."
          />

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {saudeItens.map((i) => (
              <div
                key={i.t}
                className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-orange text-white">
                  <i.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-secondary">{i.t}</span>
              </div>
            ))}
          </div>

          {saudeImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {saudeImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="aspect-square w-full object-cover rounded-2xl"
                  loading="lazy"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-border p-12 text-center text-sm text-muted-foreground bg-card">
              Fotos das ações de saúde aparecerão aqui em breve.
            </div>
          )}

          {data.saude_instagram_urls.filter(Boolean).length > 0 && (
            <div>
              <h3 className="text-xl font-display font-bold text-secondary mb-4">
                Registros no Instagram
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.saude_instagram_urls.filter(Boolean).map((url, i) => (
                  <InstagramCard key={i} url={url} title={`Ação de saúde #${i + 1}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Clube do Caminhoneiro */}
      <section id="clube-do-caminhoneiro" className="py-24 bg-surface scroll-mt-24">
        <div className="container-valen">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                Experiência
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold text-secondary text-balance">
                Clube do Caminhoneiro
              </h2>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                O Clube do Caminhoneiro foi pensado para valorizar quem está
                sempre na estrada. É um espaço de convivência, lazer, apoio e
                cuidado para oferecer mais conforto durante a parada no
                Complexo Valen.
              </p>
              <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <MapPin className="h-4 w-4" />
                Disponível no Valen Center I e no Pátio 05.
              </p>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {clubeItens.map((i) => (
                  <div
                    key={i.t}
                    className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3.5"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-orange text-white">
                      <i.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-secondary">
                      {i.t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <img
              src={clubeImage}
              alt="Clube do Caminhoneiro"
              className="aspect-[4/3] w-full object-cover rounded-3xl shadow-glow"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 6. Espaço Valentina */}
      <section id="espaco-valentina" className="py-24 bg-background scroll-mt-24">
        <div className="container-valen">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            {valentinaImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {valentinaImages.slice(0, 4).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="aspect-square w-full object-cover rounded-2xl"
                    loading="lazy"
                  />
                ))}
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-3xl border-2 border-dashed border-border grid place-items-center text-sm text-muted-foreground bg-card">
                Fotos do Espaço Valentina em breve.
              </div>
            )}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                Acolhimento
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold text-secondary text-balance">
                Espaço Valentina
              </h2>
              <p className="mt-3 text-base font-semibold text-muted-foreground">
                Acolhimento para mulheres e crianças dentro do Complexo Valen.
              </p>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                O Espaço Valentina foi criado para oferecer conforto, segurança
                e acolhimento para mulheres e crianças que passam pelo
                complexo. Um ambiente de apoio para descanso, conectividade e
                cuidado durante a jornada.
              </p>
              <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <MapPin className="h-4 w-4" />
                Disponível no Pátio 01 e Pátio 05.
              </p>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {valentinaItens.map((i) => (
                  <div
                    key={i.t}
                    className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3.5"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-orange text-white">
                      <i.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-secondary">
                      {i.t}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/servicos/valenlog"
                hash="espaco-valentina"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
              >
                Conhecer Espaço Valentina <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Studio Valen / PodValen */}
      <section id="studio-valen" className="py-24 bg-secondary text-white scroll-mt-24">
        <div className="container-valen space-y-12">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                Destaque
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold text-balance">
                Studio Valen
              </h2>
              <p className="mt-3 text-base font-semibold text-white/80">
                Conteúdo, histórias e conversas que movimentam o complexo.
              </p>
              <p className="mt-4 text-lg text-white/85 leading-relaxed">
                O Studio Valen é o espaço onde nascem conteúdos, entrevistas e
                episódios do PodValen. Um ambiente criado para registrar
                histórias, compartilhar experiências e aproximar ainda mais o
                Valen de quem vive a estrada, os negócios e o movimento do
                complexo.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/80">
                <li>• Gravação do PodValen</li>
                <li>• Entrevistas</li>
                <li>• Conteúdos institucionais</li>
                <li>• Histórias de clientes e parceiros</li>
                <li>• Bastidores do Complexo Valen</li>
              </ul>
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-orange px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow"
              >
                <Youtube className="h-4 w-4" /> Ver canal no YouTube
              </a>
            </div>
            <img
              src={studioImage}
              alt="Studio Valen"
              className="aspect-[4/3] w-full object-cover rounded-3xl shadow-glow"
              loading="lazy"
            />
          </div>

          {data.studio_youtube_urls.filter(Boolean).length > 0 && (
            <div>
              <h3 className="text-xl font-display font-bold mb-4">
                Últimos vídeos
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.studio_youtube_urls.filter(Boolean).map((url, i) => (
                  <YoutubeCard key={i} url={url} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 8. Nossos eventos */}
      <section id="eventos" className="py-24 bg-background scroll-mt-24">
        <div className="container-valen space-y-12">
          <SectionHeader
            eyebrow="Nossos eventos"
            title="Momentos que aproximam pessoas, marcas e histórias"
            subtitle="Ao longo do ano, o Complexo Valen realiza eventos, campanhas e ações especiais que fortalecem o relacionamento com caminhoneiros, clientes, parceiros e colaboradores."
          />

          {publishedEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publishedEvents.map((ev) => (
                <EventCard key={ev.id} ev={ev} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-border p-12 text-center text-sm text-muted-foreground bg-card">
              Novos eventos serão publicados em breve.
            </div>
          )}
        </div>
      </section>

      {/* 9. Galeria */}
      <section className="py-24 bg-surface">
        <div className="container-valen">
          <SectionHeader
            eyebrow="Galeria"
            title="Momentos em movimento"
            subtitle="Registros reais de quem vive o Valen todos os dias."
            center
          />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="aspect-square w-full object-cover rounded-2xl hover:scale-105 transition-transform"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA final */}
      <section className="py-20 bg-gradient-orange text-white">
        <div className="container-valen text-center">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-balance">
            Viva as experiências do Complexo Valen
          </h2>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Eventos, cuidado, acolhimento e histórias reais para quem está em movimento.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#eventos"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-base font-bold text-primary shadow-lg hover:bg-white/90"
            >
              <Calendar className="h-4 w-4" /> Ver eventos
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white px-7 py-4 text-base font-bold text-white hover:bg-white/10"
            >
              <Instagram className="h-4 w-4" /> Seguir no Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function InstagramCard({
  url,
  title,
  thumbnail,
}: {
  url: string;
  title: string;
  thumbnail?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-square bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 grid place-items-center text-white overflow-hidden">
        {thumbnail ? (
          <>
            <img
              src={thumbnail}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform"
              loading="lazy"
            />
            <span className="absolute inset-0 grid place-items-center bg-black/25 group-hover:bg-black/35 transition-colors">
              <span className="h-14 w-14 rounded-full bg-white/95 text-secondary grid place-items-center shadow-lg">
                <Instagram className="h-6 w-6" />
              </span>
            </span>
          </>
        ) : (
          <Instagram className="h-14 w-14 opacity-90 group-hover:scale-110 transition-transform" />
        )}
      </div>
      <div className="p-4 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-secondary truncate">{title}</span>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary shrink-0">
          Ver no Instagram <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}

function YoutubeCard({ url }: { url: string }) {
  const id = extractYoutubeId(url);
  if (!id) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl overflow-hidden bg-white text-secondary hover:shadow-xl transition-shadow"
    >
      <div className="relative aspect-video">
        <img
          src={youtubeThumbnail(id, "hq")}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute inset-0 grid place-items-center bg-black/30 group-hover:bg-black/40 transition-colors">
          <span className="h-14 w-14 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg">
            <Play className="h-6 w-6 ml-0.5" />
          </span>
        </span>
      </div>
      <div className="p-4 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold truncate">Vídeo do canal</span>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary shrink-0">
          Assistir <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}

function statusBadgeClass(s?: string): string {
  switch (s) {
    case "Em breve":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Inscrições abertas":
      return "bg-green-100 text-green-800 border-green-200";
    case "Realizado":
      return "bg-neutral-100 text-neutral-700 border-neutral-200";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
}

function EventCard({ ev }: { ev: ExperienciasEvent }) {
  const [open, setOpen] = useState(false);
  const title = ev.title || ev.name;
  const status = ev.event_status;
  const category = ev.category;
  const location = ev.location;
  const date = ev.period;

  return (
    <>
      <article className="group flex flex-col rounded-3xl border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
        <div className="relative">
          {ev.image_url ? (
            <img
              src={ev.image_url}
              alt={title}
              className="aspect-[16/10] w-full object-cover group-hover:scale-105 transition-transform"
              loading="lazy"
            />
          ) : (
            <div className="aspect-[16/10] bg-gradient-orange" />
          )}
          {status && (
            <span
              className={`absolute top-3 right-3 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${statusBadgeClass(
                status,
              )}`}
            >
              {status}
            </span>
          )}
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold uppercase tracking-wider text-primary">
            {date && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {date}
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {location}
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 text-secondary/70">
                • {category}
              </span>
            )}
          </div>
          <h3 className="mt-2 text-xl font-display font-bold text-secondary">
            {title}
          </h3>
          {ev.description && (
            <p className="mt-2 text-sm text-muted-foreground flex-1">
              {ev.description}
            </p>
          )}
          <div className="mt-4">
            {ev.link ? (
              <a
                href={ev.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"
              >
                Ver detalhes <ArrowRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              (ev.full_description || ev.description) && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"
                >
                  Ver detalhes <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )
            )}
          </div>
        </div>
      </article>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] overflow-auto rounded-3xl bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-secondary hover:bg-white"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
            {ev.image_url && (
              <img
                src={ev.image_url}
                alt={title}
                className="aspect-[16/9] w-full object-cover"
              />
            )}
            <div className="p-6 space-y-3">
              {status && (
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${statusBadgeClass(status)}`}
                >
                  {status}
                </span>
              )}
              <h3 className="text-2xl font-display font-bold text-secondary">
                {title}
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold uppercase tracking-wider text-primary">
                {date && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {date}
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {location}
                  </span>
                )}
                {category && <span>• {category}</span>}
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {ev.full_description || ev.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

