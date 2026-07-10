export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/15 via-gold/20 to-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary ring-1 ring-primary/20">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_20%,transparent)]" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-5 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-balance text-secondary">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground text-balance leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
