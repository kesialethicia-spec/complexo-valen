import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/PageHero";
import { Search, MapPin, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/lojas")({
  head: () => ({ meta: [{ title: "Lojas — Complexo Valen" }, { name: "description", content: "Lojas, serviços e conveniência no Complexo Valen. Encontre o que precisa sem sair da sua rota." }] }),
  component: Lojas,
});

const categorias = ["Todas", "Alimentação", "Serviços", "Autopeças", "Saúde", "Conveniência", "Financeiro", "Escritórios", "Outros"];

interface Loja {
  nome: string;
  categoria: string;
  desc: string;
  horario: string;
  contato: string;
  local: string;
}

const lojas: Loja[] = [
  { nome: "Restaurante Valen", categoria: "Alimentação", desc: "Pratos caseiros e self-service todos os dias.", horario: "06h às 22h", contato: "(98) 0000-0000", local: "Bloco A" },
  { nome: "Lanchonete Movimento", categoria: "Alimentação", desc: "Lanches rápidos, cafés especiais e sucos.", horario: "24h", contato: "(98) 0000-0001", local: "Bloco A" },
  { nome: "Conveniência Valen", categoria: "Conveniência", desc: "Tudo para a sua jornada em um só lugar.", horario: "24h", contato: "(98) 0000-0002", local: "Posto" },
  { nome: "AutoPeças Rota", categoria: "Autopeças", desc: "Peças, acessórios e produtos automotivos.", horario: "08h às 18h", contato: "(98) 0000-0003", local: "Truck Center" },
  { nome: "Farmácia Estrada", categoria: "Saúde", desc: "Remédios e itens de cuidado pessoal.", horario: "07h às 22h", contato: "(98) 0000-0004", local: "Galeria" },
  { nome: "Lotérica Valen", categoria: "Financeiro", desc: "Apostas, recebimentos e pagamentos.", horario: "08h às 20h", contato: "(98) 0000-0005", local: "Galeria" },
  { nome: "Barbearia em Movimento", categoria: "Serviços", desc: "Cuidado pessoal para seguir em rota.", horario: "08h às 19h", contato: "(98) 0000-0006", local: "Clube" },
  { nome: "Escritório Logística+", categoria: "Escritórios", desc: "Apoio operacional para empresas.", horario: "08h às 18h", contato: "(98) 0000-0007", local: "Bloco B" },
  { nome: "Lavanderia Rota Limpa", categoria: "Serviços", desc: "Lavanderia para quem está em viagem.", horario: "07h às 21h", contato: "(98) 0000-0008", local: "Clube" },
];

function Lojas() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");

  const filtradas = useMemo(() => {
    return lojas.filter((l) =>
      (cat === "Todas" || l.categoria === cat) &&
      (q === "" || l.nome.toLowerCase().includes(q.toLowerCase()))
    );
  }, [q, cat]);

  return (
    <>
      <PageHero
        eyebrow="Lojas"
        title="Lojas, serviços e conveniência para facilitar sua rotina"
        subtitle="Encontre no Valen opções para resolver o que precisa sem sair da sua rota."
      />

      <section className="py-12 bg-background sticky top-[72px] z-30">
        <div className="container-valen">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar loja por nome..."
              className="w-full rounded-full border border-border bg-card pl-12 pr-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {categorias.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  cat === c ? "bg-secondary text-secondary-foreground" : "bg-surface text-muted-foreground hover:bg-surface/80"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 bg-background">
        <div className="container-valen">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtradas.map((l) => (
              <article key={l.nome} className="rounded-3xl bg-card border border-border p-6 hover:border-primary/50 hover:-translate-y-1 transition-all">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{l.categoria}</span>
                <h3 className="mt-2 text-xl font-display font-bold text-secondary">{l.nome}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{l.desc}</p>
                <div className="mt-4 space-y-1.5 text-sm">
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {l.horario}</p>
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {l.contato}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {l.local}</p>
                </div>
                <a href={`https://wa.me/?text=Olá! Vi a ${l.nome} no Valen.`} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-gradient-orange px-5 py-2.5 text-sm font-bold text-primary-foreground">
                  WhatsApp
                </a>
              </article>
            ))}
            {filtradas.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-12">Nenhuma loja encontrada.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
