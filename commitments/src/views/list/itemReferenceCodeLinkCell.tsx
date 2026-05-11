import React from 'react';
import { useParams } from '@tanstack/react-router';
import { Typography } from '@procore/core-react';
import {
  withDataTableRenderer,
  type DataTableCellRendererProps,
} from '@procore/data-table';

import type { Item } from '@/mockServer/itemsStore';

import { ItemTitleLink, listItemBasePath } from './titleCell';

const emptyValue = '--';

function formatCellDisplay(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number')
    return String(value);
  return '';
}

/**
 * Data-table / json-tabulator: link to item detail from reference code
 * (same pattern as planroom {@link BidPackageCell} + {@link ItemSummaryLinkCell}).
 */
function ItemReferenceCodeLinkCell({
  data,
  value,
}: Readonly<DataTableCellRendererProps<string | undefined>>) {
  const { companyId } = useParams({ strict: false });
  const row = data as Item | undefined;
  const id = String(row?.id ?? '');
  const display = formatCellDisplay(value);
  const base = listItemBasePath(companyId);

  if (!display) {
    return <Typography intent="small">{emptyValue}</Typography>;
  }

  return (
    <Typography intent="small">
      <ItemTitleLink
        data-testid="item-reference-code-link"
        to={`${base}/items/${id}`}
        onClick={(e) => e.stopPropagation()}
      >
        {display}
      </ItemTitleLink>
    </Typography>
  );
}

export const ItemReferenceCodeLinkCellRenderer = withDataTableRenderer(
  ItemReferenceCodeLinkCell
);
