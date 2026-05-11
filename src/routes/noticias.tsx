import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { ArrowRight } from "lucide-react";
import postoImg from "@/assets/posto.jpg";
import truckImg from "@/assets/truck-center.jpg";
import foodImg from "@/assets/alimentacao.jpg";
import parkImg from "@/assets/estacionamento.jpg";
import festaImg from "@/assets/festa.jpg";
import hotelImg from "@/assets/hotel.jpg";

export const Route = createFileRoute("/noticias")({
  head: () => ({ meta: [{ title: "Notícias — Complexo Valen" }, { name: "description", content: "Notícias, dicas, campanhas e novidades do Complexo Valen." }] }),
  component: Noticias,
});

const cats = ["Todas", "Notícias do Valen", "Dicas para caminhoneiros", "Manutenção", "Segurança", "Bem-estar", "Eventos", "Promoções"];

const posts = [
  { cat: "Dicas para caminhoneiros", date: "10 Mai 2026", title: "5 cuidados antes de pegar a estrada", img: postoImg, resumo: "Confira um checklist essencial para começar a viagem com segurança." },
  { cat: "Dicas para caminhoneiros", date: "02 Mai 2026", title: "Como economizar diesel na rotina", img: truckImg, resumo: "Práticas simples que reduzem o consumo no dia a dia." },
  { cat: "Segurança", date: "28 Abr 2026", title: "Onde descansar com segurança em São Luís", img: parkImg, resumo: "Pontos de apoio para uma parada tranquila." },
  { cat: "Eventos", date: "20 Abr 2026", title: "Festa do Caminhoneiro: uma tradição em movimento", img: festaImg, resumo: "A celebração que homenageia quem move o Brasil." },
  { cat: "Manutenção", date: "12 Abr 2026", title: "Por que fazer manutenção preventiva no caminhão", img: truckImg, resumo: "Evite paradas inesperadas e mantenha sua rota fluindo." },
  { cat: "Bem-estar", date: "01 Abr 2026", title: "Alimentação na estrada: equilíbrio em movimento", img: foodImg, resumo: "Dicas para se alimentar bem mesmo viajando." },
  { cat: "Notícias do Valen", date: "25 Mar 2026", title: "Novidades do complexo Valen", img: hotelImg, resumo: "O que está chegando ao Valen neste semestre." },
];

function Noticias() {
  return (
    <>
      <PageHero eyebrow="Notícias" title="O que movimenta o Valen" subtitle="Notícias, dicas, campanhas e novidades para quem vive em movimento." />

      <section className="py-12 bg-background">
        <div className="container-valen">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <span key={c} className="rounded-full bg-surface px-4 py-2 text-sm font-semibold text-muted-foreground">{c}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 bg-background">
        <div className="container-valen">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article key={p.title} className="overflow-hidden rounded-3xl bg-card border border-border hover:-translate-y-1 hover:shadow-glow transition-all">
                <div className="h-48 overflow-hidden">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover hover:scale-110 transition-transform duration-700" loading="lazy" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">{p.cat}</span>
                    <span className="text-muted-foreground">{p.date}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-display font-bold text-secondary">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.resumo}</p>
                  <Link to="/noticias" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">Ler mais <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
