import { supabase } from "@/integrations/supabase/client";

export const STORE_CATEGORIES = [
  "Alimentação",
  "Serviços",
  "Autopeças",
  "Saúde",
  "Conveniência",
  "Transportadoras",
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
  order_index: number;
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

// Columns exposed publicly (store contact details are business info, not personal data).
export const PUBLIC_STORE_COLUMNS =
  "id,name,slug,category,logo_url,cover_url,short_description,full_description,hours,phone,whatsapp,location,block,cta_text,cta_url,status,featured,show_on_home,order_index,meta_title,meta_description,created_at,updated_at";

export type PublicStoreRow = StoreRow;

export async function listActiveStores(): Promise<PublicStoreRow[]> {
  const { data, error } = await supabase
    .from("stores")
    .select(PUBLIC_STORE_COLUMNS)
    .eq("status", "ativa")
    .order("order_index", { ascending: true })
    .order("featured", { ascending: false })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as PublicStoreRow[];
}


export async function listAllStores(): Promise<StoreRow[]> {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as StoreRow[];
}

export async function getStoreBySlug(slug: string): Promise<PublicStoreRow | null> {
  const { data, error } = await supabase
    .from("stores")
    .select(PUBLIC_STORE_COLUMNS)
    .eq("slug", slug)
    .eq("status", "ativa")
    .maybeSingle();
  if (error) throw error;
  return data as PublicStoreRow | null;
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
