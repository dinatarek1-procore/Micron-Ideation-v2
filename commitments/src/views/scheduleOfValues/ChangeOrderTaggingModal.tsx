import React, { useState } from 'react';
import { Box, Button, Typography, colors } from '@procore/core-react';
import { sovLines, formatCurrency, type SovLine } from './sovData';

interface Props {
  onClose: () => void;
}

type AssociationType = 'associate' | 'new';

const OVERLAY: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const MODAL: React.CSSProperties = {
  background: '#fff',
  borderRadius: 6,
  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  width: 600,
  maxWidth: '95vw',
  maxHeight: '90vh',
  overflow: 'auto',
};

const HEADER: React.CSSProperties = {
  padding: '20px 24px 16px',
  borderBottom: `1px solid ${colors.gray15}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const BODY: React.CSSProperties = {
  padding: '20px 24px',
};

const FOOTER: React.CSSProperties = {
  padding: '16px 24px',
  borderTop: `1px solid ${colors.gray15}`,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
};

const FIELD_GROUP: React.CSSProperties = {
  marginBottom: 20,
};

const LABEL: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  color: colors.gray60,
};

const INPUT: React.CSSProperties = {
  width: '100%',
  border: `1px solid ${colors.gray20}`,
  borderRadius: 4,
  padding: '8px 10px',
  fontSize: 14,
  boxSizing: 'border-box',
};

const SELECT: React.CSSProperties = { ...INPUT, background: '#fff', cursor: 'pointer' };

const RADIO_ROW: React.CSSProperties = {
  display: 'flex',
  gap: 24,
  marginBottom: 16,
};

const RADIO_OPTION: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
};

const WARNING_BOX: React.CSSProperties = {
  background: colors.yellow98,
  border: `1px solid ${colors.yellow30}`,
  borderRadius: 4,
  padding: '10px 14px',
  marginTop: 12,
  fontSize: 13,
};

const INFO_BOX: React.CSSProperties = {
  background: colors.blue98,
  border: `1px solid ${colors.blue20}`,
  borderRadius: 4,
  padding: '10px 14px',
  marginTop: 12,
  fontSize: 13,
  color: colors.blue45,
};

// Lines with the same budget code (09-900) — the key UX challenge
const duplicateBudgetCodeLines = sovLines.filter(
  (l) => l.budgetCode === '09-900'
);

export function ChangeOrderTaggingModal({ onClose }: Props) {
  const [description, setDescription] = useState('');
  const [budgetCode, setBudgetCode] = useState('09-900');
  const [amount, setAmount] = useState('');
  const [uom, setUom] = useState('');
  const [associationType, setAssociationType] = useState<AssociationType>('associate');
  const [selectedLineId, setSelectedLineId] = useState<number | ''>('');

  // Lines matching the entered budget code
  const matchingLines = sovLines.filter((l) => l.budgetCode === budgetCode);
  const selectedLine = sovLines.find((l) => l.id === selectedLineId);
  const hasDuplicateBudgetCodes = matchingLines.length > 1;

  function handleLineSelect(id: number) {
    setSelectedLineId(id);
    // Pre-fill UOM from the original line
    setUom('LF');
  }

  function handleBudgetCodeChange(code: string) {
    setBudgetCode(code);
    setSelectedLineId('');
    setUom('');
  }

  return (
    <div style={OVERLAY} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={MODAL}>
        <div style={HEADER}>
          <Typography intent="h2">Add change order line</Typography>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: colors.gray40 }}
          >
            ×
          </button>
        </div>

        <div style={BODY}>
          {/* Description */}
          <div style={FIELD_GROUP}>
            <label style={LABEL}>Description</label>
            <input
              style={INPUT}
              placeholder="Enter a description for this line item"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Budget code */}
          <div style={FIELD_GROUP}>
            <label style={LABEL}>Budget code</label>
            <select
              style={SELECT}
              value={budgetCode}
              onChange={(e) => handleBudgetCodeChange(e.target.value)}
            >
              <option value="03-100">03-100 — Concrete Work</option>
              <option value="09-900">09-900 — Finishes</option>
              <option value="15-500">15-500 — Fire Protection</option>
              <option value="16-000">16-000 — Electrical</option>
            </select>
          </div>

          {/* Association type */}
          <div style={FIELD_GROUP}>
            <label style={LABEL}>Line item type</label>
            <div style={RADIO_ROW}>
              <label style={RADIO_OPTION}>
                <input
                  type="radio"
                  name="assocType"
                  value="associate"
                  checked={associationType === 'associate'}
                  onChange={() => setAssociationType('associate')}
                />
                <span>
                  <strong>Associate to existing line</strong>
                  <div style={{ fontSize: 12, color: colors.gray50 }}>
                    This change amends an original contract line
                  </div>
                </span>
              </label>
              <label style={RADIO_OPTION}>
                <input
                  type="radio"
                  name="assocType"
                  value="new"
                  checked={associationType === 'new'}
                  onChange={() => {
                    setAssociationType('new');
                    setSelectedLineId('');
                    setUom('');
                  }}
                />
                <span>
                  <strong>New scope</strong>
                  <div style={{ fontSize: 12, color: colors.gray50 }}>
                    This is entirely new work not in the original contract
                  </div>
                </span>
              </label>
            </div>
          </div>

          {/* Associate to line selector */}
          {associationType === 'associate' && (
            <div style={FIELD_GROUP}>
              <label style={LABEL}>Original contract line</label>

              {/* The key scenario: 2 lines share 09-900 — user must pick using description */}
              {hasDuplicateBudgetCodes && (
                <div style={WARNING_BOX}>
                  <strong>⚠ Two lines share budget code {budgetCode}.</strong>{' '}
                  Select the correct line using the description to identify it.
                </div>
              )}

              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {matchingLines.length === 0 && (
                  <Typography intent="body" color="gray40">
                    No original lines match this budget code. Consider selecting New scope instead.
                  </Typography>
                )}
                {matchingLines.map((line) => (
                  <label
                    key={line.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      border: `1px solid ${selectedLineId === line.id ? colors.blue45 : colors.gray15}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      background: selectedLineId === line.id ? colors.blue98 : '#fff',
                    }}
                  >
                    <input
                      type="radio"
                      name="lineSelect"
                      checked={selectedLineId === line.id}
                      onChange={() => handleLineSelect(line.id)}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        Line {line.lineNumber} — {line.description}
                      </div>
                      <div style={{ fontSize: 12, color: colors.gray50, marginTop: 2 }}>
                        Budget code: {line.budgetCode} · Original amount:{' '}
                        {formatCurrency(line.originalAmount)}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Pre-fill confirmation */}
              {selectedLine && (
                <div style={INFO_BOX}>
                  Unit of measure pre-filled from Line {selectedLine.lineNumber} (
                  {selectedLine.description}). Review before saving.
                </div>
              )}
            </div>
          )}

          {/* Amount + UOM */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ ...FIELD_GROUP, flex: 2 }}>
              <label style={LABEL}>Amount</label>
              <input
                style={INPUT}
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div style={{ ...FIELD_GROUP, flex: 1 }}>
              <label style={LABEL}>
                Unit of measure{' '}
                {uom && (
                  <span style={{ fontWeight: 400, color: colors.blue45, fontSize: 12 }}>
                    (pre-filled)
                  </span>
                )}
              </label>
              <input
                style={{
                  ...INPUT,
                  background: uom ? colors.blue98 : '#fff',
                  borderColor: uom ? colors.blue20 : colors.gray20,
                }}
                placeholder="e.g. LF, SF, EA"
                value={uom}
                onChange={(e) => setUom(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={FOOTER}>
          <Button variant="tertiary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={
              !description ||
              !amount ||
              (associationType === 'associate' && !selectedLineId)
            }
          >
            Add line
          </Button>
        </div>
      </div>
    </div>
  );
}
