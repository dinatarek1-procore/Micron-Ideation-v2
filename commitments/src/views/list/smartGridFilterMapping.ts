/**
 * Pure helpers: toolbar filter form (json-formulator) ↔ AG Grid filter model + Mirage extras.
 */

export type SmartGridToolbarFilterFormData = {
  status: string;
  assignee: string;
  divisionCode: string;
  referenceCode: string;
  dueDateFrom: string;
  dueDateTo: string;
};

export function emptySmartGridToolbarFilterFormData(): SmartGridToolbarFilterFormData {
  return {
    status: '',
    assignee: '',
    divisionCode: '',
    referenceCode: '',
    dueDateFrom: '',
    dueDateTo: '',
  };
}

/** Scalar cell filter shape consumed by `readSmartGridScalarFilter` in grid views. */
function scalarFilter(value: string): { filter: string } {
  return { filter: value };
}

/**
 * Partial AG Grid filter model for Smart Grid server requests.
 * Empty strings omit keys so `setFilterModel` clears removed filters.
 */
export function buildAgGridFilterPartialFromFormData(
  data: SmartGridToolbarFilterFormData
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.status.trim()) out.status = scalarFilter(data.status.trim());
  if (data.assignee.trim()) out.assignee = scalarFilter(data.assignee.trim());
  if (data.divisionCode.trim())
    out.divisionCode = scalarFilter(data.divisionCode.trim());
  if (data.referenceCode.trim())
    out.referenceCode = scalarFilter(data.referenceCode.trim());
  return out;
}

export function buildExtraQueryParamsFromFormData(
  data: SmartGridToolbarFilterFormData
): { dueDateFrom?: string; dueDateTo?: string } {
  const dueDateFrom = data.dueDateFrom.trim();
  const dueDateTo = data.dueDateTo.trim();
  const out: { dueDateFrom?: string; dueDateTo?: string } = {};
  if (dueDateFrom) out.dueDateFrom = dueDateFrom;
  if (dueDateTo) out.dueDateTo = dueDateTo;
  return out;
}

const FIELD_LABELS: Record<keyof SmartGridToolbarFilterFormData, string> = {
  status: 'State',
  assignee: 'Owner',
  divisionCode: 'Group',
  referenceCode: 'Reference',
  dueDateFrom: 'Due from',
  dueDateTo: 'Due to',
};

export function countActiveFilterFields(
  data: SmartGridToolbarFilterFormData
): number {
  let n = 0;
  for (const k of Object.keys(
    data
  ) as (keyof SmartGridToolbarFilterFormData)[]) {
    if (String(data[k] ?? '').trim()) n += 1;
  }
  return n;
}

export type SmartGridFilterChip = {
  field: keyof SmartGridToolbarFilterFormData;
  label: string;
};

export function buildFilterChips(
  data: SmartGridToolbarFilterFormData
): SmartGridFilterChip[] {
  const chips: SmartGridFilterChip[] = [];
  for (const field of Object.keys(
    data
  ) as (keyof SmartGridToolbarFilterFormData)[]) {
    const raw = String(data[field] ?? '').trim();
    if (!raw) continue;
    chips.push({
      field,
      label: `${FIELD_LABELS[field]}: ${raw}`,
    });
  }
  return chips;
}

export function clearFilterField(
  data: SmartGridToolbarFilterFormData,
  field: keyof SmartGridToolbarFilterFormData
): SmartGridToolbarFilterFormData {
  return { ...data, [field]: '' };
}

/** Reorder column ids (pure). Used by ColumnConfigurePopoverContent + tests. */
const TOOLBAR_FILTER_KEYS = [
  'status',
  'assignee',
  'divisionCode',
  'referenceCode',
] as const;

/** Merge toolbar-driven filters into an existing AG Grid filter model (keeps e.g. `search`). */
export function mergeToolbarIntoAgGridFilterModel(
  existing: Record<string, unknown> | null | undefined,
  data: SmartGridToolbarFilterFormData
): Record<string, unknown> {
  const prev = { ...(existing ?? {}) };
  const partial = buildAgGridFilterPartialFromFormData(data);
  for (const k of TOOLBAR_FILTER_KEYS) {
    if (partial[k]) prev[k] = partial[k];
    else delete prev[k];
  }
  return prev;
}

export function reorderColumnOrder<T>(
  items: readonly T[],
  fromIndex: number,
  toIndex: number
): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return [...items];
  }
  const next = [...items];
  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed!);
  return next;
}
