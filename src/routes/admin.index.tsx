import { createFileRoute } from "@tanstack/react-router";
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

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Blog do Caminhoneiro</h2>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie artigos e categorias (em breve).</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Promoções</h2>
          <p className="mt-1 text-sm text-muted-foreground">Cadastre promoções ativas (em breve).</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Lojas e parceiros</h2>
          <p className="mt-1 text-sm text-muted-foreground">Atualize lojas do complexo (em breve).</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        Este é o esqueleto do painel. Os módulos de CRUD podem ser ativados em uma próxima fase.
      </div>
    </div>
  );
}
