import { useEffect } from "react";
import { CONSENT_CHANGED_EVENT, readVideoConsent } from "@/lib/video-consent";

export function VideoAnalytics() {
  useEffect(() => {
    const sync = () => {
      const measurementId = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY;
      const w = window as Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
      const granted = readVideoConsent().analytics;
      if (w.gtag) {
        w.gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
        return;
      }
      if (!granted || !measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) return;
      w.dataLayer = w.dataLayer || [];
      w.gtag = function (..._args: unknown[]) {
        // Google requires the Arguments object rather than a rest-argument array.
        w.dataLayer?.push(arguments);
      };
      w.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      w.gtag("set", "developer_id.dZjgwMW", true);
      w.gtag("js", new Date());
      w.gtag("config", measurementId);
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
    };
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return null;
}