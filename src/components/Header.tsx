import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, MapPin } from "lucide-react";
import { Logo } from "./Logo";

const nav = [
  { to: "/", label: "Home" },
  { to: "/o-valen", label: "O Valen" },
  { to: "/servicos", label: "Serviços" },
  { to: "/lojas", label: "Lojas" },
  { to: "/promocoes", label: "Promoções" },
  { to: "/experiencias", label: "Experiências" },
  { to: "/blog-do-caminhoneiro", label: "Blog do Caminhoneiro" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-soft"
          : "bg-background/60 backdrop-blur"
      }`}
    >
      <div className="container-valen flex h-20 items-center justify-between py-3">
        <Logo />

        <nav className="hidden xl:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors rounded-lg"
              activeProps={{ className: "text-primary font-semibold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-orange px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-105 transition-transform"
          >
            <MapPin className="h-4 w-4" /> Como chegar
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="xl:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card"
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border bg-background">
          <nav className="container-valen flex flex-col py-4 gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-medium hover:bg-surface"
                activeProps={{ className: "bg-surface text-primary font-semibold" }}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://maps.app.goo.gl/cKXrF3HYv5ypB9aU6"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-orange px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              <MapPin className="h-4 w-4" /> Como chegar
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
