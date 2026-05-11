import React from 'react';
import { useViewContext } from '@procore/json-toolinator';
import { Form } from '@procore/json-formulator';
import { Button, DetailPage, Typography } from '@procore/core-react';
import { ProtoPageHeader } from '@/views/shared/ProtoPageHeader';

import type { Item } from '@/mockServer/itemsStore';
import { unwrapData } from '@/views/shared/itemQueries';
import {
  getItemDetailCommercialSchema,
  getItemDetailCommercialUiSchema,
  getItemDetailGeneralSchema,
  getItemDetailGeneralUiSchema,
  pickItemDetailFormData,
} from '@/views/detail/itemDetail.schema';

export function ItemDetailGeneral() {
  const { queries } = useViewContext({ strict: false });
  const item = unwrapData<Item>(queries?.item?.data);

  if (!item) {
    return <Typography intent="body">Loading…</Typography>;
  }

  const initialData = pickItemDetailFormData(item);

  return (
    <>
      <ProtoPageHeader
        title={item.contractor || item.summary || item.number}
        subtitle={<>{item.number} · {item.summary}</>}
        actions={<Button variant="primary">Edit contract</Button>}
        tabs={[
          { label: 'General', active: true, path: '' },
          { label: 'Schedule of Values', path: '/schedule-of-values' },
          { label: 'Change Orders (0)', path: '/change-orders' },
          { label: 'RFQs' },
          { label: 'Compliance' },
          { label: 'Invoices (0)' },
          { label: 'Lien Rights' },
          { label: 'Payments Issued (0)' },
          { label: 'Emails', path: '/emails' },
          { label: 'Change History', path: '/history' },
          { label: 'Financial Markup' },
          { label: 'Advanced Settings' },
        ]}
      />

      <DetailPage.Card>
        <DetailPage.Section expandId={1} heading="General Information">
          <Form
            schema={getItemDetailGeneralSchema()}
            uiSchema={getItemDetailGeneralUiSchema()}
            initialData={initialData}
          />
        </DetailPage.Section>
      </DetailPage.Card>
      <DetailPage.Card>
        <DetailPage.Section expandId={2} heading="Description">
          <Typography intent="body" color="gray60">
            {item.description?.trim() || '—'}
          </Typography>
        </DetailPage.Section>
      </DetailPage.Card>
      <DetailPage.Card>
        <DetailPage.Section expandId={3} heading="Notes">
          <Typography intent="body" color="gray60">
            {item.notes?.trim() || '—'}
          </Typography>
        </DetailPage.Section>
      </DetailPage.Card>
      <DetailPage.Card>
        <DetailPage.Section expandId={4} heading="Commercial">
          <Form
            schema={getItemDetailCommercialSchema()}
            uiSchema={getItemDetailCommercialUiSchema()}
            initialData={initialData}
          />
        </DetailPage.Section>
      </DetailPage.Card>
      <DetailPage.Card>
        <DetailPage.Section expandId={5} heading="Coordination">
          <Typography intent="body" color="gray60">
            Use this stretch of the page to validate in-body navigation, sticky
            headers, and scroll position when jumping between sections. The
            sections above mirror common construction workflows: core fields,
            narrative description, internal notes, commercial context, and
            cross-team coordination.
          </Typography>
        </DetailPage.Section>
      </DetailPage.Card>
      <DetailPage.Card>
        <DetailPage.Section expandId={6} heading="Attachments & references">
          <Typography intent="body" color="gray60">
            Prototype-only block for longer content. Link out to drawings,
            specs, RFIs, and submittals from your real tool; here we keep static
            copy so the layout stays predictable in Storybook and Mirage.
          </Typography>
          <Typography intent="body" color="gray60" style={{ marginTop: 12 }}>
            Secondary paragraph to add vertical rhythm and make the scroll
            affordance obvious when testing the detail-page navigation rail.
          </Typography>
        </DetailPage.Section>
      </DetailPage.Card>
    </>
  );
}
