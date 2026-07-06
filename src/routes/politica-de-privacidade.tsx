import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Complexo Valen" },
      { name: "description", content: "Saiba como o Complexo Valen coleta, utiliza, armazena e protege dados pessoais dos usuários deste site." },
      { property: "og:title", content: "Política de Privacidade — Complexo Valen" },
      { property: "og:description", content: "Saiba como o Complexo Valen coleta, utiliza, armazena e protege dados pessoais dos usuários deste site." },
    ],
  }),
  component: PoliticaDePrivacidade,
});

function PoliticaDePrivacidade() {
  return (
    <>
      <PageHero eyebrow="Privacidade" title="Política de Privacidade" subtitle="Como tratamos seus dados no site do Complexo Valen." />

      <section className="py-20 bg-background">
        <div className="container-valen max-w-4xl">
          <article className="prose-valen space-y-6 text-foreground/90 leading-relaxed">
            <p className="text-sm text-muted-foreground">Última atualização: [inserir data]</p>

            <p>
              O Complexo Valen valoriza a privacidade e a segurança das informações de seus usuários, clientes, parceiros, candidatos e visitantes. Esta Política de Privacidade explica de forma simples como podemos coletar, utilizar, armazenar e proteger dados pessoais fornecidos por meio deste site.
            </p>
            <p>Ao acessar ou utilizar este site, você declara estar ciente das práticas descritas nesta Política.</p>

            <Section title="1. Quem somos">
              <p>Este site pertence ao Complexo Valen, uma empresa do Grupo Marinho & Moura, localizado em São Luís/MA, que reúne serviços, conveniência, experiências e estrutura para caminhoneiros, empresas, viajantes e pessoas em movimento.</p>
            </Section>

            <Section title="2. Quais dados podemos coletar">
              <p>Podemos coletar dados pessoais quando você utiliza formulários, acessa páginas, interage com conteúdos ou entra em contato conosco.</p>
              <p>Os dados podem incluir:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>nome</li>
                <li>e-mail</li>
                <li>telefone/WhatsApp</li>
                <li>empresa, quando informado</li>
                <li>área de interesse</li>
                <li>mensagem enviada em formulários</li>
                <li>informações de navegação, como páginas acessadas, data, hora, endereço IP, tipo de dispositivo e navegador</li>
                <li>dados fornecidos voluntariamente em cadastros, contatos, newsletter, promoções ou solicitações</li>
              </ul>
              <p>Não solicitamos dados sensíveis pelo site, salvo quando estritamente necessário e informado de forma clara.</p>
            </Section>

            <Section title="3. Como usamos seus dados">
              <p>Os dados coletados podem ser utilizados para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>responder solicitações enviadas pelo site</li>
                <li>facilitar contato comercial ou institucional</li>
                <li>enviar informações sobre serviços, promoções, novidades e conteúdos do Valen, quando autorizado</li>
                <li>melhorar a experiência de navegação</li>
                <li>analisar desempenho do site</li>
                <li>divulgar campanhas, eventos e ações do Complexo Valen</li>
                <li>direcionar candidatos para a plataforma oficial de talentos</li>
                <li>cumprir obrigações legais ou regulatórias</li>
                <li>proteger direitos, segurança e interesses do Valen, de seus usuários e de terceiros</li>
              </ul>
            </Section>

            <Section title="4. Base legal para tratamento dos dados">
              <p>O tratamento de dados pessoais poderá ocorrer conforme as bases legais previstas na Lei Geral de Proteção de Dados, incluindo consentimento, execução de contrato ou procedimentos preliminares, cumprimento de obrigação legal ou regulatória, legítimo interesse e exercício regular de direitos.</p>
            </Section>

            <Section title="5. Compartilhamento de dados">
              <p>O Valen poderá compartilhar dados pessoais com fornecedores, plataformas e parceiros necessários para a operação do site e prestação dos serviços, como:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>plataformas de hospedagem</li>
                <li>ferramentas de análise de navegação</li>
                <li>sistemas de formulário e atendimento</li>
                <li>plataformas de envio de comunicação</li>
                <li>plataforma oficial de talentos</li>
                <li>prestadores de serviços técnicos e administrativos</li>
              </ul>
              <p>O compartilhamento ocorrerá apenas quando necessário e de acordo com finalidades legítimas.</p>
            </Section>

            <Section title="6. Plataforma de talentos">
              <p>O cadastro de currículos e candidaturas para vagas do Valen é realizado por meio de plataforma externa oficial.</p>
              <p>
                Ao clicar em links de Trabalhe Conosco, o usuário será direcionado para:{" "}
                <a href="https://complexovalen.portaldetalentos.senior.com.br/jobs" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  complexovalen.portaldetalentos.senior.com.br/jobs
                </a>
              </p>
              <p>O tratamento de dados realizado nessa plataforma também poderá seguir os termos e políticas próprios do fornecedor responsável.</p>
            </Section>

            <Section title="7. Cookies e tecnologias semelhantes">
              <p>Este site pode utilizar cookies e tecnologias semelhantes para melhorar a experiência de navegação, entender como os usuários interagem com o site, medir desempenho e personalizar conteúdos.</p>
              <p>O usuário pode gerenciar cookies diretamente nas configurações do navegador.</p>
              <p>Caso o site utilize ferramentas como Google Analytics, Meta Pixel ou outras tecnologias de rastreamento, adicionar aviso de cookies e opção de gerenciamento de consentimento.</p>
            </Section>

            <Section title="8. Armazenamento e segurança">
              <p>Adotamos medidas técnicas e organizacionais razoáveis para proteger os dados pessoais contra acessos não autorizados, perda, alteração, divulgação ou uso indevido.</p>
              <p>Os dados serão mantidos pelo tempo necessário para cumprir as finalidades descritas nesta Política, obrigações legais ou defesa de direitos.</p>
            </Section>

            <Section title="9. Direitos dos titulares">
              <p>Nos termos da LGPD, o titular dos dados pode solicitar:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>confirmação da existência de tratamento</li>
                <li>acesso aos dados</li>
                <li>correção de dados incompletos, inexatos ou desatualizados</li>
                <li>anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade</li>
                <li>portabilidade, quando aplicável</li>
                <li>informação sobre compartilhamento</li>
                <li>revogação do consentimento, quando aplicável</li>
                <li>exclusão de dados tratados com base no consentimento, respeitadas obrigações legais</li>
              </ul>
            </Section>

            <Section title="10. Como entrar em contato">
              <p>Para dúvidas, solicitações ou exercício de direitos relacionados à privacidade e proteção de dados, entre em contato pelo canal oficial:</p>
              <p>E-mail: [inserir e-mail oficial de contato/LGPD]</p>
              <p>Telefone/WhatsApp: [inserir contato]</p>
            </Section>

            <Section title="11. Alterações nesta Política">
              <p>Esta Política de Privacidade poderá ser atualizada a qualquer momento para refletir melhorias, mudanças legais ou alterações nos serviços do Valen. A versão mais recente estará sempre disponível neste site.</p>
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
