import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "valen-cookie-consent-v1";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function writeConsent(consent: Consent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    /* ignore */
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) setVisible(true);
    const openHandler = () => {
      const current = readConsent();
      if (current) {
        setAnalytics(current.analytics);
        setMarketing(current.marketing);
      }
      setSettingsOpen(true);
      setVisible(true);
    };
    window.addEventListener("valen:open-cookie-preferences", openHandler);
    return () => window.removeEventListener("valen:open-cookie-preferences", openHandler);
  }, []);

  const save = (a: boolean, m: boolean) => {
    writeConsent({
      necessary: true,
      analytics: a,
      marketing: m,
      timestamp: new Date().toISOString(),
    });
    setVisible(false);
    setSettingsOpen(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:pb-6 pointer-events-none"
    >
      <div className="mx-auto max-w-3xl pointer-events-auto rounded-2xl bg-white border border-border shadow-2xl overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-display font-bold text-secondary">Sua privacidade importa</h2>
              <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, analisar o tráfego do site, personalizar conteúdos e apoiar ações de marketing, como Google Analytics e Meta Pixel. Ao continuar navegando, você concorda com o uso desses cookies. Consulte nossa{" "}
                <Link to="/politica-de-privacidade" className="text-primary font-semibold hover:underline">
                  Política de Privacidade
                </Link>{" "}
                para mais informações.
              </p>
            </div>
            <button
              onClick={() => save(true, true)}
              aria-label="Fechar aviso de cookies aceitando todos"
              className="shrink-0 -mt-1 -mr-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 hover:bg-surface hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {settingsOpen && (
            <div className="mt-5 space-y-3 rounded-xl bg-surface/60 p-4 border border-border">
              <PrefRow label="Necessários" description="Essenciais para o funcionamento do site." checked disabled />
              <PrefRow
                label="Desempenho / Analytics"
                description="Google Analytics e métricas de uso."
                checked={analytics}
                onChange={setAnalytics}
              />
              <PrefRow
                label="Marketing"
                description="Meta Pixel e campanhas personalizadas."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          )}

          <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
            {settingsOpen ? (
              <button
                onClick={() => save(analytics, marketing)}
                className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-secondary hover:bg-surface transition-colors"
              >
                Salvar preferências
              </button>
            ) : (
              <button
                onClick={() => setSettingsOpen(true)}
                className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-secondary hover:bg-surface transition-colors"
              >
                Configurar cookies
              </button>
            )}
            <button
              onClick={() => save(true, true)}
              className="rounded-full bg-gradient-orange px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform"
            >
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrefRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className={`flex items-start justify-between gap-4 ${disabled ? "opacity-70" : "cursor-pointer"}`}>
      <div>
        <div className="text-sm font-semibold text-secondary">{label}</div>
        <div className="text-xs text-foreground/70">{description}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 accent-primary"
      />
    </label>
  );
}
