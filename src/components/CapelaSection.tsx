import { useCallback, useEffect, useRef, useState } from "react";
import { Clock, ChevronLeft, ChevronRight, Church } from "lucide-react";

import fachada from "@/assets/capela/fachada.jpg.asset.json";
import frente from "@/assets/capela/frente.png.asset.json";
import interior from "@/assets/capela/interior.png.asset.json";
import altar from "@/assets/capela/altar.png.asset.json";
import { Img } from "@/components/Img";

const SLIDES = [
  { url: fachada.url, alt: "Fachada externa da Capela Valen" },
  { url: frente.url, alt: "Vista frontal da Capela Valen" },
  { url: interior.url, alt: "Interior da Capela Valen com bancos" },
  { url: altar.url, alt: "Detalhe do altar da Capela Valen" },
];

export function CapelaSection() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((dir: number) => {
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);
  }, []);

  // Só monta a imagem depois que o slide é (ou será) exibido — evita baixar as 4 de uma vez.
  useEffect(() => {
    setSeen((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, [index]);


  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => go(1), 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, go]);

  return (
    <section id="capela-valen" className="py-20 bg-surface scroll-mt-24">
      <div className="container-valen">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Texto */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Church className="h-3.5 w-3.5" /> Fé e acolhimento
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-display font-extrabold tracking-tight text-secondary text-balance">
              Capela Valen
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              Um espaço de fé, pausa e acolhimento dentro do Complexo Valen. A
              Capela Valen foi criada para receber clientes, caminhoneiros,
              colaboradores e visitantes que desejam fazer uma oração, agradecer
              ou viver um momento de tranquilidade durante a jornada.
            </p>

            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-soft">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-orange text-white">
                <Clock className="h-5 w-5" />
              </span>
              <span className="text-sm leading-tight">
                <span className="block text-muted-foreground">
                  Aberta todos os dias
                </span>
                <span className="block text-lg font-display font-extrabold text-secondary">
                  7h às 19h
                </span>
              </span>
            </div>

            <p className="mt-5 text-sm italic text-secondary/70">
              Um lugar para respirar, agradecer e seguir em movimento.
            </p>
          </div>

          {/* Carrossel */}
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-secondary/5 shadow-soft"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {SLIDES.map((s, i) =>
              seen.has(i) ? (
                <Img
                  key={s.url}
                  src={s.url}
                  alt={s.alt}
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : null,
            )}

            <button
              type="button"
              aria-label="Imagem anterior"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-secondary backdrop-blur transition hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Próxima imagem"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-secondary backdrop-blur transition hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {SLIDES.map((s, i) => (
                <button
                  key={s.url}
                  type="button"
                  aria-label={`Ir para imagem ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
