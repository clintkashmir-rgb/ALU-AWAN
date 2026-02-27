export interface Section {
  id: string;
  name: string;
  top_formula: string;
  bottom_formula: string;
  side_formula: string;
  weight_per_ft: number;
  rate_per_ft?: number;
}

export interface Colour {
  id: string;
  name: string;
}

export interface Thickness {
  id: string;
  value: string;
}

export interface GlassType {
  id: string;
  name: string;
  rate_per_sqft: number;
}

export interface HardwareItem {
  id: string;
  name: string;
  rate: number;
}

export interface Rate {
  id: string;
  aluminum_rate_per_kg: number;
  glass_rate_per_sqft: number;
  hardware_rate: number;
  labour_rate_per_sqft: number;
  frame_rate_per_ft: number;
}

export interface WindowItem {
  id: string;
  type: 'Fixed' | 'Sliding';
  pallaQty: number;
  colour: string;
  glassType: string;
  width: number; // in feet
  height: number; // in feet
  quantity: number;
  frameFt: number;
  glassSqFt: number;
  frameCost: number;
  glassCost: number;
  hardwareCost: number;
  totalCost: number;
  sectionId: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  date: string;
  items: WindowItem[];
  grossAmount: number;
  discount: number;
  netAmount: number;
  status: 'Draft' | 'Sent' | 'Paid';
}
