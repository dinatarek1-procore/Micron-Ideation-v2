import React from 'react';
import { Box, Button, DetailPage, Dropdown, Flex } from '@procore/core-react';
import { EllipsisVertical } from '@procore/core-icons';
import { Form } from '@procore/json-formulator';

import { SectionNameConnectedFileSelect } from './SectionNameConnectedFileSelect';
import {
  GENERIC_DEMO_RECORD,
  getGenericToolItemDetailGeneralSchema,
  getGenericToolItemDetailGeneralUiSchema,
  pickGenericToolItemDetailFormData,
} from './genericToolItemDetail.schema';

export function GenericToolItemDetail() {
  const initialData = pickGenericToolItemDetailFormData(GENERIC_DEMO_RECORD);

  return (
    <Box data-testid="pbs-generic-tool-item-detail">
      <DetailPage.Card>
        <DetailPage.Section expandId={1} heading="General Information">
          <Form
            schema={getGenericToolItemDetailGeneralSchema()}
            uiSchema={getGenericToolItemDetailGeneralUiSchema()}
            initialData={initialData}
          />
        </DetailPage.Section>
      </DetailPage.Card>
      <DetailPage.Card>
        <DetailPage.Section
          expandId={2}
          heading="Section Name"
          actions={
            <Flex gap="xs" alignItems="center">
              <Button size="sm" variant="secondary">
                Verb
              </Button>
              <Dropdown
                size="sm"
                variant="tertiary"
                icon={<EllipsisVertical />}
                aria-label="More section actions"
                placement="bottom-right"
              >
                <Dropdown.Item>Download all</Dropdown.Item>
                <Dropdown.Item>Add from Documents</Dropdown.Item>
                <Dropdown.Item>Delete all items</Dropdown.Item>
              </Dropdown>
            </Flex>
          }
        >
          <SectionNameConnectedFileSelect />
        </DetailPage.Section>
      </DetailPage.Card>
    </Box>
  );
}
