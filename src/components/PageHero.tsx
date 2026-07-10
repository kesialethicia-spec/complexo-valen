import { Link } from "@tanstack/react-router";

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
    <section className="relative overflow-hidden bg-gradient-hero text-white sunburst grain">
      <div className="absolute inset-0 opacity-30">
        {image && (
          <img src={image} alt="" className="h-full w-full object-cover mix-blend-overlay" />
        )}
      </div>
      <div className="decor-blob decor-blob-orange -bottom-24 -right-24 h-[28rem] w-[28rem]" />
      <div className="decor-blob decor-blob-gold top-10 -left-16 h-72 w-72" />
      <div className="decor-blob decor-blob-blue top-1/3 right-1/4 h-56 w-56 opacity-40" />

      <div className="container-valen relative z-10 py-24 md:py-32">
        <nav className="text-xs text-white/70 mb-6">
          <Link to="/" className="hover:text-white">Home</Link>
          {eyebrow && <> <span className="mx-2">/</span> <span>{eyebrow}</span></>}
        </nav>
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-white ring-1 ring-white/25 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {eyebrow}
          </span>
        )}
        <h1 className="max-w-3xl text-5xl md:text-6xl font-display font-extrabold tracking-tight text-balance drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-lg text-white/90 leading-relaxed">{subtitle}</p>
        )}
      </div>

      <svg className="absolute bottom-0 left-0 right-0 w-full z-10" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C360,90 1080,0 1440,50 L1440,80 L0,80 Z" fill="var(--background)" />
      </svg>
    </section>
  );
}
