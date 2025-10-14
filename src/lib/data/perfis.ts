
export type Perfil = {
    nome: string;
    peso: number; // kg/m
    area: number; // cm²
    h: number; // mm
    b: number; // mm
    tw: number; // mm
    tf: number; // mm
    d: number; // mm
    Ix: number; // cm⁴
    Wx: number; // cm³
    rx: number; // cm
    Iy: number; // cm⁴
    Wy: number; // cm³
    ry: number; // cm
};

// Exemplo de dados - Catálogo Gerdau (W) - Adicionar mais conforme necessário
export const perfisData: Perfil[] = [
    { nome: "W150x13", peso: 13.0, area: 16.6, h: 150, b: 100, tw: 4.8, tf: 5.8, d: 125, Ix: 699, Wx: 93.3, rx: 6.49, Iy: 97.4, Wy: 19.5, ry: 2.42 },
    { nome: "W150x18", peso: 18.0, area: 22.9, h: 155, b: 102, tw: 5.8, tf: 8.1, d: 125, Ix: 1070, Wx: 138, rx: 6.83, Iy: 154, Wy: 30.1, ry: 2.59 },
    { nome: "W200x15", peso: 15.0, area: 19.1, h: 201, b: 101, tw: 4.3, tf: 5.8, d: 175, Ix: 1330, Wx: 132, rx: 8.35, Iy: 97.4, Wy: 19.3, ry: 2.26 },
    { nome: "W200x21", peso: 21.3, area: 27.1, h: 206, b: 133, tw: 5.6, tf: 7.9, d: 175, Ix: 2030, Wx: 197, rx: 8.66, Iy: 441, Wy: 66.4, ry: 4.04 },
    { nome: "W250x33", peso: 32.7, area: 41.7, h: 254, b: 146, tw: 6.1, tf: 9.1, d: 225, Ix: 4910, Wx: 387, rx: 10.8, Iy: 699, Wy: 95.8, ry: 4.09 },
];

    