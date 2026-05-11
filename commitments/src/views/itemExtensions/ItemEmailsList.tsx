import React from 'react';
import { useViewContext } from '@procore/json-toolinator';
import { Box, DetailPage } from '@procore/core-react';
import { Emails } from '@procore/engagement-emails';

import { unwrapData } from '@/views/shared/itemQueries';

type ItemRouteParams = {
  companyId?: string | number;
  itemId?: string | number;
};

export function ItemEmailsList({
  itemId: itemIdProp,
}: { itemId?: string } = {}) {
  const { params, queries } = useViewContext({ strict: false });
  const p = params as ItemRouteParams;
  const itemId = itemIdProp ?? String(p.itemId ?? '');
  const item = unwrapData<{ summary?: string }>(queries?.item?.data);

  return (
    <DetailPage.Card>
      <DetailPage.Section heading="Emails">
        <Box data-testid="item-emails-engagement-host">
          <Emails.Provider
            procoreEnv={{
              company: {
                id: Number(p.companyId ?? 0),
                name: 'Prototype company',
              },
              project: { id: 1, name: 'Prototype project' },
            }}
            topic={{
              id: Number(itemId),
              type: 'prototype_item',
              title: item?.summary ?? 'Item',
            }}
            permissions={{
              canSendEmail: true,
              canViewEmailContent: true,
              canSendEmailReply: true,
              isAdmin: true,
            }}
          >
            <Emails
              usersApi={{
                query: { url: `/rest/v1.0/companies/${p.companyId}/users` },
              }}
              environment="development"
            />
          </Emails.Provider>
        </Box>
      </DetailPage.Section>
    </DetailPage.Card>
  );
}
