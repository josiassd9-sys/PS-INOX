
import type { LiveLoadOption } from './types';

export const liveLoadOptions: LiveLoadOption[] = [
    { id: 'residential', label: 'Uso Residencial', value: 200, exclusive: true, group: 'uso' },
    { id: 'office', label: 'Escritórios', value: 250, exclusive: true, group: 'uso' },
    { id: 'garage', label: 'Garagens', value: 500, exclusive: true, group: 'uso' },
    { id: 'light-storage', label: 'Depósito Leve', value: 400, exclusive: true, group: 'uso' },
    { id: 'partitions', label: 'Paredes/Divisórias', value: 75, exclusive: false, group: 'adicional' },
    { id: 'floor-finish', label: 'Revestimento e Contrapiso', value: 100, exclusive: false, group: 'adicional' },
];
