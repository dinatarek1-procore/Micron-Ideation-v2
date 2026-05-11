import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button, Dropdown, colors } from '@procore/core-react';
import { EllipsisVertical } from '@procore/core-icons';

import { ComplianceLab } from './ComplianceLab';

/**
 * Compliance lab — title-bar action overflow threshold.
 *
 * Today Toolinator's titleActionsTemplate hardcodes overflow at 3 actions.
 * Design feedback (Jeremy, 2026-04) asks for the threshold to be configurable.
 * This lab shows the same 5 actions rendered three ways.
 */

const meta: Meta<typeof ComplianceLab> = {
  title: 'IX Compliance Lab/Title Overflow',
  component: ComplianceLab,
};

export default meta;

type Story = StoryObj<typeof ComplianceLab>;

const ACTIONS = ['Create', 'Export', 'Import', 'Archive', 'Configure'];

const BarFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      border: `1px solid ${colors.gray85}`,
      borderRadius: 4,
      padding: 12,
      background: colors.white,
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      flexWrap: 'wrap',
    }}
  >
    {children}
  </div>
);

const renderInlineActions = (visibleCount: number) => {
  const inline = ACTIONS.slice(0, visibleCount);
  const overflow = ACTIONS.slice(visibleCount);
  return (
    <>
      {inline.map((label, i) => (
        <Button
          key={label}
          variant={i === 0 ? 'primary' : 'secondary'}
          type="button"
        >
          {label}
        </Button>
      ))}
      {overflow.length > 0 ? (
        <Dropdown
          variant="tertiary"
          icon={<EllipsisVertical />}
          aria-label="More actions"
        >
          {overflow.map((label) => (
            <Dropdown.Item key={label}>{label}</Dropdown.Item>
          ))}
        </Dropdown>
      ) : null}
    </>
  );
};

export const TitleActionOverflow: Story = {
  render: () => (
    <ComplianceLab
      rule="Title-bar action overflow — max inline actions before the rest collapse into an overflow menu (configurable per layout)."
      referenceLabel="Design feedback (Jeremy, 2026-04); TOOLINATOR-EXTENSIONS.md → Configurable title-bar overflow threshold"
      columns={[
        {
          title: 'IX target',
          status: 'toolinator-proposal',
          description:
            'Layout config sets titleActionsVisibleMax = 2. Two buttons inline, rest in overflow menu.',
          children: <BarFrame>{renderInlineActions(2)}</BarFrame>,
        },
        {
          title: 'Stack today',
          status: 'supported',
          description:
            'Toolinator hardcodes overflow at 3. Works correctly but not configurable.',
          children: <BarFrame>{renderInlineActions(3)}</BarFrame>,
        },
        {
          title: 'Toolinator-extended',
          status: 'toolinator-proposal',
          description:
            'Proposed: titleActionsVisibleMax?: number on GenericLayoutOptions. See TOOLINATOR-EXTENSIONS.md.',
          children: <BarFrame>{renderInlineActions(2)}</BarFrame>,
        },
      ]}
    />
  ),
};
