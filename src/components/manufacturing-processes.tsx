"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { StandardLink } from "./standard-link"

const processes = [
  {
    id: "fabricacao-tubos",
    title: "Fabricação de Tubos de Aço Inox",
    summary: "Como são feitos os tubos redondos, quadrados e retangulares.",
    details: <>Existem dois métodos principais para a fabricação de tubos de aço inoxidável:<br/><br/>1. Com Costura (Soldado): É o processo mais comum para a maioria das aplicações. Uma chapa plana de aço inox é conformada progressivamente por rolos até formar um cilindro. As bordas são então unidas por um processo de soldagem (geralmente TIG ou Laser). Após a soldagem, o tubo pode passar por um acabamento para remover a rebarba da solda. Normas como a <StandardLink standardId="astmA554" /> (estrutural/ornamental), <StandardLink standardId="astmA269" /> (serviços gerais) e <StandardLink standardId="astmA249" /> (trocadores de calor) cobrem tubos com costura.<br/><br/>2. Sem Costura (Seamless): Este processo parte de uma barra de aço maciça que é aquecida e perfurada por um mandril para criar a cavidade interna. O tubo é então alongado e dimensionado. Tubos sem costura não possuem solda, o que os torna ideais para aplicações de altíssima pressão e corrosão intensa, como em indústrias químicas e petroquímicas. A norma <StandardLink standardId="astmA312" /> é a principal para tubos com e sem costura para serviços corrosivos.</>
  },
  {
    id: "conexoes",
    title: "Conexões para Tubulação",
    summary: "Componentes para unir, desviar, vedar e controlar o fluxo em sistemas de tubulação.",
    details: <>As conexões são peças fundamentais que permitem a montagem de um sistema de tubulação completo. Elas podem ser soldadas, rosqueadas ou sanitárias (clamp).<br/><br/>- Curva (Elbow): Usada para alterar a direção do fluxo. As mais comuns são as de 90° e 45°. Podem ter raio longo (preferencial para fluxo suave) ou raio curto.<br/><br/>- Tee: Conexão em forma de 'T' que permite criar uma derivação de 90° a partir da linha principal. Existe o Tee reto (com as três saídas do mesmo diâmetro) e o Tee de redução (com a derivação de diâmetro menor).<br/><br/>- Redução (Reducer): Utilizada para conectar tubos de diâmetros diferentes. A Redução Concêntrica mantém o eixo central da tubulação, enquanto a Redução Excêntrica mantém uma das faces da tubulação nivelada (geralmente a inferior, para evitar acúmulo de produto).<br/><br/>- União (Union): Permite a desconexão rápida da tubulação para manutenção ou limpeza sem a necessidade de cortar o tubo. As uniões sanitárias são as mais comuns na indústria alimentícia e farmacêutica:<br/>  - União SMS (Swedish Manufacturing Standard): Padrão sanitário com rosca redonda e vedação em 'L'. Simples e eficaz.<br/>  - União RJT (Ring Joint Type): Padrão mais antigo, com rosca trapezoidal e vedação anular. Robusta, mas com mais pontos para acúmulo de produto.<br/>  - União TC (Tri-Clamp): Padrão mais utilizado atualmente para aplicações sanitárias. Consiste em duas flanges (ferrules) que são unidas por uma abraçadeira (clamp) com um anel de vedação (gaxeta) entre elas. Oferece montagem e desmontagem extremamente rápidas e uma superfície interna muito lisa.<br/><br/>- Luva (Socket/Coupling): Peça curta usada para unir dois tubos pela extremidade. Pode ser de solda (Socket Weld) ou com rosca interna (BSP ou NPT).<br/><br/>- Ponta Roscada (Nipple): Pedaço curto de tubo com rosca nas extremidades, usado para conectar outras peças rosqueadas.<br/><br/>- Válvula (Valve): Componente para controlar ou bloquear o fluxo. Existem vários tipos:<br/>  - Válvula Borboleta: Um disco gira para abrir ou fechar a passagem. Rápida e simples, muito comum em aplicações sanitárias.<br/>  - Válvula de Esfera: Uma esfera perfurada gira para liberar ou bloquear o fluxo. Oferece ótima vedação.<br/>  - Válvula Globo: Controla o fluxo de forma precisa (regulagem), mas causa maior perda de carga.<br/>  - Válvula de Retenção: Permite o fluxo em apenas uma direção.<br/><br/>- Espigão (Hose Barb): Conexão com uma ponta serrilhada para acoplar uma mangueira de forma segura.</>
  },
  {
    id: "laminacao-chapas",
    title: "Laminação de Chapas e Barras",
    summary: "O processo de transformar blocos de aço em chapas e barras.",
    details: "A laminação é o processo de reduzir a espessura de um bloco de metal, passando-o entre dois cilindros que giram em sentidos opostos.\n\n- Laminação a Quente: O aço é aquecido a altas temperaturas (acima de 930°C) antes de ser laminado. Isso o torna mais maleável, permitindo grandes reduções de espessura. Chapas e barras laminadas a quente têm uma superfície mais áspera e uma tolerância dimensional menor.\n\n- Laminação a Frio: Realizada à temperatura ambiente, geralmente após a laminação a quente. O processo melhora o acabamento superficial, a precisão dimensional e aumenta a resistência mecânica do material (encruamento). A maioria das chapas finas, barras e tubos com acabamento polido ou escovado (como os das normas A270 e A554) passam por laminação a frio em alguma etapa."
  },
  {
    id: "trefilacao-barras",
    title: "Trefilação de Barras e Arames",
    summary: "Como barras e arames obtêm seu diâmetro preciso.",
    details: "Trefilação é um processo de conformação a frio usado para reduzir a seção transversal de uma barra ou arame. O material é puxado através de uma matriz cônica (fieira), que é mais estreita que o diâmetro original. Este processo garante um controle dimensional muito preciso, um excelente acabamento superficial e um aumento significativo da resistência mecânica. É amplamente utilizado na fabricação de barras redondas, quadradas e sextavadas de pequeno diâmetro com tolerâncias apertadas."
  },
  {
    id: "corte-dobra",
    title: "Corte, Dobra e Calandragem",
    summary: "Processos fundamentais de transformação de chapas e perfis.",
    details: <>1. Corte:<br/>   - Guilhotina: Para cortes retos em chapas de até uma certa espessura. É rápido e econômico.<br/>   - Plasma: Usa um jato de gás ionizado em alta temperatura. Ideal para chapas de espessuras médias a altas, com boa velocidade de corte.<br/>   - Laser: Utiliza um feixe de luz de alta energia. Oferece altíssima precisão e excelente acabamento de corte, ideal para peças complexas e chapas finas.<br/>   - Jato d'água: Corta com um jato de água em altíssima pressão, com ou sem adição de abrasivos. Pode cortar praticamente qualquer material sem gerar calor, evitando a deformação da peça.<br/><br/>2. Dobra: Realizada em uma máquina chamada prensa dobradeira (ou viradeira). A chapa é posicionada sobre uma matriz em 'V' e um punção a pressiona para criar a dobra no ângulo desejado. É essencial para a fabricação de caixas, perfis e suportes.<br/><br/>3. Calandragem: Processo para curvar chapas e perfis, transformando-os em cilindros ou cones. O material é passado através de 3 ou 4 rolos que aplicam pressão para criar a curvatura. É usado para fazer tanques, dutos e virolas, como as usadas na fabricação de tubos de grande diâmetro pela norma <StandardLink standardId="astmA358" />.</>
  },
  {
    id: "usinagem",
    title: "Usinagem",
    summary: "Removendo material para criar peças de precisão.",
    details: <>Usinagem é um conjunto de processos que removem material de uma peça bruta para dar a ela forma e dimensões precisas. No aço inox, os processos mais comuns são:<br/><br/>- Torneamento: A peça gira em alta velocidade enquanto uma ferramenta de corte se move linearmente, removendo material para criar formas cilíndricas (eixos, flanges, pinos).<br/><br/>- Fresamento: A ferramenta de corte gira em alta velocidade enquanto a peça se move, criando superfícies planas, canais, furos e contornos complexos.<br/><br/>- Furação: Processo para criar furos cilíndricos. A usinagem do aço inox requer ferramentas e parâmetros específicos (velocidade de corte, avanço, refrigeração) devido à sua dureza e tendência ao encruamento (endurecimento durante o trabalho).</>
  },
  {
    id: "soldagem",
    title: "Soldagem (União)",
    summary: "Unindo componentes de aço inoxidável.",
    details: <>A soldagem é crucial para unir peças de aço inox. A escolha do processo depende da espessura, aplicação e acabamento desejado:<br/><br/>- TIG (Tungsten Inert Gas): Usa um eletrodo de tungstênio não consumível e um gás de proteção (argônio). Produz soldas de altíssima qualidade, com ótimo acabamento, ideal para chapas finas, tubos sanitários (norma <StandardLink standardId="astmA270" />) e peças com requisito estético (norma <StandardLink standardId="astmA554" />). É um processo mais lento.<br/><br/>- MIG/MAG (Metal Inert/Active Gas): Utiliza um arame consumível que é alimentado continuamente. É um processo muito mais rápido que o TIG, adequado para chapas de média a alta espessura e aplicações estruturais.<br/><br/>- Solda a Ponto (Resistance Spot Welding): Une chapas sobrepostas aplicando pressão e uma corrente elétrica através de eletrodos de cobre. É um processo extremamente rápido, usado em larga escala na indústria automotiva e de eletrodomésticos.</>
  },
  {
    id: "estampagem",
    title: "Estampagem",
    summary: "Conformando chapas para criar peças tridimensionais.",
    details: "Estampagem é um processo de conformação a frio onde uma chapa de aço inox é colocada em uma prensa entre um molde (matriz) e um punção. A força da prensa deforma a chapa, forçando-a a adquirir o formato da matriz. É um processo de alta produtividade usado para fabricar grandes volumes de peças, como pias de cozinha, painéis de eletrodomésticos, componentes automotivos e utensílios domésticos. O aço inox utilizado para estampagem profunda precisa ter boa ductilidade (capacidade de se deformar sem romper)."
  },
];

export function ManufacturingProcesses() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Processos de Fabricação e Transformação do Aço Inox</CardTitle>
          <CardDescription>
            Desde a matéria-prima até o produto final, o aço inoxidável passa por diversos processos que definem sua forma, acabamento e aplicação.
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full">
          {processes.map(process => (
              <AccordionItem value={process.id} key={process.id}>
                  <AccordionTrigger className="text-base font-semibold hover:bg-primary/10 px-1">{process.title}</AccordionTrigger>
                  <AccordionContent className="px-1 py-1 border-t bg-primary/5">
                      <div className="text-base">{process.details}</div>
                  </AccordionContent>
              </AccordionItem>
          ))}
      </Accordion>
    </>
  )
}
