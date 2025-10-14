
"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Book, CheckCircle, Scale } from "lucide-react";

const informacoes = [
    {
        id: "normas",
        title: "Principais Normas Técnicas",
        icon: Book,
        content: (
            <div>
                <p className="mb-2">
                    Projetos estruturais em aço são guiados por normas rigorosas que garantem segurança e desempenho. As mais importantes no nosso contexto são:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>ABNT NBR 8800 (Brasil):</strong> Norma brasileira para o projeto de estruturas de aço e de estruturas mistas de aço e concreto de edifícios. Ela define os critérios de dimensionamento, resistência, estabilidade e segurança.</li>
                    <li><strong>AISC (American Institute of Steel Construction):</strong> As especificações do AISC são a referência principal nos Estados Unidos e influenciam normas no mundo todo. Elas cobrem desde o projeto até a fabricação e montagem de estruturas de aço.</li>
                </ul>
            </div>
        )
    },
    {
        id: "tipos-aco",
        title: "Tipos de Aço Estrutural",
        icon: CheckCircle,
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
        title: "Conceitos Chave de Dimensionamento",
        icon: Scale,
        content: (
            <div className="space-y-2">
                 <p>Para entender qual perfil escolher, é essencial conhecer dois conceitos:</p>
                <div>
                    <h4 className="font-semibold">Momento de Inércia (Ix)</h4>
                    <p className="text-muted-foreground">
                        É a principal medida da <strong>resistência de uma viga à flexão (deformação)</strong>. Quanto maior o Ix, menos a viga irá "embarrigar" (defletir) sob uma carga. Perfis com mais material longe do centro (como as vigas "I" altas) possuem um momento de inércia maior e, portanto, são mais eficientes para vencer grandes vãos.
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
    }
]

export default function Page() {
  return (
    <div className="container mx-auto p-4">
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Informações Técnicas Essenciais</CardTitle>
                <CardDescription>
                    Contexto e conceitos fundamentais para o uso e dimensionamento de perfis de aço estrutural.
                </CardDescription>
            </CardHeader>
        </Card>
        
        <Accordion type="single" collapsible className="w-full" defaultValue="conceitos">
            {informacoes.map(info => (
                <AccordionItem value={info.id} key={info.id}>
                    <AccordionTrigger className="text-lg font-semibold hover:bg-primary/10 px-1">
                        <div className="flex items-center gap-2">
                            <info.icon className="h-5 w-5 text-primary" />
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
