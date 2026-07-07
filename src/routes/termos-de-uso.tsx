import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Complexo Valen" },
      { name: "description", content: "Termos e condições para uso do site do Complexo Valen." },
      { property: "og:title", content: "Termos de Uso — Complexo Valen" },
      { property: "og:description", content: "Termos e condições para uso do site do Complexo Valen." },
    ],
  }),
  component: TermosDeUso,
});

function TermosDeUso() {
  return (
    <>
      <PageHero eyebrow="Termos" title="Termos de Uso" subtitle="Condições para navegação e uso do site do Complexo Valen." />

      <section className="py-20 bg-background">
        <div className="container-valen max-w-4xl">
          <article className="space-y-6 text-foreground/90 leading-relaxed">
            <p className="text-sm text-muted-foreground">Última atualização: 06.07.2026</p>

            <p>Bem-vindo ao site do Complexo Valen. Ao acessar ou utilizar este site, você concorda com estes Termos de Uso. Caso não concorde com alguma condição, recomendamos que não utilize o site.</p>

            <Section title="1. Objetivo do site">
              <p>Este site tem como objetivo apresentar informações institucionais, serviços, lojas, promoções, experiências, conteúdos do Blog do Caminhoneiro, canais de contato e informações sobre o Complexo Valen.</p>
            </Section>

            <Section title="2. Uso permitido">
              <p>O usuário se compromete a utilizar o site de forma adequada, ética e em conformidade com a legislação vigente.</p>
              <p>Não é permitido:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>utilizar o site para fins ilegais</li>
                <li>tentar acessar áreas restritas sem autorização</li>
                <li>inserir informações falsas em formulários</li>
                <li>comprometer a segurança, funcionamento ou integridade do site</li>
                <li>copiar, reproduzir ou utilizar indevidamente conteúdos, imagens, marcas ou materiais do Valen sem autorização</li>
              </ul>
            </Section>

            <Section title="3. Conteúdos e informações">
              <p>O Valen busca manter as informações do site atualizadas e corretas, mas não garante que todo o conteúdo esteja livre de erros, desatualizações ou indisponibilidades temporárias.</p>
              <p>Informações sobre promoções, serviços, horários, lojas e experiências podem ser alteradas sem aviso prévio.</p>
            </Section>

            <Section title="4. Promoções e campanhas">
              <p>As promoções divulgadas no site poderão ter regras, prazos, condições e regulamentos próprios.</p>
              <p>A participação em campanhas depende da observância das condições específicas informadas em cada promoção.</p>
            </Section>

            <Section title="5. Links externos">
              <p>O site pode conter links para páginas externas, como redes sociais, mapas, plataformas de talentos, parceiros, ferramentas de atendimento ou outros serviços.</p>
              <p>O Valen não se responsabiliza pelo conteúdo, políticas ou práticas de sites de terceiros.</p>
            </Section>

            <Section title="6. Trabalhe Conosco">
              <p>
                O cadastro de currículos e candidaturas é realizado por meio da plataforma oficial de talentos:{" "}
                <a href="https://complexovalen.portaldetalentos.senior.com.br/jobs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  complexovalen.portaldetalentos.senior.com.br/jobs
                </a>
              </p>
              <p>O Valen não solicita pagamentos, taxas ou dados bancários para participação em processos seletivos por meio deste site.</p>
            </Section>

            <Section title="7. Propriedade intelectual">
              <p>Todos os conteúdos presentes neste site, incluindo textos, imagens, marcas, logos, ícones, personagens, layouts, vídeos e elementos visuais, pertencem ao Valen ou são utilizados mediante autorização.</p>
              <p>É proibida a reprodução, distribuição, alteração ou uso comercial sem autorização prévia.</p>
            </Section>

            <Section title="8. Disponibilidade do site">
              <p>O Valen poderá suspender, modificar ou interromper o site, total ou parcialmente, a qualquer momento, por motivos técnicos, operacionais, estratégicos ou de segurança.</p>
            </Section>

            <Section title="9. Privacidade">
              <p>O tratamento de dados pessoais realizado por meio deste site seguirá a Política de Privacidade disponível neste mesmo site.</p>
            </Section>

            <Section title="10. Responsabilidades do usuário">
              <p>O usuário é responsável pelas informações que fornecer no site e pelo uso adequado das funcionalidades disponíveis.</p>
            </Section>

            <Section title="11. Alterações dos Termos">
              <p>Estes Termos de Uso poderão ser atualizados a qualquer momento. A versão mais recente estará sempre disponível neste site.</p>
            </Section>

            <Section title="12. Contato">
              <p>Para dúvidas sobre estes Termos de Uso, entre em contato:</p>
              <p>E-mail: marketing@redevalen.com</p>
              <p>Telefone/WhatsApp: +55 (98) 98445-8884</p>
            </Section>
          </article>
        </div>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-display font-bold text-secondary">{title}</h2>
      <div className="space-y-3 text-foreground/85">{children}</div>
    </div>
  );
}
