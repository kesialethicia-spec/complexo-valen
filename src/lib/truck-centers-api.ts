import { supabase } from "@/integrations/supabase/client";

export type TruckCenterStatus = "ativo" | "inativo";

export interface TruckCenterRow {
  id: string;
  name: string;
  image_url: string;
  location: string;
  status: TruckCenterStatus;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type TruckCenterInput = Omit<TruckCenterRow, "id" | "created_at" | "updated_at">;

export async function listActiveTruckCenters(): Promise<TruckCenterRow[]> {
  const { data, error } = await supabase
    .from("truck_centers")
    .select("*")
    .eq("status", "ativo")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TruckCenterRow[];
}

export async function listAllTruckCenters(): Promise<TruckCenterRow[]> {
  const { data, error } = await supabase
    .from("truck_centers")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TruckCenterRow[];
}

export async function updateTruckCenter(id: string, input: Partial<TruckCenterInput>): Promise<void> {
  const { error } = await supabase.from("truck_centers").update(input).eq("id", id);
  if (error) throw error;
}
