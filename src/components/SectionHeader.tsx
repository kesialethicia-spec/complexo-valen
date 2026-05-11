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
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-4xl md:text-5xl font-display font-extrabold tracking-tight text-balance text-secondary">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground text-balance leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
