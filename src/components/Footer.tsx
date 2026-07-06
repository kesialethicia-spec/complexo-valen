import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Linkedin, MapPin, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-24 bg-secondary text-secondary-foreground overflow-hidden">
      <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

      <div className="container-valen relative py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo variant="light" />
            <p className="mt-5 text-lg font-display font-semibold leading-tight">
              Somos feitos<br />de <span className="text-primary">movimento</span>.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/posto.valen/", label: "Instagram do Posto Valen" },
                { Icon: Facebook, href: "https://www.facebook.com/grupovalen1/?locale=pt_BR", label: "Facebook do Grupo Valen" },
                { Icon: Youtube, href: "https://www.youtube.com/@complexovalen/videos", label: "YouTube do Complexo Valen" },
                { Icon: Linkedin, href: "https://br.linkedin.com/company/grupovalen", label: "LinkedIn do Grupo Valen" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Valen" links={[
            ["O Valen", "/o-valen"],
            ["Serviços", "/servicos"],
            ["Lojas", "/lojas"],
            ["Promoções", "/promocoes"],
            ["Experiências", "/experiencias"],
          ]} />

          <FooterCol title="Serviços" links={[
            ["Posto Valen", "/servicos/posto"],
            ["Truck Center", "/servicos/truck-center"],
            ["Alimentação", "/servicos/alimentacao"],
            ["Valen Porto Hotel", "/servicos/valen-porto-hotel"],
            ["Clube do Caminhoneiro", "/servicos/clube-do-caminhoneiro"],
          ]} />

          <div>
            <h4 className="font-display font-bold text-base mb-4 text-white">Contato</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" /> São Luís — MA, Brasil</li>
              <li className="flex gap-2"><MessageCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" /> WhatsApp: (98) 0000-0000</li>
              <li><Link to="/contato" className="hover:text-primary">Fale conosco</Link></li>
              <li><a href="https://complexovalen.portaldetalentos.senior.com.br/jobs" target="_blank" rel="noreferrer" className="hover:text-primary">Trabalhe Conosco</a></li>
            </ul>
            <a
              href="https://maps.google.com/?q=Complexo+Valen+São+Luís+MA"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <MapPin className="h-4 w-4" /> Como chegar
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Complexo Valen. Todos os direitos reservados.</p>
          <p className="flex flex-wrap items-center gap-3">
            <Link to="/politica-de-privacidade" className="hover:text-primary">Política de Privacidade</Link>
            <span className="opacity-40">·</span>
            <Link to="/termos-de-uso" className="hover:text-primary">Termos de Uso</Link>
            <span className="opacity-40">·</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("valen:open-cookie-preferences"))}
              className="hover:text-primary"
            >
              Preferências de cookies
            </button>
            <span className="opacity-40">·</span>
            <Link to="/conecte-se" className="hover:text-primary">Área Administrativa</Link>
          </p>

        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-display font-bold text-base mb-4 text-white">{title}</h4>
      <ul className="space-y-2.5 text-sm text-white/80">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="hover:text-primary transition-colors">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
