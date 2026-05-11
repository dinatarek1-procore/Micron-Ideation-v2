import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button, Panel, Pill, Typography, colors } from '@procore/core-react';

/**
 * IX Form Zone Architecture demo — Zones 1 (Identity), 2 (Primary Content),
 * and 4 (Action Bar) rendered via `@procore/core-react` Panel primitives.
 *
 * Zone 3 (Context Panel, 320px right rail) is a `core-react-proposal` — see
 * `skills/ds-cheat-sheet/TOOLINATOR-EXTENSIONS.md`. For now Zone 3 is
 * approximated by a sidebar stubbed below the form for illustration only.
 *
 * Full rules: `.cursor/rules/ix-form-zones.mdc`.
 */

const meta = {
  title: 'IX Patterns/Form Zones',
} satisfies Meta;

export default meta;

type Story = StoryObj;

const ZoneLabel: React.FC<{ n: number; label: string }> = ({ n, label }) => (
  <Typography
    intent="small"
    color="gray60"
    style={{
      display: 'inline-block',
      padding: '2px 8px',
      border: `1px dashed ${colors.gray85}`,
      borderRadius: 4,
      marginBottom: 8,
      fontSize: 11,
    }}
  >
    Zone {n} — {label}
  </Typography>
);

const StubFieldLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Typography intent="small" color="gray45" style={{ display: 'block' }}>
    {children}
  </Typography>
);

const StubInput: React.FC<{ value: string }> = ({ value }) => (
  <div
    style={{
      border: `1px solid ${colors.gray85}`,
      borderRadius: 3,
      padding: '6px 8px',
      marginBottom: 12,
    }}
  >
    {value}
  </div>
);

export const Tier2FormInPanel: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px',
        gap: 16,
        padding: 16,
        background: colors.gray96,
        minHeight: '100vh',
      }}
    >
      <Panel>
        <Panel.Header>
          <ZoneLabel n={1} label="Identity Strip" />
          <Panel.Title>RFI-102 — Slab penetration clarification</Panel.Title>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Pill color="blue">Open</Pill>
            <Typography intent="small" color="gray60">
              Due Apr 28
            </Typography>
          </div>
        </Panel.Header>

        <Panel.Body>
          <ZoneLabel n={2} label="Primary Content (single column)" />

          <StubFieldLabel>Title</StubFieldLabel>
          <StubInput value="Slab penetration clarification" />

          <StubFieldLabel>Description</StubFieldLabel>
          <StubInput value="Requesting clarification on penetration sleeve detail for Grid A-3…" />

          <StubFieldLabel>Assignee</StubFieldLabel>
          <StubInput value="Jane Doe" />

          <StubFieldLabel>Due Date</StubFieldLabel>
          <StubInput value="04/28/2026" />
        </Panel.Body>

        <Panel.Footer>
          <Panel.FooterActions>
            <ZoneLabel n={4} label="Action Bar" />
            <Button variant="tertiary" type="button">
              Cancel
            </Button>
            <Button variant="primary" type="button">
              Save
            </Button>
          </Panel.FooterActions>
        </Panel.Footer>
      </Panel>

      <div
        style={{
          padding: 16,
          background: colors.white,
          border: `1px solid ${colors.gray85}`,
          borderRadius: 4,
          height: 'fit-content',
        }}
      >
        <ZoneLabel n={3} label="Context Panel (proposal)" />
        <Typography intent="small" color="gray45" style={{ display: 'block' }}>
          320px right rail for comments, activity, related items. Currently a
          core-react proposal — see TOOLINATOR-EXTENSIONS.md.
        </Typography>
      </div>
    </div>
  ),
};
