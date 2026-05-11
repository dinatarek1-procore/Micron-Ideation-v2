import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useParams } from '@tanstack/react-router';
import type { CommonProps } from '@procore/json-toolinator';
import type {
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-enterprise';
import {
  Box,
  Button,
  Flex,
  Select,
  SplitViewCard,
  Tabs,
  colors,
  useSplitViewCard,
} from '@procore/core-react';
import {
  SmartGridServer,
  type ExtendedColDefs,
  type SmartServerSideGetRowsRequest,
} from '@procore/smart-grid-core';
import { SGPillCol, SGSelectCol, SGTextCol } from '@procore/smart-grid-cells';
import type { PillColor } from '@procore/core-react';
import { styled } from 'styled-components';
import { Form } from '@procore/json-formulator';

import { FormulatorFilterPopoverContent } from '@/components/templates/ix-popover/FormulatorFilterPopoverContent';
import {
  ColumnConfigurePopoverContent,
  type ColumnConfigureApplyPayload,
  type ColumnConfigureRow,
} from '@/components/templates/ix-popover/ColumnConfigurePopoverContent';
import { FilterToolbarPopoverButton } from '@/components/templates/popovers/PopoverComponentFilter';
import { ConfigureToolbarPopoverButton } from '@/components/templates/popovers/PopoverComponentConfigure';
import {
  PROTOTYPE_TOOL_BASE,
  shellNavigate,
} from '@/components/mfe-global-nav-package/standalone/src/lib/prototypeToolPaths';
import { GUARDRAILS } from '@/shared/guardrails';
import type { Item } from '@/mockServer/itemsStore';
import {
  getToolLandingDetailSchema,
  getToolLandingDetailUiSchema,
  pickToolLandingDetailFormData,
} from '@/views/detail/itemDetail.schema';

import { ActiveFilterChipsRow } from '../list/ActiveFilterChipsRow';
import { getListSmartGridPageSize } from '../list/listSmartGridColumnDefs';
import {
  buildExtraQueryParamsFromFormData,
  mergeToolbarIntoAgGridFilterModel,
} from '../list/smartGridFilterMapping';
import {
  readStoredSmartGridToolbarConfig,
  writeStoredSmartGridToolbarConfig,
  TOOL_LANDING_RECYCLE_SMART_GRID_TOOLBAR_CONFIG_KEY,
  TOOL_LANDING_SMART_GRID_TOOLBAR_CONFIG_KEY,
} from '../list/smartGridToolbarStorage';
import { smartGridAgTheme } from '../list/smartGridAgTheme';
import { useSmartGridHostMinHeight } from '../list/useSmartGridHostMinHeight';
import { useSmartGridToolbarFilters } from '../list/useSmartGridToolbarFilters';

import {
  getToolLandingGenericFilterPopoverSchema,
  getToolLandingGenericFilterPopoverUiSchema,
} from './toolLandingFilterPopover.schema';

import '../list/listSmartGridFilterPanel.css';

const GridShell = styled(Box)`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  align-self: stretch;
  height: 100%;
  min-height: 0;
  min-width: 0;
  width: 100%;
`;

const GridHost = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  min-height: 0;
  min-width: 0;
  width: 100%;
  overflow: hidden;
  padding: 16px 24px;
  box-sizing: border-box;
`;

const EmptyDetail = styled.p`
  margin: 0;
  color: ${colors.gray45};
  font-size: 14px;
`;

export type ToolLandingGenericRow = {
  id: number;
  referenceCode: string;
  summary: string;
  divisionCode: string;
  status: string;
  assignee: string;
  dueDate: string;
  description: string;
  responsibleOrg: string;
  recordedOn: string;
  priority: string;
};

function itemToGenericRow(item: Item): ToolLandingGenericRow {
  return {
    id: item.id,
    referenceCode: item.referenceCode,
    summary: item.summary,
    divisionCode: item.divisionCode,
    status: item.status,
    assignee: item.assignee,
    dueDate: item.dueDate,
    description: item.description,
    responsibleOrg: item.responsibleOrg,
    recordedOn: item.recordedOn,
    priority: item.priority,
  };
}

function readSmartGridScalarFilter(
  filterModel: Record<string, unknown> | null | undefined,
  field: string
): string | undefined {
  const entry = filterModel?.[field];
  if (!entry || typeof entry !== 'object') return undefined;
  const e = entry as Record<string, unknown>;
  const coerce = (v: unknown): string | undefined => {
    if (typeof v === 'string' && v.trim()) return v;
    if (typeof v === 'number' && Number.isFinite(v)) return String(v);
    if (Array.isArray(v) && v.length > 0) {
      const x = v[0];
      if (typeof x === 'string' && x.trim()) return x;
      if (x && typeof x === 'object' && 'id' in (x as object)) {
        const id = (x as { id: unknown }).id;
        if (id != null && String(id).trim()) return String(id);
      }
    }
    return undefined;
  };
  return coerce(e.filter) ?? coerce(e.value);
}

function statusPillColor(status: string | undefined): PillColor {
  const s = String(status ?? '').toLowerCase();
  if (s === 'open') return 'green';
  if (s === 'closed') return 'gray';
  if (s === 'in progress') return 'blue';
  return 'blue';
}

const GENERIC_STATUS_OPTIONS = [
  { id: 'Open', label: 'Open', color: 'green' as PillColor },
  { id: 'Closed', label: 'Closed', color: 'gray' as PillColor },
  { id: 'In Progress', label: 'In Progress', color: 'blue' as PillColor },
];

const GENERIC_TITLES = [
  'Review vendor qualification packet',
  'Coordinate shop drawing turnaround',
  'Publish weekly coordination log',
  'Track permit submittal status',
  'Confirm material lead times',
  'Field-verify as-built dimensions',
  'Schedule pre-install walkthrough',
  'Route safety observation follow-up',
  'Summarize owner meeting notes',
  'Reconcile subcontractor pay app',
] as const;

const GENERIC_DIVISIONS = ['Operations', 'Field', 'HQ', 'Estimating'] as const;
const GENERIC_OWNERS = [
  'Jamie Ortiz',
  'Morgan Lee',
  'Riley Chen',
  'Sam Patel',
  'Taylor Brooks',
  'Jordan Ng',
] as const;

function uniqSortedStrings(values: readonly string[]): string[] {
  return [...new Set(values.map((v) => String(v).trim()).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b)
  );
}

const ALL_GENERIC_ROWS: ToolLandingGenericRow[] = (() => {
  const count = 42;
  return Array.from({ length: count }, (_, i) => ({
    id: 100_000 + i,
    referenceCode: `TLN-${String(i + 1).padStart(4, '0')}`,
    summary: `${GENERIC_TITLES[i % GENERIC_TITLES.length]} (${i + 1})`,
    divisionCode: GENERIC_DIVISIONS[i % GENERIC_DIVISIONS.length],
    status: GENERIC_STATUS_OPTIONS[i % GENERIC_STATUS_OPTIONS.length].id,
    assignee: GENERIC_OWNERS[i % GENERIC_OWNERS.length],
    dueDate: `2026-0${(i % 6) + 1}-15`,
    description:
      'Placeholder description for a generic tool landing demo — not tied to prototype seed data.',
    responsibleOrg: 'Demo Organization',
    recordedOn: '2026-01-10',
    priority: i % 3 === 0 ? 'High' : 'Normal',
  }));
})();

function ToolLandingRowActionsCell(
  params: ICellRendererParams<ToolLandingGenericRow>
) {
  const rowId = params.data?.id;
  if (rowId == null) {
    return null;
  }
  const pathBase = `${PROTOTYPE_TOOL_BASE}/items/${rowId}`;
  return (
    <Flex gap="xs" alignItems="center" style={{ height: '100%' }}>
      <Button
        size="sm"
        variant="tertiary"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          shellNavigate(pathBase);
        }}
      >
        View
      </Button>
      <Button
        size="sm"
        variant="tertiary"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          shellNavigate(`${pathBase}/edit`);
        }}
      >
        Edit
      </Button>
    </Flex>
  );
}

const DIVISION_FILTER_OPTIONS = {
  options: uniqSortedStrings(ALL_GENERIC_ROWS.map((r) => r.divisionCode)).map(
    (label) => ({
      id: label,
      label,
    })
  ),
  placeholder: 'Any group',
} as const;

const ASSIGNEE_FILTER_OPTIONS = {
  options: uniqSortedStrings(ALL_GENERIC_ROWS.map((r) => r.assignee)).map(
    (label) => ({
      id: label,
      label,
    })
  ),
  placeholder: 'Any owner',
} as const;

const QUICK_STATUS_OPTIONS: Array<{ id: string; label: string }> = [
  { id: '', label: 'All' },
  ...GENERIC_STATUS_OPTIONS.map((o) => ({ id: o.id, label: o.label })),
];

const QUICK_ASSIGNEE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: '', label: 'Any' },
  ...ASSIGNEE_FILTER_OPTIONS.options.map((o) => ({ id: o.id, label: o.label })),
];

function buildGenericToolLandingColumnDefs(): Array<
  ExtendedColDefs<ToolLandingGenericRow>
> {
  return [
    {
      colId: 'actions',
      field: 'id',
      headerName: '',
      width: 130,
      maxWidth: 130,
      pinned: 'left',
      sortable: false,
      filter: false,
      resizable: false,
      suppressMovable: true,
      editable: false,
      isBulkEdit: false,
      cellRenderer: ToolLandingRowActionsCell,
    },
    {
      field: 'referenceCode',
      headerName: 'Reference',
      flex: 1,
      minWidth: 120,
      sortable: false,
      editable: false,
      isBulkEdit: false,
      ...SGTextCol,
    },
    {
      field: 'summary',
      headerName: 'Title',
      flex: 2,
      minWidth: 220,
      sortable: false,
      editable: false,
      isBulkEdit: false,
      ...SGTextCol,
    },
    {
      field: 'divisionCode',
      headerName: 'Group',
      flex: 1,
      minWidth: 120,
      sortable: false,
      editable: false,
      isBulkEdit: false,
      ...SGSelectCol,
      cellEditorType: 'select' as const,
      filterParams: { ...DIVISION_FILTER_OPTIONS },
      cellEditorParams: { ...DIVISION_FILTER_OPTIONS },
    },
    {
      field: 'status',
      headerName: 'State',
      flex: 1,
      minWidth: 120,
      sortable: false,
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
      filterParams: { options: [...GENERIC_STATUS_OPTIONS] },
      cellEditorParams: { options: [...GENERIC_STATUS_OPTIONS] },
    },
    {
      field: 'assignee',
      headerName: 'Owner',
      flex: 1,
      minWidth: 120,
      sortable: false,
      editable: false,
      isBulkEdit: false,
      ...SGSelectCol,
      cellEditorType: 'select' as const,
      filterParams: { ...ASSIGNEE_FILTER_OPTIONS },
      cellEditorParams: { ...ASSIGNEE_FILTER_OPTIONS },
    },
    {
      field: 'dueDate',
      headerName: 'Due',
      flex: 1,
      minWidth: 120,
      sortable: false,
      editable: false,
      isBulkEdit: false,
      ...SGTextCol,
    },
  ];
}

function buildGenericColumnConfigureRows(): ColumnConfigureRow[] {
  return buildGenericToolLandingColumnDefs()
    .filter((def) => {
      const colId =
        (def as { colId?: string }).colId ??
        String((def as { field?: string }).field ?? '');
      return colId !== 'actions';
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

function filterGenericRows(
  rows: readonly ToolLandingGenericRow[],
  params: SmartServerSideGetRowsRequest,
  quickStatus: string | undefined,
  quickAssignee: string | undefined,
  dueExtras: { dueDateFrom?: string; dueDateTo?: string }
): ToolLandingGenericRow[] {
  const filterModel = params.filterModel as
    | Record<string, unknown>
    | null
    | undefined;
  const searchEntry = filterModel?.search as { filter?: string } | undefined;
  const searchText = (
    typeof searchEntry?.filter === 'string' ? searchEntry.filter : ''
  )
    .trim()
    .toLowerCase();

  let out = [...rows];

  if (searchText) {
    out = out.filter(
      (r) =>
        r.summary.toLowerCase().includes(searchText) ||
        r.referenceCode.toLowerCase().includes(searchText)
    );
  }

  const status =
    readSmartGridScalarFilter(filterModel, 'status') ?? quickStatus;
  if (status) {
    out = out.filter((r) => r.status === status);
  }

  const divisionCode = readSmartGridScalarFilter(filterModel, 'divisionCode');
  if (divisionCode) {
    out = out.filter((r) => r.divisionCode === divisionCode);
  }

  const assignee =
    readSmartGridScalarFilter(filterModel, 'assignee') ?? quickAssignee;
  if (assignee) {
    out = out.filter((r) => r.assignee === assignee);
  }

  const referenceCode = readSmartGridScalarFilter(filterModel, 'referenceCode');
  if (referenceCode) {
    out = out.filter((r) =>
      r.referenceCode.toLowerCase().includes(referenceCode.toLowerCase())
    );
  }

  const summary = readSmartGridScalarFilter(filterModel, 'summary');
  if (summary) {
    out = out.filter((r) =>
      r.summary.toLowerCase().includes(summary.toLowerCase())
    );
  }

  const dueDate = readSmartGridScalarFilter(filterModel, 'dueDate');
  if (dueDate) {
    out = out.filter((r) => r.dueDate.includes(dueDate));
  }

  const dueDateFrom = dueExtras.dueDateFrom?.trim();
  const dueDateTo = dueExtras.dueDateTo?.trim();
  if (dueDateFrom) {
    out = out.filter((r) => r.dueDate >= dueDateFrom);
  }
  if (dueDateTo) {
    out = out.filter((r) => r.dueDate <= dueDateTo);
  }

  return out;
}

function GenericGridAndDetailSplit({
  recycleBinMode = false,
}: Readonly<{ recycleBinMode?: boolean }>) {
  const { companyId } = useParams({ strict: false });
  const mirageCompanyId = companyId ?? GUARDRAILS.DEMO_ROUTE.COMPANY_ID;

  const { hostRef, minHeightPx, remeasure } = useSmartGridHostMinHeight();
  const { show, hide, isOpen: splitDetailOpen } = useSplitViewCard();
  const [gridApi, setGridApi] = useState<GridApi<ToolLandingGenericRow> | null>(
    null
  );
  const [selectedRow, setSelectedRow] = useState<ToolLandingGenericRow | null>(
    null
  );
  const [detailTab, setDetailTab] = useState<'details' | 'activity'>('details');

  const {
    filterData,
    applyFilterData,
    clearField,
    filterFormResetKey,
    activeCount,
    chips,
  } = useSmartGridToolbarFilters();

  const [configureColumns, setConfigureColumns] = useState(() =>
    buildGenericColumnConfigureRows()
  );

  const toolbarConfigKey = recycleBinMode
    ? TOOL_LANDING_RECYCLE_SMART_GRID_TOOLBAR_CONFIG_KEY
    : TOOL_LANDING_SMART_GRID_TOOLBAR_CONFIG_KEY;

  const pageSize = useMemo(() => getListSmartGridPageSize(), []);

  const handleServerSideDatasource = useCallback(
    async (params: SmartServerSideGetRowsRequest) => {
      if (recycleBinMode) {
        const startRow = params.startRow ?? 0;
        const endRow = params.endRow ?? 100;
        const blockSize = Math.max(1, endRow - startRow);
        const page = Math.floor(startRow / blockSize) + 1;

        const qs = new URLSearchParams();
        qs.set('page', String(page));
        qs.set('per_page', String(blockSize));
        qs.set('filters[recycled]', 'true');

        const filterModel = params.filterModel as
          | Record<string, unknown>
          | null
          | undefined;
        const searchEntry = filterModel?.search as
          | { filter?: string }
          | undefined;
        const searchText =
          typeof searchEntry?.filter === 'string' ? searchEntry.filter : '';
        if (searchText.trim()) {
          qs.set('filters[search]', searchText.trim());
        }

        const status = readSmartGridScalarFilter(filterModel, 'status');
        if (status) qs.set('filters[status]', status);

        const assignee = readSmartGridScalarFilter(filterModel, 'assignee');
        if (assignee) qs.set('filters[assignee]', assignee);

        const divisionCode = readSmartGridScalarFilter(
          filterModel,
          'divisionCode'
        );
        if (divisionCode) qs.set('filters[divisionCode]', divisionCode);

        const referenceCode = readSmartGridScalarFilter(
          filterModel,
          'referenceCode'
        );
        if (referenceCode) qs.set('filters[referenceCode]', referenceCode);

        const summary = readSmartGridScalarFilter(filterModel, 'summary');
        if (summary) qs.set('filters[summary]', summary);

        const dueDate = readSmartGridScalarFilter(filterModel, 'dueDate');
        if (dueDate) qs.set('filters[dueDate]', dueDate);

        const extra = buildExtraQueryParamsFromFormData(filterData);
        if (extra.dueDateFrom)
          qs.set('filters[dueDateFrom]', extra.dueDateFrom);
        if (extra.dueDateTo) qs.set('filters[dueDateTo]', extra.dueDateTo);

        const res = await fetch(
          `/rest/v1.0/companies/${mirageCompanyId}/items?${qs.toString()}`
        );
        if (!res.ok) {
          return { rowData: [] as ToolLandingGenericRow[], rowCount: 0 };
        }
        const body = (await res.json()) as { data: Item[]; total: number };
        const rows = (body.data ?? []).map(itemToGenericRow);
        return {
          rowData: rows,
          rowCount: body.total ?? 0,
        };
      }

      const startRow = params.startRow ?? 0;
      const endRow = params.endRow ?? 100;
      const dueExtras = buildExtraQueryParamsFromFormData(filterData);
      const qStatus = filterData.status.trim() || undefined;
      const qAssignee = filterData.assignee.trim() || undefined;
      const filtered = filterGenericRows(
        ALL_GENERIC_ROWS,
        params,
        qStatus,
        qAssignee,
        dueExtras
      );
      const rowData = filtered.slice(startRow, endRow);
      return {
        rowData,
        rowCount: filtered.length,
      };
    },
    [filterData, mirageCompanyId, recycleBinMode]
  );

  const noRowsOverlayParams = useMemo(
    () =>
      recycleBinMode
        ? {
            title: 'Nothing in Recycle Bin',
            description:
              'Items you move to Recycle Bin appear here. Move an item to Recycle Bin from the full list to see it.',
            RecycleBin: true as const,
          }
        : {
            title: 'No rows',
            description: 'Adjust filters to see demo rows.',
            RecycleBin: false as const,
          },
    [recycleBinMode]
  );

  const gridDomId = recycleBinMode
    ? 'prototype-tool-landing-generic-smart-grid-recycle'
    : 'prototype-tool-landing-generic-smart-grid';

  const gridLocalStorageKey = recycleBinMode
    ? 'prototype-tool-landing-generic-smart-grid-recycle-v1'
    : 'prototype-tool-landing-generic-smart-grid-v1';

  const columnDefs = useMemo(() => buildGenericToolLandingColumnDefs(), []);

  const defaultColDef = useMemo(
    () => ({
      minWidth: 100,
      sortable: false,
      resizable: true,
      suppressHeaderFilterButton: false,
    }),
    []
  );

  const applyToolbarToGrid = useCallback(
    (data: typeof filterData) => {
      if (!gridApi) return;
      const merged = mergeToolbarIntoAgGridFilterModel(
        gridApi.getFilterModel() as Record<string, unknown>,
        data
      );
      gridApi.setFilterModel(merged);
      gridApi.refreshServerSide({ purge: true });
    },
    [gridApi]
  );

  useEffect(() => {
    if (!gridApi) return;
    applyToolbarToGrid(filterData);
  }, [applyToolbarToGrid, filterData, gridApi]);

  const onGridReady = useCallback(
    (e: GridReadyEvent<ToolLandingGenericRow>) => {
      setGridApi(e.api);
      queueMicrotask(() => {
        e.api.setSideBarPosition('left');
        e.api.setSideBarVisible(false);
        remeasure();
        (e.api as { doLayout?: () => void }).doLayout?.();
        const stored = readStoredSmartGridToolbarConfig(toolbarConfigKey);
        if (stored?.columns?.length) {
          setConfigureColumns(stored.columns.map((c) => ({ ...c })));
          const state = stored.columns.map((c, i) => ({
            colId: c.colId,
            hide: c.hide,
            order: i,
          }));
          e.api.applyColumnState({ state, applyOrder: true });
          e.api.setGridOption('rowHeight', stored.rowHeight);
          (e.api as { resetRowHeights?: () => void }).resetRowHeights?.();
        }
      });
    },
    [remeasure, toolbarConfigKey]
  );

  useLayoutEffect(() => {
    if (gridApi == null || minHeightPx == null) return;
    queueMicrotask(() => {
      (gridApi as { doLayout?: () => void }).doLayout?.();
    });
  }, [gridApi, minHeightPx]);

  const handleFilterApply = useCallback(
    (next: typeof filterData) => {
      applyFilterData(next);
    },
    [applyFilterData]
  );

  const handleChipRemove = useCallback(
    (field: keyof typeof filterData) => {
      clearField(field);
    },
    [clearField]
  );

  const handleColumnConfigureApply = useCallback(
    (payload: ColumnConfigureApplyPayload) => {
      if (!gridApi) return;
      const state = payload.columns.map((c, i) => ({
        colId: c.colId,
        hide: c.hide,
        order: i,
      }));
      gridApi.applyColumnState({ state, applyOrder: true });
      gridApi.setGridOption('rowHeight', payload.rowHeight);
      (gridApi as { resetRowHeights?: () => void }).resetRowHeights?.();
      setConfigureColumns(payload.columns.map((c) => ({ ...c })));
      writeStoredSmartGridToolbarConfig(toolbarConfigKey, {
        version: 1,
        columns: payload.columns.map((c) => ({ ...c })),
        rowHeight: payload.rowHeight,
      });
    },
    [gridApi, toolbarConfigKey]
  );

  const syncQuickSelect = useCallback(
    (field: 'status' | 'assignee', raw: unknown) => {
      const v = raw != null ? String(raw) : '';
      const next = { ...filterData, [field]: v };
      applyFilterData(next);
    },
    [applyFilterData, filterData]
  );

  const filterSchema = useMemo(
    () => getToolLandingGenericFilterPopoverSchema(),
    []
  );
  const filterUiSchema = useMemo(
    () => getToolLandingGenericFilterPopoverUiSchema(),
    []
  );

  const quickToolbarLeft = useMemo(
    () => (
      <Flex
        gap="sm"
        alignItems="center"
        wrap="wrap"
        data-prototype-quick-filters-wrap
      >
        <FilterToolbarPopoverButton
          width={360}
          activeCount={activeCount}
          content={
            <FormulatorFilterPopoverContent
              resetKey={filterFormResetKey}
              initialData={filterData}
              schema={filterSchema}
              uiSchema={filterUiSchema}
              onApply={handleFilterApply}
              onLiveChange={handleFilterApply}
            />
          }
        />
        <Flex gap="sm" alignItems="flex-end" wrap="nowrap">
          <Select
            key={`tl-qf-status-${filterData.status}-${filterFormResetKey}`}
            label="State"
            placeholder="All"
            data-testid="tool-landing-quick-filter-status"
            style={{ minWidth: 248 }}
            onClear={() => {
              syncQuickSelect('status', '');
            }}
            onSelect={({ item }) => {
              syncQuickSelect('status', item);
            }}
          >
            {QUICK_STATUS_OPTIONS.map((o) => (
              <Select.Option
                key={o.id === '' ? 'all' : o.id}
                value={o.id}
                selected={o.id === (filterData.status ?? '')}
              >
                {o.label}
              </Select.Option>
            ))}
          </Select>
          <Select
            key={`tl-qf-assignee-${filterData.assignee}-${filterFormResetKey}`}
            label="Owner"
            placeholder="Any"
            data-testid="tool-landing-quick-filter-assignee"
            style={{ minWidth: 248 }}
            onClear={() => {
              syncQuickSelect('assignee', '');
            }}
            onSelect={({ item }) => {
              syncQuickSelect('assignee', item);
            }}
          >
            {QUICK_ASSIGNEE_OPTIONS.map((o) => (
              <Select.Option
                key={o.id === '' ? 'any' : o.id}
                value={o.id}
                selected={o.id === (filterData.assignee ?? '')}
              >
                {o.label}
              </Select.Option>
            ))}
          </Select>
        </Flex>
      </Flex>
    ),
    [
      activeCount,
      filterData,
      filterFormResetKey,
      filterSchema,
      filterUiSchema,
      filterData.assignee,
      filterData.status,
      handleFilterApply,
      syncQuickSelect,
    ]
  );

  const quickToolbarRight = useMemo(
    () => (
      <Flex gap="sm" alignItems="center" wrap="wrap">
        <Button variant="secondary" type="button">
          Action
        </Button>
        <ConfigureToolbarPopoverButton
          width={320}
          content={
            <ColumnConfigurePopoverContent
              columns={configureColumns}
              initialRowHeight={
                Number(
                  (
                    gridApi as {
                      getGridOption?: (k: string) => unknown;
                    } | null
                  )?.getGridOption?.('rowHeight')
                ) || 40
              }
              onApply={handleColumnConfigureApply}
            />
          }
        />
      </Flex>
    ),
    [configureColumns, gridApi, handleColumnConfigureApply]
  );

  const customToolbarGroups = useMemo(
    () => [
      {
        id: 'prototype-tool-landing-quick-filters',
        position: 'left' as const,
        element: quickToolbarLeft,
      },
      {
        id: 'prototype-tool-landing-toolbar-right',
        position: 'right' as const,
        element: quickToolbarRight,
      },
    ],
    [quickToolbarLeft, quickToolbarRight]
  );

  const handleRowActivate = useCallback(
    (row: ToolLandingGenericRow | undefined) => {
      if (row?.id == null) return;
      setSelectedRow(row);
      setDetailTab('details');
      show();
    },
    [show]
  );

  const detailPanelBody = useMemo(() => {
    if (!selectedRow) {
      return <EmptyDetail>Choose a row to view details.</EmptyDetail>;
    }
    if (detailTab === 'activity') {
      return <EmptyDetail>No activity yet.</EmptyDetail>;
    }
    return (
      <Box data-testid="tool-landing-detail-formulator-form">
        <Form
          schema={getToolLandingDetailSchema()}
          uiSchema={getToolLandingDetailUiSchema()}
          initialData={pickToolLandingDetailFormData(selectedRow)}
        />
      </Box>
    );
  }, [detailTab, selectedRow]);

  return (
    <>
      <SplitViewCard.Main
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
          minHeight: 0,
          minWidth: 0,
          ...(!splitDetailOpen ? { width: '100%', maxWidth: '100%' } : {}),
        }}
      >
        <GridHost
          ref={hostRef}
          style={
            minHeightPx != null
              ? { flex: '1 1 auto', minHeight: minHeightPx }
              : undefined
          }
        >
          <Box
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              minHeight: 0,
              minWidth: 0,
            }}
          >
            <ActiveFilterChipsRow chips={chips} onRemove={handleChipRemove} />
            <SmartGridServer<ToolLandingGenericRow>
              id={gridDomId}
              theme={smartGridAgTheme}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              getRowId={({ data }) => String(data?.id ?? '')}
              localStorageKey={gridLocalStorageKey}
              globalizationConfig={{
                locale: 'en',
                timeZone: 'America/Los_Angeles',
              }}
              pagination
              paginationPageSize={pageSize}
              cacheBlockSize={pageSize}
              sideBar={{
                toolPanels: [],
              }}
              customToolbarGroups={customToolbarGroups}
              filterConfig={{
                search: {
                  isEnabled: true,
                  fieldName: 'search',
                },
              }}
              handleServerSideDatasource={handleServerSideDatasource}
              onGridReady={onGridReady}
              noRowsOverlayComponentParams={noRowsOverlayParams}
              onRowClicked={(e) => {
                handleRowActivate(e.data ?? undefined);
              }}
            />
          </Box>
        </GridHost>
      </SplitViewCard.Main>

      <SplitViewCard.Panel data-testid="tool-landing-generic-detail-panel">
        <SplitViewCard.PanelHeader>
          <SplitViewCard.PanelTitle>
            {selectedRow ? (
              <>
                <span>{selectedRow.referenceCode}</span>
                <span style={{ marginLeft: 8, fontWeight: 400 }}>
                  {selectedRow.summary}
                </span>
              </>
            ) : (
              'Details'
            )}
          </SplitViewCard.PanelTitle>
          <Tabs>
            <Tabs.Tab
              role="button"
              selected={detailTab === 'details'}
              onPress={() => setDetailTab('details')}
            >
              Details
            </Tabs.Tab>
            <Tabs.Tab
              role="button"
              selected={detailTab === 'activity'}
              onPress={() => setDetailTab('activity')}
            >
              Activity
            </Tabs.Tab>
          </Tabs>
        </SplitViewCard.PanelHeader>
        <SplitViewCard.PanelBody>{detailPanelBody}</SplitViewCard.PanelBody>
        {selectedRow ? (
          <SplitViewCard.PanelFooter>
            <SplitViewCard.Actions>
              <Button variant="secondary" onClick={() => hide()}>
                Close
              </Button>
            </SplitViewCard.Actions>
          </SplitViewCard.PanelFooter>
        ) : null}
      </SplitViewCard.Panel>
    </>
  );
}

export type ToolLandingGenericSmartGridProps = CommonProps & {
  /** When true, loads Mirage items with `filters[recycled]=true` into the generic grid shape. */
  recycleBinMode?: boolean;
};

export function ToolLandingGenericSmartGrid({
  recycleBinMode = false,
}: Readonly<ToolLandingGenericSmartGridProps>) {
  const shellTestId = recycleBinMode
    ? 'tool-landing-generic-smart-grid-recycle'
    : 'tool-landing-generic-smart-grid';

  return (
    <GridShell
      className="prototype-tool-landing-generic-smart-grid-shell"
      data-testid={shellTestId}
    >
      <SplitViewCard
        style={{
          display: 'flex',
          alignItems: 'stretch',
          flex: 1,
          height: '100%',
          minHeight: 0,
          minWidth: 0,
          width: '100%',
        }}
      >
        <GenericGridAndDetailSplit recycleBinMode={recycleBinMode} />
      </SplitViewCard>
    </GridShell>
  );
}
