
import type { SteelItem, Category, ConnectionGroup, ScrapItem, CategoryGroup, Perfil, PerfilIpe, SteelDeck, BudgetItem, SupportReaction } from './types';
import { perfisData, tiposAco, PESO_CONCRETO_KGF_M3, E_ACO_MPA } from './perfis';
import { perfisIpeData } from './perfis-ipe';
import { steelDeckData } from './steel-deck';
import { scrapItems } from './sucata';
import { tubosOdItems } from './tubos-od';
import { tubosAliancaItems } from './tubos-alianca';
import { connectionsGroups } from './conexoes';
import { chapasItems } from './chapas';
import { bronzeRodsItems } from './tarugo-bronze';
import { aluminumRodsItems } from './verg-aluminio';
import { chapasAluminioItems } from './chapas-aluminio';
import { brassRodsItems } from './verg-latao';
import { barrasRedondasItems } from './barras-redondas';
import { barrasQuadradasItems } from './barras-quadradas';
import { barrasSextavadasItems } from './barras-sextavadas';
import { tubosScheduleItems } from './tubos-schedule';
import { cantoneirasItems } from './cantoneiras';
import { barrasChatasItems } from './barras-chatas';
import { metalonQuadradoItems } from './metalon-quadrado';
import { metalonRetangularItems } from './metalon-retangular';

const ALL_CATEGORIES: Category[] = [
  {
    id: 'package-checker',
    name: 'Conferência',
    description: 'Selecione item e insira os dados para calculo de metragem e custo.',
    icon: 'PackageCheck',
    unit: 'calc',
    items: [],
  },
  {
    id: 'balanca',
    name: 'Balança',
    description: 'Insira os dados de pesagem para calcular o peso líquido.',
    icon: 'Weight',
    unit: 'calc',
    items: [],
  },
  {
    id: 'tabela-sucata',
    name: 'Tabela Sucata',
    description: 'Tabela de preços e composição de sucatas.',
    icon: 'Trash2',
    unit: 'kg',
    items: scrapItems,
  },
  {
    id: 'tubos-od',
    name: 'Tubos OD',
    description: 'Tubos redondos com medidas em polegadas e parede em milímetros.',
    icon: 'Minus',
    unit: 'm',
    items: tubosOdItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 30,
    defaultMarkup: 50,
  },
  {
    id: 'tubos-alianca',
    name: 'Tubos Aliança (DIN)',
    description: 'Tubos redondos padrão DIN 2458.',
    icon: 'GalleryVertical',
    unit: 'm',
    items: tubosAliancaItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 30,
    defaultMarkup: 50,
  },
  {
    id: 'conexoes',
    name: 'Conexões',
    description: 'Catálogo de conexões sanitárias, roscadas e de solda.',
    icon: 'Link',
    unit: 'un',
    items: connectionsGroups,
    hasOwnPriceControls: true,
    defaultCostPrice: 40,
    defaultMarkup: 50,
  },
  {
    id: 'chapas',
    name: 'Chapas',
    description: 'Chapas de aço inoxidável em diversas espessuras e dimensões.',
    icon: 'Square',
    unit: 'un',
    items: chapasItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 30,
    defaultMarkup: 50,
  },
  {
    id: 'tarugo-bronze',
    name: 'Tarugo Bronze',
    description: 'Tarugos de Bronze TM23 em diversas bitolas.',
    icon: 'Circle',
    unit: 'm',
    items: bronzeRodsItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 45,
    defaultMarkup: 50,
  },
  {
    id: 'verg-aluminio',
    name: 'Verg. Alumínio',
    description: 'Vergalhões de Alumínio 6351 T6 em diversas bitolas.',
    icon: 'Circle',
    unit: 'm',
    items: aluminumRodsItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 20,
    defaultMarkup: 50,
  },
  {
    id: 'chapas-aluminio',
    name: 'Chapas Alumínio',
    description: 'Chapas de alumínio em diversas espessuras e dimensões.',
    icon: 'Square',
    unit: 'un',
    items: chapasAluminioItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 25,
    defaultMarkup: 50,
  },
  {
    id: 'verg-latao',
    name: 'Verg. Latão',
    description: 'Vergalhões de Latão em diversas bitolas.',
    icon: 'Circle',
    unit: 'm',
    items: brassRodsItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 35,
    defaultMarkup: 50,
  },
  {
    id: 'barras-redondas',
    name: 'Barras Redondas',
    description: 'Barras redondas maciças em diversas bitolas.',
    icon: 'Circle',
    unit: 'm',
    items: barrasRedondasItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 30,
    defaultMarkup: 50,
  },
  {
    id: 'barra-quadrada',
    name: 'Barra Quadrada',
    description: 'Barras quadradas maciças em diversas bitolas.',
    icon: 'Square',
    unit: 'm',
    items: barrasQuadradasItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 30,
    defaultMarkup: 50,
  },
  {
    id: 'barra-sextavada',
    name: 'Barra Sextavada',
    description: 'Barras sextavadas maciças em diversas bitolas.',
    icon: 'Hexagon',
    unit: 'm',
    items: barrasSextavadasItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 30,
    defaultMarkup: 50,
  },
  {
    id: 'tubos-schedule',
    name: 'Tubos Schedule',
    description: 'Tubos redondos para condução de fluídos, norma Schedule.',
    icon: 'Layers',
    unit: 'm',
    items: tubosScheduleItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 30,
    defaultMarkup: 50,
  },
  {
    id: 'cantoneiras',
    name: 'Cantoneiras',
    description: 'Cantoneiras em "L" com diversas medidas.',
    icon: 'FlipHorizontal',
    unit: 'm',
    items: cantoneirasItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 30,
    defaultMarkup: 50,
  },
  {
    id: 'barras-chatas',
    name: 'Barras Chatas',
    description: 'Barras chatas (retangulares) em diversas medidas.',
    icon: 'RectangleHorizontal',
    unit: 'm',
    items: barrasChatasItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 30,
    defaultMarkup: 50,
  },
  {
    id: 'metalon-quadrado',
    name: 'Metalon Quadrado',
    description: 'Tubos quadrados (metalon) em diversas medidas.',
    icon: 'Square',
    unit: 'm',
    items: metalonQuadradoItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 30,
    defaultMarkup: 50,
  },
  {
    id: 'metalon-retangular',
    name: 'Metalon Retangular',
    description: 'Tubos retangulares (metalon) em diversas medidas.',
    icon: 'RectangleHorizontal',
    unit: 'm',
    items: metalonRetangularItems,
    hasOwnPriceControls: true,
    defaultCostPrice: 30,
    defaultMarkup: 50,
  },
  {
    id: 'normas-astm',
    name: 'Normas ASTM',
    description: 'Guia de normas técnicas para aço inoxidável.',
    icon: 'Book',
    unit: 'calc',
    items: [],
  },
  {
    id: 'processos-fabricacao',
    name: 'Processos',
    description: 'Processos de produção e trabalho com aço inoxidável.',
    icon: 'Factory',
    unit: 'calc',
    items: [],
  },
  {
    id: 'desenho-tecnico',
    name: 'Desenho Técnico',
    description: 'Guia de leitura e interpretação de desenhos.',
    icon: 'DraftingCompass',
    unit: 'calc',
    items: [],
  },
   {
    id: 'gauge',
    name: 'Tabela de Gauges',
    description: 'Tabela de referência para espessuras de chapas (gauge).',
    icon: 'Sheet',
    unit: 'calc',
    items: [],
  },
  {
    id: 'ai-assistant',
    name: 'Assistente IA',
    description: 'Assistente de IA para otimização de preços e custos.',
    icon: 'Sparkles',
    unit: 'calc',
    items: [],
  },
   {
    id: 'perfis/parametros-vigas-i',
    name: 'Parâmetros Vigas I',
    description: 'Entenda o significado de cada propriedade geométrica e física que define um perfil de aço estrutural.',
    icon: 'Variable',
    unit: 'calc',
    items: [],
  },
  {
    id: 'perfis/tabela-w',
    name: 'Tabela Perfis W',
    description: 'Consulte as propriedades dos perfis de aço padrão W (Gerdau/Açominas).',
    icon: 'Ruler',
    unit: 'calc',
    items: [],
  },
    {
    id: 'perfis/tabela-ipe',
    name: 'Tabela Perfis IPE',
    description: 'Consulte as propriedades dos perfis de aço padrão IPE.',
    icon: 'Ruler',
    unit: 'calc',
    items: [],
  },
  {
    id: 'perfis/tabela-steel-deck',
    name: 'Tabela Steel Deck',
    description: 'Consulte as propriedades das chapas de Steel Deck.',
    icon: 'Ruler',
    unit: 'calc',
    items: [],
  },
  {
    id: 'perfis/informacoes',
    name: 'Informações Técnicas',
    description: 'Contexto e conceitos fundamentais para o uso e dimensionamento de perfis de aço estrutural.',
    icon: 'BookOpen',
    unit: 'calc',
    items: [],
  },
  {
    id: 'perfis/calculadora',
    name: 'Calculadora de Estruturas',
    description: 'Dimensione vigas, pilares e lajes steel deck.',
    icon: 'Calculator',
    unit: 'calc',
    items: [],
  },
  {
    id: 'perfis/guia',
    name: 'Guia da Calculadora',
    description: 'Aprenda a usar a calculadora de estruturas passo a passo.',
    icon: 'BookOpen',
    unit: 'calc',
    items: [],
  },
  {
    id: 'lista-materiais',
    name: 'Lista de Materiais',
    description: 'Crie e gerencie listas de materiais para projetos.',
    icon: 'ClipboardList',
    unit: 'calc',
    items: [],
  },
    {
    id: 'lista-sucatas',
    name: 'Lista de Sucatas',
    description: 'Crie e gerencie listas de sucatas.',
    icon: 'ScrapClaw',
    unit: 'calc',
    items: [],
  }
];

const CATEGORY_GROUPS: CategoryGroup[] = [
    {
        title: 'FERRAMENTAS',
        items: [
            ALL_CATEGORIES.find(c => c.id === 'lista-materiais')!,
            ALL_CATEGORIES.find(c => c.id === 'package-checker')!,
            ALL_CATEGORIES.find(c => c.id === 'balanca')!,
            ALL_CATEGORIES.find(c => c.id === 'tabela-sucata')!,
            ALL_CATEGORIES.find(c => c.id === 'lista-sucatas')!,
        ]
    },
    {
        title: 'MATERIAIS (AÇO INOX)',
        items: [
            ALL_CATEGORIES.find(c => c.id === 'conexoes')!,
            ALL_CATEGORIES.find(c => c.id === 'tubos-od')!,
            ALL_CATEGORIES.find(c => c.id === 'tubos-schedule')!,
            ALL_CATEGORIES.find(c => c.id === 'tubos-alianca')!,
            ALL_CATEGORIES.find(c => c.id === 'metalon-quadrado')!,
            ALL_CATEGORIES.find(c => c.id === 'metalon-retangular')!,
            ALL_CATEGORIES.find(c => c.id === 'barras-redondas')!,
            ALL_CATEGORIES.find(c => c.id === 'barra-quadrada')!,
            ALL_CATEGORIES.find(c => c.id === 'barra-sextavada')!,
            ALL_CATEGORIES.find(c => c.id === 'barras-chatas')!,
            ALL_CATEGORIES.find(c => c.id === 'cantoneiras')!,
            ALL_CATEGORIES.find(c => c.id === 'chapas')!,
        ]
    },
    {
        title: 'OUTROS METAIS',
        items: [
            ALL_CATEGORIES.find(c => c.id === 'tarugo-bronze')!,
            ALL_CATEGORIES.find(c => c.id === 'verg-aluminio')!,
            ALL_CATEGORIES.find(c => c.id === 'chapas-aluminio')!,
            ALL_CATEGORIES.find(c => c.id === 'verg-latao')!,
        ]
    },
    {
        title: 'INFORMATIVOS',
        items: [
            ALL_CATEGORIES.find(c => c.id === 'ai-assistant')!,
            ALL_CATEGORIES.find(c => c.id === 'normas-astm')!,
            ALL_CATEGORIES.find(c => c.id === 'processos-fabricacao')!,
            ALL_CATEGORIES.find(c => c.id === 'desenho-tecnico')!,
            ALL_CATEGORIES.find(c => c.id === 'gauge')!,
        ]
    },
    {
        title: 'Perfis de Aço',
        items: [
            ALL_CATEGORIES.find(c => c.id === 'perfis/guia')!,
            ALL_CATEGORIES.find(c => c.id === 'perfis/calculadora')!,
            ALL_CATEGORIES.find(c => c.id === 'perfis/tabela-w')!,
            ALL_CATEGORIES.find(c => c.id === 'perfis/tabela-ipe')!,
            ALL_CATEGORIES.find(c => c.id === 'perfis/tabela-steel-deck')!,
            ALL_CATEGORIES.find(c => c.id === 'perfis/parametros-vigas-i')!,
            ALL_CATEGORIES.find(c => c.id === 'perfis/informacoes')!,
        ]
    },
];

export { 
    ALL_CATEGORIES, 
    CATEGORY_GROUPS,
    perfisData,
    perfisIpeData,
    steelDeckData,
    tiposAco,
    PESO_CONCRETO_KGF_M3,
    E_ACO_MPA
};
export type { SteelItem, Category, ConnectionGroup, ScrapItem, CategoryGroup, Perfil, PerfilIpe, SteelDeck, BudgetItem, SupportReaction };
