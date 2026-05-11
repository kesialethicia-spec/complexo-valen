import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { Users, Briefcase, Heart, TrendingUp, Upload, Send } from "lucide-react";

export const Route = createFileRoute("/trabalhe-conosco")({
  head: () => ({ meta: [{ title: "Trabalhe Conosco — Complexo Valen" }, { name: "description", content: "Faça parte de um time em movimento. Conheça oportunidades de carreira no Complexo Valen." }] }),
  component: Trabalhe,
});

function Trabalhe() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero eyebrow="Trabalhe Conosco" title="Faça parte de um time em movimento" subtitle="No Valen, somos movidos por pessoas. Buscamos talentos que queiram crescer, aprender e fazer parte de um ambiente dinâmico e cheio de oportunidades." />

      <section className="py-24 bg-background">
        <div className="container-valen grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Heart, t: "Cultura humana", d: "Pessoas no centro de tudo." },
            { icon: TrendingUp, t: "Crescimento", d: "Espaço para evoluir profissionalmente." },
            { icon: Users, t: "Time diverso", d: "Diferentes áreas conectadas." },
            { icon: Briefcase, t: "Oportunidades", d: "Vagas em diversos setores." },
          ].map((b) => (
            <div key={b.t} className="rounded-3xl bg-card border border-border p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-orange text-white shadow-glow"><b.icon className="h-6 w-6" /></div>
              <h3 className="mt-5 text-lg font-display font-bold text-secondary">{b.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="container-valen">
          <SectionHeader eyebrow="Áreas" title="Áreas de atuação" />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {["Atendimento", "Operações", "Administrativo", "Comercial", "Marketing", "Hotelaria", "Serviços", "Manutenção"].map((a) => (
              <div key={a} className="rounded-2xl bg-card border border-border p-5 text-center font-semibold text-secondary hover:border-primary/50 transition-colors">{a}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container-valen max-w-2xl">
          <SectionHeader eyebrow="Currículo" title="Envie seu currículo" />
          {sent ? (
            <div className="mt-10 rounded-3xl bg-primary/10 border border-primary/30 p-8 text-center">
              <h3 className="text-2xl font-display font-bold text-secondary">Currículo recebido!</h3>
              <p className="mt-2 text-muted-foreground">Em breve nossa equipe entrará em contato.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-10 space-y-4">
              {[
                { l: "Nome completo", t: "text" },
                { l: "E-mail", t: "email" },
                { l: "Telefone", t: "tel" },
              ].map((f) => (
                <div key={f.l}>
                  <label className="text-sm font-semibold text-secondary">{f.l}</label>
                  <input required type={f.t} className="mt-1.5 w-full rounded-2xl border border-border bg-card px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              ))}
              <div>
                <label className="text-sm font-semibold text-secondary">Área de interesse</label>
                <select required className="mt-1.5 w-full rounded-2xl border border-border bg-card px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary">
                  {["Selecione", "Atendimento", "Operações", "Administrativo", "Comercial", "Marketing", "Hotelaria", "Serviços", "Manutenção"].map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-secondary">Mensagem</label>
                <textarea rows={4} className="mt-1.5 w-full rounded-2xl border border-border bg-card px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <label className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-surface px-4 py-6 cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Upload de currículo (PDF)</span>
                <input type="file" accept=".pdf,.doc,.docx" className="sr-only" />
              </label>
              <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-orange px-7 py-4 text-base font-bold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform">
                <Send className="h-4 w-4" /> Enviar currículo
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
