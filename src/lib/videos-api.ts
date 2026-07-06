import { supabase } from "@/integrations/supabase/client";

export const VIDEO_CATEGORIES = [
  "Geral",
  "Bem-estar",
  "Segurança",
  "Manutenção",
  "Novidades",
  "Bastidores",
  "Serviços",
  "Eventos",
] as const;

export type VideoCategory = (typeof VIDEO_CATEGORIES)[number];
export type VideoStatus = "rascunho" | "publicado";

export interface VideoRow {
  id: string;
  title: string;
  category: string;
  short_description: string;
  youtube_url: string;
  youtube_id: string;
  status: VideoStatus;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type VideoInput = Omit<VideoRow, "id" | "created_at" | "updated_at">;

/** Extract a YouTube video ID from any common URL shape (watch, youtu.be, shorts, embed). */
export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // Direct 11-char id
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const v = u.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const kw = ["shorts", "embed", "live", "v"];
      const idx = parts.findIndex((p) => kw.includes(p));
      if (idx >= 0 && parts[idx + 1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[idx + 1])) {
        return parts[idx + 1];
      }
    }
  } catch {
    // fall through
  }
  const m = trimmed.match(/[a-zA-Z0-9_-]{11}/);
  return m ? m[0] : null;
}

export function youtubeThumbnail(id: string, quality: "mq" | "hq" | "max" = "hq"): string {
  const map = { mq: "mqdefault", hq: "hqdefault", max: "maxresdefault" };
  return `https://img.youtube.com/vi/${id}/${map[quality]}.jpg`;
}

export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
}

export async function listPublishedVideos(): Promise<VideoRow[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("status", "publicado")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as VideoRow[];
}

export async function listAllVideos(): Promise<VideoRow[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as VideoRow[];
}

export async function getVideoById(id: string): Promise<VideoRow | null> {
  const { data, error } = await supabase.from("videos").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as VideoRow | null;
}

export async function createVideo(input: VideoInput): Promise<VideoRow> {
  const { data, error } = await supabase.from("videos").insert(input).select("*").single();
  if (error) throw error;
  return data as VideoRow;
}

export async function updateVideo(id: string, input: Partial<VideoInput>): Promise<VideoRow> {
  const { data, error } = await supabase.from("videos").update(input).eq("id", id).select("*").single();
  if (error) throw error;
  return data as VideoRow;
}

export async function deleteVideo(id: string): Promise<void> {
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) throw error;
}
