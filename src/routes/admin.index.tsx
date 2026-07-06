import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

type AdminLink =
  | "/admin/blog"
  | "/admin/promocoes"
  | "/admin/lojas"
  | "/admin/videos"
  | "/admin/pagina-hotel"
  | "/admin/pagina-valenlog"
  | "/admin/pagina-posto";

const cards: { title: string; desc: string; to: AdminLink; cta: string }[] = [
  { title: "Blog do Caminhoneiro", desc: "Crie, edite e publique artigos do blog do Valen.", to: "/admin/blog", cta: "Gerenciar artigos" },
  { title: "Promoções", desc: "Cadastre e gerencie as promoções exibidas no site.", to: "/admin/promocoes", cta: "Gerenciar promoções" },
  { title: "Lojas do Complexo", desc: "Gerencie as lojas, serviços e operações presentes no Complexo Valen.", to: "/admin/lojas", cta: "Gerenciar lojas" },
  { title: "Vídeos", desc: "Cadastre vídeos do YouTube para a seção “Vídeos para quem vive na estrada”.", to: "/admin/videos", cta: "Gerenciar vídeos" },
  { title: "Página Posto Valen", desc: "Atualize imagens, logo e formas de pagamento da página do Posto Valen.", to: "/admin/pagina-posto", cta: "Editar página do Posto" },
  { title: "Página Valen Porto Hotel", desc: "Atualize imagens, logo e links de reserva exibidos na página do hotel.", to: "/admin/pagina-hotel", cta: "Editar página do hotel" },
  { title: "Página ValenLog", desc: "Gerencie imagens da página do ValenLog e do Espaço Valentina.", to: "/admin/pagina-valenlog", cta: "Editar página do ValenLog" },
];

function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Painel Administrativo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bem-vindo, {user?.email}. Use este espaço para gerenciar o conteúdo do Complexo Valen.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.to} className="flex flex-col rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="font-semibold">{c.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground flex-1">{c.desc}</p>
            <Link
              to={c.to}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {c.cta} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
