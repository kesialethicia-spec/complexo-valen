import { Link } from "@tanstack/react-router";
import { Img } from "@/components/Img";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-white">
      <div className="absolute inset-0 opacity-30">
        {image && (
          <Img src={image} alt="" fetchPriority="high" sizes="100vw" className="h-full w-full object-cover mix-blend-overlay" />
        )}
      </div>
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/40 blur-3xl" />
      <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

      <div className="container-valen relative py-24 md:py-32">
        <nav className="text-xs text-white/70 mb-6">
          <Link to="/" className="hover:text-white">Home</Link>
          {eyebrow && <> <span className="mx-2">/</span> <span>{eyebrow}</span></>}
        </nav>
        <h1 className="max-w-3xl text-5xl md:text-6xl font-display font-extrabold tracking-tight text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-lg text-white/85 leading-relaxed">{subtitle}</p>
        )}
      </div>

      <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C360,90 1080,0 1440,50 L1440,80 L0,80 Z" fill="var(--background)" />
      </svg>
    </section>
  );
}
