import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ScrapListPdfItem = {
  description: string;
  unit?: string;
  quantity: number;
  weight: number;
  price: number;
};

type GenerateScrapListPdfParams = {
  items: ScrapListPdfItem[];
  totalWeight: number;
  totalPrice: number;
};

function formatNumber(value: number, decimals = 3): string {
  if (!Number.isFinite(value)) return '0';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export async function generateScrapListPdf({
  items,
  totalWeight,
  totalPrice,
}: GenerateScrapListPdfParams): Promise<'native' | 'web'> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const now = new Date();
  const dataHora = `${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`;
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const fileName = `lista_sucatas_${stamp}.pdf`;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('PS INOX', 105, 16, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('LISTA DE SUCATAS', 105, 23, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Data/Hora: ${dataHora}`, 20, 30);

  autoTable(doc, {
    startY: 36,
    head: [['DESCRICAO', 'UN', 'QTD', 'PESO', 'VALOR']],
    body: items.map((item) => [
      item.description || '-',
      (item.unit || '-').toUpperCase(),
      String(item.quantity ?? 0),
      `${formatNumber(item.weight, 3)} kg`,
      formatCurrency(item.price),
    ]),
    theme: 'grid',
    margin: { left: 14, right: 14 },
    styles: { fontSize: 8.5, cellPadding: 1.8, halign: 'right' },
    headStyles: { fontStyle: 'bold', fillColor: [33, 37, 41], textColor: [255, 255, 255] },
    columnStyles: {
      0: { halign: 'left', cellWidth: 88 },
      1: { halign: 'center', cellWidth: 14 },
      2: { halign: 'center', cellWidth: 16 },
      3: { halign: 'right', cellWidth: 28 },
      4: { halign: 'right', cellWidth: 34 },
    },
  });

  const tableRef = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable;
  const finalY = tableRef?.finalY ?? 60;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Peso Total: ${formatNumber(totalWeight, 3)} kg`, 14, finalY + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Total: ${formatCurrency(totalPrice)}`, 196, finalY + 9, { align: 'right' });

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
      title: 'Lista de Sucatas',
      text: 'PDF da lista de sucatas gerado pelo PS INOX',
      url: uri.uri,
      dialogTitle: 'Compartilhar PDF',
    });

    return 'native';
  }

  doc.save(fileName);
  return 'web';
}