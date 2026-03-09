export const standardsData: Record<string, { title: string, summary?: string, details: string }> = {
  // NBR Norms
  "nbr6120": {
    title: "NBR 6120",
    summary: "Cargas para o cálculo de estruturas de edificações.",
    details: "Esta norma estabelece as cargas mínimas a serem consideradas no cálculo de estruturas de edificações, incluindo cargas permanentes (peso próprio) e cargas acidentais (sobrecargas de uso, como pessoas, móveis e veículos). Define valores de sobrecarga para diferentes tipos de ocupação, como residências (1,5 kN/m²), escritórios (2,0 kN/m²) e garagens (3,0 kN/m²)."
  },
  "nbr8800": {
    title: "NBR 8800",
    summary: "Projeto de estruturas de aço e de estruturas mistas de aço e concreto de edifícios.",
    details: "É a principal norma brasileira para o projeto de estruturas de aço. Ela define os critérios e métodos para o dimensionamento à resistência, estabilidade (incluindo flambagem) e estados limites de serviço (como deformações). Cobre todos os aspectos do projeto de vigas, pilares, ligações e outros elementos estruturais."
  },
  "nbr14323": {
    title: "NBR 14323",
    summary: "Dimensionamento de estruturas de aço de edifícios em situação de incêndio.",
    details: "Esta norma complementa a NBR 8800, fornecendo os procedimentos para a verificação da segurança das estruturas de aço quando expostas ao fogo. Define como calcular a redução da resistência e rigidez do aço com o aumento da temperatura e os requisitos para proteção contra incêndio."
  },
    "nbr14762": {
    title: "NBR 14762",
    summary: "Dimensionamento de estruturas de aço constituídas por perfis formados a frio.",
    details: "Esta norma estabelece os requisitos para o projeto e dimensionamento de elementos estruturais compostos por perfis de aço formados a frio, como perfis U, Z e cartolas, que são muito utilizados em sistemas de Light Steel Frame, terças de cobertura e outros sistemas construtivos leves."
  },

  // ASTM Norms
  "astmA213": {
    title: "ASTM A213",
    summary: "Tubos de Aço Liga Ferríticos e Austeníticos para Caldeiras, Superaquecedores e Trocadores de Calor, sem Costura.",
    details: "Esta especificação abrange tubos de aço ferrítico e austenítico sem costura para caldeiras, superaquecedores e trocadores de calor. Os aços são classificados em vários graus, incluindo os populares 304/304L e 316/316L. Os tubos devem ser fabricados pelo processo sem costura e podem ser acabados a quente ou a frio. Requisitos de tratamento térmico, composição química, propriedades de tração e testes (como achatamento, flangeamento e hidrostático) são rigorosamente especificados."
  },
  "astmA249": {
    title: "ASTM A249",
    summary: "Tubos de Aço Austenítico para Caldeiras, Superaquecedores, Trocadores de Calor e Condensadores, com Costura.",
    details: "Especificação para tubos com costura (soldados) de aços austeníticos, destinados ao uso em caldeiras, superaquecedores, trocadores de calor e condensadores. Os tubos são fabricados a partir de tiras de aço laminadas a frio, que são soldadas eletricamente. Após a soldagem, os tubos são geralmente trabalhados a frio e submetidos a um tratamento térmico de recozimento para otimizar as propriedades e a resistência à corrosão."
  },
  "astmA269": {
    title: "ASTM A269",
    summary: "Tubos de Aço Inoxidável Austenítico para Serviços Gerais, com e sem Costura.",
    details: "Esta norma cobre tubos de aço inoxidável austenítico, com ou sem costura, para serviços gerais que exigem resistência à corrosão e ao calor. É uma das normas mais comuns para tubulação de instrumentação e sistemas hidráulicos. Os tubos são adequados para conformação, como flangeamento e dobra. A norma especifica requisitos de composição química, propriedades mecânicas e testes, mas é geralmente menos rigorosa que as normas para vasos de pressão."
  },
  "astmA270": {
    title: "ASTM A270",
    summary: "Tubos de Aço Inoxidável Austenítico Sanitário (Alimentício), com e sem Costura.",
    details: "Especificação para tubos sanitários de aço inoxidável austenítico, com e sem costura, destinados às indústrias de laticínios, alimentos, farmacêutica e biotecnologia. A característica principal é o acabamento superficial interno e externo, que deve ser extremamente liso (baixa rugosidade, medida em Ra) para impedir a contaminação e facilitar a limpeza e esterilização. Os tubos são obrigatoriamente polidos e podem ser fornecidos em condição decapada, passivada ou com polimento mecânico adicional."
  },
  "astmA312": {
    title: "ASTM A312",
    summary: "Tubos de Aço Inoxidável Austenítico para Alta Temperatura e Serviços Corrosivos, com e sem Costura.",
    details: "Esta norma abrange tubos de aço inoxidável austenítico, com e sem costura, destinados a serviços em altas temperaturas e corrosivos em geral. É a principal especificação para tubulações de processo em indústrias químicas, petroquímicas e de papel. Cobre uma ampla gama de tamanhos de tubos, desde 1/8\" até 30\" de diâmetro nominal. Os requisitos de teste são rigorosos, incluindo ensaios não destrutivos e hidrostáticos."
  },
  "astmA358": {
    title: "ASTM A358",
    summary: "Tubos de Aço Inoxidável Austenítico Cromo-Níquel, com Costura por Fusão Elétrica, para Alta Temperatura.",
    details: "Esta norma especifica tubos de aço inoxidável austenítico soldados por fusão elétrica (EFW - Electric Fusion Welded), adequados para serviço corrosivo e/ou de alta temperatura. É comumente usada para tubos de grande diâmetro. A fabricação parte de chapas que são conformadas e soldadas. A norma classifica os tubos em 5 classes, dependendo do tipo de solda, tratamento térmico e se a solda foi radiografada."
  },
  "astmA554": {
    title: "ASTM A554",
    summary: "Tubos de Aço Inoxidável para Fins Estruturais, Ornamentais e Mecânicos, com Costura.",
    details: "Especificação para tubos de aço inoxidável com costura (soldados) para aplicações mecânicas e estruturais onde a aparência, propriedades mecânicas e resistência à corrosão são necessárias (ex: corrimãos, móveis, suportes). Não se destina a aplicações de alta pressão. Cobre tubos com seções redonda, quadrada, retangular e especiais. O acabamento superficial (como polido brilhante ou escovado/acetinado) é um aspecto fundamental desta norma e pode ser especificado pelo comprador."
  },
  "astmA778": {
    title: "ASTM A778",
    summary: "Tubos de Aço Inoxidável Austenítico sem Recozimento, com Costura.",
    details: "Esta norma abrange produtos tubulares de aço inoxidável austenítico soldados e não recozidos, destinados a aplicações de serviço geral onde a resistência à corrosão é necessária, mas onde a aparência não é a principal consideração. Geralmente, são tubos com uma relação parede/diâmetro mais baixa. A principal diferença para outras normas de tubos com costura é a ausência de tratamento térmico (recozimento) após a soldagem, o que os torna uma opção mais econômica para aplicações menos críticas."
  },
  "astmA789": {
    title: "ASTM A789",
    summary: "Tubos de Aço Inoxidável Ferrítico/Austenítico (Duplex) para Serviços Gerais, com e sem Costura.",
    details: "Especificação para tubos de aço inoxidável duplex (ferrítico/austenítico), com e sem costura, para serviços que requerem resistência à corrosão geral e, em particular, alta resistência à corrosão sob tensão (stress corrosion cracking). Ligas como 2205 são cobertas por esta norma. Os tubos duplex combinam boa resistência mecânica com excelente resistência à corrosão."
  },
  "astmA790": {
    title: "ASTM A790",
    summary: "Tubos de Aço Inoxidável Ferrítico/Austenítico (Duplex) para Tubulação, com e sem Costura.",
    details: "Esta norma abrange tubos de aço inoxidável duplex (ferrítico/austenítico), com e sem costura, destinados a sistemas de tubulação (piping) que exigem alta resistência à corrosão. É muito semelhante à A789, mas mais focada em sistemas de tubulação. As ligas duplex são conhecidas por sua combinação de alta resistência mecânica (quase o dobro dos aços austeníticos) e boa tenacidade."
  },

  // Outros
   "aics": {
    title: "AISC",
    summary: "American Institute of Steel Construction.",
    details: "O Instituto Americano de Construção em Aço (AISC) é a principal organização técnica e de padronização para o uso de aço estrutural nos Estados Unidos. Suas especificações, como a AISC 360, são a referência principal para o projeto, fabricação e montagem de estruturas de aço e influenciam normas no mundo todo."
  }
};
