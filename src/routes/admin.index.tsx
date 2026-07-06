import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

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
        <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Blog do Caminhoneiro</h2>
          <p className="mt-1 text-sm text-muted-foreground flex-1">
            Crie, edite e publique artigos do blog do Valen.
          </p>
          <Link
            to="/admin/blog"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Gerenciar artigos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Promoções</h2>
          <p className="mt-1 text-sm text-muted-foreground flex-1">
            Cadastre e gerencie as promoções exibidas no site.
          </p>
          <Link
            to="/admin/promocoes"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Gerenciar promoções <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Lojas do Complexo</h2>
          <p className="mt-1 text-sm text-muted-foreground flex-1">
            Gerencie as lojas, serviços e operações presentes no Complexo Valen.
          </p>
          <Link
            to="/admin/lojas"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Gerenciar lojas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex flex-col rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Vídeos</h2>
          <p className="mt-1 text-sm text-muted-foreground flex-1">
            Cadastre vídeos do YouTube para a seção "Vídeos para quem vive na estrada".
          </p>
          <Link
            to="/admin/videos"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Gerenciar vídeos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
