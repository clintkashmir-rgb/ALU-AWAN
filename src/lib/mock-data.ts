import { Section, Colour, Thickness, Rate, GlassType, HardwareItem } from './types';

export const mockSections: Section[] = [
  // D Series (Data from Image)
  { id: 'd10-12', name: 'D10 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.35, rates: { dull: 447, champagne: 449, white_black: 449 } },
  { id: 'd10-16', name: 'D10 (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.45, rates: { dull: 562, champagne: 564, white_black: 564 } },
  { id: 'd10-20', name: 'D10 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.55, rates: { dull: 693, champagne: 695, white_black: 695 } },
  { id: 'd10a-16', name: 'D10A (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.50, rates: { dull: 632, champagne: 634, white_black: 634 } },
  { id: 'd10a-20', name: 'D10A (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.62, rates: { dull: 777, champagne: 779, white_black: 779 } },
  { id: 'd11-12', name: 'D11 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.16, rates: { dull: 200, champagne: 201, white_black: 201 } },
  { id: 'd14-12', name: 'D14 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.24, rates: { dull: 306, champagne: 308, white_black: 308 } },
  { id: 'd15-12', name: 'D15 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.15, rates: { dull: 195, champagne: 197, white_black: 197 } },
  { id: 'd16-12', name: 'D16 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.40, rates: { dull: 514, champagne: 516, white_black: 516 } },
  { id: 'd16-16', name: 'D16 (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.47, rates: { dull: 593, champagne: 595, white_black: 595 } },
  { id: 'd16-20', name: 'D16 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.58, rates: { dull: 727, champagne: 729, white_black: 729 } },
  { id: 'd18-12', name: 'D18 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.43, rates: { dull: 546, champagne: 548, white_black: 548 } },
  { id: 'd18-16', name: 'D18 (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.56, rates: { dull: 708, champagne: 710, white_black: 710 } },
  { id: 'd18-20', name: 'D18 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.70, rates: { dull: 885, champagne: 887, white_black: 887 } },
  { id: 'd20-20', name: 'D20 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.45, rates: { dull: 573, champagne: 575, white_black: 575 } },
  { id: 'd29-12', name: 'D29/D29D/EM29 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.19, rates: { dull: 237, champagne: 238, white_black: 238 } },
  { id: 'd29-16', name: 'D29 (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.24, rates: { dull: 305, champagne: 307, white_black: 307 } },
  { id: 'd29-20', name: 'D29 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.28, rates: { dull: 349, champagne: 351, white_black: 351 } },
  { id: 'd29a-12', name: 'D29A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.23, rates: { dull: 287, champagne: 288, white_black: 288 } },
  { id: 'd29b-12', name: 'D29B (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.12, rates: { dull: 147, champagne: 148, white_black: 148 } },
  { id: 'd29f-12', name: 'D29F (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.08, rates: { dull: 108, champagne: 109, white_black: 109 } },
  { id: 'd31-12', name: 'D31 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.13, rates: { dull: 165, champagne: 166, white_black: 166 } },
  { id: 'd31-16', name: 'D31 (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.17, rates: { dull: 212, champagne: 213, white_black: 213 } },
  { id: 'd31a-12', name: 'D31A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.17, rates: { dull: 220, champagne: 221, white_black: 221 } },
  { id: 'd32-12', name: 'D32 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.07, rates: { dull: 91, champagne: 92, white_black: 92 } },
  { id: 'd32a-12', name: 'D32A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.13, rates: { dull: 162, champagne: 163, white_black: 163 } },
  { id: 'd32b-12', name: 'D32B (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.14, rates: { dull: 170, champagne: 171, white_black: 171 } },
  { id: 'd32c-12', name: 'D32C (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.16, rates: { dull: 199, champagne: 200, white_black: 200 } },
  { id: 'd33-12', name: 'D33 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.40, rates: { dull: 502, champagne: 504, white_black: 504 } },
  { id: 'd33-16', name: 'D33 (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.53, rates: { dull: 667, champagne: 669, white_black: 669 } },
  { id: 'd33-20', name: 'D33 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.65, rates: { dull: 814, champagne: 816, white_black: 816 } },
  { id: 'd35-12', name: 'D35 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.34, rates: { dull: 429, champagne: 431, white_black: 431 } },
  { id: 'd35-16', name: 'D35 (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.43, rates: { dull: 548, champagne: 550, white_black: 550 } },
  { id: 'd35-20', name: 'D35 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.53, rates: { dull: 663, champagne: 665, white_black: 665 } },
  { id: 'd38-20', name: 'D38 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.55, rates: { dull: 694, champagne: 696, white_black: 696 } },
  { id: 'd38b-16', name: 'D38B (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.32, rates: { dull: 404, champagne: 406, white_black: 406 } },
  { id: 'd38b-20', name: 'D38B (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.40, rates: { dull: 502, champagne: 504, white_black: 504 } },
  { id: 'd38f-16', name: 'D38F (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.38, rates: { dull: 477, champagne: 479, white_black: 479 } },
  { id: 'd38f-20', name: 'D38F (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.47, rates: { dull: 586, champagne: 588, white_black: 588 } },
  { id: 'd40-12', name: 'D40 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.33, rates: { dull: 415, champagne: 417, white_black: 417 } },
  { id: 'd40-16', name: 'D40 (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.37, rates: { dull: 469, champagne: 471, white_black: 471 } },
  { id: 'd40-20', name: 'D40 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.46, rates: { dull: 578, champagne: 580, white_black: 580 } },
  { id: 'd41-12', name: 'D41 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.12, rates: { dull: 158, champagne: 159, white_black: 159 } },
  { id: 'd41b-12', name: 'D41B (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.10, rates: { dull: 127, champagne: 128, white_black: 128 } },
  { id: 'd41c-12', name: 'D41C (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.09, rates: { dull: 116, champagne: 117, white_black: 117 } },
  { id: 'd42-12', name: 'D42 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.22, rates: { dull: 276, champagne: 278, white_black: 278 } },
  { id: 'd42-16', name: 'D42 (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.26, rates: { dull: 333, champagne: 335, white_black: 335 } },
  { id: 'd42-20', name: 'D42 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.30, rates: { dull: 385, champagne: 387, white_black: 387 } },
  { id: 'd42a-12', name: 'D42A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.25, rates: { dull: 319, champagne: 321, white_black: 321 } },
  { id: 'd42fh-12', name: 'D42F / H (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.28, rates: { dull: 353, champagne: 355, white_black: 355 } },
  { id: 'd42fh-16', name: 'D42F / H (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.33, rates: { dull: 417, champagne: 419, white_black: 419 } },
  { id: 'd42fh-20', name: 'D42F / H (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.39, rates: { dull: 497, champagne: 499, white_black: 499 } },
  { id: 'd44-12', name: 'D44 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.27, rates: { dull: 343, champagne: 345, white_black: 345 } },
  { id: 'd44a-12', name: 'D44A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.33, rates: { dull: 421, champagne: 423, white_black: 423 } },
  { id: 'd44a-16', name: 'D44A (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.43, rates: { dull: 545, champagne: 547, white_black: 547 } },
  { id: 'd44a-20', name: 'D44A (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.45, rates: { dull: 570, champagne: 572, white_black: 572 } },
];

export const mockColours: Colour[] = [
  { id: '1', name: '9016 (White)', category: 'white_black' },
  { id: '2', name: 'Black', category: 'white_black' },
  { id: '3', name: 'Champagne', category: 'champagne' },
  { id: '4', name: 'Dull', category: 'dull' },
];

export const mockThickness: Thickness[] = [
  { id: '1', value: '1.2mm' },
  { id: '2', value: '1.6mm' },
  { id: '3', value: '2mm' },
];

export const mockGlassTypes: GlassType[] = [
  { id: '1', name: '6mm Clear Glass', rate_per_sqft: 120 },
  { id: '2', name: '12mm Tempered Glass', rate_per_sqft: 180 },
  { id: '3', name: '6mm Tinted Glass', rate_per_sqft: 140 },
];

export const mockHardware: HardwareItem[] = [
  { id: 'h1', name: 'Handle', rate: 450 },
  { id: 'h2', name: 'Rollers (Pair)', rate: 650 },
  { id: 'h3', name: 'Hinges', rate: 150 },
  { id: 'h4', name: 'Mesh / Jali', rate: 1200 },
];

export const mockRates: Rate = {
  id: 'current',
  aluminum_rate_per_kg: 850,
  glass_rate_per_sqft: 220,
  hardware_rate: 1500,
  labour_rate_per_sqft: 45,
  frame_rate_per_ft: 220,
};
