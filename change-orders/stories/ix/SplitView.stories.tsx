import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { colors, Typography } from '@procore/core-react';

import { SplitViewShell } from '@/components/templates/split-view';

/**
 * IX Pattern 1 — Split-View pattern demo.
 *
 * In production, the `list` slot is a `@procore/json-tabulator` or
 * `@procore/smart-grid` table. This demo renders a simplified list so the
 * shell's composition is visible without needing a full Tabulator context.
 *
 * Full rules: `.cursor/rules/ix-split-view.mdc`.
 */

const meta: Meta<typeof SplitViewShell> = {
  title: 'IX Patterns/Split-View',
  component: SplitViewShell,
};

export default meta;

type Story = StoryObj<typeof SplitViewShell>;

type Row = {
  id: string;
  reference: string;
  title: string;
  status: 'Open' | 'Closed';
  assignee: string;
};

const ROWS: Row[] = [
  {
    id: '1',
    reference: 'RFI-101',
    title: 'Slab penetration clarification',
    status: 'Open',
    assignee: 'Alex Rivera',
  },
  {
    id: '2',
    reference: 'RFI-102',
    title: 'Door hardware spec',
    status: 'Open',
    assignee: 'Jane Doe',
  },
  {
    id: '3',
    reference: 'RFI-103',
    title: 'Lighting zone conflict',
    status: 'Closed',
    assignee: 'Sam Hughes',
  },
];

const StubList: React.FC<{
  onRowActivate: (row: Row) => void;
  selected: Row | null;
}> = ({ onRowActivate, selected }) => (
  <div style={{ padding: 16 }}>
    <Typography
      intent="small"
      color="gray45"
      style={{ display: 'block', marginBottom: 8 }}
    >
      In production this is a `@procore/json-tabulator` or `@procore/smart-grid`
      table.
    </Typography>
    <div style={{ border: `1px solid ${colors.gray85}`, borderRadius: 4 }}>
      {ROWS.map((row) => {
        const isActive = selected?.id === row.id;
        return (
          <div
            key={row.id}
            role="button"
            tabIndex={0}
            onClick={() => onRowActivate(row)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onRowActivate(row);
            }}
            style={{
              padding: 12,
              borderBottom: `1px solid ${colors.gray94}`,
              background: isActive ? colors.gray94 : 'transparent',
              cursor: 'pointer',
              display: 'grid',
              gridTemplateColumns: '120px 1fr 100px',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <Typography intent="small" style={{ fontWeight: 600 }}>
              {row.reference}
            </Typography>
            <Typography intent="small">{row.title}</Typography>
            <Typography intent="small" color="gray45">
              {row.status}
            </Typography>
          </div>
        );
      })}
    </div>
  </div>
);

const StubDetail: React.FC<{ selected: Row; close: () => void }> = ({
  selected,
  close,
}) => (
  <div style={{ padding: 16 }}>
    <Typography intent="h3">{selected.reference}</Typography>
    <Typography intent="body" style={{ display: 'block', margin: '8px 0' }}>
      {selected.title}
    </Typography>
    <Typography intent="small" color="gray45" style={{ display: 'block' }}>
      Status: {selected.status}
    </Typography>
    <Typography intent="small" color="gray45" style={{ display: 'block' }}>
      Assignee: {selected.assignee}
    </Typography>
    <button
      type="button"
      onClick={close}
      style={{ marginTop: 16, padding: '6px 12px' }}
    >
      Close panel
    </button>
  </div>
);

export const TabulatorPlacement: Story = {
  render: () => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SplitViewShell<Row>
        list={({ onRowActivate, selected }) => (
          <StubList onRowActivate={onRowActivate} selected={selected} />
        )}
        detail={({ selected, close }) => (
          <StubDetail selected={selected} close={close} />
        )}
      />
    </div>
  ),
};
