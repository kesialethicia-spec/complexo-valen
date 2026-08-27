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
  | "/admin/servicos"
  | "/admin/mercados"
  | "/admin/videos"
  | "/admin/pagina-home"
  | "/admin/pagina-o-valen"
  | "/admin/pagina-hotel"
  | "/admin/pagina-valenlog"
  | "/admin/pagina-valenben"
  | "/admin/pagina-valenlub"
  | "/admin/pagina-experiencias"
  | "/admin/pagina-posto"
  | "/admin/clube-valen";

const cards: { title: string; desc: string; to: AdminLink; cta: string }[] = [
  { title: "Clube Valen Fidelidade", desc: "Gerencie benefícios, brindes, combos, imagens e valores de pontos.", to: "/admin/clube-valen", cta: "Gerenciar Clube" },
  { title: "Blog do Caminhoneiro", desc: "Crie, edite e publique artigos do blog do Valen.", to: "/admin/blog", cta: "Gerenciar artigos" },
  { title: "Promoções", desc: "Cadastre e gerencie as promoções exibidas no site.", to: "/admin/promocoes", cta: "Gerenciar promoções" },
  { title: "Serviços", desc: "Gerencie os cards da página /servicos: nome, imagem, tags, ordem e publicação.", to: "/admin/servicos", cta: "Gerenciar serviços" },
  { title: "Mercados", desc: "Gerencie os mercados exibidos na página /servicos/mercado: nome, descrição, localização, imagem e ordem.", to: "/admin/mercados", cta: "Gerenciar mercados" },
  { title: "Lojas do Complexo", desc: "Gerencie as lojas, serviços e operações presentes no Complexo Valen.", to: "/admin/lojas", cta: "Gerenciar lojas" },
  { title: "Vídeos", desc: "Cadastre vídeos do YouTube para a seção “Vídeos para quem vive na estrada”.", to: "/admin/videos", cta: "Gerenciar vídeos" },
  { title: "Página Home", desc: "Personalize a imagem de fundo da hero principal do site.", to: "/admin/pagina-home", cta: "Editar página Home" },
  { title: "Página O Valen", desc: "Gerencie imagens da página institucional 'O Valen', linha do tempo, galeria e Instagram.", to: "/admin/pagina-o-valen", cta: "Editar página O Valen" },
  { title: "Página Posto Valen", desc: "Atualize imagens, logo e formas de pagamento da página do Posto Valen.", to: "/admin/pagina-posto", cta: "Editar página do Posto" },
  { title: "Página ValenBen", desc: "Gerencie imagens e links da página ValenBen Super Troca de Óleo.", to: "/admin/pagina-valenben", cta: "Editar página ValenBen" },
  { title: "Página ValenLub", desc: "Gerencie imagens, logos das marcas e links da página ValenLub.", to: "/admin/pagina-valenlub", cta: "Editar página ValenLub" },
  { title: "Página Valen Porto Hotel", desc: "Atualize imagens, logo e links de reserva exibidos na página do hotel.", to: "/admin/pagina-hotel", cta: "Editar página do hotel" },
  { title: "Página ValenLog", desc: "Gerencie imagens da página do ValenLog e do Espaço Valentina.", to: "/admin/pagina-valenlog", cta: "Editar página do ValenLog" },
  { title: "Página Experiências", desc: "Gerencie imagens, vídeos do Instagram/YouTube e eventos exibidos na página Experiências.", to: "/admin/pagina-experiencias", cta: "Editar página Experiências" },
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
