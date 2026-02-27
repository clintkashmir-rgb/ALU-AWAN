import { Section, Colour, Thickness, Rate } from './types';

export const mockSections: Section[] = [
  { id: '1', name: 'DC30C', default_formula: '(Width * 2) + (Height * 2)', weight_per_ft: 0.4 },
  { id: '2', name: 'DC2BC', default_formula: '(Width * 2) + (Height * 2)', weight_per_ft: 0.45 },
  { id: '3', name: 'M23', default_formula: '(Width * 2) + (Height * 2)', weight_per_ft: 0.38 },
  { id: '4', name: 'M28', default_formula: '(Width * 2) + (Height * 2)', weight_per_ft: 0.42 },
  { id: '5', name: 'M24', default_formula: '(Width * 2) + (Height * 2)', weight_per_ft: 0.4 },
  { id: '6', name: 'D29', default_formula: '(Width * 2) + (Height * 2)', weight_per_ft: 0.5 },
];

export const mockColours: Colour[] = [
  { id: '1', name: '9016' },
  { id: '2', name: 'Black' },
  { id: '3', name: 'CH' },
  { id: '4', name: 'Champagne' },
];

export const mockThickness: Thickness[] = [
  { id: '1', value: '1.2mm' },
  { id: '2', value: '1.4mm' },
  { id: '3', value: '1.6mm' },
];

export const mockRates: Rate = {
  id: 'current',
  aluminum_rate_per_kg: 850,
  glass_rate_per_sqft: 220,
  hardware_rate: 1500,
  labour_rate_per_sqft: 45,
};