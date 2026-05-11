import type { ExtendedColDefs } from '@procore/smart-grid-core';
import { SGPillCol, SGSelectCol, SGTextCol } from '@procore/smart-grid-cells';
import type { PillColor } from '@procore/core-react';

import type { ColumnConfigureRow } from '@/components/templates/ix-popover/ColumnConfigurePopoverContent';

import dataSchema from '../../../blueprints/prototype-tool/data.schema.json';
import seedData from '../../../blueprints/prototype-tool/seed.json';
import { GUARDRAILS } from '@/shared/guardrails';
import type { Item } from '@/mockServer/itemsStore';

import { buildPrototypeToolListUiSchema } from './buildPrototypeToolListUiSchema';
import { ListToolRowActionsCell } from './listToolRowActionsCell';

function dataPropertyTitle(field: string): string | undefined {
  const props = (
    dataSchema as { properties?: Record<string, { title?: string }> }
  ).properties;
  return props?.[field]?.title;
}

function getMergedFieldOptions(
  merged: Record<string, unknown>,
  field: string
): Record<string, unknown> {
  const listUiOpts =
    (
      merged['ui:options'] as
        | Record<string, Record<string, unknown>>
        | undefined
    )?.[field] ?? {};
  const perField =
    (merged[field] as { 'ui:options'?: Record<string, unknown> } | undefined)?.[
      'ui:options'
    ] ?? {};
  return { ...listUiOpts, ...perField };
}

function statusPillColor(status: string | undefined): PillColor {
  const s = String(status ?? '').toLowerCase();
  if (s === 'open') return 'green';
  if (s === 'closed') return 'gray';
  if (s === 'in progress') return 'blue';
  return 'blue';
}

/** PillSelect `options` — without these, State filters render like empty / broken selects. */
const LIST_STATUS_PILL_OPTIONS = [
  { id: 'Open', label: 'Open', color: 'green' as PillColor },
  { id: 'Closed', label: 'Closed', color: 'gray' as PillColor },
  { id: 'In Progress', label: 'In Progress', color: 'blue' as PillColor },
];

function uniqSortedStrings(values: readonly string[]): string[] {
  return [...new Set(values.map((v) => String(v).trim()).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b)
  );
}

function multiSelectOptionsFromSeed(
  pick: (row: Item) => string
): Array<{ id: string; label: string }> {
  const rows = seedData as Item[];
  return uniqSortedStrings(rows.map(pick)).map((label) => ({
    id: label,
    label,
  }));
}

export const LIST_DIVISION_SELECT_PARAMS = {
  options: multiSelectOptionsFromSeed((r) => r.divisionCode),
  placeholder: 'Any group',
} as const;

const LIST_ASSIGNEE_SELECT_PARAMS = {
  options: multiSelectOptionsFromSeed((r) => r.assignee),
  placeholder: 'Any owner',
} as const;

/** Toolbar quick-filter dropdowns (State / Owner), aligned with list column filters. */
export const LIST_QUICK_STATUS_OPTIONS: Array<{ id: string; label: string }> = [
  { id: '', label: 'All' },
  ...LIST_STATUS_PILL_OPTIONS.map((o) => ({ id: o.id, label: o.label })),
];

export const LIST_QUICK_ASSIGNEE_OPTIONS: Array<{ id: string; label: string }> =
  [{ id: '', label: 'Any' }, ...LIST_ASSIGNEE_SELECT_PARAMS.options];

export function getListSmartGridPageSize(): number {
  const merged = buildPrototypeToolListUiSchema();
  const t = merged['ui:tableOptions'] as
    | { paginationPageSize?: number }
    | undefined;
  return typeof t?.paginationPageSize === 'number' ? t.paginationPageSize : 20;
}

function buildListRowActionsColumn(): ExtendedColDefs<Item> {
  return {
    colId: 'listRowActions',
    field: 'id',
    headerName: '',
    width: 130,
    maxWidth: 140,
    pinned: 'left',
    sortable: false,
    filter: false,
    resizable: false,
    suppressMovable: true,
    editable: false,
    isBulkEdit: false,
    cellRenderer: ListToolRowActionsCell,
  };
}

/**
 * Column definitions derived from the same merged list uiSchema as json-tabulator
 * (`buildPrototypeToolListUiSchema`), so blueprint titles / flex / sortable / pill
 * stay aligned with the template.
 */
/** Column ids excluded from the Configure popover (pinned row chrome). */
export const LIST_SMART_GRID_CONFIGURE_EXCLUDED_COL_IDS = new Set([
  'listRowActions',
]);

export function buildListColumnConfigureRows(): ColumnConfigureRow[] {
  return buildListSmartGridColumnDefs()
    .filter((def) => {
      const colId = (def as { colId?: string }).colId;
      if (colId && LIST_SMART_GRID_CONFIGURE_EXCLUDED_COL_IDS.has(colId)) {
        return false;
      }
      return true;
    })
    .map((def) => {
      const colId = String(
        (def as { colId?: string }).colId ??
          (def as { field?: string }).field ??
          ''
      );
      return {
        colId,
        headerName: String(
          (def as { headerName?: string }).headerName ?? colId
        ),
        hide: Boolean((def as { hide?: boolean }).hide),
      };
    });
}

export function buildListSmartGridColumnDefs(): Array<ExtendedColDefs<Item>> {
  const merged = buildPrototypeToolListUiSchema();

  const dataColumns = GUARDRAILS.ITEM_SCHEMA.LIST_COLUMNS.map((field) => {
    const opts = getMergedFieldOptions(merged, field);
    const headerName = String(
      (opts.title as string | undefined) ?? dataPropertyTitle(field) ?? field
    );
    const flex = typeof opts.flex === 'number' ? opts.flex : undefined;
    const sortable = opts.sortable === true;

    if (field === 'summary') {
      return {
        field: 'summary' as const,
        headerName,
        flex,
        minWidth: 200,
        sortable,
        editable: false,
        isBulkEdit: false,
        ...SGTextCol,
      };
    }

    if (field === 'referenceCode') {
      return {
        field: 'referenceCode' as const,
        headerName,
        flex,
        minWidth: 140,
        sortable,
        editable: false,
        isBulkEdit: false,
        ...SGTextCol,
      };
    }

    if (field === 'status' && opts.cellRenderer === 'pill') {
      return {
        field: 'status' as const,
        headerName,
        flex,
        minWidth: 120,
        sortable,
        editable: false,
        isBulkEdit: false,
        cellRenderer: SGPillCol.cellRenderer,
        cellEditor: SGPillCol.cellEditor,
        filter: SGPillCol.filter,
        bulkEditor: SGPillCol.bulkEditor,
        cellEditorType: 'select' as const,
        cellRendererParams: {
          getColor: (value: unknown) =>
            statusPillColor(
              typeof value === 'string' || typeof value === 'number'
                ? String(value)
                : undefined
            ),
        },
        filterParams: { options: [...LIST_STATUS_PILL_OPTIONS] },
        cellEditorParams: { options: [...LIST_STATUS_PILL_OPTIONS] },
      };
    }

    if (field === 'divisionCode') {
      return {
        field: 'divisionCode' as const,
        headerName,
        flex,
        minWidth: 120,
        sortable,
        editable: false,
        isBulkEdit: false,
        ...SGSelectCol,
        cellEditorType: 'select' as const,
        filterParams: { ...LIST_DIVISION_SELECT_PARAMS },
        cellEditorParams: { ...LIST_DIVISION_SELECT_PARAMS },
      };
    }

    if (field === 'assignee') {
      return {
        field: 'assignee' as const,
        headerName,
        flex,
        minWidth: 120,
        sortable,
        editable: false,
        isBulkEdit: false,
        ...SGSelectCol,
        cellEditorType: 'select' as const,
        filterParams: { ...LIST_ASSIGNEE_SELECT_PARAMS },
        cellEditorParams: { ...LIST_ASSIGNEE_SELECT_PARAMS },
      };
    }

    let minWidth = 100;
    if (field === 'dueDate') {
      minWidth = 120;
    }
    return {
      field: field as keyof Item & string,
      headerName,
      flex,
      minWidth,
      sortable,
      editable: false,
      isBulkEdit: false,
      ...SGTextCol,
    };
  });

  return [buildListRowActionsColumn(), ...dataColumns];
}
