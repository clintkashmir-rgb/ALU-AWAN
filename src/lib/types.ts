export interface Section {
  id: string;
  name: string;
  default_formula: string;
  weight_per_ft: number;
}

export interface Colour {
  id: string;
  name: string;
}

export interface Thickness {
  id: string;
  value: string;
}

export interface Rate {
  id: string;
  aluminum_rate_per_kg: number;
  glass_rate_per_sqft: number;
  hardware_rate: number;
  labour_rate_per_sqft: number;
}

export interface WindowItem {
  id: string;
  type: 'Fixed' | 'Sliding';
  pallaQty: number;
  colour: string;
  thickness: string;
  width: number;
  height: number;
  quantity: number;
  sqFt: number;
  section?: string;
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