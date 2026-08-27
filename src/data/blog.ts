
export type Category =
  | "Dicas da Estrada"
  | "Manutenção Preventiva"
  | "Segurança"
  | "Alimentação e Bem-estar"
  | "Economia de Diesel"
  | "Cuidados com o Caminhão"
  | "Experiências Valen"
  | "Promoções"
  | "Notícias do Complexo";

export const categories: Category[] = [
  "Dicas da Estrada",
  "Manutenção Preventiva",
  "Segurança",
  "Alimentação e Bem-estar",
  "Economia de Diesel",
  "Cuidados com o Caminhão",
  "Experiências Valen",
  "Promoções",
  "Notícias do Complexo",
];

export type CTAType = "manutencao" | "alimentacao" | "descanso";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  cover: string;
  author: string;
  publishedAt: string; // "10 Mai 2026"
  readingTime: string; // "5 min"
  featured?: boolean;
  mainFeatured?: boolean;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  content: string; // HTML
  cta?: CTAType;
}

const ctaManutencao = `
<aside class="article-cta" data-variant="manutencao">
  <h4>Seu caminhão precisa seguir em movimento?</h4>
  <p>Conheça os serviços do Truck Center Valen e cuide da sua jornada com mais segurança.</p>
  <a href="/servicos/truck-center">Conhecer Truck Center →</a>
</aside>`;

const ctaAlimentacao = `
<aside class="article-cta" data-variant="alimentacao">
  <h4>Faça uma parada para comer bem</h4>
  <p>No Valen, você encontra opções de alimentação para recuperar as energias e seguir viagem.</p>
  <a href="/servicos/alimentacao">Conhecer alimentação →</a>
</aside>`;

const ctaDescanso = `
<aside class="article-cta" data-variant="descanso">
  <h4>Descanse com estrutura e segurança</h4>
  <p>O Valen oferece uma parada completa para quem precisa recuperar as energias na estrada.</p>
  <a href="https://maps.google.com/?q=Complexo+Valen+São+Luís+MA" target="_blank" rel="noreferrer">Como chegar →</a>
</aside>`;

export const posts: Post[] = [
  {
    slug: "5-cuidados-antes-de-pegar-a-estrada",
    title: "5 cuidados antes de pegar a estrada",
    excerpt:
      "Um checklist essencial para começar a viagem com mais segurança, economia e tranquilidade.",
    category: "Dicas da Estrada",
    cover: "",
    author: "Equipe Valen",
    publishedAt: "10 Mai 2026",
    readingTime: "5 min",
    mainFeatured: true,
    featured: true,
    tags: ["checklist", "viagem", "segurança"],
    metaTitle: "5 cuidados antes de pegar a estrada — Blog do Caminhoneiro Valen",
    metaDescription:
      "Confira 5 cuidados essenciais antes de iniciar uma viagem de caminhão: pneus, freios, óleo, documentação e descanso.",
    cta: "manutencao",
    content: `
<p>A vida na estrada é feita de movimento — e cada quilômetro percorrido começa muito antes de ligar o motor. Preparar o caminhão e o motorista para a jornada é o que separa uma viagem tranquila de uma parada inesperada.</p>
<h2>1. Cheque pneus e calibragem</h2>
<p>Pneus mal calibrados consomem mais diesel e aumentam o risco de acidentes. Antes de pegar a estrada, confira a pressão de todos os pneus, inclusive o estepe, e verifique se há sinais de desgaste irregular.</p>
<h2>2. Verifique freios e suspensão</h2>
<p>Freios são o item número um quando o assunto é segurança. Faça uma inspeção visual, observe vazamentos e teste o sistema antes de sair. A suspensão também merece atenção: ela influencia conforto, estabilidade e consumo.</p>
${ctaManutencao}
<h2>3. Confira óleo, água e filtros</h2>
<ul>
  <li>Nível de óleo do motor</li>
  <li>Líquido de arrefecimento</li>
  <li>Filtros de ar e combustível</li>
</ul>
<h2>4. Organize documentos e rota</h2>
<p>CNH, CRLV, ANTT e seguros em dia evitam dores de cabeça. Planeje paradas estratégicas em pontos seguros — como o Complexo Valen — e revise a rota antes de sair.</p>
<h2>5. Cuide do motorista</h2>
<p>Descanso, hidratação e alimentação adequada são tão importantes quanto a manutenção do veículo. Quem move o Brasil precisa estar bem.</p>
`,
  },
  {
    slug: "como-economizar-diesel-na-rotina",
    title: "Como economizar diesel na rotina",
    excerpt: "Práticas simples que reduzem o consumo de combustível e aumentam a margem da sua operação.",
    category: "Economia de Diesel",
    cover: "",
    author: "Equipe Valen",
    publishedAt: "02 Mai 2026",
    readingTime: "4 min",
    featured: true,
    tags: ["diesel", "economia", "operação"],
    cta: "manutencao",
    content: `
<p>Diesel representa boa parte do custo da operação. Pequenas mudanças na rotina podem gerar grande impacto no bolso ao final do mês.</p>
<h2>Dirija em rotações econômicas</h2>
<p>Manter o motor em faixas de torque eficientes reduz significativamente o consumo. Evite acelerações bruscas e antecipe frenagens.</p>
<h2>Manutenção em dia</h2>
<p>Filtros limpos, injeção eletrônica calibrada e pneus alinhados podem reduzir o consumo em até 10%.</p>
${ctaManutencao}
<h2>Planeje paradas inteligentes</h2>
<p>Abasteça em postos confiáveis e com preço justo. No Posto Valen, você encontra diesel de qualidade e estrutura completa.</p>
`,
  },
  {
    slug: "por-que-fazer-manutencao-preventiva",
    title: "Por que fazer manutenção preventiva no caminhão?",
    excerpt: "Evite paradas inesperadas e mantenha sua rota fluindo com manutenção planejada.",
    category: "Manutenção Preventiva",
    cover: "",
    author: "Equipe Valen",
    publishedAt: "25 Abr 2026",
    readingTime: "6 min",
    featured: true,
    tags: ["manutenção", "preventiva", "truck center"],
    cta: "manutencao",
    content: `
<p>Manutenção preventiva é investimento, não custo. Quem entende disso, fatura mais e roda mais tranquilo.</p>
<h2>O que é manutenção preventiva?</h2>
<p>É um plano programado de revisões periódicas que antecipa problemas antes que eles parem seu caminhão na estrada.</p>
<h3>Principais itens</h3>
<ul>
  <li>Troca de óleo e filtros</li>
  <li>Revisão do sistema de freios</li>
  <li>Alinhamento e balanceamento</li>
  <li>Checagem elétrica e da bateria</li>
</ul>
${ctaManutencao}
<h2>Quando fazer?</h2>
<p>O ideal é seguir o manual do fabricante e adaptar à intensidade da sua operação. Em rotas pesadas, intervalos mais curtos são recomendados.</p>
`,
  },
  {
    slug: "alimentacao-na-estrada-boas-escolhas",
    title: "Alimentação na estrada: como fazer boas escolhas",
    excerpt: "Equilíbrio em movimento: dicas para se alimentar bem mesmo viajando.",
    category: "Alimentação e Bem-estar",
    cover: "",
    author: "Equipe Valen",
    publishedAt: "18 Abr 2026",
    readingTime: "4 min",
    featured: true,
    tags: ["alimentação", "saúde", "bem-estar"],
    cta: "alimentacao",
    content: `
<p>A rotina do caminhoneiro pede praticidade, mas isso não significa abrir mão da qualidade. Comer bem na estrada é uma escolha possível.</p>
<h2>Prefira refeições equilibradas</h2>
<p>Inclua proteínas, carboidratos complexos e vegetais. Evite excessos de fritura e alimentos muito açucarados antes de longas horas ao volante.</p>
${ctaAlimentacao}
<h2>Hidrate-se sempre</h2>
<p>Água é combustível para o motorista. Mantenha sempre uma garrafa por perto e evite refrigerantes em excesso.</p>
`,
  },
  {
    slug: "onde-descansar-com-seguranca-em-sao-luis",
    title: "Onde descansar com segurança em São Luís",
    excerpt: "Pontos de apoio para uma parada tranquila no Maranhão.",
    category: "Segurança",
    cover: "",
    author: "Equipe Valen",
    publishedAt: "10 Abr 2026",
    readingTime: "3 min",
    tags: ["descanso", "segurança", "são luís"],
    cta: "descanso",
    content: `
<p>Descansar bem é parte da operação. Em São Luís, o Complexo Valen oferece estrutura completa para quem precisa parar com segurança.</p>
<h2>Pátio monitorado 24h</h2>
<p>Estacionamento amplo, iluminado e com câmeras em todos os pontos. Sua carga e seu caminhão protegidos enquanto você descansa.</p>
${ctaDescanso}
<h2>Hotel e Clube do Caminhoneiro</h2>
<p>Quartos confortáveis, banhos quentes e área de convivência. Tudo pensado para você recuperar as energias.</p>
`,
  },
  {
    slug: "clube-do-caminhoneiro-cuidado-quem-vive-estrada",
    title: "Clube do Caminhoneiro: cuidado para quem vive na estrada",
    excerpt: "Conheça o espaço pensado para o bem-estar de quem move o Brasil.",
    category: "Experiências Valen",
    cover: "",
    author: "Equipe Valen",
    publishedAt: "02 Abr 2026",
    readingTime: "4 min",
    tags: ["clube", "experiências", "bem-estar"],
    cta: "descanso",
    content: `
<p>O Clube do Caminhoneiro Valen é mais do que um espaço de descanso — é um lugar de pertencimento.</p>
<h2>Estrutura completa</h2>
<p>Banhos quentes, lavanderia, sala de TV, área de convivência e Wi-Fi gratuito. Tudo pensado para quem passa a maior parte do tempo na estrada.</p>
${ctaDescanso}
<p>Venha conhecer e faça do Valen sua parada preferida em São Luís.</p>
`,
  },
  {
    slug: "festa-do-caminhoneiro-tradicao-em-movimento",
    title: "Festa do Caminhoneiro: uma tradição em movimento",
    excerpt: "A celebração que homenageia quem move o Brasil.",
    category: "Experiências Valen",
    cover: "",
    author: "Equipe Valen",
    publishedAt: "25 Mar 2026",
    readingTime: "5 min",
    tags: ["festa", "tradição", "caminhoneiro"],
    content: `
<p>Todo ano, o Complexo Valen abre as portas para celebrar quem move o Brasil: a Festa do Caminhoneiro.</p>
<h2>Música, comida e gratidão</h2>
<p>Shows, sorteios, refeições especiais e muita confraternização. Uma data para reconhecer a importância desse profissional.</p>
<h2>Faça parte</h2>
<p>Fique atento ao nosso blog e redes sociais para saber a próxima edição.</p>
`,
  },
  {
    slug: "como-escolher-parada-segura-caminhao",
    title: "Como escolher uma parada segura para seu caminhão",
    excerpt: "Critérios que separam um ponto qualquer de uma parada de verdade.",
    category: "Segurança",
    cover: "",
    author: "Equipe Valen",
    publishedAt: "18 Mar 2026",
    readingTime: "4 min",
    tags: ["segurança", "parada", "estacionamento"],
    cta: "descanso",
    content: `
<p>Nem toda parada é uma boa parada. Saber escolher onde estacionar pode evitar prejuízos, transtornos e até riscos à integridade do motorista.</p>
<h2>Itens essenciais</h2>
<ul>
  <li>Iluminação adequada</li>
  <li>Câmeras de monitoramento</li>
  <li>Acesso facilitado</li>
  <li>Estrutura de apoio (banho, alimentação, descanso)</li>
</ul>
${ctaDescanso}
`,
  },
];

export interface Video {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
  description: string;
  featured?: boolean;
}

export const videos: Video[] = [
  {
    id: "v1",
    title: "Por dentro do Complexo Valen",
    category: "Notícias do Complexo",
    youtubeId: "dQw4w9WgXcQ",
    description: "Conheça a estrutura completa do Valen em São Luís.",
    featured: true,
  },
  {
    id: "v2",
    title: "Checklist do caminhoneiro",
    category: "Dicas da Estrada",
    youtubeId: "dQw4w9WgXcQ",
    description: "5 itens que você precisa conferir antes de cada viagem.",
  },
  {
    id: "v3",
    title: "Como economizar diesel",
    category: "Economia de Diesel",
    youtubeId: "dQw4w9WgXcQ",
    description: "Práticas que reduzem o consumo na sua operação.",
  },
];

export interface BlogPromotion {
  id: string;
  title: string;
  category: string;
  image: string;
  shortDescription: string;
  validity: string;
  link: string;
}

export const blogPromotions: BlogPromotion[] = [
  {
    id: "p1",
    title: "Diesel com preço especial",
    category: "Posto",
    image: "",
    shortDescription: "Condições exclusivas para abastecimento.",
    validity: "Até 31/12",
    link: "/promocoes",
  },
  {
    id: "p2",
    title: "Voucher na Conveniência",
    category: "Conveniência",
    image: "",
    shortDescription: "Abasteça e participe de campanhas especiais.",
    validity: "Campanha ativa",
    link: "/promocoes",
  },
  {
    id: "p3",
    title: "Troca de óleo em promoção",
    category: "Truck Center",
    image: "",
    shortDescription: "Manutenção preventiva com condições especiais.",
    validity: "Até esgotar",
    link: "/promocoes",
  },
  {
    id: "p4",
    title: "Sexta Valen",
    category: "Eventos",
    image: "",
    shortDescription: "Música, promoções e relacionamento.",
    validity: "Toda sexta",
    link: "/experiencias",
  },
];

export interface Banner {
  id: string;
  placement: "blog-mid" | "article-end";
  title: string;
  text: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export const banners: Banner[] = [
  {
    id: "b1",
    placement: "blog-mid",
    title: "App ValenLog",
    text: "Acompanhe sua operação com mais praticidade, agilidade e controle.",
    image: "",
    buttonText: "Conhecer o app",
    buttonLink: "#",
  },
  {
    id: "b2",
    placement: "article-end",
    title: "Sua próxima parada é no Valen",
    text: "Diesel, descanso, alimentação, manutenção e segurança em um só lugar.",
    image: "",
    buttonText: "Como chegar",
    buttonLink: "https://maps.google.com/?q=Complexo+Valen+São+Luís+MA",
  },
];
