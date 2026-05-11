import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import type { CommonProps } from '@procore/json-toolinator';
import type { GridApi, GridReadyEvent } from 'ag-grid-enterprise';
import {
  Box,
  Button,
  Flex,
  Label,
  Pill,
  Select,
  SplitViewCard,
  Tabs,
  colors,
  useSplitViewCard,
} from '@procore/core-react';
import {
  SmartGridServer,
  type SmartServerSideGetRowsRequest,
} from '@procore/smart-grid-core';
import { styled } from 'styled-components';

import { FormulatorFilterPopoverContent } from '@/components/templates/ix-popover/FormulatorFilterPopoverContent';
import {
  ColumnConfigurePopoverContent,
  type ColumnConfigureApplyPayload,
} from '@/components/templates/ix-popover/ColumnConfigurePopoverContent';
import { FilterToolbarPopoverButton } from '@/components/templates/popovers/PopoverComponentFilter';
import { ConfigureToolbarPopoverButton } from '@/components/templates/popovers/PopoverComponentConfigure';
import { GUARDRAILS } from '@/shared/guardrails';
import type { Item } from '@/mockServer/itemsStore';

import { ActiveFilterChipsRow } from './ActiveFilterChipsRow';
import {
  buildListColumnConfigureRows,
  buildListSmartGridColumnDefs,
  getListSmartGridPageSize,
  LIST_QUICK_ASSIGNEE_OPTIONS,
  LIST_QUICK_STATUS_OPTIONS,
} from './listSmartGridColumnDefs';
import {
  getMirageListFilterPopoverSchema,
  getMirageListFilterPopoverUiSchema,
} from './listFilterPopover.schema';
import { smartGridAgTheme } from './smartGridAgTheme';
import {
  buildExtraQueryParamsFromFormData,
  mergeToolbarIntoAgGridFilterModel,
} from './smartGridFilterMapping';
import {
  LIST_SMART_GRID_TOOLBAR_CONFIG_KEY,
  readStoredSmartGridToolbarConfig,
  writeStoredSmartGridToolbarConfig,
} from './smartGridToolbarStorage';
import { useSmartGridToolbarFilters } from './useSmartGridToolbarFilters';

import './listSmartGridFilterPanel.css';
import { useSmartGridHostMinHeight } from './useSmartGridHostMinHeight';

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

const FieldBlock = styled.div`
  margin-bottom: 16px;
`;

const FieldLabel = styled(Label)`
  display: block;
  margin-bottom: 4px;
`;

const EmptyDetail = styled.p`
  margin: 0;
  color: ${colors.gray45};
  font-size: 14px;
`;

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

type ListGridSplitProps = {
  base: string;
  companyId: string | number;
  navigate: ReturnType<typeof useNavigate>;
};

function ListGridAndDetailSplit({
  base,
  companyId,
  navigate,
}: Readonly<ListGridSplitProps>) {
  const { hostRef, minHeightPx, remeasure } = useSmartGridHostMinHeight();
  const { show, hide, isOpen: splitDetailOpen } = useSplitViewCard();
  const [gridApi, setGridApi] = useState<GridApi<Item> | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
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
    buildListColumnConfigureRows()
  );

  const pageSize = useMemo(() => getListSmartGridPageSize(), []);

  const handleServerSideDatasource = useCallback(
    async (params: SmartServerSideGetRowsRequest) => {
      const startRow = params.startRow ?? 0;
      const endRow = params.endRow ?? 100;
      const blockSize = Math.max(1, endRow - startRow);
      const page = Math.floor(startRow / blockSize) + 1;

      const qs = new URLSearchParams();
      qs.set('page', String(page));
      qs.set('per_page', String(blockSize));

      const filterModel = params.filterModel as
        | Record<string, unknown>
        | null
        | undefined;
      const searchEntry = filterModel?.search as
        | { filter?: string }
        | undefined;
      const searchText =
        typeof searchEntry?.filter === 'string' ? searchEntry.filter : '';
      if (searchText) qs.set('filters[search]', searchText);

      const status = readSmartGridScalarFilter(filterModel, 'status');
      if (status) qs.set('filters[status]', status);

      const divisionCode = readSmartGridScalarFilter(
        filterModel,
        'divisionCode'
      );
      if (divisionCode) qs.set('filters[divisionCode]', divisionCode);

      const assignee = readSmartGridScalarFilter(filterModel, 'assignee');
      if (assignee) qs.set('filters[assignee]', assignee);

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
      if (extra.dueDateFrom) qs.set('filters[dueDateFrom]', extra.dueDateFrom);
      if (extra.dueDateTo) qs.set('filters[dueDateTo]', extra.dueDateTo);

      const res = await fetch(
        `/rest/v1.0/companies/${companyId}/items?${qs.toString()}`
      );
      if (!res.ok) {
        return { rowData: [] as Item[], rowCount: 0 };
      }
      const body = (await res.json()) as { data: Item[]; total: number };
      return {
        rowData: body.data ?? [],
        rowCount: body.total ?? 0,
      };
    },
    [companyId, filterData]
  );

  const columnDefs = useMemo(() => buildListSmartGridColumnDefs(), []);

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
      writeStoredSmartGridToolbarConfig(LIST_SMART_GRID_TOOLBAR_CONFIG_KEY, {
        version: 1,
        columns: payload.columns.map((c) => ({ ...c })),
        rowHeight: payload.rowHeight,
      });
    },
    [gridApi]
  );

  const onGridReady = useCallback(
    (e: GridReadyEvent<Item>) => {
      setGridApi(e.api);
      queueMicrotask(() => {
        e.api.setSideBarPosition('left');
        e.api.setSideBarVisible(false);
        remeasure();
        e.api.doLayout?.();
        const stored = readStoredSmartGridToolbarConfig(
          LIST_SMART_GRID_TOOLBAR_CONFIG_KEY
        );
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
    [remeasure]
  );

  useLayoutEffect(() => {
    if (gridApi == null || minHeightPx == null) return;
    queueMicrotask(() => {
      gridApi.doLayout?.();
    });
  }, [gridApi, minHeightPx]);

  const syncQuickSelect = useCallback(
    (field: 'status' | 'assignee', raw: unknown) => {
      const v = raw != null ? String(raw) : '';
      const next = { ...filterData, [field]: v };
      applyFilterData(next);
    },
    [applyFilterData, filterData]
  );

  const filterSchema = useMemo(() => getMirageListFilterPopoverSchema(), []);
  const filterUiSchema = useMemo(
    () => getMirageListFilterPopoverUiSchema(),
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
            key={`list-qf-status-${filterData.status}-${filterFormResetKey}`}
            label="State"
            placeholder="All"
            data-testid="list-quick-filter-status"
            style={{ minWidth: 248 }}
            onClear={() => {
              syncQuickSelect('status', '');
            }}
            onSelect={({ item }) => {
              syncQuickSelect('status', item);
            }}
          >
            {LIST_QUICK_STATUS_OPTIONS.map((o) => (
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
            key={`list-qf-assignee-${filterData.assignee}-${filterFormResetKey}`}
            label="Owner"
            placeholder="Any"
            data-testid="list-quick-filter-assignee"
            style={{ minWidth: 248 }}
            onClear={() => {
              syncQuickSelect('assignee', '');
            }}
            onSelect={({ item }) => {
              syncQuickSelect('assignee', item);
            }}
          >
            {LIST_QUICK_ASSIGNEE_OPTIONS.map((o) => (
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
                Number(gridApi?.getGridOption?.('rowHeight')) || 40
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
        id: 'prototype-quick-filters',
        position: 'left' as const,
        element: quickToolbarLeft,
      },
      {
        id: 'prototype-toolbar-filters-right',
        position: 'right' as const,
        element: quickToolbarRight,
      },
    ],
    [quickToolbarLeft, quickToolbarRight]
  );

  const handleRowActivate = useCallback(
    (row: Item | undefined) => {
      if (row?.id == null) return;
      setSelectedItem(row);
      setDetailTab('details');
      show();
    },
    [show]
  );

  const detailPanelBody = useMemo(() => {
    if (!selectedItem) {
      return <EmptyDetail>Choose a row to view details.</EmptyDetail>;
    }
    if (detailTab === 'activity') {
      return <EmptyDetail>No activity yet.</EmptyDetail>;
    }
    return (
      <>
        <FieldBlock>
          <FieldLabel>State</FieldLabel>
          <Pill>{selectedItem.status}</Pill>
        </FieldBlock>
        <FieldBlock>
          <FieldLabel>Due</FieldLabel>
          <span>{selectedItem.dueDate}</span>
        </FieldBlock>
        <FieldBlock>
          <FieldLabel>Owner</FieldLabel>
          <span>{selectedItem.assignee || '—'}</span>
        </FieldBlock>
        <FieldBlock>
          <FieldLabel>Description</FieldLabel>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            {selectedItem.description}
          </p>
        </FieldBlock>
        <FieldBlock>
          <FieldLabel>Organization</FieldLabel>
          <span>{selectedItem.responsibleOrg}</span>
        </FieldBlock>
        <FieldBlock>
          <FieldLabel>Recorded</FieldLabel>
          <span>{selectedItem.recordedOn}</span>
        </FieldBlock>
        <FieldBlock>
          <FieldLabel>Group</FieldLabel>
          <span>{selectedItem.divisionCode}</span>
        </FieldBlock>
        <FieldBlock>
          <FieldLabel>Priority</FieldLabel>
          <span>{selectedItem.priority}</span>
        </FieldBlock>
      </>
    );
  }, [detailTab, selectedItem]);

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
            <SmartGridServer<Item>
              id="prototype-tool-new-smart-grid"
              theme={smartGridAgTheme}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              getRowId={({ data }) => String(data?.id ?? '')}
              localStorageKey="prototype-tool-new-smart-grid-v1"
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
              rowSelection={{ mode: 'singleRow' }}
              handleServerSideDatasource={handleServerSideDatasource}
              onGridReady={onGridReady}
              noRowsOverlayComponentParams={{
                title: 'No items',
                description: 'Create an item to see it in the grid.',
                RecycleBin: false,
              }}
              onRowClicked={(e) => {
                handleRowActivate(e.data ?? undefined);
              }}
            />
          </Box>
        </GridHost>
      </SplitViewCard.Main>

      <SplitViewCard.Panel data-testid="list-item-detail-panel">
        <SplitViewCard.PanelHeader>
          <SplitViewCard.PanelTitle>
            {selectedItem ? (
              <>
                <span>{selectedItem.referenceCode}</span>
                <span style={{ marginLeft: 8, fontWeight: 400 }}>
                  {selectedItem.summary}
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
        {selectedItem ? (
          <SplitViewCard.PanelFooter>
            <SplitViewCard.Actions>
              <Button variant="secondary" onClick={() => hide()}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  void navigate({ to: `${base}/items/${selectedItem.id}` })
                }
              >
                View full record
              </Button>
            </SplitViewCard.Actions>
          </SplitViewCard.PanelFooter>
        ) : null}
      </SplitViewCard.Panel>
    </>
  );
}

export function ListToolLandingSmartGrid(_props: Readonly<CommonProps>) {
  const { companyId } = useParams({ strict: false });
  const navigate = useNavigate();
  const id = companyId ?? GUARDRAILS.DEMO_ROUTE.COMPANY_ID;
  const base = GUARDRAILS.DEMO_ROUTE.BASE_PATH.replace(
    '$companyId',
    String(id)
  );

  return (
    <GridShell
      className="prototype-list-smart-grid-shell"
      data-testid="list-tool-smart-grid"
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
        <ListGridAndDetailSplit
          base={base}
          companyId={id}
          navigate={navigate}
        />
      </SplitViewCard>
    </GridShell>
  );
}
