import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button, Typography, colors } from '@procore/core-react';

import { ComplianceLab } from './ComplianceLab';

/**
 * Compliance lab — Pattern 3 Slide-Out data-entry autosave.
 *
 * As of 2026-04 the scaffold matches the IX target for hand-wired Create
 * views via `useDebouncedAutosave` + `TearsheetAutosaveIndicator`. Toolinator
 * `feature: 'form'` Creates are still explicit-submit — closing that gap
 * requires the `FormFeature` extension tracked in TOOLINATOR-EXTENSIONS.md.
 */

const meta: Meta<typeof ComplianceLab> = {
  title: 'IX Compliance Lab/Tearsheet Autosave',
  component: ComplianceLab,
};

export default meta;

type Story = StoryObj<typeof ComplianceLab>;

const SlideOutFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      border: `1px solid ${colors.gray85}`,
      borderRadius: 4,
      background: colors.white,
      minHeight: 320,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {children}
  </div>
);

const SlideOutHeader = ({ title }: { title: string }) => (
  <div
    style={{
      padding: 12,
      borderBottom: `1px solid ${colors.gray85}`,
      fontWeight: 600,
    }}
  >
    {title}
  </div>
);

const SlideOutBody = () => (
  <div style={{ padding: 12, flex: 1, fontSize: 12, color: colors.gray45 }}>
    <div style={{ marginBottom: 8 }}>Title *</div>
    <div
      style={{
        border: `1px solid ${colors.gray85}`,
        borderRadius: 3,
        padding: 6,
        marginBottom: 12,
      }}
    >
      Weekly status report
    </div>
    <div style={{ marginBottom: 8 }}>Description</div>
    <div
      style={{
        border: `1px solid ${colors.gray85}`,
        borderRadius: 3,
        padding: 6,
        minHeight: 60,
      }}
    >
      Draft…
    </div>
  </div>
);

const SlideOutFooter = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: 12,
      borderTop: `1px solid ${colors.gray85}`,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

const SavedIndicator = () => (
  <Typography intent="small" color="gray45">
    Saved 2s ago
  </Typography>
);

export const DataEntrySlideOut: Story = {
  render: () => (
    <ComplianceLab
      rule='Pattern 3 Data-Entry Slide-Out — "NO Save/Cancel — autosave only" per REFERENCE.md.'
      referenceLabel="REFERENCE.md → Slide-Out Types and Footer Rules; .cursor/rules/ix-tearsheet.mdc"
      columns={[
        {
          title: 'IX target',
          status: 'supported',
          description:
            'Server-side autosave on every change. No Save/Cancel. A "Saved Ns ago" indicator replaces the commit button.',
          children: (
            <SlideOutFrame>
              <SlideOutHeader title="Create item" />
              <SlideOutBody />
              <SlideOutFooter>
                <SavedIndicator />
              </SlideOutFooter>
            </SlideOutFrame>
          ),
        },
        {
          title: 'Stack today (custom view)',
          status: 'scaffold-wiring',
          description:
            'CreateFormTearsheetView uses useDebouncedAutosave + TearsheetAutosaveIndicator. Matches the IX target today — no Save/Cancel.',
          children: (
            <SlideOutFrame>
              <SlideOutHeader title="Create item" />
              <SlideOutBody />
              <SlideOutFooter>
                <SavedIndicator />
              </SlideOutFooter>
            </SlideOutFrame>
          ),
        },
        {
          title: 'Stack today (Toolinator feature: form)',
          status: 'toolinator-proposal',
          description:
            'feature: form views still fire onSubmit only. Closing this gap is a FormFeature extension (onChangeDebounced) — see TOOLINATOR-EXTENSIONS.md.',
          children: (
            <SlideOutFrame>
              <SlideOutHeader title="Create item" />
              <SlideOutBody />
              <SlideOutFooter>
                <Button variant="tertiary" type="button">
                  Cancel
                </Button>
                <Button variant="primary" type="button">
                  Create
                </Button>
              </SlideOutFooter>
            </SlideOutFrame>
          ),
        },
      ]}
    />
  ),
};
