
export type PerfilIpe = {
    nome: string;
    h: number; // mm
    b: number; // mm
    tw: number; // mm
    tf: number; // mm
    area: number; // cm²
    peso: number; // kg/m
    Ix: number; // cm⁴
    Wx: number; // cm³
    rx: number; // cm
    Iy: number; // cm⁴
    Wy: number; // cm³
    ry: number; // cm
};

export const perfisIpeData: PerfilIpe[] = [
    { nome: "IPE 80", h: 80, b: 46, tw: 3.8, tf: 5.2, area: 7.64, peso: 6.0, Ix: 80.1, Wx: 20.0, rx: 3.24, Iy: 6.7, Wy: 2.9, ry: 0.94 },
    { nome: "IPE 100", h: 100, b: 55, tw: 4.1, tf: 5.7, area: 10.3, peso: 8.1, Ix: 171, Wx: 34.2, rx: 4.07, Iy: 13.7, Wy: 5.0, ry: 1.15 },
    { nome: "IPE 120", h: 120, b: 64, tw: 4.4, tf: 6.3, area: 13.2, peso: 10.4, Ix: 318, Wx: 53.0, rx: 4.91, Iy: 25.0, Wy: 7.8, ry: 1.38 },
    { nome: "IPE 140", h: 140, b: 73, tw: 4.7, tf: 6.9, area: 16.4, peso: 12.9, Ix: 541, Wx: 77.3, rx: 5.75, Iy: 41.9, Wy: 11.5, ry: 1.60 },
    { nome: "IPE 160", h: 160, b: 82, tw: 5.0, tf: 7.4, area: 20.1, peso: 15.8, Ix: 869, Wx: 109, rx: 6.57, Iy: 63.8, Wy: 15.6, ry: 1.78 },
    { nome: "IPE 180", h: 180, b: 91, tw: 5.3, tf: 8.0, area: 23.9, peso: 18.8, Ix: 1317, Wx: 146, rx: 7.42, Iy: 91.9, Wy: 20.2, ry: 1.96 },
    { nome: "IPE 200", h: 200, b: 100, tw: 5.6, tf: 8.5, area: 28.5, peso: 22.4, Ix: 1943, Wx: 194, rx: 8.25, Iy: 130, Wy: 25.9, ry: 2.14 },
    { nome: "IPE 220", h: 220, b: 110, tw: 5.9, tf: 9.2, area: 33.4, peso: 26.2, Ix: 2772, Wx: 252, rx: 9.10, Iy: 181, Wy: 32.8, ry: 2.33 },
    { nome: "IPE 240", h: 240, b: 120, tw: 6.2, tf: 9.8, area: 39.1, peso: 30.7, Ix: 3892, Wx: 324, rx: 9.97, Iy: 248, Wy: 41.3, ry: 2.52 },
    { nome: "IPE 270", h: 270, b: 135, tw: 6.6, tf: 10.2, area: 45.9, peso: 36.1, Ix: 5790, Wx: 429, rx: 11.2, Iy: 368, Wy: 54.5, ry: 2.83 },
    { nome: "IPE 300", h: 300, b: 150, tw: 7.1, tf: 10.7, area: 53.8, peso: 42.2, Ix: 8356, Wx: 557, rx: 12.5, Iy: 551, Wy: 73.4, ry: 3.20 },
];

    