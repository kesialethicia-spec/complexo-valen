import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/conecte-se")({
  head: () => ({
    meta: [
      { title: "Área Administrativa — Complexo Valen" },
      { name: "description", content: "Acesso à área administrativa do Complexo Valen." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ConecteSePage,
});

function ConecteSePage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/admin" });
  }, [session, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err.message ?? "Erro ao autenticar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-muted/40 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg">
        <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground">← Voltar ao site</Link>
        <h1 className="mt-4 text-2xl font-display font-bold">Entrar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acesse a área administrativa. O acesso é restrito a administradores autorizados.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-gradient-orange px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Aguarde…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
