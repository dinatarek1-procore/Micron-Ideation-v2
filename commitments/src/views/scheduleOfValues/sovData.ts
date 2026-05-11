export interface SovLine {
  id: number;
  lineNumber: string;
  description: string;
  budgetCode: string;
  budgetCodeName: string;
  originalAmount: number;
  approvedCOs: ApprovedCO[];
  isNewScope?: boolean;
}

export interface ApprovedCO {
  id: number;
  coNumber: string;
  description: string;
  budgetCode: string;
  budgetCodeName: string;
  taxCode: string;
  qty: number;
  uom: string;
  amount: number;
  status: 'Approved';
}

export const contractData = {
  title: 'Mechanical & Electrical Purchase Order',
  vendor: 'Hoffman Construction',
  number: 'PO-0042',
  status: 'Approved',
  originalTotal: 775_000,
};

// Approved CO lines that are new scope (not tied to an original SOV line)
export const newScopeCOs: ApprovedCO[] = [
  {
    id: 301,
    coNumber: 'CO-003',
    description: 'Fire Protection Systems — Phase 2',
    budgetCode: '15-500',
    budgetCodeName: 'Fire Protection',
    taxCode: 'EXEMPT',
    qty: 1,
    uom: 'LS',
    amount: 50_000,
    status: 'Approved',
  },
];

export const sovLines: SovLine[] = [
  {
    id: 1,
    lineNumber: '001',
    description: 'Concrete Work',
    budgetCode: '03-100',
    budgetCodeName: 'Concrete Forming',
    originalAmount: 500_000,
    approvedCOs: [
      {
        id: 101,
        coNumber: 'CO-001',
        description: 'Concrete Work — Foundation Scope Increase',
        budgetCode: '03-100',
        budgetCodeName: 'Concrete Forming',
        taxCode: 'EXEMPT',
        qty: 100,
        uom: 'CY',
        amount: 25_000,
        status: 'Approved',
      },
    ],
  },
  {
    id: 2,
    lineNumber: '002',
    description: 'Finishes',
    budgetCode: '09-900',
    budgetCodeName: 'Paints and Coatings',
    originalAmount: 200_000,
    approvedCOs: [],
  },
  {
    id: 3,
    lineNumber: '003',
    // Two lines share budget code 09-900 — this is the key UX challenge
    description: 'Specialty Finishes',
    budgetCode: '09-900',
    budgetCodeName: 'Paints and Coatings',
    originalAmount: 75_000,
    approvedCOs: [
      {
        id: 201,
        coNumber: 'CO-002',
        description: 'Specialty Finishes — Added Flooring Scope',
        budgetCode: '09-900',
        budgetCodeName: 'Paints and Coatings',
        taxCode: 'STD-1',
        qty: 750,
        uom: 'SF',
        amount: 15_000,
        status: 'Approved',
      },
    ],
  },
];

export function revisedAmount(line: SovLine): number {
  return (
    line.originalAmount +
    line.approvedCOs.reduce((sum, co) => sum + co.amount, 0)
  );
}

export function approvedCOTotal(line: SovLine): number {
  return line.approvedCOs.reduce((sum, co) => sum + co.amount, 0);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export const totalOriginal = sovLines.reduce(
  (sum, l) => sum + l.originalAmount,
  0
);
export const totalNewScope = newScopeCOs.reduce(
  (sum, co) => sum + co.amount,
  0
);
export const totalApprovedCOs =
  sovLines.reduce((sum, l) => sum + approvedCOTotal(l), 0) + totalNewScope;
export const totalRevised = totalOriginal + totalApprovedCOs;
