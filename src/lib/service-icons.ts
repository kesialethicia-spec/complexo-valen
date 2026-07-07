import {
  Fuel, Wrench, ParkingSquare, ShoppingBag, Coffee, Hotel, Droplet,
  Sparkles, Wallet, Mic, Building2, Truck, Package, Car, Star,
  type LucideIcon,
} from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  Fuel, Wrench, ParkingSquare, ShoppingBag, Coffee, Hotel, Droplet,
  Sparkles, Wallet, Mic, Building2, Truck, Package, Car, Star,
};

export const SERVICE_ICON_NAMES = Object.keys(SERVICE_ICONS);

export function getServiceIcon(name: string): LucideIcon {
  return SERVICE_ICONS[name] ?? Sparkles;
}
