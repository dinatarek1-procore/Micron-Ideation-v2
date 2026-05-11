import React from 'react';
import type { ICellRendererParams } from 'ag-grid-enterprise';
import { Button, Flex } from '@procore/core-react';
import { useNavigate, useParams } from '@tanstack/react-router';

import type { Item } from '@/mockServer/itemsStore';

import { listItemBasePath } from './titleCell';

/**
 * Smart Grid leading column: View / Edit for the row (no in-cell links on title or reference).
 */
export function ListToolRowActionsCell(
  params: Readonly<ICellRendererParams<Item>>
) {
  const { companyId } = useParams({ strict: false });
  const navigate = useNavigate();
  const rowId = params.data?.id;
  const base = listItemBasePath(companyId);

  if (rowId == null) {
    return null;
  }

  return (
    <Flex gap="xs" alignItems="center" style={{ height: '100%' }}>
      <Button
        size="sm"
        variant="tertiary"
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
        variant="tertiary"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          void navigate({ to: `${base}/items/${rowId}/edit` });
        }}
      >
        Edit
      </Button>
    </Flex>
  );
}
