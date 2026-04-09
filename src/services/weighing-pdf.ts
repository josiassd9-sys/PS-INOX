import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type HeaderData = {
  client: string;
  plate: string;
  driver: string;
};

type WeighingItemNumeric = {
  material: string;
  bruto: number;
  tara: number;
  descontos: number;
  liquido: number;
};

type WeighingSetNumeric = {
  name: string;
  descontoCacamba: number;
  items: WeighingItemNumeric[];
};

type GenerateWeighingPdfParams = {
  headerData: HeaderData;
  weighingSets: WeighingSetNumeric[];
  grandTotalLiquido: number;
};

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('pt-BR').format(value);
}

export async function generateWeighingPdf({
  headerData,
  weighingSets,
  grandTotalLiquido,
}: GenerateWeighingPdfParams): Promise<'native' | 'web'> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const now = new Date();
  const dataHora = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`;
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const fileName = `pesagem_${stamp}.pdf`;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('PS INOX', 105, 16, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PSINOX COMERCIO DE ACO LTDA', 105, 23, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Data/Hora: ${dataHora}`, 20, 30);
  doc.text(`Cliente: ${headerData.client || 'N/A'}`, 20, 35);
  doc.text(`Motorista: ${headerData.driver || 'N/A'}`, 100, 35);
  doc.text(`Placa: ${headerData.plate || 'N/A'}`, 170, 35, { align: 'right' });

  let y = 42;

  weighingSets.forEach((set) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(set.name.toUpperCase(), 20, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      head: [['PRODUTO', 'BRUTO', 'TARA', 'DESC', 'LIQUIDO']],
      body: set.items.map((item) => [
        item.material || '-',
        formatNumber(item.bruto),
        formatNumber(item.tara),
        formatNumber(item.descontos),
        formatNumber(item.liquido),
      ]),
      theme: 'plain',
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9, cellPadding: 1.4, halign: 'right' },
      headStyles: { fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'left', cellWidth: 80 },
      },
    });

    const tableRef = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable;
    const finalY = tableRef?.finalY ?? y + 10;

    const totalSetLiquido = set.items.reduce((acc, item) => acc + item.liquido, 0) - set.descontoCacamba;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('DESCONTO CACAMBA', 20, finalY + 5);
    doc.text(`-${formatNumber(set.descontoCacamba)}`, 190, finalY + 5, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL CACAMBA', 20, finalY + 10);
    doc.text(formatNumber(totalSetLiquido), 190, finalY + 10, { align: 'right' });

    y = finalY + 16;
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PESO LIQUIDO TOTAL', 20, y + 4);
  doc.text(`${formatNumber(grandTotalLiquido)} KG`, 190, y + 4, { align: 'right' });

  if (Capacitor.isNativePlatform()) {
    const base64 = doc.output('datauristring').split(',')[1] ?? '';

    await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: Directory.Documents,
      recursive: true,
    });

    const uri = await Filesystem.getUri({ path: fileName, directory: Directory.Documents });

    await Share.share({
      title: 'Relatorio de Pesagem',
      text: 'PDF da pesagem gerado pelo PS INOX',
      url: uri.uri,
      dialogTitle: 'Compartilhar PDF',
    });

    return 'native';
  }

  doc.save(fileName);
  return 'web';
}
