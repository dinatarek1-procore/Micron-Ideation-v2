export interface ContractLine {
  id: number;
  lineNumber: string;
  description: string;
  budgetCode: string;
  budgetCodeName: string;
  originalAmount: number;
  isNewContractLine?: boolean;
}

export interface COLine {
  id: number;
  description: string;
  budgetCode: string;
  budgetCodeName: string;
  taxCode: string;
  qty: number;
  uom: string;
  amount: number;
  associatedContractLineId: number | null;
  isNewContractLine?: boolean;
}

export const contractLines: ContractLine[] = [
  { id: 1, lineNumber: '001', description: 'Concrete Work', budgetCode: '03-100', budgetCodeName: 'Concrete Forming', originalAmount: 500_000 },
  { id: 2, lineNumber: '002', description: 'Finishes', budgetCode: '09-900', budgetCodeName: 'Paints and Coatings', originalAmount: 200_000 },
  { id: 3, lineNumber: '003', description: 'Specialty Finishes', budgetCode: '09-900', budgetCodeName: 'Paints and Coatings', originalAmount: 75_000 },
];

// The CO being edited — CO-004 with 6 lines (some unassociated, simulating a large CO)
export const coHeader = {
  number: 'CO-004',
  title: 'Structural & Finishes Additions',
  status: 'Draft',
  contract: 'PO-0042 — Mechanical & Electrical Purchase Order',
  vendor: 'Hoffman Construction',
};

export const initialCOLines: COLine[] = [
  { id: 1, description: 'Additional concrete pour — east wing', budgetCode: '03-100', budgetCodeName: 'Concrete Forming', taxCode: 'EXEMPT', qty: 120, uom: 'CY', amount: 18_000, associatedContractLineId: 1 },
  { id: 2, description: 'Additional concrete pour — west wing', budgetCode: '03-100', budgetCodeName: 'Concrete Forming', taxCode: 'EXEMPT', qty: 80, uom: 'CY', amount: 12_000, associatedContractLineId: null },
  { id: 3, description: 'Flooring upgrade — Level 2', budgetCode: '09-900', budgetCodeName: 'Paints and Coatings', taxCode: 'STD-1', qty: 950, uom: 'SF', amount: 9_500, associatedContractLineId: null },
  { id: 4, description: 'Flooring upgrade — Level 3', budgetCode: '09-900', budgetCodeName: 'Paints and Coatings', taxCode: 'STD-1', qty: 950, uom: 'SF', amount: 9_500, associatedContractLineId: null },
  { id: 5, description: 'Ceiling tile replacement', budgetCode: '09-900', budgetCodeName: 'Paints and Coatings', taxCode: 'STD-1', qty: 310, uom: 'SF', amount: 6_200, associatedContractLineId: null },
  { id: 6, description: 'New MEP rough-in — server room', budgetCode: '16-000', budgetCodeName: 'Electrical', taxCode: 'USE-TX', qty: 1, uom: 'LS', amount: 34_000, associatedContractLineId: null },
];

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
