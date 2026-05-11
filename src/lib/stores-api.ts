import { supabase } from "@/integrations/supabase/client";

export const STORE_CATEGORIES = [
  "Alimentação",
  "Serviços",
  "Autopeças",
  "Saúde",
  "Conveniência",
  "Financeiro",
  "Escritórios",
  "Hotel",
  "Posto",
  "Truck Center",
  "Outros",
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];
export type StoreStatus = "rascunho" | "ativa" | "inativa";

export interface StoreRow {
  id: string;
  name: string;
  slug: string;
  category: string;
  logo_url: string;
  cover_url: string;
  short_description: string;
  full_description: string;
  hours: string;
  phone: string;
  whatsapp: string;
  location: string;
  block: string;
  cta_text: string;
  cta_url: string;
  status: StoreStatus;
  featured: boolean;
  show_on_home: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export type StoreInput = Omit<StoreRow, "id" | "created_at" | "updated_at">;

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

export async function listActiveStores(): Promise<StoreRow[]> {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("status", "ativa")
    .order("featured", { ascending: false })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as StoreRow[];
}

export async function listAllStores(): Promise<StoreRow[]> {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as StoreRow[];
}

export async function getStoreBySlug(slug: string): Promise<StoreRow | null> {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .eq("status", "ativa")
    .maybeSingle();
  if (error) throw error;
  return data as StoreRow | null;
}

export async function getStoreById(id: string): Promise<StoreRow | null> {
  const { data, error } = await supabase.from("stores").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as StoreRow | null;
}

export async function createStore(input: StoreInput): Promise<StoreRow> {
  const { data, error } = await supabase.from("stores").insert(input).select("*").single();
  if (error) throw error;
  return data as StoreRow;
}

export async function updateStore(id: string, input: Partial<StoreInput>): Promise<StoreRow> {
  const { data, error } = await supabase.from("stores").update(input).eq("id", id).select("*").single();
  if (error) throw error;
  return data as StoreRow;
}

export async function deleteStore(id: string): Promise<void> {
  const { error } = await supabase.from("stores").delete().eq("id", id);
  if (error) throw error;
}
