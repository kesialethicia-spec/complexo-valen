import { supabase } from "@/integrations/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const client = supabase as any;

export const BENEFIT_CATEGORIES = [
  "Brinde",
  "Estacionamento",
  "Combo",
  "Conveniência",
  "Serviço",
] as const;

export type BenefitCategory = (typeof BENEFIT_CATEGORIES)[number];
export type BenefitStatus = "ativo" | "inativo" | "rascunho";

export interface ClubeSettings {
  seo_title: string;
  seo_description: string;
  page_status: "publicada" | "rascunho";
  hero_badge: string;
  hero_title: string;
  hero_highlight: string;
  hero_subtitle: string;
  hero_bg_image_url: string;
  phone_mockup_url: string;
  qr_code_url: string;
  cta_text: string;
  cta_url: string;
  google_play_url: string;
  app_store_url: string;
}

export const DEFAULT_CLUBE_SETTINGS: ClubeSettings = {
  seo_title: "Clube Valen Fidelidade — Seu abastecimento vale benefícios",
  seo_description:
    "Baixe o aplicativo Clube Valen Fidelidade, pontue no abastecimento e troque seus pontos por brindes, estacionamento e combos da conveniência.",
  page_status: "publicada",
  hero_badge: "Clube Valen Fidelidade",
  hero_title: "SEU ABASTECIMENTO VALE BENEFÍCIOS",
  hero_highlight: "BENEFÍCIOS",
  hero_subtitle:
    "Baixe o aplicativo, pontue no abastecimento e troque seus pontos por brindes, serviços e combos da conveniência.",
  hero_bg_image_url: "",
  phone_mockup_url: "",
  qr_code_url: "",
  cta_text: "Baixe o aplicativo",
  cta_url: "",
  google_play_url: "",
  app_store_url: "",
};

export interface BenefitRow {
  id: string;
  name: string;
  slug: string;
  category: string;
  image_url: string;
  short_description: string;
  full_description: string;
  points: number | null;
  status: BenefitStatus;
  featured: boolean;
  order_index: number;
}

export type BenefitInput = Omit<BenefitRow, "id">;

export interface FaqRow {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  status: "ativo" | "inativo";
}

export type FaqInput = Omit<FaqRow, "id">;

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ---------- settings ---------- */

export async function getClubeSettings(): Promise<ClubeSettings> {
  const { data, error } = await client
    .from("clube_valen_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return DEFAULT_CLUBE_SETTINGS;
  return { ...DEFAULT_CLUBE_SETTINGS, ...data } as ClubeSettings;
}

export async function updateClubeSettings(input: ClubeSettings): Promise<void> {
  const { error } = await client
    .from("clube_valen_settings")
    .upsert({ id: true, ...input });
  if (error) throw error;
}

/* ---------- benefits ---------- */

export async function listActiveBenefits(): Promise<BenefitRow[]> {
  const { data, error } = await client
    .from("clube_valen_benefits")
    .select("*")
    .eq("status", "ativo")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return (data ?? []) as BenefitRow[];
}

export async function listAllBenefits(): Promise<BenefitRow[]> {
  const { data, error } = await client
    .from("clube_valen_benefits")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return (data ?? []) as BenefitRow[];
}

export async function createBenefit(input: BenefitInput): Promise<void> {
  const { error } = await client.from("clube_valen_benefits").insert(input);
  if (error) throw error;
}

export async function updateBenefit(id: string, input: Partial<BenefitInput>): Promise<void> {
  const { error } = await client.from("clube_valen_benefits").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteBenefit(id: string): Promise<void> {
  const { error } = await client.from("clube_valen_benefits").delete().eq("id", id);
  if (error) throw error;
}

/* ---------- faqs ---------- */

export async function listActiveFaqs(): Promise<FaqRow[]> {
  const { data, error } = await client
    .from("clube_valen_faqs")
    .select("*")
    .eq("status", "ativo")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return (data ?? []) as FaqRow[];
}

export async function listAllFaqs(): Promise<FaqRow[]> {
  const { data, error } = await client
    .from("clube_valen_faqs")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return (data ?? []) as FaqRow[];
}

export async function createFaq(input: FaqInput): Promise<void> {
  const { error } = await client.from("clube_valen_faqs").insert(input);
  if (error) throw error;
}

export async function updateFaq(id: string, input: Partial<FaqInput>): Promise<void> {
  const { error } = await client.from("clube_valen_faqs").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteFaq(id: string): Promise<void> {
  const { error } = await client.from("clube_valen_faqs").delete().eq("id", id);
  if (error) throw error;
}
