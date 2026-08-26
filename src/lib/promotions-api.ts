import { supabase } from "@/integrations/supabase/client";

export const PROMOTION_CATEGORIES = [
  "Posto",
  "ValenBen",
  "Conveniência",
  "Alimentação",
  "Truck Center",
  "Estacionamento",
  "Eventos",
  "Lojas",
  "Hotel",
  "Clube do Caminhoneiro",
] as const;

export type PromotionCategory = (typeof PROMOTION_CATEGORIES)[number];

export type PromotionStatus = "rascunho" | "ativa" | "inativa";

export interface PromotionRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  cover_url: string;
  short_description: string;
  full_description: string;
  how_to_participate: string;
  validity: string;
  rules: string;
  cta_text: string;
  cta_url: string;
  status: PromotionStatus;
  featured: boolean;
  show_on_home: boolean;
  show_on_blog: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export type PromotionInput = Omit<PromotionRow, "id" | "created_at" | "updated_at">;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function listActivePromotions(): Promise<PromotionRow[]> {
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("status", "ativa")
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PromotionRow[];
}

export async function listAllPromotions(): Promise<PromotionRow[]> {
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PromotionRow[];
}

export async function getPromotionBySlug(slug: string): Promise<PromotionRow | null> {
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("slug", slug)
    .eq("status", "ativa")
    .maybeSingle();
  if (error) throw error;
  return data as PromotionRow | null;
}

export async function getPromotionById(id: string): Promise<PromotionRow | null> {
  const { data, error } = await supabase
    .from("promotions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as PromotionRow | null;
}

export async function createPromotion(input: PromotionInput): Promise<PromotionRow> {
  const { data, error } = await supabase
    .from("promotions")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as PromotionRow;
}

export async function updatePromotion(id: string, input: Partial<PromotionInput>): Promise<PromotionRow> {
  const { data, error } = await supabase
    .from("promotions")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as PromotionRow;
}

export async function deletePromotion(id: string): Promise<void> {
  const { error } = await supabase.from("promotions").delete().eq("id", id);
  if (error) throw error;
}
