"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

const standards = [
  {
    id: "a213",
    title: "ASTM A213",
    summary: "Tubos de Aço Liga Ferríticos e Austeníticos para Caldeiras, Superaquecedores e Trocadores de Calor, sem Costura.",
    details: "Esta especificação abrange tubos de aço ferrítico e austenítico sem costura para caldeiras, superaquecedores e trocadores de calor. Os aços são classificados em vários graus, incluindo os populares 304/304L e 316/316L. Os tubos devem ser fabricados pelo processo sem costura e podem ser acabados a quente ou a frio. Requisitos de tratamento térmico, composição química, propriedades de tração e testes (como achatamento, flangeamento e hidrostático) são rigorosamente especificados."
  },
  {
    id: "a249",
    title: "ASTM A249",
    summary: "Tubos de Aço Austenítico para Caldeiras, Superaquecedores, Trocadores de Calor e Condensadores, com Costura.",
    details: "Especificação para tubos com costura (soldados) de aços austeníticos, destinados ao uso em caldeiras, superaquecedores, trocadores de calor e condensadores. Os tubos são fabricados a partir de tiras de aço laminadas a frio, que são soldadas eletricamente. Após a soldagem, os tubos são geralmente trabalhados a frio e submetidos a um tratamento térmico de recozimento para otimizar as propriedades e a resistência à corrosão."
  },
  {
    id: "a269",
    title: "ASTM A269",
    summary: "Tubos de Aço Inoxidável Austenítico para Serviços Gerais, com e sem Costura.",
    details: "Esta norma cobre tubos de aço inoxidável austenítico, com ou sem costura, para serviços gerais que exigem resistência à corrosão e ao calor. É uma das normas mais comuns para tubulação de instrumentação e sistemas hidráulicos. Os tubos são adequados para conformação, como flangeamento e dobra. A norma especifica requisitos de composição química, propriedades mecânicas e testes, mas é geralmente menos rigorosa que as normas para vasos de pressão."
  },
  {
    id: "a270",
    title: "ASTM A270",
    summary: "Tubos de Aço Inoxidável Austenítico Sanitário (Alimentício), com e sem Costura.",
    details: "Especificação para tubos sanitários de aço inoxidável austenítico, com e sem costura, destinados às indústrias de laticínios, alimentos, farmacêutica e biotecnologia. A característica principal é o acabamento superficial interno e externo, que deve ser extremamente liso (baixa rugosidade, medida em Ra) para impedir a contaminação e facilitar a limpeza e esterilização. Os tubos são obrigatoriamente polidos e podem ser fornecidos em condição decapada, passivada ou com polimento mecânico adicional."
  },
  {
    id: "a312",
    title: "ASTM A312",
    summary: "Tubos de Aço Inoxidável Austenítico para Alta Temperatura e Serviços Corrosivos, com e sem Costura.",
    details: "Esta norma abrange tubos de aço inoxidável austenítico, com e sem costura, destinados a serviços em altas temperaturas e corrosivos em geral. É a principal especificação para tubulações de processo em indústrias químicas, petroquímicas e de papel. Cobre uma ampla gama de tamanhos de tubos, desde 1/8\" até 30\" de diâmetro nominal. Os requisitos de teste são rigorosos, incluindo ensaios não destrutivos e hidrostáticos."
  },
  {
    id: "a358",
    title: "ASTM A358",
    summary: "Tubos de Aço Inoxidável Austenítico Cromo-Níquel, com Costura por Fusão Elétrica, para Alta Temperatura.",
    details: "Esta norma especifica tubos de aço inoxidável austenítico soldados por fusão elétrica (EFW - Electric Fusion Welded), adequados para serviço corrosivo e/ou de alta temperatura. É comumente usada para tubos de grande diâmetro. A fabricação parte de chapas que são conformadas e soldadas. A norma classifica os tubos em 5 classes, dependendo do tipo de solda, tratamento térmico e se a solda foi radiografada."
  },
  {
    id: "a554",
    title: "ASTM A554",
    summary: "Tubos de Aço Inoxidável para Fins Estruturais, Ornamentais e Mecânicos, com Costura.",
    details: "Especificação para tubos de aço inoxidável com costura (soldados) para aplicações mecânicas e estruturais onde a aparência, propriedades mecânicas e resistência à corrosão são necessárias (ex: corrimãos, móveis, suportes). Não se destina a aplicações de alta pressão. Cobre tubos com seções redonda, quadrada, retangular e especiais. O acabamento superficial (como polido brilhante ou escovado/acetinado) é um aspecto fundamental desta norma e pode ser especificado pelo comprador."
  },
  {
    id: "a778",
    title: "ASTM A778",
    summary: "Tubos de Aço Inoxidável Austenítico sem Recozimento, com Costura.",
    details: "Esta norma abrange produtos tubulares de aço inoxidável austenítico soldados e não recozidos, destinados a aplicações de serviço geral onde a resistência à corrosão é necessária, mas onde a aparência não é a principal consideração. Geralmente, são tubos com uma relação parede/diâmetro mais baixa. A principal diferença para outras normas de tubos com costura é a ausência de tratamento térmico (recozimento) após a soldagem, o que os torna uma opção mais econômica para aplicações menos críticas."
  },
  {
    id: "a789",
    title: "ASTM A789",
    summary: "Tubos de Aço Inoxidável Ferrítico/Austenítico (Duplex) para Serviços Gerais, com e sem Costura.",
    details: "Especificação para tubos de aço inoxidável duplex (ferrítico/austenítico), com e sem costura, para serviços que requerem resistência à corrosão geral e, em particular, alta resistência à corrosão sob tensão (stress corrosion cracking). Ligas como 2205 são cobertas por esta norma. Os tubos duplex combinam boa resistência mecânica com excelente resistência à corrosão."
  },
  {
    id: "a790",
    title: "ASTM A790",
    summary: "Tubos de Aço Inoxidável Ferrítico/Austenítico (Duplex) para Tubulação, com e sem Costura.",
    details: "Esta norma abrange tubos de aço inoxidável duplex (ferrítico/austenítico), com e sem costura, destinados a sistemas de tubulação (piping) que exigem alta resistência à corrosão. É muito semelhante à A789, mas mais focada em sistemas de tubulação. As ligas duplex são conhecidas por sua combinação de alta resistência mecânica (quase o dobro dos aços austeníticos) e boa tenacidade."
  }
];

export function AstmStandards() {
  return (
    <>
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Acabamentos e Tratamentos</CardTitle>
          <CardDescription>
            Além da composição química, o acabamento superficial e os tratamentos térmicos são cruciais para o desempenho e a aparência do aço inoxidável.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="mb-2"><strong className="text-foreground">Recozimento:</strong> Tratamento térmico que alivia as tensões internas do material, geralmente após processos de soldagem ou conformação. Melhora a ductilidade e a resistência à corrosão.</p>
          <p className="mb-2"><strong className="text-foreground">Decapagem e Passivação:</strong> Processo químico que remove impurezas da superfície e restaura a camada passiva de óxido de cromo, que é a responsável pela resistência à corrosão do aço inox.</p>
          <p className="mb-2"><strong className="text-foreground">Acabamento Polido:</strong> Obtido por lixamento com abrasivos finos. Pode ser sanitário (para higiene) ou brilhante (estético). A norma A270 é um exemplo focado em acabamento sanitário.</p>
          <p><strong className="text-foreground">Acabamento Escovado (Acetinado):</strong> Cria um visual com riscos finos e uniformes, menos reflexivo que o polido. Muito comum em aplicações arquitetônicas e ornamentais, cobertas pela norma A554.</p>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
          {standards.map(standard => (
              <AccordionItem value={standard.id} key={standard.id}>
                  <AccordionTrigger className="text-base font-semibold hover:bg-primary/10 px-4">{standard.title} - <span className="text-sm font-normal text-muted-foreground ml-2 flex-1 text-left">{standard.summary}</span></AccordionTrigger>
                  <AccordionContent className="px-6 py-4 border-t bg-primary/5">
                      <p className="text-base whitespace-pre-wrap">{standard.details}</p>
                  </AccordionContent>
              </AccordionItem>
          ))}
      </Accordion>
    </>
  )
}
