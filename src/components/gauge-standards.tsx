
"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const gaugeData = {
  standard: [
    { gauge: "3", inches: "0.2391", mm: "6.073" },
    { gauge: "4", inches: "0.2242", mm: "5.695" },
    { gauge: "5", inches: "0.2092", mm: "5.314" },
    { gauge: "6", inches: "0.1943", mm: "4.935" },
    { gauge: "7", inches: "0.1793", mm: "4.554" },
    { gauge: "8", inches: "0.1644", mm: "4.176" },
    { gauge: "9", inches: "0.1495", mm: "3.797" },
    { gauge: "10", inches: "0.1345", mm: "3.416" },
    { gauge: "11", inches: "0.1196", mm: "3.038" },
    { gauge: "12", inches: "0.1046", mm: "2.657" },
    { gauge: "13", inches: "0.0897", mm: "2.278" },
    { gauge: "14", inches: "0.0747", mm: "1.897" },
    { gauge: "15", inches: "0.0673", mm: "1.709" },
    { gauge: "16", inches: "0.0598", mm: "1.519" },
    { gauge: "17", inches: "0.0538", mm: "1.367" },
    { gauge: "18", inches: "0.0478", mm: "1.214" },
    { gauge: "19", inches: "0.0418", mm: "1.062" },
    { gauge: "20", inches: "0.0359", mm: "0.912" },
    { gauge: "21", inches: "0.0329", mm: "0.836" },
    { gauge: "22", inches: "0.0299", mm: "0.759" },
    { gauge: "23", inches: "0.0269", mm: "0.683" },
    { gauge: "24", inches: "0.0239", mm: "0.607" },
    { gauge: "25", inches: "0.0209", mm: "0.531" },
    { gauge: "26", inches: "0.0179", mm: "0.455" },
  ],
  stainless: [
    { gauge: "3", inches: "0.2500", mm: "6.350" },
    { gauge: "4", inches: "0.2344", mm: "5.954" },
    { gauge: "5", inches: "0.2188", mm: "5.558" },
    { gauge: "6", inches: "0.2031", mm: "5.159" },
    { gauge: "7", inches: "0.1875", mm: "4.763" },
    { gauge: "8", inches: "0.1719", mm: "4.366" },
    { gauge: "9", inches: "0.1563", mm: "3.970" },
    { gauge: "10", inches: "0.1406", mm: "3.571" },
    { gauge: "11", inches: "0.1250", mm: "3.175" },
    { gauge: "12", inches: "0.1094", mm: "2.779" },
    { gauge: "13", inches: "0.0938", mm: "2.383" },
    { gauge: "14", inches: "0.0781", mm: "1.984" },
    { gauge: "15", inches: "0.0703", mm: "1.786" },
    { gauge: "16", inches: "0.0625", mm: "1.588" },
    { gauge: "17", inches: "0.0563", mm: "1.430" },
    { gauge: "18", inches: "0.0500", mm: "1.270" },
    { gauge: "19", inches: "0.0438", mm: "1.113" },
    { gauge: "20", inches: "0.0375", mm: "0.953" },
    { gauge: "21", inches: "0.0344", mm: "0.874" },
    { gauge: "22", inches: "0.0313", mm: "0.795" },
    { gauge: "23", inches: "0.0281", mm: "0.714" },
    { gauge: "24", inches: "0.0250", mm: "0.635" },
    { gauge: "25", inches: "0.0219", mm: "0.556" },
    { gauge: "26", inches: "0.0188", mm: "0.478" },
  ],
  aluminum: [
    { gauge: "3", inches: "0.2294", mm: "5.827" },
    { gauge: "4", inches: "0.2043", mm: "5.189" },
    { gauge: "5", inches: "0.1819", mm: "4.620" },
    { gauge: "6", inches: "0.1620", mm: "4.115" },
    { gauge: "7", inches: "0.1443", mm: "3.665" },
    { gauge: "8", inches: "0.1285", mm: "3.264" },
    { gauge: "9", inches: "0.1144", mm: "2.906" },
    { gauge: "10", inches: "0.1019", mm: "2.588" },
    { gauge: "11", inches: "0.0907", mm: "2.304" },
    { gauge: "12", inches: "0.0808", mm: "2.052" },
    { gauge: "13", inches: "0.0720", mm: "1.829" },
    { gauge: "14", inches: "0.0641", mm: "1.628" },
    { gauge: "15", inches: "0.0571", mm: "1.450" },
    { gauge: "16", inches: "0.0508", mm: "1.290" },
    { gauge: "17", inches: "0.0453", mm: "1.151" },
    { gauge: "18", inches: "0.0403", mm: "1.024" },
    { gauge: "19", inches: "0.0359", mm: "0.912" },
    { gauge: "20", inches: "0.0320", mm: "0.813" },
    { gauge: "21", inches: "0.0285", mm: "0.724" },
    { gauge: "22", inches: "0.0253", mm: "0.643" },
    { gauge: "23", inches: "0.0226", mm: "0.574" },
    { gauge: "24", inches: "0.0201", mm: "0.511" },
    { gauge: "25", inches: "0.0179", mm: "0.455" },
    { gauge: "26", inches: "0.0159", mm: "0.404" },
  ]
};

const GaugeTable = ({ data }: { data: { gauge: string; inches: string; mm: string }[] }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-1/3">Gauge</TableHead>
                <TableHead className="w-1/3 text-right">Polegadas (in)</TableHead>
                <TableHead className="w-1/3 text-right">Milímetros (mm)</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((item) => (
                <TableRow key={item.gauge}>
                    <TableCell className="font-medium">{item.gauge}</TableCell>
                    <TableCell className="text-right">{item.inches}</TableCell>
                    <TableCell className="text-right">{item.mm}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);


export function GaugeStandards() {
  return (
    <>
      <Card className="mb-1 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Tabela de Padrão de Gauge para Chapas</CardTitle>
          <CardDescription>
            Consulte a espessura de chapas de metal com base no número do gauge para Aço Padrão, Aço Inoxidável e Alumínio.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="stainless" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stainless">Aço Inox</TabsTrigger>
          <TabsTrigger value="standard">Aço Padrão</TabsTrigger>
          <TabsTrigger value="aluminum">Alumínio</TabsTrigger>
        </TabsList>
        <TabsContent value="standard">
            <Card>
                <CardContent className="p-1">
                    <GaugeTable data={gaugeData.standard} />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="stainless">
            <Card>
                <CardContent className="p-1">
                    <GaugeTable data={gaugeData.stainless} />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="aluminum">
            <Card>
                <CardContent className="p-1">
                    <GaugeTable data={gaugeData.aluminum} />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
