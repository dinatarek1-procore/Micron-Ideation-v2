import seedData from '../../blueprints/prototype-tool/seed.json';

export interface Item {
  id: number;
  referenceCode: string;
  summary: string;
  divisionCode: string;
  status: string;
  assignee: string;
  dueDate: string;
  description: string;
  number: string;
  manager: string;
  receivedFrom: string;
  assignees: string[];
  distributionList: string[];
  ballInCourt: string;
  contractor: string;
  specSection: string;
  location: string;
  createdBy: string;
  subJob: string;
  dateInitiated: string;
  costCode: string;
  scheduleImpact: string;
  costImpact: string;
  reference: string;
  privateChecked: boolean;
  recordedOn: string;
  responsibleOrg: string;
  priority: string;
  cost: number;
  notes: string;
}

let items: Item[] = [];
let recycledItems: Item[] = [];
let nextId = 11;

/** Seed IDs moved to Recycle Bin on reset so the bin table is non-empty in demos. */
const SEED_IDS_IN_RECYCLE_BIN: readonly number[] = [2, 3, 4];

type ListItemsFilterOptions = {
  search?: string;
  status?: string;
  divisionCode?: string;
  assignee?: string;
  referenceCode?: string;
  summary?: string;
  dueDate?: string;
  /** Inclusive lower bound `YYYY-MM-DD` (toolbar popover). */
  dueDateFrom?: string;
  /** Inclusive upper bound `YYYY-MM-DD` (toolbar popover). */
  dueDateTo?: string;
  page?: number;
  perPage?: number;
};

function applyItemFilters(
  source: Item[],
  options?: ListItemsFilterOptions
): Item[] {
  let filtered = [...source];

  if (options?.status && options.status !== 'all') {
    filtered = filtered.filter(
      (i) => i.status.toLowerCase() === options.status!.toLowerCase()
    );
  }

  if (options?.divisionCode?.trim()) {
    filtered = filtered.filter((i) => i.divisionCode === options.divisionCode);
  }

  if (options?.assignee?.trim()) {
    filtered = filtered.filter((i) => i.assignee === options.assignee);
  }

  if (options?.referenceCode?.trim()) {
    const q = options.referenceCode.toLowerCase();
    filtered = filtered.filter((i) =>
      i.referenceCode.toLowerCase().includes(q)
    );
  }

  if (options?.summary?.trim()) {
    const q = options.summary.toLowerCase();
    filtered = filtered.filter((i) => i.summary.toLowerCase().includes(q));
  }

  if (options?.dueDate?.trim()) {
    const q = options.dueDate.toLowerCase();
    filtered = filtered.filter((i) => i.dueDate.toLowerCase().includes(q));
  }

  const from = options?.dueDateFrom?.trim();
  const to = options?.dueDateTo?.trim();
  if (from || to) {
    filtered = filtered.filter((i) => {
      const d = String(i.dueDate ?? '').trim();
      if (!d) return false;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.referenceCode.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q) ||
        i.assignee.toLowerCase().includes(q)
    );
  }

  return filtered;
}

function paginate(
  filtered: Item[],
  options?: ListItemsFilterOptions
): { data: Item[]; total: number } {
  const total = filtered.length;
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 20;
  const start = (page - 1) * perPage;
  const data = filtered.slice(start, start + perPage);
  return { data, total };
}

export function resetItemsStore(): void {
  items = (seedData as Item[]).map((item) => ({ ...item }));
  recycledItems = [];
  nextId = Math.max(...items.map((i) => i.id)) + 1;

  for (const id of SEED_IDS_IN_RECYCLE_BIN) {
    moveItemToRecycleBin(id);
  }
}

resetItemsStore();

export function listItems(options?: ListItemsFilterOptions): {
  data: Item[];
  total: number;
} {
  const filtered = applyItemFilters(items, options);
  return paginate(filtered, options);
}

export function listRecycledItems(options?: ListItemsFilterOptions): {
  data: Item[];
  total: number;
} {
  const filtered = applyItemFilters(recycledItems, options);
  return paginate(filtered, options);
}

export function getItemById(id: number): Item | undefined {
  return (
    items.find((i) => i.id === id) ?? recycledItems.find((i) => i.id === id)
  );
}

/** Move from active list to recycle bin. Returns false if not in active list. */
export function moveItemToRecycleBin(id: number): boolean {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  const [removed] = items.splice(idx, 1);
  recycledItems.push(removed!);
  return true;
}

export function createItem(input: Partial<Item>): Item {
  const item: Item = {
    id: nextId++,
    referenceCode: `ITEM-${1000 + nextId}`,
    summary: '',
    divisionCode: '',
    status: 'Open',
    assignee: '',
    dueDate: '',
    description: '',
    number: `#${1000 + nextId}`,
    manager: '',
    receivedFrom: '',
    assignees: [],
    distributionList: [],
    ballInCourt: '',
    contractor: '',
    specSection: '',
    location: '',
    createdBy: 'System Admin',
    subJob: '',
    dateInitiated: new Date().toISOString().split('T')[0],
    costCode: '',
    scheduleImpact: 'N/A',
    costImpact: 'N/A',
    reference: '',
    privateChecked: false,
    recordedOn: new Date().toISOString().split('T')[0],
    responsibleOrg: '',
    priority: 'Medium',
    cost: 0,
    notes: '',
    ...input,
  };
  items.push(item);
  return item;
}

export function updateItem(id: number, patch: Partial<Item>): Item | undefined {
  const item = items.find((i) => i.id === id);
  if (!item) return undefined;
  Object.assign(item, patch);
  return item;
}
