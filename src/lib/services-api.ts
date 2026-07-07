import { supabase } from "@/integrations/supabase/client";

export type ServiceStatus = "rascunho" | "publicado";

export interface ServiceRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  icon: string;
  image_url: string;
  link_url: string;
  status: ServiceStatus;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type ServiceInput = Omit<ServiceRow, "id" | "created_at" | "updated_at">;

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

export async function listPublishedServices(): Promise<ServiceRow[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("status", "publicado")
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ServiceRow[];
}

export async function listAllServices(): Promise<ServiceRow[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ServiceRow[];
}

export async function getServiceById(id: string): Promise<ServiceRow | null> {
  const { data, error } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as ServiceRow | null;
}

export async function createService(input: ServiceInput): Promise<ServiceRow> {
  const { data, error } = await supabase.from("services").insert(input).select("*").single();
  if (error) throw error;
  return data as ServiceRow;
}

export async function updateService(id: string, input: Partial<ServiceInput>): Promise<ServiceRow> {
  const { data, error } = await supabase.from("services").update(input).eq("id", id).select("*").single();
  if (error) throw error;
  return data as ServiceRow;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}
