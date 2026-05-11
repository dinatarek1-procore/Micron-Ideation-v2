import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button, Modal, Typography, colors } from '@procore/core-react';
import { ToastAlertProvider, useToastAlertContext } from '@procore/toast-alert';

/**
 * IX Destructive Action Tiers demo — Tier 1 (undo toast) + Tier 2 (Modal).
 * Tier 3 (typed confirmation + cascade list) is a core-react-proposal.
 *
 * Full rules: `.cursor/rules/ix-destructive.mdc`.
 */

const meta = {
  title: 'IX Patterns/Destructive Actions',
} satisfies Meta;

export default meta;

type Story = StoryObj;

function Tier1Demo() {
  const { showToast } = useToastAlertContext();
  return (
    <Button
      variant="secondary"
      onClick={() => {
        showToast.success('Draft archived. Undo.', { duration: 6000 });
      }}
    >
      Archive draft (Tier 1)
    </Button>
  );
}

function Tier2Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Delete item (Tier 2)
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header onClose={() => setOpen(false)}>
          Delete RFI-102
        </Modal.Header>
        <Modal.Body>
          <Typography intent="body">
            This will permanently delete RFI-102. This cannot be undone.
          </Typography>
        </Modal.Body>
        <Modal.Footer>
          <Modal.FooterButtons>
            <Button variant="tertiary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Delete RFI
            </Button>
          </Modal.FooterButtons>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function Tier3Demo() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const MATCH = 'Company-1';
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Delete all RFIs (Tier 3 — interim)
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header onClose={() => setOpen(false)}>
          Delete all RFIs for Company-1
        </Modal.Header>
        <Modal.Body>
          <Typography
            intent="body"
            style={{ display: 'block', marginBottom: 12 }}
          >
            This will permanently delete 47 RFIs and 18 related submittals.
          </Typography>
          <Typography
            intent="small"
            color="gray45"
            style={{ display: 'block', marginBottom: 8 }}
          >
            Type <strong>{MATCH}</strong> to confirm.
          </Typography>
          <input
            aria-label="Type confirmation"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            style={{
              width: '100%',
              padding: 8,
              border: `1px solid ${colors.gray85}`,
              borderRadius: 3,
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Modal.FooterButtons>
            <Button variant="tertiary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={typed !== MATCH}
              onClick={() => setOpen(false)}
            >
              Delete all
            </Button>
          </Modal.FooterButtons>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export const AllTiers: Story = {
  render: () => (
    <ToastAlertProvider>
      <div style={{ padding: 24, display: 'flex', gap: 16 }}>
        <Tier1Demo />
        <Tier2Demo />
        <Tier3Demo />
      </div>
    </ToastAlertProvider>
  ),
};
