"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

const processes = [
  {
    id: "fabricacao-tubos",
    title: "Fabricação de Tubos de Aço Inox",
    summary: "Como são feitos os tubos redondos, quadrados e retangulares.",
    details: "Existem dois métodos principais para a fabricação de tubos de aço inoxidável:\n\n1. Com Costura (Soldado): É o processo mais comum para a maioria das aplicações. Uma chapa plana de aço inox é conformada progressivamente por rolos até formar um cilindro. As bordas são então unidas por um processo de soldagem (geralmente TIG ou Laser). Após a soldagem, o tubo pode passar por um acabamento para remover a rebarba da solda. Normas como a A554 (estrutural/ornamental), A269 (serviços gerais) e A249 (trocadores de calor) cobrem tubos com costura.\n\n2. Sem Costura (Seamless): Este processo parte de uma barra de aço maciça que é aquecida e perfurada por um mandril para criar a cavidade interna. O tubo é então alongado e dimensionado. Tubos sem costura não possuem solda, o que os torna ideais para aplicações de altíssima pressão e corrosão intensa, como em indústrias químicas e petroquímicas. A norma ASTM A312 é a principal para tubos com e sem costura para serviços corrosivos."
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
    details: "1. Corte:\n   - Guilhotina: Para cortes retos em chapas de até uma certa espessura. É rápido e econômico.\n   - Plasma: Usa um jato de gás ionizado em alta temperatura. Ideal para chapas de espessuras médias a altas, com boa velocidade de corte.\n   - Laser: Utiliza um feixe de luz de alta energia. Oferece altíssima precisão e excelente acabamento de corte, ideal para peças complexas e chapas finas.\n   - Jato d'água: Corta com um jato de água em altíssima pressão, com ou sem adição de abrasivos. Pode cortar praticamente qualquer material sem gerar calor, evitando a deformação da peça.\n\n2. Dobra: Realizada em uma máquina chamada prensa dobradeira (ou viradeira). A chapa é posicionada sobre uma matriz em 'V' e um punção a pressiona para criar a dobra no ângulo desejado. É essencial para a fabricação de caixas, perfis e suportes.\n\n3. Calandragem: Processo para curvar chapas e perfis, transformando-os em cilindros ou cones. O material é passado através de 3 ou 4 rolos que aplicam pressão para criar a curvatura. É usado para fazer tanques, dutos e virolas, como as usadas na fabricação de tubos de grande diâmetro pela norma A358."
  },
  {
    id: "usinagem",
    title: "Usinagem",
    summary: "Removendo material para criar peças de precisão.",
    details: "Usinagem é um conjunto de processos que removem material de uma peça bruta para dar a ela forma e dimensões precisas. No aço inox, os processos mais comuns são:\n\n- Torneamento: A peça gira em alta velocidade enquanto uma ferramenta de corte se move linearmente, removendo material para criar formas cilíndricas (eixos, flanges, pinos).\n\n- Fresamento: A ferramenta de corte gira em alta velocidade enquanto a peça se move, criando superfícies planas, canais, furos e contornos complexos.\n\n- Furação: Processo para criar furos cilíndricos. A usinagem do aço inox requer ferramentas e parâmetros específicos (velocidade de corte, avanço, refrigeração) devido à sua dureza e tendência ao encruamento (endurecimento durante o trabalho)."
  },
  {
    id: "soldagem",
    title: "Soldagem (União)",
    summary: "Unindo componentes de aço inoxidável.",
    details: "A soldagem é crucial para unir peças de aço inox. A escolha do processo depende da espessura, aplicação e acabamento desejado:\n\n- TIG (Tungsten Inert Gas): Usa um eletrodo de tungstênio não consumível e um gás de proteção (argônio). Produz soldas de altíssima qualidade, com ótimo acabamento, ideal para chapas finas, tubos sanitários (norma A270) e peças com requisito estético (norma A554). É um processo mais lento.\n\n- MIG/MAG (Metal Inert/Active Gas): Utiliza um arame consumível que é alimentado continuamente. É um processo muito mais rápido que o TIG, adequado para chapas de média a alta espessura e aplicações estruturais.\n\n- Solda a Ponto (Resistance Spot Welding): Une chapas sobrepostas aplicando pressão e uma corrente elétrica através de eletrodos de cobre. É um processo extremamente rápido, usado em larga escala na indústria automotiva e de eletrodomésticos."
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
      <Card className="mb-6 border-primary/20 bg-primary/5">
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
                  <AccordionTrigger className="text-base font-semibold hover:bg-primary/10 px-4">{process.title}</AccordionTrigger>
                  <AccordionContent className="px-6 py-4 border-t bg-primary/5">
                      <p className="text-base whitespace-pre-wrap">{process.details}</p>
                  </AccordionContent>
              </AccordionItem>
          ))}
      </Accordion>
    </>
  )
}
