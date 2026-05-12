export interface SovLine {
  id: number;
  lineNumber: string;
  description: string;
  budgetCode: string;
  budgetCodeName: string;
  qty: number;
  uom: string;
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
  {
    id: 302,
    coNumber: 'CO-007',
    description: 'Security Access Control — Floors 4–6',
    budgetCode: '28-100',
    budgetCodeName: 'Electronic Safety',
    taxCode: 'EXEMPT',
    qty: 1,
    uom: 'LS',
    amount: 34_000,
    status: 'Approved',
  },
  {
    id: 303,
    coNumber: 'CO-010',
    description: 'EV Charging Station Infrastructure',
    budgetCode: '26-500',
    budgetCodeName: 'Lighting',
    taxCode: 'EXEMPT',
    qty: 8,
    uom: 'EA',
    amount: 28_800,
    status: 'Approved',
  },
  {
    id: 304,
    coNumber: 'CO-015',
    description: 'Rooftop Mechanical Screen Enclosure',
    budgetCode: '07-700',
    budgetCodeName: 'Roofing Specialties',
    taxCode: 'EXEMPT',
    qty: 1,
    uom: 'LS',
    amount: 41_500,
    status: 'Approved',
  },
];

// Generate 100 mock CCOs for Line 001 (Concrete Work)
const concreteDescriptions = [
  'Foundation Scope Increase', 'Retaining Wall Extension', 'Column Pad Redesign',
  'Added Slab Thickness', 'Elevator Pit Excavation', 'Grade Beam Reinforcement',
  'Sump Pit Addition', 'Pier Cap Modification', 'Tilt-Up Panel Revision',
  'Shear Wall Thickening', 'Curb and Gutter Extension', 'Ramp Slope Correction',
  'Catch Basin Relocation', 'Precast Ledger Adjustment', 'Grout Injection Treatment',
  'Void Fill Injection', 'Underpinning — Zone B', 'Deepened Footing Section 4',
  'Mat Slab Edge Thickening', 'Shotcrete Tunnel Lining',
];
const concreteBudgetCodes = [
  { code: '03-100', name: 'Concrete Forming' },
  { code: '03-200', name: 'Concrete Reinforcing' },
  { code: '03-300', name: 'Cast-in-Place Concrete' },
];
const concreteUOMs = ['CY', 'SF', 'LF', 'EA', 'LS'];
const concreteTaxCodes = ['EXEMPT', 'EXEMPT', 'EXEMPT', 'STD-1'];

function generateConcreteCOs(): ApprovedCO[] {
  return Array.from({ length: 100 }, (_, i) => {
    const n = i + 1;
    const desc = concreteDescriptions[i % concreteDescriptions.length];
    const bc = concreteBudgetCodes[i % concreteBudgetCodes.length];
    const uom = concreteUOMs[i % concreteUOMs.length];
    const taxCode = concreteTaxCodes[i % concreteTaxCodes.length];
    const qty = uom === 'LS' ? 1 : uom === 'EA' ? Math.ceil((n * 3) % 20) + 1 : Math.ceil((n * 17) % 500) + 10;
    const amount = Math.round((n * 2873 + 4200) / 100) * 100;
    return {
      id: 1000 + n,
      coNumber: `CO-${String(n).padStart(3, '0')}`,
      description: `Concrete Work — ${desc}${n > concreteDescriptions.length ? ` (${Math.ceil(n / concreteDescriptions.length)})` : ''}`,
      budgetCode: bc.code,
      budgetCodeName: bc.name,
      taxCode,
      qty,
      uom,
      amount,
      status: 'Approved' as const,
    };
  });
}

export const sovLines: SovLine[] = [
  {
    id: 1,
    lineNumber: '001',
    description: 'Concrete Work',
    budgetCode: '03-100',
    budgetCodeName: 'Concrete Forming',
    qty: 2500,
    uom: 'CY',
    originalAmount: 500_000,
    approvedCOs: generateConcreteCOs(),
  },
  {
    id: 2,
    lineNumber: '002',
    description: 'Finishes',
    budgetCode: '09-900',
    budgetCodeName: 'Paints and Coatings',
    qty: 8000,
    uom: 'SF',
    originalAmount: 200_000,
    approvedCOs: [
      {
        id: 211,
        coNumber: 'CO-006',
        description: 'Finishes — Level 3 Paint Upgrade',
        budgetCode: '09-900',
        budgetCodeName: 'Paints and Coatings',
        taxCode: 'STD-1',
        qty: 2400,
        uom: 'SF',
        amount: 9_600,
        status: 'Approved',
      },
      {
        id: 212,
        coNumber: 'CO-012',
        description: 'Finishes — Lobby Feature Wall',
        budgetCode: '09-900',
        budgetCodeName: 'Paints and Coatings',
        taxCode: 'STD-1',
        qty: 1,
        uom: 'LS',
        amount: 7_200,
        status: 'Approved',
      },
      {
        id: 213,
        coNumber: 'CO-016',
        description: 'Finishes — Exterior Trim Recolor',
        budgetCode: '09-900',
        budgetCodeName: 'Paints and Coatings',
        taxCode: 'STD-1',
        qty: 800,
        uom: 'SF',
        amount: 3_400,
        status: 'Approved',
      },
    ],
  },
  {
    id: 3,
    lineNumber: '003',
    // Two lines share budget code 09-900 — this is the key UX challenge
    description: 'Specialty Finishes',
    budgetCode: '09-900',
    budgetCodeName: 'Paints and Coatings',
    qty: 1,
    uom: 'LS',
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
      {
        id: 202,
        coNumber: 'CO-009',
        description: 'Specialty Finishes — Decorative Ceiling Panels',
        budgetCode: '09-900',
        budgetCodeName: 'Paints and Coatings',
        taxCode: 'STD-1',
        qty: 1,
        uom: 'LS',
        amount: 22_500,
        status: 'Approved',
      },
      {
        id: 203,
        coNumber: 'CO-013',
        description: 'Specialty Finishes — Epoxy Floor Coating',
        budgetCode: '09-650',
        budgetCodeName: 'Resilient Flooring',
        taxCode: 'STD-1',
        qty: 3200,
        uom: 'SF',
        amount: 18_400,
        status: 'Approved',
      },
      {
        id: 204,
        coNumber: 'CO-017',
        description: 'Specialty Finishes — Acoustic Wall Treatment',
        budgetCode: '09-900',
        budgetCodeName: 'Paints and Coatings',
        taxCode: 'STD-1',
        qty: 1,
        uom: 'LS',
        amount: 12_600,
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
