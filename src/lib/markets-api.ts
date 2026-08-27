import { supabase } from "@/integrations/supabase/client";

export type MarketStatus = "rascunho" | "publicado";

export interface MarketRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  full_description: string;
  location: string;
  image_url: string;
  gallery_urls: string[];
  features: string[];
  cta_text: string;
  cta_url: string;
  meta_title: string | null;
  meta_description: string | null;
  status: MarketStatus;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type MarketInput = Omit<MarketRow, "id" | "created_at" | "updated_at">;

export async function listPublishedMarkets(): Promise<MarketRow[]> {
  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .eq("status", "publicado")
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MarketRow[];
}

export async function listAllMarkets(): Promise<MarketRow[]> {
  const { data, error } = await supabase
    .from("markets")
    .select("*")
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MarketRow[];
}

export async function getMarketById(id: string): Promise<MarketRow | null> {
  const { data, error } = await supabase.from("markets").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as MarketRow | null;
}

export async function createMarket(input: MarketInput): Promise<MarketRow> {
  const { data, error } = await supabase.from("markets").insert(input).select("*").single();
  if (error) throw error;
  return data as MarketRow;
}

export async function updateMarket(id: string, input: Partial<MarketInput>): Promise<MarketRow> {
  const { data, error } = await supabase.from("markets").update(input).eq("id", id).select("*").single();
  if (error) throw error;
  return data as MarketRow;
}

export async function deleteMarket(id: string): Promise<void> {
  const { error } = await supabase.from("markets").delete().eq("id", id);
  if (error) throw error;
}
