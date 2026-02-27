import { Section, Colour, Thickness, Rate, GlassType, HardwareItem } from './types';

export const mockSections: Section[] = [
  { id: '1', name: 'DC30C', default_formula: '(Width * 2) + (Height * 2)', weight_per_ft: 0.4, rate_per_ft: 220 },
  { id: '2', name: 'DC2BC', default_formula: '(Width * 2) + (Height * 2)', weight_per_ft: 0.45, rate_per_ft: 240 },
  { id: '3', name: 'M23', default_formula: '(Width * 2) + (Height * 2)', weight_per_ft: 0.38, rate_per_ft: 210 },
];

export const mockColours: Colour[] = [
  { id: '1', name: '9016 (White)' },
  { id: '2', name: 'Black' },
  { id: '3', name: 'CH (Chocolate)' },
  { id: '4', name: 'Champagne' },
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
