import { Section, Colour, Thickness, Rate, GlassType, HardwareItem } from './types';

export const mockSections: Section[] = [
  // DC Series (1.2mm) - Only DC26 and DC30 have default formulas now as examples
  { id: 'dc26', name: 'DC26 (1.2mm)', type: 'Sliding', top_formula: 'Width + 0', bottom_formula: 'Width + 0', side_formula: 'Height + 0', weight_per_ft: 0.45, rates: { dull: 674, champagne: 676, white_black: 723 } },
  { id: 'dc30', name: 'DC30 (1.2mm)', type: 'Sliding', top_formula: 'Width + 0', bottom_formula: 'Width + 0', side_formula: 'Height + 0', weight_per_ft: 0.40, rates: { dull: 593, champagne: 595, white_black: 637 } },
  
  // Others set to 'None' so they don't show until user configures them
  { id: 'dc26e', name: 'DC26E (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.46, rates: { dull: 693, champagne: 695, white_black: 744 } },
  { id: 'dc30e', name: 'DC30E (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.40, rates: { dull: 593, champagne: 595, white_black: 637 } },
  { id: 'dc26a', name: 'DC26A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.48, rates: { dull: 732, champagne: 734, white_black: 785 } },
  { id: 'dc30a', name: 'DC30A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.42, rates: { dull: 633, champagne: 635, white_black: 679 } },
  { id: 'dc26b', name: 'DC26B (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.42, rates: { dull: 629, champagne: 631, white_black: 675 } },
  { id: 'dc30b', name: 'DC30B (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.36, rates: { dull: 534, champagne: 536, white_black: 574 } },
  { id: 'dc26bac', name: 'DC26BA/C (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.45, rates: { dull: 673, champagne: 675, white_black: 722 } },
  { id: 'dc30bac', name: 'DC30BA/C (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.39, rates: { dull: 584, champagne: 586, white_black: 627 } },
  
  // M Series (1.2mm)
  { id: 'm23', name: 'M23 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.28, rates: { dull: 306, champagne: 308, white_black: 330 } },
  { id: 'm28', name: 'M28 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.32, rates: { dull: 373, champagne: 375, white_black: 401 } },
  { id: 'm24', name: 'M24 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.31, rates: { dull: 363, champagne: 365, white_black: 391 } },
  { id: 'm24a', name: 'M24A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.29, rates: { dull: 321, champagne: 323, white_black: 346 } },
  { id: 'm24f', name: 'M24F (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.22, rates: { dull: 236, champagne: 238, white_black: 255 } },
  { id: 'm23a', name: 'M23A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.29, rates: { dull: 315, champagne: 317, white_black: 339 } },
  { id: 'm23h', name: 'M23H (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.30, rates: { dull: 335, champagne: 337, white_black: 361 } },
  { id: 'm28a', name: 'M28A (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.33, rates: { dull: 379, champagne: 381, white_black: 408 } },
  
  // AA Series (1.2mm)
  { id: 'aa23', name: 'AA23 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.38, rates: { dull: 462, champagne: 464, white_black: 496 } },
  { id: 'aa23s', name: 'AA23-S (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.37, rates: { dull: 455, champagne: 457, white_black: 489 } },
  { id: 'aa28', name: 'AA28 (1.2mm)', type: 'Sliding', top_formula: 'None', bottom_formula: 'None', side_formula: 'None', weight_per_ft: 0.42, rates: { dull: 531, champagne: 533, white_black: 570 } },
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
