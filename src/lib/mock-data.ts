import { Section, Colour, Thickness, Rate, GlassType, HardwareItem } from './types';

export const mockSections: Section[] = [
  // Original D Series
  { id: 'd10-12', name: 'D10 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.35, rates: { dull: 447, champagne: 449, white_black: 449 } },
  { id: 'd16-12', name: 'D16 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.40, rates: { dull: 514, champagne: 516, white_black: 516 } },
  { id: 'd18-12', name: 'D18 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.43, rates: { dull: 546, champagne: 548, white_black: 548 } },
  { id: 'd26-12', name: 'D26 Bottom (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.38, rates: { dull: 490, champagne: 492, white_black: 492 } },
  { id: 'd30-12', name: 'D30 Top (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.40, rates: { dull: 502, champagne: 504, white_black: 504 } },
  
  // New Sections from Image 1
  { id: 'd46-12', name: 'D46 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.55, rates: { dull: 747, champagne: 749, white_black: 749 } },
  { id: 'd46-16', name: 'D46 (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.68, rates: { dull: 943, champagne: 945, white_black: 945 } },
  { id: 'd46-20', name: 'D46 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.82, rates: { dull: 1157, champagne: 1159, white_black: 1159 } },
  { id: 'd48-20', name: 'D48 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.75, rates: { dull: 1026, champagne: 1028, white_black: 1028 } },
  { id: 'd48-32', name: 'D48 (3.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 1.05, rates: { dull: 1431, champagne: 1433, white_black: 1433 } },
  { id: 'd48a-12', name: 'D48A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.38, rates: { dull: 501, champagne: 503, white_black: 503 } },
  { id: 'd48a-14', name: 'D48A (1.4mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.44, rates: { dull: 571, champagne: 573, white_black: 573 } },
  { id: 'd48a-16', name: 'D48A (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.50, rates: { dull: 637, champagne: 639, white_black: 639 } },
  { id: 'd48a-20', name: 'D48A (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.62, rates: { dull: 799, champagne: 801, white_black: 801 } },
  { id: 'd48b-14', name: 'D48B (1.4mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.28, rates: { dull: 346, champagne: 348, white_black: 348 } },
  { id: 'd48b-16', name: 'D48B (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.35, rates: { dull: 435, champagne: 437, white_black: 437 } },
  { id: 'd48b-20', name: 'D48B (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.42, rates: { dull: 522, champagne: 524, white_black: 524 } },
  { id: 'd50-12', name: 'D50 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.36, rates: { dull: 479, champagne: 481, white_black: 481 } },
  { id: 'd50-16', name: 'D50 (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.46, rates: { dull: 613, champagne: 615, white_black: 615 } },
  { id: 'd50-20', name: 'D50 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.56, rates: { dull: 738, champagne: 740, white_black: 740 } },
  { id: 'd50a-12', name: 'D50A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.32, rates: { dull: 424, champagne: 426, white_black: 426 } },
  { id: 'd50a-16', name: 'D50A (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.39, rates: { dull: 506, champagne: 508, white_black: 508 } },
  { id: 'd50a-20', name: 'D50A (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.48, rates: { dull: 615, champagne: 617, white_black: 617 } },
  { id: 'd50b-12', name: 'D50B (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.45, rates: { dull: 598, champagne: 600, white_black: 600 } },
  { id: 'd50b-16', name: 'D50B (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.58, rates: { dull: 770, champagne: 772, white_black: 772 } },
  { id: 'd50b-20', name: 'D50B (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.72, rates: { dull: 948, champagne: 950, white_black: 950 } },
  { id: 'd51a-12', name: 'D51A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.30, rates: { dull: 392, champagne: 394, white_black: 394 } },
  { id: 'd51a-16', name: 'D51A (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.38, rates: { dull: 484, champagne: 486, white_black: 486 } },
  { id: 'd51a-20', name: 'D51A (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.46, rates: { dull: 584, champagne: 586, white_black: 586 } },
  { id: 'd51c-12', name: 'D51C (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.54, rates: { dull: 712, champagne: 714, white_black: 714 } },
  { id: 'd51c-16', name: 'D51C (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.68, rates: { dull: 903, champagne: 905, white_black: 905 } },
  { id: 'd51c-20', name: 'D51C (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.84, rates: { dull: 1104, champagne: 1106, white_black: 1106 } },
  { id: 'd51fh-12', name: 'D51F / H (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.35, rates: { dull: 459, champagne: 461, white_black: 461 } },
  { id: 'd51fh-16', name: 'D51F / H (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.44, rates: { dull: 576, champagne: 578, white_black: 578 } },
  { id: 'd51fh-20', name: 'D51F / H (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.54, rates: { dull: 697, champagne: 699, white_black: 699 } },
  { id: 'd52-12', name: 'D52 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.28, rates: { dull: 375, champagne: 377, white_black: 377 } },
  { id: 'd52-16', name: 'D52 (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.34, rates: { dull: 446, champagne: 448, white_black: 448 } },
  { id: 'd52-20', name: 'D52 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.42, rates: { dull: 539, champagne: 541, white_black: 541 } },
  { id: 'd54a-12', name: 'D54A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.26, rates: { dull: 343, champagne: 345, white_black: 345 } },
  { id: 'd54a-16', name: 'D54A (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.32, rates: { dull: 419, champagne: 421, white_black: 421 } },
  { id: 'd54a-20', name: 'D54A (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.39, rates: { dull: 502, champagne: 504, white_black: 504 } },
  { id: 'd54c-12', name: 'D54C (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.46, rates: { dull: 605, champagne: 607, white_black: 607 } },
  { id: 'd54fh-12', name: 'D54F / H (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.32, rates: { dull: 421, champagne: 423, white_black: 423 } },
  { id: 'd54fh-16', name: 'D54F / H (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.39, rates: { dull: 504, champagne: 506, white_black: 506 } },
  { id: 'd54fh-20', name: 'D54F / H (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.47, rates: { dull: 608, champagne: 610, white_black: 610 } },
  { id: 'd57-30', name: 'D57 (3mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.50, rates: { dull: 658, champagne: 660, white_black: 660 } },
  { id: 'd57-40', name: 'D57 (4mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.62, rates: { dull: 812, champagne: 814, white_black: 814 } },
  { id: 'd58-30', name: 'D58 (3mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.34, rates: { dull: 440, champagne: 442, white_black: 442 } },
  { id: 'd58-40', name: 'D58 (4mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.38, rates: { dull: 495, champagne: 497, white_black: 497 } },
  { id: 'd59-12', name: 'D59 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.35, rates: { dull: 465, champagne: 467, white_black: 467 } },
  { id: 'd59-16', name: 'D59 (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.42, rates: { dull: 544, champagne: 546, white_black: 546 } },
  { id: 'd59-20', name: 'D59 (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.50, rates: { dull: 647, champagne: 649, white_black: 649 } },
  { id: 'd59a-12', name: 'D59A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.36, rates: { dull: 476, champagne: 478, white_black: 478 } },
  { id: 'd59a-16', name: 'D59A (1.6mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.45, rates: { dull: 586, champagne: 588, white_black: 588 } },
  { id: 'd59a-20', name: 'D59A (2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.55, rates: { dull: 712, champagne: 714, white_black: 714 } },
  { id: 'd60-12', name: 'D60 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.21, rates: { dull: 274, champagne: 276, white_black: 276 } },
  { id: 'terris-stairs', name: 'Terris & Stairs Section (1.2mm)', type: 'Both', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.34, rates: { dull: 435, champagne: 437, white_black: 437 } },
  { id: 'd61-12', name: 'D61 (1.2mm)', type: 'Both', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.35, rates: { dull: 445, champagne: 447, white_black: 447 } },
  { id: 'd61h-16', name: 'D61H (1.6mm)', type: 'Both', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.28, rates: { dull: 357, champagne: 359, white_black: 359 } },
  { id: 'd61s-12', name: 'D61S (1.2mm)', type: 'Both', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.27, rates: { dull: 341, champagne: 343, white_black: 343 } },
];

export const mockColours: Colour[] = [
  { id: '1', name: '9016 (White)', category: 'white_black' },
  { id: '2', name: 'Black', category: 'white_black' },
  { id: '3', name: 'Champagne', category: 'champagne' },
  { id: '4', name: 'Dull', category: 'dull' },
];

export const mockThickness: Thickness[] = [
  { id: '1', value: '1.2mm' },
  { id: '2', value: '1.4mm' },
  { id: '3', value: '1.6mm' },
  { id: '4', value: '2mm' },
  { id: '5', value: '3mm' },
  { id: '6', value: '4mm' },
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
