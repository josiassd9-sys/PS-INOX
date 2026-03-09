
import type { LiveLoadOption } from './types';

// Valores aproximados baseados na NBR 6120 (1 kN/m² ≈ 100 kgf/m²)
export const liveLoadOptions: LiveLoadOption[] = [
    // Cargas de Uso Principal (exclusivas entre si)
    { id: 'residential', label: 'Piso Residencial', value: 150, exclusive: true, group: 'uso' },
    { id: 'office', label: 'Piso de Escritórios', value: 200, exclusive: true, group: 'uso' },
    { id: 'library_reading', label: 'Biblioteca (Sala de Leitura)', value: 300, exclusive: true, group: 'uso' },
    { id: 'archives', label: 'Depósitos / Arquivos', value: 500, exclusive: true, group: 'uso' },
    { id: 'garage', label: 'Garagens', value: 300, exclusive: true, group: 'uso' },
    
    // Cargas de Cobertura (exclusivas entre si)
    { id: 'roof-inaccessible', label: 'Cobertura Inacessível', value: 50, exclusive: true, group: 'cobertura' },
    { id: 'roof-maintenance', label: 'Cobertura com Manutenção', value: 100, exclusive: true, group: 'cobertura' },

    // Cargas Adicionais (não exclusivas)
    { id: 'partitions', label: 'Paredes/Divisórias Leves', value: 100, exclusive: false, group: 'adicional' },
    { id: 'floor-finish', label: 'Revestimento e Contrapiso', value: 100, exclusive: false, group: 'adicional' },
    { id: 'water-accumulation', label: 'Lâmina d\'água (5cm)', value: 50, exclusive: false, group: 'adicional' },
];
