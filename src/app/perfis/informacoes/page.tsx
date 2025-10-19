
"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Dashboard } from "@/components/dashboard";
import { Icon } from "@/components/icons";

const informacoes = [
    {
        id: "normas",
        title: "Principais Normas Técnicas de Estruturas",
        icon: "Book",
        content: (
            <div>
                <p className="mb-2">
                    Projetos estruturais em aço são guiados por normas rigorosas que garantem segurança e desempenho. As mais importantes no nosso contexto são:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>ABNT NBR 8800:</strong> Norma brasileira para o projeto de estruturas de aço e de estruturas mistas de aço e concreto de edifícios. Ela define os critérios de dimensionamento, resistência, estabilidade e segurança.</li>
                    <li><strong>ABNT NBR 14323:</strong> Norma para lajes mistas (steel deck), definindo requisitos para a chapa-forma e conectores de cisalhamento.</li>
                    <li><strong>AISC (American Institute of Steel Construction):</strong> As especificações do AISC são a referência principal nos Estados Unidos e influenciam normas no mundo todo, cobrindo todo o ciclo do projeto.</li>
                </ul>
            </div>
        )
    },
    {
        id: "tipos-aco",
        title: "Tipos de Aço Estrutural",
        icon: "CheckCircle",
        content: (
             <div>
                <p className="mb-2">A resistência do perfil depende diretamente do tipo de aço utilizado. A propriedade mais importante é a tensão de escoamento (fy).</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tipo de Aço</TableHead>
                            <TableHead>Tensão de Escoamento (fy)</TableHead>
                            <TableHead>Aplicação Comum</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">ASTM A36</TableCell>
                            <TableCell>250 MPa (36 ksi)</TableCell>
                            <TableCell>Uso geral, perfis laminados, chapas.</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">ASTM A572 Grau 50</TableCell>
                            <TableCell>345 MPa (50 ksi)</TableCell>
                            <TableCell>Estruturas que exigem maior resistência, como pontes e grandes edifícios.</TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell className="font-medium">ASTM A992</TableCell>
                            <TableCell>345 a 450 MPa</TableCell>
                            <TableCell>Padrão atual para perfis W nos EUA, otimizado para bom desempenho sísmico.</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        )
    },
    {
        id: "conceitos",
        title: "Conceitos Chave de Dimensionamento Estrutural",
        icon: "Scale",
        content: (
            <div className="space-y-2">
                 <p>Para entender qual perfil escolher, é essencial conhecer dois conceitos:</p>
                <div>
                    <h4 className="font-semibold">Momento de Inércia (Ix)</h4>
                    <p className="text-muted-foreground">
                        É a principal medida da <strong>resistência de uma viga à deformação (flexão)</strong>. Quanto maior o Ix, menos a viga irá "embarrigar" (defletir) sob uma carga. Perfis com mais material longe do centro (como as vigas "I" altas) possuem um momento de inércia maior e, portanto, são mais eficientes para vencer grandes vãos.
                    </p>
                </div>
                 <div>
                    <h4 className="font-semibold">Módulo de Resistência (Wx)</h4>
                    <p className="text-muted-foreground">
                        Está diretamente relacionado à <strong>resistência da viga à ruptura</strong> por excesso de carga. A tensão máxima em uma viga é calculada dividindo-se o momento fletor pelo Wx. Portanto, para um mesmo esforço, um perfil com maior Wx sofrerá uma tensão menor, tornando-o mais seguro. A calculadora de resistência usa o Wx para encontrar o perfil mais leve que suporta a carga.
                    </p>
                </div>
            </div>
        )
    },
    {
        id: "ltb",
        title: "Travamento Lateral-Torcional (LTB)",
        icon: "Link",
        content: (
            <div className="space-y-2">
                 <p>
                    A Flambagem Lateral-Torcional (LTB) é um fenômeno que pode reduzir a capacidade de uma viga quando sua mesa comprimida não é adequadamente travada lateralmente. A calculadora considera essa verificação de forma simplificada.
                </p>
                <div>
                    <h4 className="font-semibold">Critério de Verificação</h4>
                    <p className="text-muted-foreground">
                        A segurança é garantida quando o Momento Solicitante (Msd) é menor ou igual ao Momento Resistente (Mrd). O Mrd leva em conta a redução de capacidade devido ao LTB. Se a verificação falha, é necessário adicionar travamentos laterais para reduzir o comprimento não-travado (Lb) ou escolher um perfil mais robusto.
                    </p>
                </div>
            </div>
        )
    },
    {
        id: "conexoes-geral",
        title: "Ligações e Conexões",
        icon: "Workflow",
        content: (
            <div className="space-y-2">
                 <p>As ligações são responsáveis por transmitir os esforços entre os elementos estruturais (viga-viga, viga-pilar). O dimensionamento delas é uma etapa crítica do projeto.</p>
                 <div>
                    <h4 className="font-semibold">Parafusos</h4>
                    <p className="text-muted-foreground">
                        Verifica-se a resistência ao cisalhamento do parafuso e a resistência à pressão de contato (bearing) no material ao redor do furo. Espaçamentos mínimos e distâncias de borda devem ser respeitados conforme a NBR 8800.
                    </p>
                </div>
                 <div>
                    <h4 className="font-semibold">Soldas</h4>
                    <p className="text-muted-foreground">
                        O cordão de solda deve ser dimensionado para resistir às forças transmitidas. O tamanho da "garganta" da solda e seu comprimento eficaz são os parâmetros chave no cálculo.
                    </p>
                </div>
            </div>
        )
    },
    {
        id: "conexoes-deck",
        title: "Conectores de Cisalhamento (Steel Deck)",
        icon: "Layers",
        content: (
             <div className="space-y-2">
                 <p>Para que a laje de concreto e a viga de aço trabalhem juntas (ação composta), são necessários conectores de cisalhamento. Eles transferem a força de cisalhamento horizontal entre os dois materiais.</p>
                  <div>
                    <h4 className="font-semibold">Dimensionamento</h4>
                    <p className="text-muted-foreground">
                       Calcula-se a força de cisalhamento total na interface aço-concreto e divide-se pela resistência de um único conector (Qconector) para obter a quantidade necessária. A norma ABNT NBR 14323 fornece as diretrizes para este cálculo. A calculadora pode recomendar um número de conectores por metro.
                    </p>
                </div>
            </div>
        )
    },
]

function InfoComponent() {
  return (
    <div className="container mx-auto p-4">
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Arcabouço Técnico Estrutural</CardTitle>
                <CardDescription>
                    Conceitos, normas e guias fundamentais para o dimensionamento e detalhamento de perfis e ligações de aço.
                </CardDescription>
            </CardHeader>
        </Card>
        
        <Accordion type="multiple" collapsible className="w-full" defaultValue={["normas", "conceitos"]}>
            {informacoes.map(info => (
                <AccordionItem value={info.id} key={info.id}>
                    <AccordionTrigger className="text-lg font-semibold hover:bg-primary/10 px-1">
                        <div className="flex items-center gap-2">
                            <Icon name={info.icon as any} className="h-5 w-5 text-primary" />
                            {info.title}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-1 py-2 border-t bg-primary/5 text-base">
                      {info.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  );
}

export default function Page() {
  return (
      <Dashboard initialCategoryId="perfis/informacoes">
          <InfoComponent />
      </Dashboard>
  );
}
