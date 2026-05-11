import { createFileRoute, Outlet, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel Administrativo — Complexo Valen" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { session, isAdmin, loading, signOut, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: "/conecte-se" });
    }
  }, [loading, session, navigate]);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">Carregando…</div>;
  }

  if (!session) return null;

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-display font-bold">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">
          Sua conta ({user?.email}) não possui permissão de administrador.
        </p>
        <button
          onClick={async () => { await signOut(); navigate({ to: "/conecte-se" }); }}
          className="rounded-full border px-5 py-2 text-sm font-semibold hover:bg-muted"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-display font-bold">Valen · Admin</Link>
            <nav className="hidden gap-4 text-sm text-muted-foreground md:flex">
              <Link to="/admin" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground font-semibold" }}>Dashboard</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground md:inline">{user?.email}</span>
            <button
              onClick={async () => { await signOut(); navigate({ to: "/conecte-se" }); }}
              className="rounded-full border px-4 py-1.5 font-medium hover:bg-muted"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}
