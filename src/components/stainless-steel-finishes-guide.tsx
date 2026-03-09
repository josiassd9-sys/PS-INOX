
"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Icon } from "./icons"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

const topics = [
    {
        id: "camada-passiva",
        title: "A Magia do Aço Inox: A Camada Passiva",
        icon: "Shield",
        content: (
            <p>
                O que torna o aço inoxidável "inoxidável" não é o metal em si, mas uma camada protetora invisível, extremamente fina e auto-regenerativa, chamada de <strong>camada passiva</strong>. Essa camada é formada quando o cromo (Cr), presente em alta concentração no aço (no mínimo 10,5%), reage com o oxigênio do ambiente. O resultado é um filme estável de óxido de cromo que protege o ferro na liga contra a ferrugem e a corrosão. Qualquer dano superficial, como um risco, é imediatamente "curado" pela formação de uma nova camada passiva, desde que haja oxigênio disponível.
            </p>
        ),
    },
    {
        id: "acabamentos-usina",
        title: "Acabamentos de Usina (Bruto de Laminação)",
        icon: "Factory",
        content: (
            <div>
                <p className="mb-2">Estes são os acabamentos básicos, resultantes diretamente do processo de laminação a quente ou a frio nas usinas siderúrgicas.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Acabamento 2B:</strong> O mais comum e versátil. Resulta da laminação a frio, seguida de tratamento térmico (recozimento) e uma passagem final em cilindros polidos. Possui uma superfície lisa, semi-brilhante e reflexiva, ideal para uma vasta gama de aplicações industriais e domésticas.</li>
                    <li><strong>Acabamento BA (Bright Annealed):</strong> Acabamento brilhante e espelhado. Após a laminação a frio, o recozimento é feito em um forno com atmosfera controlada (sem oxigênio), o que impede a oxidação da superfície. O resultado é um acabamento altamente reflexivo, usado em aplicações decorativas, eletrodomésticos e refletores.</li>
                    <li><strong>Acabamento Nº 1 (ou 1D):</strong> Resultante da laminação a quente, recozimento e decapagem. Possui uma superfície fosca, áspera e não uniforme. É o ponto de partida para muitos outros processos e usado em aplicações industriais onde a estética não é primordial.</li>
                </ul>
            </div>
        ),
    },
    {
        id: "acabamentos-mecanicos",
        title: "Acabamentos Mecânicos (Lixados)",
        icon: "Cog",
        content: (
             <div>
                <p className="mb-2">Estes acabamentos são obtidos através do lixamento da superfície do aço com abrasivos (lixas) de diferentes granulometrias.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Acabamento Escovado (Nº 4 ou Scotch-Brite):</strong> Um dos acabamentos mais populares para fins arquitetônicos e decorativos. É criado pelo lixamento com uma lixa de grão fino (geralmente entre 150 e 240), resultando em um padrão de riscos finos, unidirecionais e um brilho acetinado. É muito usado em corrimãos, painéis de elevadores e eletrodomésticos.</li>
                    <li><strong>Acabamento Polido Espelhado (Nº 8):</strong> O acabamento mais liso e reflexivo, obtido por um processo de lixamento sequencial com lixas cada vez mais finas, seguido de polimento com pastas abrasivas até que todas as linhas de lixamento desapareçam. O resultado é uma superfície semelhante a um espelho, usada em aplicações decorativas de alto padrão, arquitetura e equipamentos para salas limpas.</li>
                </ul>
            </div>
        ),
    },
    {
        id: "tratamentos-quimicos",
        title: "Tratamentos Químicos: Limpeza e Proteção",
        icon: "FlaskConical",
        content: (
            <div>
                 <p className="mb-2">Após processos como soldagem ou usinagem, a camada passiva pode ser danificada ou contaminada. Estes tratamentos restauram a proteção do aço.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Decapagem:</strong> Processo químico, geralmente com uma mistura de ácidos (nítrico e fluorídrico), que remove as "queimaduras de solda" (óxidos formados pelo calor) e outras impurezas da superfície. É uma limpeza profunda que prepara o aço para o próximo passo.</li>
                    <li><strong>Passivação:</strong> Tratamento químico, tipicamente com ácido nítrico ou cítrico, que remove contaminações ferrosas da superfície e acelera a formação de uma camada passiva mais espessa, uniforme e resistente à corrosão. É uma etapa crucial para garantir a máxima durabilidade do aço inox, especialmente em ambientes agressivos.</li>
                </ul>
            </div>
        ),
    },
     {
        id: "outros",
        title: "Outros Acabamentos e Texturas",
        icon: "Layers",
        content: (
            <div>
                 <p className="mb-2">Além dos mais comuns, existem acabamentos especiais para aplicações específicas:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Eletropolimento:</strong> Um processo eletroquímico que remove uma camada microscópica da superfície, resultando em um acabamento extremamente liso, brilhante e limpo. É o padrão ouro para as indústrias farmacêutica, de semicondutores e alimentícia, pois minimiza a adesão de bactérias e partículas.</li>
                    <li><strong>Chapas Texturizadas/Estampadas:</strong> Chapas que passam por um processo de laminação com cilindros gravados, criando padrões em relevo. São usadas para fins estéticos (revestimentos, painéis) e funcionais (aumentam a rigidez da chapa e escondem arranhões).</li>
                </ul>
            </div>
        ),
    },
];

export function StainlessSteelFinishesGuide() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Guia de Acabamentos do Aço Inox</CardTitle>
          <CardDescription>
            Conheça os principais tipos de acabamentos e tratamentos que definem a aparência, a funcionalidade e a resistência do aço inoxidável.
          </CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full" defaultValue="camada-passiva">
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
