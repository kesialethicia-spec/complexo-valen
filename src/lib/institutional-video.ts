import { readVideoConsent } from "./video-consent";

export const INSTITUTIONAL_VIDEO_ID = "rRdO0BrGE78";
export type VideoPage = "home" | "o_valen";
type Gtag = (...args: unknown[]) => void;

export function videoEventParameters(pagina: VideoPage) {
  return { pagina, video_id: INSTITUTIONAL_VIDEO_ID, video_titulo: "institucional_grupo_valen", origem: "youtube_embed" };
}

// Each mounted player owns one tracker; pauses/resumes cannot emit duplicates.
export function createVideoPlayTracker(pagina: VideoPage, allowed: () => boolean, send: Gtag) {
  let started = false;
  return (state: number) => {
    if (state !== 1 || started) return;
    started = true;
    if (allowed()) send("event", "play_video_institucional", videoEventParameters(pagina));
  };
}

export function sendVideoAnalytics(...args: unknown[]) {
  if (!readVideoConsent().analytics) return;
  const analyticsWindow = window as Window & { gtag?: Gtag };
  // Reuse the site's tag; never initialize a second analytics property here.
  analyticsWindow.gtag?.(...args);
}

export type YouTubePlayer = { destroy: () => void };
type YouTubeAPI = {
  Player: new (element: HTMLElement, options: {
    videoId: string;
    width: string;
    height: string;
    playerVars: { autoplay: number; controls: number; playsinline: number; origin: string; rel: number };
    events: { onStateChange: (event: { data: number }) => void; onError: () => void; onReady: (event: { target: { getIframe: () => HTMLIFrameElement } }) => void };
  }) => YouTubePlayer;
};
let youtubePromise: Promise<YouTubeAPI> | undefined;

export function loadYouTubeAPI(): Promise<YouTubeAPI> {
  const youtubeWindow = window as Window & { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void };
  if (youtubeWindow.YT?.Player) return Promise.resolve(youtubeWindow.YT);
  if (youtubePromise) return youtubePromise;
  youtubePromise = new Promise((resolve, reject) => {
    const previous = youtubeWindow.onYouTubeIframeAPIReady;
    const timeout = window.setTimeout(() => { youtubePromise = undefined; reject(new Error("YouTube indisponível")); }, 20000);
    youtubeWindow.onYouTubeIframeAPIReady = () => {
      previous?.();
      window.clearTimeout(timeout);
      if (youtubeWindow.YT?.Player) resolve(youtubeWindow.YT);
      else { youtubePromise = undefined; reject(new Error("YouTube indisponível")); }
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => { window.clearTimeout(timeout); script.remove(); youtubePromise = undefined; reject(new Error("YouTube indisponível")); };
    document.head.appendChild(script);
  });
  return youtubePromise;
}