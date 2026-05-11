import { Link } from "@tanstack/react-router";
import logoOrange from "@/assets/logo-valen.png";
import logoWhite from "@/assets/logo-valen-branca.png";

export function Logo({ variant = "default" }: { variant?: "default" | "light" }) {
  const src = variant === "light" ? logoWhite : logoOrange;
  return (
    <Link to="/" className="inline-flex items-center group" aria-label="Complexo Valen">
      <img
        src={src}
        alt="Complexo Valen"
        className="h-10 w-auto object-contain"
        loading="eager"
      />
    </Link>
  );
}
