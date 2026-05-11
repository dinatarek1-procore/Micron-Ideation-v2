import React, { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button, Typography, colors } from '@procore/core-react';

import {
  TearsheetShell,
  TearsheetAutosaveIndicator,
} from '@/components/templates/tearsheet';
import { useDebouncedAutosave } from '@/shared/useDebouncedAutosave';

/**
 * IX Pattern 3 — Slide-Out (Tearsheet) demos.
 *
 * Demonstrates:
 *   - Default (37vw) data-entry with **autosave** (no Save/Cancel) — the
 *     IX-compliant pattern, wired via `useDebouncedAutosave` +
 *     `TearsheetAutosaveIndicator`.
 *   - Wide (63vw) content-dense variant.
 *   - Contextual view with Apply/Cancel (still the correct pattern for
 *     Contextual View / System Config slide-outs).
 *
 * Full rules: `.cursor/rules/ix-tearsheet.mdc`.
 */

const meta: Meta<typeof TearsheetShell> = {
  title: 'IX Patterns/Tearsheet',
  component: TearsheetShell,
};

export default meta;

type Story = StoryObj<typeof TearsheetShell>;

const DemoBody = () => (
  <div style={{ padding: 16 }}>
    <Typography intent="body" style={{ display: 'block', marginBottom: 12 }}>
      In production this body hosts a <code>@procore/json-formulator</code>{' '}
      <code>Form</code> with a <code>localStorageKey</code> for client-side
      refresh recovery.
    </Typography>
    <div
      style={{
        border: `1px solid ${colors.gray85}`,
        borderRadius: 4,
        padding: 12,
        background: colors.gray98,
      }}
    >
      <Typography intent="small" color="gray45">
        Form placeholder — Title, Description, Status, Due Date…
      </Typography>
    </div>
  </div>
);

export const DefaultWidth37_Autosave: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const savesRef = useRef(0);

    const autosave = useDebouncedAutosave<{ title: string; notes: string }>({
      onSave: async () => {
        savesRef.current += 1;
        await new Promise((resolve) => setTimeout(resolve, 300));
      },
    });

    const emit = (nextTitle: string, nextNotes: string) => {
      autosave.onChange({ title: nextTitle, notes: nextNotes });
    };

    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Quick Create (autosave)
        </Button>
        <TearsheetShell
          open={open}
          onClose={async () => {
            await autosave.flush();
            setOpen(false);
          }}
          title="Create item"
          titleId="tearsheet-demo-default"
          footer={
            <TearsheetAutosaveIndicator
              status={autosave.status}
              lastSavedAt={autosave.lastSavedAt}
              error={autosave.error}
            />
          }
        >
          <div
            style={{
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <Typography intent="body">
              Type below — changes persist via <code>useDebouncedAutosave</code>
              . Debounce is 800ms; the simulated save takes ~300ms.
            </Typography>
            <label>
              <Typography
                intent="small"
                color="gray45"
                style={{ display: 'block' }}
              >
                Title
              </Typography>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  emit(e.target.value, notes);
                }}
                style={{
                  width: '100%',
                  padding: 8,
                  border: `1px solid ${colors.gray85}`,
                  borderRadius: 3,
                  marginTop: 4,
                }}
              />
            </label>
            <label>
              <Typography
                intent="small"
                color="gray45"
                style={{ display: 'block' }}
              >
                Notes
              </Typography>
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  emit(title, e.target.value);
                }}
                rows={4}
                style={{
                  width: '100%',
                  padding: 8,
                  border: `1px solid ${colors.gray85}`,
                  borderRadius: 3,
                  marginTop: 4,
                  resize: 'vertical',
                }}
              />
            </label>
            <Typography intent="small" color="gray60">
              Debounced saves fired: {savesRef.current}
            </Typography>
          </div>
        </TearsheetShell>
      </>
    );
  },
};

export const WideWidth63: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Wide Create
        </Button>
        <TearsheetShell
          open={open}
          onClose={() => setOpen(false)}
          title="Create RFI (wide)"
          titleId="tearsheet-demo-wide"
          width="wide"
          footer={
            <>
              <Button variant="tertiary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Submit for Review
              </Button>
            </>
          }
        >
          <DemoBody />
        </TearsheetShell>
      </>
    );
  },
};

export const ContextualViewApplyCancel: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open Filter Panel
        </Button>
        <TearsheetShell
          open={open}
          onClose={() => setOpen(false)}
          title="Filters"
          titleId="tearsheet-demo-filters"
          footer={
            <>
              <Button variant="tertiary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Apply
              </Button>
            </>
          }
        >
          <DemoBody />
        </TearsheetShell>
      </>
    );
  },
};
