import { Link } from "@tanstack/react-router";
import logoOrangeAsset from "@/assets/logo-valen.png.asset.json";
import logoWhiteAsset from "@/assets/logo-valen-branca.png.asset.json";

const logoOrange = logoOrangeAsset.url;
const logoWhite = logoWhiteAsset.url;

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
