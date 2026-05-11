import { Link } from "@tanstack/react-router";

export function Logo({ variant = "default" }: { variant?: "default" | "light" }) {
  const text = variant === "light" ? "text-white" : "text-secondary";
  return (
    <Link to="/" className="inline-flex items-center gap-2 group">
      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-orange shadow-glow">
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M3 17c4-6 6-6 9 0s5 6 9 0" />
        </svg>
      </span>
      <span className={`font-display text-2xl font-extrabold tracking-tight ${text}`}>
        Valen<span className="text-primary">.</span>
      </span>
    </Link>
  );
}
