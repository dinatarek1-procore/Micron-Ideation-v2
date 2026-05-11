import React, { useRef } from 'react';
import { useViewContext } from '@procore/json-toolinator';
import { Form, type FormRef } from '@procore/json-formulator';
import { Button, DetailPage, Typography } from '@procore/core-react';

import type { Item } from '@/mockServer/itemsStore';
import { unwrapData } from '@/views/shared/itemQueries';

import {
  getItemEditSchema,
  getItemEditUiSchema,
  pickItemEditFormData,
  type ItemEditFormData,
} from './itemEdit.schema';

export function ItemEditContent() {
  const { params, queries, navigate, queryClient } = useViewContext({
    strict: false,
  });
  const { companyId, itemId } = params;
  const serverItem = unwrapData<Item>(queries?.item?.data);
  const formRef = useRef<FormRef | null>(null);

  if (!serverItem) {
    return <Typography intent="body">Loading…</Typography>;
  }

  const initialData = pickItemEditFormData(serverItem);

  return (
    <>
      <DetailPage.Card>
        <DetailPage.Section heading="General Information">
          <Form
            key={`edit-${String(itemId)}`}
            initialData={initialData}
            liveValidate={false}
            onSubmit={async (ev) => {
              const patch = ev.formData as ItemEditFormData;
              const body: Item = { ...serverItem, ...patch };
              const res = await fetch(
                `/rest/v1.0/companies/${companyId}/items/${encodeURIComponent(String(itemId))}`,
                {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body),
                }
              );
              if (!res.ok) throw new Error('Update failed');
              await queryClient.invalidateQueries({
                queryKey: ['item', companyId, itemId],
              });
              await queryClient.invalidateQueries({
                queryKey: ['items', companyId],
              });
              await navigate({ ignoreBlocker: true, to: '..' });
            }}
            ref={formRef}
            schema={getItemEditSchema()}
            uiSchema={getItemEditUiSchema()}
          />
        </DetailPage.Section>
      </DetailPage.Card>
      <DetailPage.Footer>
        <DetailPage.FooterActions>
          <Button
            variant="tertiary"
            onClick={() => {
              void navigate({ ignoreBlocker: true, to: '..' });
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={() => {
              void formRef.current?.submit();
            }}
          >
            Save Changes
          </Button>
        </DetailPage.FooterActions>
      </DetailPage.Footer>
    </>
  );
}
