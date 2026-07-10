import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { listPublishedPosts } from "@/lib/blog-api";
import { listActivePromotions } from "@/lib/promotions-api";
import { listActiveStores } from "@/lib/stores-api";

const BASE_URL = "https://valen-route-connect.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const STATIC_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/o-valen", changefreq: "monthly", priority: "0.8" },
  { path: "/servicos", changefreq: "monthly", priority: "0.8" },
  { path: "/servicos/posto-valen", changefreq: "monthly", priority: "0.7" },
  { path: "/servicos/truck-center", changefreq: "monthly", priority: "0.7" },
  { path: "/servicos/valen-porto-hotel", changefreq: "monthly", priority: "0.7" },
  { path: "/servicos/valenlog", changefreq: "monthly", priority: "0.7" },
  { path: "/servicos/valenben-super-troca-de-oleo", changefreq: "monthly", priority: "0.7" },
  { path: "/servicos/valenlub", changefreq: "monthly", priority: "0.7" },
  { path: "/servicos/alimentacao", changefreq: "monthly", priority: "0.7" },
  { path: "/servicos/clube-do-caminhoneiro", changefreq: "monthly", priority: "0.7" },
  { path: "/lojas", changefreq: "weekly", priority: "0.8" },
  { path: "/promocoes", changefreq: "weekly", priority: "0.8" },
  { path: "/experiencias", changefreq: "monthly", priority: "0.7" },
  { path: "/blog-do-caminhoneiro", changefreq: "weekly", priority: "0.8" },
  { path: "/contato", changefreq: "yearly", priority: "0.5" },
  { path: "/politica-de-privacidade", changefreq: "yearly", priority: "0.3" },
  { path: "/termos-de-uso", changefreq: "yearly", priority: "0.3" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [...STATIC_ENTRIES];

        const [posts, promotions, stores] = await Promise.all([
          listPublishedPosts().catch(() => []),
          listActivePromotions().catch(() => []),
          listActiveStores().catch(() => []),
        ]);

        for (const p of posts) {
          entries.push({
            path: `/blog-do-caminhoneiro/${p.slug}`,
            lastmod: (p.updated_at ?? p.published_at ?? "").slice(0, 10) || undefined,
            changefreq: "monthly",
            priority: "0.6",
          });
        }
        for (const p of promotions) {
          entries.push({
            path: `/promocoes/${p.slug}`,
            lastmod: (p.updated_at ?? "").slice(0, 10) || undefined,
            changefreq: "weekly",
            priority: "0.6",
          });
        }
        for (const s of stores) {
          entries.push({
            path: `/lojas/${s.slug}`,
            lastmod: (s.updated_at ?? "").slice(0, 10) || undefined,
            changefreq: "monthly",
            priority: "0.6",
          });
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
