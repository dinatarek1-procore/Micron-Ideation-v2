import React from 'react';
import { useViewContext } from '@procore/json-toolinator';
import { RelatedItems } from '@procore/related-items';
import { Box, DetailPage } from '@procore/core-react';

type ItemRouteParams = {
  companyId?: string | number;
  itemId?: string | number;
};

export function ItemRelatedItemsList({
  itemId: itemIdProp,
}: { itemId?: string } = {}) {
  const { params } = useViewContext({ strict: false });
  const p = params as ItemRouteParams;
  const itemId = itemIdProp ?? String(p.itemId ?? '');

  return (
    <DetailPage.Card>
      <Box data-testid="related-items-engagement-host" padding="lg">
        <RelatedItems
          provider={{ companyId: String(p.companyId ?? ''), projectId: '1' }}
          holderItems={{ ids: [itemId], type: 'GenericToolItem' }}
          variant={{ layout: 'horizontal' }}
          disableLinking={false}
          enableFilters
          enableGrouping={false}
          showHeader
        />
      </Box>
    </DetailPage.Card>
  );
}
