export const COOKIE_CONSENT_KEY = "valen-cookie-consent-v1";
export const CONSENT_CHANGED_EVENT = "valen:cookie-consent-changed";

export function parseVideoConsent(raw: string | null) {
  try {
    const value = raw ? JSON.parse(raw) : null;
    return { analytics: value?.analytics === true, marketing: value?.marketing === true };
  } catch {
    return { analytics: false, marketing: false };
  }
}

export function readVideoConsent() {
  if (typeof window === "undefined") return parseVideoConsent(null);
  try { return parseVideoConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY)); }
  catch { return parseVideoConsent(null); }
}