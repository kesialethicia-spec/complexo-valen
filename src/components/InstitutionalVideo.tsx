import { useEffect, useRef, useState } from "react";
import { Play, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import thumbnail from "@/assets/video/valen-institucional-thumbnail.jpg.asset.json";
import { CONSENT_CHANGED_EVENT, readVideoConsent } from "@/lib/video-consent";
import { createVideoPlayTracker, INSTITUTIONAL_VIDEO_ID, loadYouTubeAPI, sendVideoAnalytics, type VideoPage, type YouTubePlayer } from "@/lib/institutional-video";

export function InstitutionalVideo({ pagina }: { pagina: VideoPage }) {
  const [active, setActive] = useState(false);
  const [permissionOpen, setPermissionOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [consented, setConsented] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const player = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    const sync = () => {
      setConsented(readVideoConsent().marketing);
      // Revoking global preferences also stops an already activated player.
      setActive(false);
      setPermissionOpen(false);
    };
    setConsented(readVideoConsent().marketing);
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!active || !container.current) return;
    let disposed = false;
    const host = document.createElement("div");
    container.current.appendChild(host);
    const track = createVideoPlayTracker(pagina, () => readVideoConsent().analytics, sendVideoAnalytics);
    setLoading(true);
    setFailed(false);
    void loadYouTubeAPI().then((api) => {
      if (disposed) return;
      player.current = new api.Player(host, {
        videoId: INSTITUTIONAL_VIDEO_ID,
        width: "100%", height: "100%",
        playerVars: { autoplay: 0, controls: 1, playsinline: 1, origin: window.location.origin, rel: 0 },
        events: {
          onReady: (event) => {
            if (disposed) return;
            event.target.getIframe().title = "Vídeo institucional oficial do Grupo Valen no YouTube";
            setLoading(false);
          },
          onStateChange: (event) => { if (!disposed) track(event.data); },
          onError: () => { if (!disposed) { setLoading(false); setFailed(true); } },
        },
      });
    }).catch(() => { if (!disposed) { setLoading(false); setFailed(true); } });
    return () => {
      disposed = true;
      player.current?.destroy();
      player.current = null;
      host.remove();
    };
  }, [active, pagina]);

  return (
    <section aria-label={pagina === "home" ? "Nosso institucional" : "Vídeo da nossa história"} className="bg-surface py-16 md:py-24">
      <div className="container-valen">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="text-xs font-bold uppercase text-primary">NOSSO INSTITUCIONAL</p>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-secondary text-balance md:text-4xl lg:text-5xl tracking-normal">
            {pagina === "home" ? <>Muito mais que um complexo. Uma história em <span className="text-primary">movimento.</span></> : <>Nossa história é feita de <span className="text-primary">movimento.</span></>}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {pagina === "home" ? "Conheça de perto o Complexo Valen, onde pessoas, negócios e oportunidades se conectam todos os dias." : "Descubra o que nos move e como construímos conexões que vão além da estrada."}
          </p>
          <div className="relative mt-9 aspect-video w-full overflow-hidden rounded-3xl bg-secondary shadow-soft md:mt-12">
            {active ? <>
              <div ref={container} className="absolute inset-0 h-full w-full [&_iframe]:h-full [&_iframe]:w-full" />
              {loading && <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-secondary text-secondary-foreground" role="status"><LoaderCircle className="h-8 w-8 animate-spin motion-reduce:animate-none" /><span className="sr-only">Carregando vídeo</span></div>}
              {failed && <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-secondary p-5 text-secondary-foreground"><p>Não foi possível carregar o vídeo.</p><Button onClick={() => setActive(false)} variant="default">Tentar novamente</Button></div>}
            </> : <>
              <img src={thumbnail.url} alt="Capa oficial do vídeo institucional do Grupo Valen" width={1280} height={720} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <Button size="icon" aria-label="Reproduzir vídeo institucional" onClick={() => { if (consented) setActive(true); else setPermissionOpen(true); }} className="absolute left-1/2 top-1/2 h-16 w-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 [&_svg]:size-8"><Play fill="currentColor" /></Button>
            </>}
          </div>
          {permissionOpen && <div role="dialog" aria-label="Permitir conteúdo do YouTube" className="mx-auto mt-5 max-w-xl text-left">
            <p className="text-sm leading-relaxed text-muted-foreground">Ao permitir este vídeo, você autoriza o carregamento de conteúdo do YouTube, que pode utilizar cookies e tecnologias de terceiros. Suas preferências de Analytics permanecem inalteradas.</p>
            <div className="mt-3 flex flex-wrap gap-3"><Button onClick={() => { setPermissionOpen(false); setActive(true); }}><Play />Permitir YouTube e carregar vídeo</Button><Button variant="outline" onClick={() => setPermissionOpen(false)}>Cancelar</Button></div>
          </div>}
        </div>
      </div>
    </section>
  );
}