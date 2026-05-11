import { supabase } from "@/integrations/supabase/client";

export const BLOG_CATEGORIES = [
  "Dicas da Estrada",
  "Manutenção Preventiva",
  "Segurança",
  "Alimentação e Bem-estar",
  "Economia de Diesel",
  "Cuidados com o Caminhão",
  "Experiências Valen",
  "Promoções",
  "Notícias do Complexo",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  cover_url: string;
  content: string;
  author: string;
  published_at: string;
  reading_time: string;
  status: "rascunho" | "publicado";
  featured: boolean;
  main_featured: boolean;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogPostInput = Omit<BlogPostRow, "id" | "created_at" | "updated_at">;

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

export function formatPublishedDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
}

export async function listPublishedPosts(): Promise<BlogPostRow[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "publicado")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPostRow[];
}

export async function listAllPosts(): Promise<BlogPostRow[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPostRow[];
}

export async function getPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "publicado")
    .maybeSingle();
  if (error) throw error;
  return data as BlogPostRow | null;
}

export async function getPostById(id: string): Promise<BlogPostRow | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as BlogPostRow | null;
}

export async function createPost(input: BlogPostInput): Promise<BlogPostRow> {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as BlogPostRow;
}

export async function updatePost(id: string, input: Partial<BlogPostInput>): Promise<BlogPostRow> {
  const { data, error } = await supabase
    .from("blog_posts")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as BlogPostRow;
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}
