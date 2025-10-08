export const INCH_TO_MM = 25.4;

// Densities
export const STAINLESS_STEEL_DENSITY_KG_M3 = 7980;
export const BRONZE_TM23_DENSITY_KG_M3 = 8800;
export const ALUMINUM_DENSITY_KG_M3 = 2710;
export const BRASS_DENSITY_KG_M3 = 8500;


// For tubes: Weight(kg/m) = (OD_mm - WT_mm) * WT_mm * (PI * DENSITY / 1000000)
export const TUBE_WEIGHT_CONSTANT = Math.PI * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);

// For sheets: Weight(kg/m²) = Thickness_mm * (DENSITY / 1000)
export const SHEET_WEIGHT_CONSTANT = STAINLESS_STEEL_DENSITY_KG_M3 / 1000;
export const ALUMINUM_SHEET_WEIGHT_CONSTANT = ALUMINUM_DENSITY_KG_M3 / 1000;

// For round bars: Weight(kg/m) = D_mm^2 * (PI/4) * (DENSITY / 1000000)
export const ROUND_BAR_WEIGHT_CONSTANT =
  (Math.PI / 4) * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);

// New constants for new materials
export const BRONZE_BAR_WEIGHT_CONSTANT = (Math.PI / 4) * (BRONZE_TM23_DENSITY_KG_M3 / 1000000);
export const ALUMINUM_BAR_WEIGHT_CONSTANT = (Math.PI / 4) * (ALUMINUM_DENSITY_KG_M3 / 1000000);
export const BRASS_BAR_WEIGHT_CONSTANT = (Math.PI / 4) * (BRASS_DENSITY_KG_M3 / 1000000);


// For square bars: Weight(kg/m) = Side_mm^2 * (DENSITY / 1000000)
export const SQUARE_BAR_WEIGHT_CONSTANT = STAINLESS_STEEL_DENSITY_KG_M3 / 1000000;

// For hexagonal bars: Weight(kg/m) = (sqrt(3)/2) * D_mm^2 * (DENSITY / 1000000)
export const HEXAGONAL_BAR_WEIGHT_CONSTANT = (Math.sqrt(3)/2) * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);


// For angle bars: Weight(kg/m) = ( (Leg_A_mm * 2) - Thickness_mm ) * Thickness_mm * (DENSITY / 1000000)
export const calculateAngleBarWeight = (leg_mm: number, thickness_mm: number) => {
    return ((leg_mm * 2) - thickness_mm) * thickness_mm * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);
}

// For flat bars: Weight(kg/m) = Width_mm * Thickness_mm * (DENSITY / 1000000)
export const calculateFlatBarWeight = (width_mm: number, thickness_mm: number) => {
    return width_mm * thickness_mm * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);
}

// For square tubes: Weight(kg/m) = (Side_mm * 4 - (Thickness_mm * 4)) * Thickness_mm * (DENSITY / 1000000)
export const calculateSquareTubeWeight = (side_mm: number, thickness_mm: number) => {
    return ((side_mm * 4) - (thickness_mm * 4)) * thickness_mm * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);
}

// For rectangular tubes: Weight(kg/m) = ( (Side_A_mm + Side_B_mm) * 2 - (Thickness_mm * 4) ) * Thickness_mm * (DENSITY / 1000000)
export const calculateRectangularTubeWeight = (side_a_mm: number, side_b_mm: number, thickness_mm: number) => {
    return ( (side_a_mm + side_b_mm) * 2 - (thickness_mm * 4) ) * thickness_mm * (STAINLESS_STEEL_DENSITY_KG_M3 / 1000000);
}
