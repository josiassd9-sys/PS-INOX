
"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Icon } from "./icons"

const topics = [
    {
        id: "conceito",
        title: "O que é Corte a Laser?",
        icon: "Scissors",
        content: (
            <p>
                O corte a laser é um processo de fabricação subtrativo que utiliza um feixe de laser de alta potência, focado e guiado por um sistema CNC (Controle Numérico Computadorizado), para cortar materiais com extrema precisão. O feixe de laser aquece, derrete e vaporiza o material em uma linha muito fina, enquanto um gás de assistência (como Nitrogênio ou Oxigênio) sopra o material derretido para fora, resultando em um corte limpo e com excelente acabamento.
            </p>
        ),
    },
    {
        id: "tipos",
        title: "Tipos de Lasers Industriais: Fibra vs. CO2",
        icon: "Cog",
        content: (
            <ul className="list-disc pl-5 space-y-2">
                <li>
                    <strong>Laser de Fibra:</strong> É a tecnologia mais moderna e eficiente para cortar metais, especialmente os reflexivos como aço inox, alumínio, latão e cobre. O laser é gerado dentro de uma fibra óptica, resultando em um feixe muito intenso e focado.
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li><strong>Vantagens:</strong> Altíssima velocidade em chapas finas, excelente eficiência energética, baixa manutenção e capacidade de cortar materiais reflexivos.</li>
                        <li><strong>Desvantagens:</strong> Menos eficaz em materiais não metálicos (madeira, acrílico).</li>
                    </ul>
                </li>
                <li>
                    <strong>Laser de CO2:</strong> Utiliza uma mistura de gases (CO2, hélio, nitrogênio) estimulada por eletricidade para gerar o feixe de laser. Foi a tecnologia dominante por muitos anos.
                     <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li><strong>Vantagens:</strong> Excelente qualidade de corte em chapas mais grossas e versatilidade para cortar materiais não metálicos.</li>
                        <li><strong>Desvantagens:</strong> Menor velocidade em chapas finas, maior consumo de energia e manutenção mais complexa (alinhamento de espelhos).</li>
                    </ul>
                </li>
            </ul>
        ),
    },
    {
        id: "passos",
        title: "Passo a Passo do Processo de Corte",
        icon: "ClipboardList",
        content: (
            <ol className="list-decimal pl-5 space-y-3">
                <li>
                    <strong>Desenho (CAD):</strong> O processo começa com um desenho digital 2D da peça, criado em um software CAD (como AutoCAD ou SolidWorks). O arquivo é geralmente salvo em formatos como .DXF ou .DWG.
                </li>
                <li>
                    <strong>Programação (CAM) e Nesting:</strong> O arquivo CAD é importado para um software CAM. O programador define a sequência de cortes e os pontos de entrada do laser. Crucialmente, é nesta etapa que se utiliza um <strong>software de Nesting</strong> (aninhamento). Este software organiza automaticamente as peças na chapa para obter o máximo aproveitamento do material e minimizar o desperdício (sucata). Softwares dedicados como <strong>Lantek</strong> ou <strong>SigmaNEST</strong>, ou módulos dentro de pacotes CAM, são usados para essa finalidade.
                </li>
                <li>
                    <strong>Setup da Máquina:</strong> O operador carrega a chapa de metal na mesa da máquina, seleciona o programa CNC correto e garante que os parâmetros (potência, velocidade, gás de assistência) estão corretos para o material e espessura.
                </li>
                <li>
                    <strong>Execução do Corte:</strong> A máquina executa o programa, movendo o cabeçote de corte sobre a chapa e realizando os cortes com precisão milesimal. O processo é totalmente automatizado.
                </li>
                <li>
                    <strong>Remoção e Acabamento:</strong> As peças cortadas são removidas da chapa. Geralmente, o acabamento é tão bom que não são necessárias etapas adicionais, mas em alguns casos pode-se fazer uma rebarbação ou limpeza.
                </li>
            </ol>
        ),
    },
    {
        id: "parametros",
        title: "Parâmetros Chave para um Corte de Qualidade",
        icon: "SlidersHorizontal",
        content: (
             <ul className="list-disc pl-5 space-y-1">
                <li><strong>Potência do Laser:</strong> Define a capacidade de cortar espessuras maiores. Medida em Watts (W) ou Kilowatts (kW).</li>
                <li><strong>Velocidade de Corte:</strong> A velocidade com que o laser se move. Um equilíbrio entre velocidade e potência é crucial para a qualidade.</li>
                <li><strong>Gás de Assistência:</strong> Nitrogênio (N2) é usado para um corte limpo e sem oxidação no aço inox. Oxigênio (O2) é usado para aço carbono, pois cria uma reação exotérmica que auxilia no corte.</li>
                <li><strong>Foco do Feixe:</strong> A posição do ponto focal do laser em relação à superfície do material afeta a largura do corte (kerf) e a qualidade da borda.</li>
            </ul>
        ),
    },
]

export function LaserCuttingGuide() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Guia de Corte a Laser</CardTitle>
          <CardDescription>
            Conceitos, processos e aplicações da tecnologia de corte a laser para metais.
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full" defaultValue="conceito">
          {topics.map(topic => (
              <AccordionItem value={topic.id} key={topic.id}>
                  <AccordionTrigger className="text-base font-semibold hover:bg-primary/10 px-1">
                    <div className="flex items-center gap-2">
                        <Icon name={topic.icon as any} className="h-5 w-5 text-primary" />
                        {topic.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-1 py-1 border-t bg-primary/5 text-base">
                      {topic.content}
                  </AccordionContent>
              </AccordionItem>
          ))}
      </Accordion>
    </>
  )
}
