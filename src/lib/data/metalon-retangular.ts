import type { SteelItem } from './types';
import { calculateRectangularTubeWeight } from './constants';

export const metalonRetangularItems: SteelItem[] = [
        { id: 'mr-40x10-1.0', unit: 'm', description: 'Metalon 40x10 x 1.00mm', weight: calculateRectangularTubeWeight(40, 10, 1.0) },
        { id: 'mr-40x10-1.2', unit: 'm', description: 'Metalon 40x10 x 1.20mm', weight: calculateRectangularTubeWeight(40, 10, 1.2) },
        { id: 'mr-40x10-1.5', unit: 'm', description: 'Metalon 40x10 x 1.50mm', weight: calculateRectangularTubeWeight(40, 10, 1.5) },
        { id: 'mr-40x20-1.0', unit: 'm', description: 'Metalon 40x20 x 1.00mm', weight: calculateRectangularTubeWeight(40, 20, 1.0) },
        { id: 'mr-40x20-1.2', unit: 'm', description: 'Metalon 40x20 x 1.20mm', weight: calculateRectangularTubeWeight(40, 20, 1.2) },
        { id: 'mr-40x20-1.5', unit: 'm', description: 'Metalon 40x20 x 1.50mm', weight: calculateRectangularTubeWeight(40, 20, 1.5) },
        { id: 'mr-50x20-1.2', unit: 'm', description: 'Metalon 50x20 x 1.20mm', weight: calculateRectangularTubeWeight(50, 20, 1.2) },
        { id: 'mr-50x20-1.5', unit: 'm', description: 'Metalon 50x20 x 1.50mm', weight: calculateRectangularTubeWeight(50, 20, 1.5) },
        { id: 'mr-50x30-1.2', unit: 'm', description: 'Metalon 50x30 x 1.20mm', weight: calculateRectangularTubeWeight(50, 30, 1.2) },
        { id: 'mr-50x30-1.5', unit: 'm', description: 'Metalon 50x30 x 1.50mm', weight: calculateRectangularTubeWeight(50, 30, 1.5) },
        { id: 'mr-60x40-1.2', unit: 'm', description: 'Metalon 60x40 x 1.20mm', weight: calculateRectangularTubeWeight(60, 40, 1.2) },
        { id: 'mr-60x40-1.5', unit: 'm', description: 'Metalon 60x40 x 1.50mm', weight: calculateRectangularTubeWeight(60, 40, 1.5) },
        { id: 'mr-80x40-1.2', unit: 'm', description: 'Metalon 80x40 x 1.20mm', weight: calculateRectangularTubeWeight(80, 40, 1.2) },
        { id: 'mr-80x40-1.5', unit: 'm', description: 'Metalon 80x40 x 1.50mm', weight: calculateRectangularTubeWeight(80, 40, 1.5) },
        { id: 'mr-100x40-1.2', unit: 'm', description: 'Metalon 100x40 x 1.20mm', weight: calculateRectangularTubeWeight(100, 40, 1.2) },
        { id: 'mr-100x40-1.5', unit: 'm', description: 'Metalon 100x40 x 1.50mm', weight: calculateRectangularTubeWeight(100, 40, 1.5) },
        { id: 'mr-100x50-1.5', unit: 'm', description: 'Metalon 100x50 x 1.50mm', weight: calculateRectangularTubeWeight(100, 50, 1.5) },
        { id: 'mr-100x50-2.0', unit: 'm', description: 'Metalon 100x50 x 2.00mm', weight: calculateRectangularTubeWeight(100, 50, 2.0) },
        { id: 'mr-100x50-3.0', unit: 'm', description: 'Metalon 100x50 x 3.00mm', weight: calculateRectangularTubeWeight(100, 50, 3.0) },
        { id: 'mr-120x60-2.0', unit: 'm', description: 'Metalon 120x60 x 2.00mm', weight: calculateRectangularTubeWeight(120, 60, 2.0) },
        { id: 'mr-120x60-3.0', unit: 'm', description: 'Metalon 120x60 x 3.00mm', weight: calculateRectangularTubeWeight(120, 60, 3.0) },
        { id: 'mr-150x50-2.0', unit: 'm', description: 'Metalon 150x50 x 2.00mm', weight: calculateRectangularTubeWeight(150, 50, 2.0) },
        { id: 'mr-150x50-3.0', unit: 'm', description: 'Metalon 150x50 x 3.00mm', weight: calculateRectangularTubeWeight(150, 50, 3.0) },
    ].map(item => ({...item, categoryName: 'Metalon Retangular'}));
