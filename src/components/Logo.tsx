import { Link } from "@tanstack/react-router";
import logoPositivaAsset from "@/assets/logo-valen-positiva.png.asset.json";
import logoNegativaAsset from "@/assets/logo-valen-negativa.png.asset.json";

const logoOrange = logoPositivaAsset.url;
const logoWhite = logoNegativaAsset.url;

export function Logo({ variant = "default" }: { variant?: "default" | "light" }) {
  const src = variant === "light" ? logoWhite : logoOrange;
  return (
    <Link to="/" className="inline-flex items-center group" aria-label="Valen — Somos feitos de movimento">
      <img
        src={src}
        alt="Valen — Somos feitos de movimento"
        className="h-10 md:h-12 w-auto object-contain"
        loading="eager"
      />
    </Link>
  );
}
