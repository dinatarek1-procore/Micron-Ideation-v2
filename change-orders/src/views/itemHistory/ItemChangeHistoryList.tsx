import React from 'react';
import { useViewContext } from '@procore/json-toolinator';
import { ChangeHistoryTable } from '@procore/change-history-table';
import { Box, DetailPage } from '@procore/core-react';

/** Matches Mirage `itemChangeHistory` payload. */
type ChangeHistoryApiRow = {
  id: string;
  column: string;
  created_at: string;
  created_by: string;
  old_value: string;
  new_value: string;
};

type ItemRouteParams = {
  companyId?: string | number;
  itemId?: string | number;
};

export function ItemChangeHistoryList({
  itemId: itemIdProp,
}: { itemId?: string } = {}) {
  const { params } = useViewContext({ strict: false });
  const p = params as ItemRouteParams;
  const itemId = itemIdProp ?? String(p.itemId ?? '');

  const query = {
    url: `/rest/v1.0/companies/${p.companyId}/items/${itemId}/change_history`,
    mappingFn: (body: unknown): ChangeHistoryApiRow[] => {
      const envelope = body as
        | { data?: ChangeHistoryApiRow[] }
        | null
        | undefined;
      return envelope?.data ?? [];
    },
  };

  return (
    <DetailPage.Card>
      <DetailPage.Section heading="Change History">
        <Box data-testid="item-change-history-host">
          <ChangeHistoryTable displayToolName="Prototype Tool" query={query} />
        </Box>
      </DetailPage.Section>
    </DetailPage.Card>
  );
}
