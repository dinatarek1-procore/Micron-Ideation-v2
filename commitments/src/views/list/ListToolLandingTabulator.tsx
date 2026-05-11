import React, { useCallback, useMemo } from 'react';
import { useParams } from '@tanstack/react-router';
import type { CommonProps } from '@procore/json-toolinator';
import type { JsonSchema } from '@procore/json-formulator';
import { Box, Card, EmptyState } from '@procore/core-react';
import { Table, type TableProps } from '@procore/json-tabulator';
import { styled } from 'styled-components';

import { GUARDRAILS } from '@/shared/guardrails';
import type { Item } from '@/mockServer/itemsStore';

import { buildPrototypeToolListUiSchema } from './buildPrototypeToolListUiSchema';
import { createListTabulatorRowActionsCellRenderer } from './listTabulatorRowActionsCell';
import listItemSchema from '../../../blueprints/prototype-tool/data.schema.json';

/** Synthetic first column so View + second action render before data fields; second is Edit or Retrieve in Recycle Bin mode. */
const LIST_TABULATOR_ROW_ACTIONS_FIELD = '_prototypeRowActions';

/** Column header: must live on this field's `ui:options` so json-tabulator `getFieldOptions` picks it up (root `ui:options[field]` is not merged for headers). */
const LIST_TABULATOR_ROW_ACTIONS_HEADER = 'Actions';

const GridShell = styled(Box)`
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  overflow: hidden;
  width: 100%;
`;

const GridHost = styled(Box)`
  box-sizing: border-box;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 16px 24px;
`;

type TabulatorServerRequest = Parameters<
  NonNullable<TableProps<Item>['onServerSideDataRequest']>
>[0];

function coerceServerFilterValue(v: unknown): string | undefined {
  if (typeof v === 'string' && v.trim()) return v;
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  if (v && typeof v === 'object') {
    const id = (v as Record<string, unknown>).id;
    if (typeof id === 'string' && id.trim()) return id;
    if (typeof id === 'number' && Number.isFinite(id)) return String(id);
  }
  return undefined;
}

function omitCellKey<T extends Record<string, unknown>>(obj: T): T {
  const next = { ...obj };
  delete next.cell;
  return next;
}

export type ListToolLandingTabulatorProps = CommonProps & {
  /** When true, requests Mirage items with `filters[recycled]=true` (Recycle Bin). */
  recycleBinMode?: boolean;
};

export function ListToolLandingTabulator({
  recycleBinMode = false,
}: Readonly<ListToolLandingTabulatorProps>) {
  const { companyId } = useParams({ strict: false });
  const id = companyId ?? GUARDRAILS.DEMO_ROUTE.COMPANY_ID;

  const listItemSchemaForTable = useMemo((): JsonSchema => {
    const base = listItemSchema as JsonSchema & {
      properties?: Record<string, unknown>;
    };
    return {
      ...base,
      properties: {
        [LIST_TABULATOR_ROW_ACTIONS_FIELD]: {
          type: 'string',
          title: LIST_TABULATOR_ROW_ACTIONS_HEADER,
        },
        ...(base.properties ?? {}),
      },
    };
  }, []);

  const rowActionsRenderer = useMemo(
    () => createListTabulatorRowActionsCellRenderer(recycleBinMode),
    [recycleBinMode]
  );

  const listUiSchema = useMemo((): TableProps<Item>['uiSchema'] => {
    const built = buildPrototypeToolListUiSchema() as Record<string, unknown>;
    const prevOptions =
      (built['ui:options'] as
        | Record<string, Record<string, unknown>>
        | undefined) ?? {};
    const prevSummary = (prevOptions.summary ?? {}) as Record<string, unknown>;
    const prevReferenceCode = (prevOptions.referenceCode ?? {}) as Record<
      string,
      unknown
    >;
    const builtSummaryRoot =
      (built.summary as Record<string, unknown> | undefined) ?? {};
    const builtSummaryRootOpts =
      (builtSummaryRoot['ui:options'] as Record<string, unknown> | undefined) ??
      {};
    const tablePrev =
      (built['ui:tableOptions'] as Record<string, unknown> | undefined) ?? {};
    return {
      ...built,
      [LIST_TABULATOR_ROW_ACTIONS_FIELD]: {
        'ui:options': {
          title: LIST_TABULATOR_ROW_ACTIONS_HEADER,
          width: 130,
          flex: 0,
          cell: rowActionsRenderer,
        },
      },
      'ui:options': {
        ...prevOptions,
        referenceCode: omitCellKey(prevReferenceCode),
        summary: omitCellKey(prevSummary),
      },
      summary: {
        ...builtSummaryRoot,
        'ui:options': omitCellKey(builtSummaryRootOpts),
      },
      'ui:tableOptions': {
        ...tablePrev,
        localStoragePersistenceKey: recycleBinMode
          ? 'prototype-tool-new-json-tabulator-recycle-v1'
          : 'prototype-tool-new-json-tabulator-v1',
      },
    };
  }, [recycleBinMode, rowActionsRenderer]);

  const recycleBinEmptyState = useMemo(
    () => () => (
      <Box
        data-testid="prototype-tool-new-json-tabulator-recycle-empty"
        style={{ padding: 24 }}
      >
        <EmptyState>
          <EmptyState.NoItems />
          <EmptyState.Title>Nothing in Recycle Bin</EmptyState.Title>
          <EmptyState.Description>
            Items you move to Recycle Bin appear here. Move an item to Recycle
            Bin from the full list to see it.
          </EmptyState.Description>
        </EmptyState>
      </Box>
    ),
    []
  );

  const handleServerSideDataRequest = useCallback(
    async ({ request }: TabulatorServerRequest) => {
      const startRow = request.startRow ?? 0;
      const endRow = request.endRow ?? 100;
      const blockSize = Math.max(1, endRow - startRow);
      const page = Math.floor(startRow / blockSize) + 1;

      const qs = new URLSearchParams();
      qs.set('page', String(page));
      qs.set('per_page', String(blockSize));

      const searchText = (request.searchValue ?? '').trim();
      if (searchText) qs.set('filters[search]', searchText);

      for (const f of request.serverFilters ?? []) {
        if (f.field === LIST_TABULATOR_ROW_ACTIONS_FIELD) continue;
        const v = coerceServerFilterValue(f.value?.[0]);
        if (v) qs.set(`filters[${f.field}]`, v);
      }

      if (recycleBinMode) {
        qs.set('filters[recycled]', 'true');
      }

      const res = await fetch(
        `/rest/v1.0/companies/${id}/items?${qs.toString()}`
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
    [id, recycleBinMode]
  );

  const shellTestId = recycleBinMode
    ? 'list-tool-json-tabulator-recycle'
    : 'list-tool-json-tabulator';
  const innerTestId = recycleBinMode
    ? 'prototype-tool-new-json-tabulator-recycle'
    : 'prototype-tool-new-json-tabulator';

  return (
    <GridShell
      className="prototype-list-json-tabulator-shell"
      data-testid={shellTestId}
    >
      <GridHost>
        <Card
          shadowStrength={1}
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <Box
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0,
              padding: '16px 24px',
            }}
            data-testid={innerTestId}
          >
            <Table<Item>
              data={[]}
              schema={listItemSchemaForTable}
              uiSchema={listUiSchema}
              emptyStateRenderer={
                recycleBinMode ? recycleBinEmptyState : undefined
              }
              onServerSideDataRequest={handleServerSideDataRequest}
            />
          </Box>
        </Card>
      </GridHost>
    </GridShell>
  );
}
