import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import {
  Button,
  OverlayTrigger,
  Popover,
  colors,
  Typography,
} from '@procore/core-react';
import { Filter } from '@procore/core-icons';

import {
  IxQuickPopover,
  IxPopoverTriggerButton,
  ConfigurationPopoverContent,
} from '@/components/templates/ix-popover';
import { FormulatorFilterPopoverContent } from '@/components/templates/ix-popover/FormulatorFilterPopoverContent';
import { ColumnConfigurePopoverContent } from '@/components/templates/ix-popover/ColumnConfigurePopoverContent';
import { FilterToolbarPopoverButton } from '@/components/templates/popovers/PopoverComponentFilter';
import { ConfigureToolbarPopoverButton } from '@/components/templates/popovers/PopoverComponentConfigure';
import {
  getMirageListFilterPopoverSchema,
  getMirageListFilterPopoverUiSchema,
} from '@/views/list/listFilterPopover.schema';
import { emptySmartGridToolbarFilterFormData } from '@/views/list/smartGridFilterMapping';

/**
 * IX Popover demo — `IxQuickPopover` (arrow-less, z-20) vs raw core-react
 * `Popover` which hardcodes `arrow: true`.
 *
 * Full rules: `.cursor/rules/ix-popover.mdc`.
 */

const meta: Meta<typeof IxQuickPopover> = {
  title: 'IX Patterns/Popover',
  component: IxQuickPopover,
};

export default meta;

type Story = StoryObj<typeof IxQuickPopover>;

export const IxQuickPopoverPattern: Story = {
  render: () => (
    <div
      style={{ display: 'flex', gap: 24, padding: 24, alignItems: 'center' }}
    >
      <div>
        <Typography
          intent="small"
          color="gray45"
          style={{ display: 'block', marginBottom: 8 }}
        >
          IxQuickPopover (correct — no arrow)
        </Typography>
        <IxQuickPopover
          placement="bottom-left"
          aria-label="Filter"
          content={
            <ConfigurationPopoverContent
              config={{
                title: 'Filter',
                subtitle: 'Refine which rows are shown.',
                items: [
                  { id: 'filter-a', label: 'Option A' },
                  { id: 'filter-b', label: 'Option B' },
                  { id: 'filter-c', label: 'Option C' },
                ],
              }}
            />
          }
        >
          <IxPopoverTriggerButton variant="secondary" icon={<Filter />}>
            Filter
          </IxPopoverTriggerButton>
        </IxQuickPopover>
      </div>

      <div>
        <Typography
          intent="small"
          color="gray45"
          style={{ display: 'block', marginBottom: 8 }}
        >
          Raw `Popover` (non-compliant — arrow is hardcoded on)
        </Typography>
        <Popover
          overlay={
            <Popover.Content
              placement="bottom"
              style={{
                padding: 12,
                minWidth: 240,
                background: colors.white,
                border: `1px solid ${colors.gray85}`,
              }}
            >
              <Typography intent="small">Raw Popover body.</Typography>
            </Popover.Content>
          }
        >
          <Button variant="secondary">Raw Popover</Button>
        </Popover>
      </div>
    </div>
  ),
};

export const RichFilterPopover: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Typography intent="small" color="gray45" style={{ marginBottom: 12 }}>
        Rich filter toolbar pattern: json-formulator inside{' '}
        <code>FilterToolbarPopoverButton</code> (360px wide).
      </Typography>
      <FilterToolbarPopoverButton
        width={360}
        activeCount={1}
        content={
          <FormulatorFilterPopoverContent
            resetKey={0}
            initialData={{
              ...emptySmartGridToolbarFilterFormData(),
              status: 'Open',
            }}
            schema={getMirageListFilterPopoverSchema()}
            uiSchema={getMirageListFilterPopoverUiSchema()}
            onApply={() => undefined}
          />
        }
      />
    </div>
  ),
};

export const ColumnConfigurePopover: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Typography intent="small" color="gray45" style={{ marginBottom: 12 }}>
        Column configure pattern: visibility, reorder handles, row density.
      </Typography>
      <ConfigureToolbarPopoverButton
        width={320}
        content={
          <ColumnConfigurePopoverContent
            columns={[
              { colId: 'a', headerName: 'Reference', hide: false },
              { colId: 'b', headerName: 'Title', hide: false },
              { colId: 'c', headerName: 'Due', hide: true },
            ]}
            initialRowHeight={40}
            onApply={() => undefined}
          />
        }
      />
    </div>
  ),
};

export const OverlayTriggerBare: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Typography intent="body" style={{ display: 'block', marginBottom: 12 }}>
        Authors reaching for a raw `OverlayTrigger` should use{' '}
        <code>IxQuickPopover</code> instead — it composes the same{' '}
        <code>OverlayTrigger</code> + <code>Popover.Content</code> with{' '}
        <code>arrow=&#123;false&#125;</code>.
      </Typography>
      <OverlayTrigger
        placement="bottom-left"
        overlay={
          <Popover.Content
            placement="bottom-left"
            style={{
              padding: 12,
              minWidth: 240,
              background: colors.white,
              border: `1px solid ${colors.gray85}`,
            }}
          >
            <Typography intent="small">Not IX-compliant.</Typography>
          </Popover.Content>
        }
      >
        <Button variant="secondary">Bare OverlayTrigger</Button>
      </OverlayTrigger>
    </div>
  ),
};
