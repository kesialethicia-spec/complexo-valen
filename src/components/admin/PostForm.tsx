import { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import {
  BLOG_CATEGORIES,
  slugify,
  type BlogPostInput,
  type BlogPostRow,
} from "@/lib/blog-api";

interface Props {
  initial?: BlogPostRow;
  submitting: boolean;
  onSubmit: (data: BlogPostInput) => Promise<void> | void;
  onCancel: () => void;
}

export function PostForm({ initial, submitting, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? BLOG_CATEGORIES[0]);
  const [coverUrl, setCoverUrl] = useState(initial?.cover_url ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "Equipe Valen");
  const [publishedAt, setPublishedAt] = useState(
    initial?.published_at ?? new Date().toISOString().slice(0, 10),
  );
  const [readingTime, setReadingTime] = useState(initial?.reading_time ?? "5 min");
  const [status, setStatus] = useState<"rascunho" | "publicado">(initial?.status ?? "rascunho");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [mainFeatured, setMainFeatured] = useState(initial?.main_featured ?? false);
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(", "));
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? "");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const previewHtml = useMemo(
    () => DOMPurify.sanitize(marked.parse(content || "*Sem conteúdo ainda…*") as string),
    [content],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: BlogPostInput = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerpt.trim(),
      category,
      cover_url: coverUrl.trim(),
      content,
      author: author.trim() || "Equipe Valen",
      published_at: publishedAt,
      reading_time: readingTime.trim() || "5 min",
      status,
      featured,
      main_featured: mainFeatured,
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
    };
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Field label="Título">
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
        </Field>

        <Field label="Slug (URL)">
          <input
            value={slug}
            onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
            required
            className={inputCls}
          />
          <p className="text-xs text-muted-foreground mt-1">/blog/{slug || "..."}</p>
        </Field>

        <Field label="Resumo">
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className={inputCls} />
        </Field>

        <Field label="Imagem principal (URL)">
          <input
            type="url"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://..."
            className={inputCls}
          />
          {coverUrl && (
            <img src={coverUrl} alt="" className="mt-2 max-h-48 rounded-lg object-cover border" />
          )}
        </Field>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-semibold">Conteúdo (Markdown)</label>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {showPreview ? "Voltar para edição" : "Visualizar"}
            </button>
          </div>
          {showPreview ? (
            <div
              className="article-body min-h-[300px] rounded-md border bg-card p-4"
              dangerouslySetInnerHTML={{ __html: previewHtml as string }}
            />
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={18}
              className={`${inputCls} font-mono text-sm`}
              placeholder="## Subtítulo&#10;&#10;Texto do artigo..."
            />
          )}
        </div>
      </div>

      <aside className="space-y-5">
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value as never)} className={inputCls}>
            <option value="rascunho">Rascunho</option>
            <option value="publicado">Publicado</option>
          </select>
        </Field>

        <Field label="Categoria">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Autor">
          <input value={author} onChange={(e) => setAuthor(e.target.value)} className={inputCls} />
        </Field>

        <Field label="Data de publicação">
          <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className={inputCls} />
        </Field>

        <Field label="Tempo de leitura">
          <input value={readingTime} onChange={(e) => setReadingTime(e.target.value)} placeholder="5 min" className={inputCls} />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Marcar como destaque
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={mainFeatured} onChange={(e) => setMainFeatured(e.target.checked)} />
          Marcar como artigo principal
        </label>

        <Field label="Tags (separadas por vírgula)">
          <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} className={inputCls} placeholder="estrada, dicas" />
        </Field>

        <Field label="Meta title (SEO)">
          <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Meta description (SEO)">
          <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className={inputCls} />
        </Field>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {submitting ? "Salvando…" : "Salvar"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            Cancelar
          </button>
        </div>
      </aside>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
