import React from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Button, Flex } from '@procore/core-react';
import {
  withDataTableRenderer,
  type DataTableCellRendererProps,
} from '@procore/data-table';

import type { Item } from '@/mockServer/itemsStore';

import { listItemBasePath } from './titleCell';

/**
 * Json Tabulator: View + second action in the first column (replaces summary / reference links).
 * Recycle Bin uses the "Retrieve" label; all other lists use "Edit". Both navigate to the edit route.
 */
function ListTabulatorRowActionsCellContent({
  data,
  recycleBinMode,
}: Readonly<
  DataTableCellRendererProps<string | undefined> & {
    recycleBinMode: boolean;
  }
>) {
  const { companyId } = useParams({ strict: false });
  const navigate = useNavigate();
  const row = data as Item | undefined;
  const rowId = row?.id;
  const base = listItemBasePath(companyId);

  if (rowId == null) {
    return null;
  }

  const secondaryLabel = recycleBinMode ? 'Retrieve' : 'Edit';

  return (
    <Flex gap="xs" alignItems="center" style={{ height: '100%' }}>
      <Button
        size="sm"
        variant="secondary"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          void navigate({ to: `${base}/items/${rowId}` });
        }}
      >
        View
      </Button>
      <Button
        size="sm"
        variant="secondary"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          void navigate({
            to: `${base}/items/${rowId}/${recycleBinMode ? '' : 'edit'}`,
          });
        }}
      >
        {secondaryLabel}
      </Button>
    </Flex>
  );
}

/** @param recycleBinMode When true, second button is "Retrieve" (Recycle Bin only). */
export function createListTabulatorRowActionsCellRenderer(
  recycleBinMode: boolean
) {
  const Cell = (
    props: Readonly<DataTableCellRendererProps<string | undefined>>
  ) => (
    <ListTabulatorRowActionsCellContent
      {...props}
      recycleBinMode={recycleBinMode}
    />
  );

  return withDataTableRenderer(Cell);
}

/** Default list (not Recycle Bin): View / Edit. */
export const ListTabulatorRowActionsCellRenderer =
  createListTabulatorRowActionsCellRenderer(false);
