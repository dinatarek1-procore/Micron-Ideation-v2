import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Typography, colors } from '@procore/core-react';

import { ComplianceLab } from './ComplianceLab';

/**
 * Compliance lab — IX Pattern 1 Split-View.
 *
 * Shows the contract in three states: the IX target (Tabulator/Smart Grid on
 * the left, detail on the right, chosen declaratively), what the stack produces
 * today (scaffold `SplitViewShell` that a prototype author composes by hand),
 * and what the proposed Toolinator `splitViewPage` layout would make possible.
 */

const meta: Meta<typeof ComplianceLab> = {
  title: 'IX Compliance Lab/Split-View',
  component: ComplianceLab,
};

export default meta;

type Story = StoryObj<typeof ComplianceLab>;

const MockTable = () => (
  <div
    style={{
      border: `1px solid ${colors.gray85}`,
      borderRadius: 4,
      padding: 12,
      background: colors.gray98,
    }}
  >
    <Typography intent="small" color="gray45">
      Tabulator / Smart Grid table
    </Typography>
    <div style={{ marginTop: 8, fontSize: 12 }}>
      <div style={{ padding: 4 }}>Row 1 — RFI #101</div>
      <div
        style={{
          padding: 4,
          background: colors.gray94,
          fontWeight: 600,
        }}
      >
        Row 2 — RFI #102 (active)
      </div>
      <div style={{ padding: 4 }}>Row 3 — RFI #103</div>
    </div>
  </div>
);

const MockDetail = () => (
  <div
    style={{
      border: `1px solid ${colors.gray85}`,
      borderRadius: 4,
      padding: 12,
      background: colors.gray98,
    }}
  >
    <Typography intent="small" color="gray45">
      Detail pane (right)
    </Typography>
    <div style={{ marginTop: 8, fontSize: 12 }}>
      <strong>RFI #102</strong>
      <div>Status: Open</div>
      <div>Assignee: Jane Doe</div>
    </div>
  </div>
);

const TwoPane = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '37% 63%', gap: 8 }}>
    <MockTable />
    <MockDetail />
  </div>
);

const FullWidthTable = () => <MockTable />;

export const PatternOneSplitView: Story = {
  render: () => (
    <ComplianceLab
      rule="Pattern 1 Split-View — 37% list / 63% detail; Tabulator or Smart Grid as list; detail opens on row click."
      referenceLabel="REFERENCE.md → Pattern Decision Tree; .cursor/rules/ix-split-view.mdc"
      columns={[
        {
          title: 'IX target',
          status: 'toolinator-proposal',
          description:
            'Prototype authors pick a "splitViewPage" layout in Toolinator config and drop a Tabulator / Smart Grid feature into the left slot. Zero handcrafting.',
          children: <TwoPane />,
        },
        {
          title: 'Stack today',
          status: 'scaffold-wiring',
          description:
            'Scaffold SplitViewShell composes SplitViewCard + render-prop slots. Prototype author wires the Tabulator/Smart Grid and the detail view manually inside a custom feature component.',
          children: <TwoPane />,
        },
        {
          title: 'Toolinator-extended',
          status: 'toolinator-proposal',
          description:
            'Proposed: splitViewPage Toolinator layout with list + detail feature slots. See TOOLINATOR-EXTENSIONS.md.',
          children: <FullWidthTable />,
        },
      ]}
    />
  ),
};
