import React, { useState, useEffect } from 'react';
import { Banner, Box, Button, DetailPage, Pill, Table, Toast, Typography, colors } from '@procore/core-react';
import { Info, Warning } from '@procore/core-icons';
import { ProtoPageHeader } from '../shared/ProtoPageHeader';
import {
  contractLines,
  coHeader,
  initialCOLines,
  formatCurrency,
  type COLine,
  type ContractLine,
} from './coData';

// ─── Styles ──────────────────────────────────────────────────────────────────


const SELECT: React.CSSProperties = {
  width: '100%', border: `1px solid ${colors.gray20}`, borderRadius: 4,
  padding: '6px 8px', fontSize: 13, background: '#fff', cursor: 'pointer',
};

const SELECT_UNSET: React.CSSProperties = {
  ...SELECT, borderColor: colors.orange30, background: colors.yellow98,
};


const TOOLBAR: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
  padding: '10px 12px', background: colors.blue98,
  border: `1px solid ${colors.blue20}`, borderRadius: 4,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lineLabel(line: ContractLine) {
  return `Line ${line.lineNumber} — ${line.description} (${line.budgetCode})`;
}

function BudgetCodeCell({ code, name }: { code: string; name: string }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{code}</div>
      <div style={{ fontSize: 11, color: colors.gray50, marginTop: 1 }}>{name}</div>
    </div>
  );
}

function AssociationDropdown({
  coLine,
  contractLines,
  value,
  onChange,
  nextNewLineNumber,
  onCreateNewLine,
}: {
  coLine: COLine;
  contractLines: ContractLine[];
  value: number | null | 'new';
  onChange: (val: number | null) => void;
  nextNewLineNumber: number;
  onCreateNewLine: (coLineId: number) => ContractLine;
}) {
  const matching = contractLines.filter(l => l.budgetCode === coLine.budgetCode);
  const others = contractLines.filter(l => l.budgetCode !== coLine.budgetCode);
  const isUnset = value === null;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    if (v === '__new__') {
      const newLine = onCreateNewLine(coLine.id);
      onChange(newLine.id);
    } else if (v === '__none__') {
      onChange(null);
    } else {
      onChange(parseInt(v, 10));
    }
  }

  return (
    <select
      style={isUnset ? SELECT_UNSET : SELECT}
      value={value === null ? '__none__' : String(value)}
      onChange={handleChange}
    >
      <option value="__none__" disabled={!isUnset}>
        {isUnset ? '— Select a contract line —' : 'New scope (no association)'}
      </option>
      {matching.length > 0 && (
        <optgroup label={`Matching budget code ${coLine.budgetCode}`}>
          {matching.map(l => (
            <option key={l.id} value={l.id}>{lineLabel(l)}</option>
          ))}
        </optgroup>
      )}
      {others.length > 0 && (
        <optgroup label="Other contract lines">
          {others.map(l => (
            <option key={l.id} value={l.id}>{lineLabel(l)}</option>
          ))}
        </optgroup>
      )}
      <optgroup label="─────────────────">
        <option value="__new__">+ Create new contract line (Line {String(nextNewLineNumber).padStart(3, '0')})</option>
      </optgroup>
    </select>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type ViewMode = 'ga' | 'bulk';

export function BulkLineItemAssociation() {
  const [mode, setMode] = useState<ViewMode>('ga');
  const [lines, setLines] = useState<COLine[]>(initialCOLines);
  const [allContractLines, setAllContractLines] = useState(contractLines);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkTarget, setBulkTarget] = useState<number | ''>('');
  const [showToast, setShowToast] = useState(false);

  const nextNewLineNumber = allContractLines.length + 1;
  const unassigned = lines.filter(l => l.associatedContractLineId === null);
  const assigned = lines.filter(l => l.associatedContractLineId !== null);

  function updateAssociation(coLineId: number, contractLineId: number | null) {
    setLines(prev => prev.map(l => l.id === coLineId ? { ...l, associatedContractLineId: contractLineId } : l));
  }

  function createNewLine(coLineId: number): ContractLine {
    const coLine = lines.find(l => l.id === coLineId)!;
    const newLine: ContractLine = {
      id: allContractLines.length + 100,
      lineNumber: String(allContractLines.length + 1).padStart(3, '0'),
      description: coLine.description,
      budgetCode: coLine.budgetCode,
      originalAmount: 0,
    };
    setAllContractLines(prev => [...prev, newLine]);
    return newLine;
  }

  function toggleSelect(id: number) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(lines.map(l => l.id)));
  }

  function clearSelection() {
    setSelectedIds(new Set());
    setBulkTarget('');
  }

  function applyBulkAssign() {
    if (!bulkTarget) return;
    setLines(prev =>
      prev.map(l => selectedIds.has(l.id) ? { ...l, associatedContractLineId: bulkTarget as number } : l)
    );
    setSelectedIds(new Set());
    setBulkTarget('');
    setShowToast(true);
  }

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(timer);
  }, [showToast]);

  const allAssigned = lines.every(l => l.associatedContractLineId !== null);

  return (
    <>
      <ProtoPageHeader
        title={coHeader.title}
        subtitle={<>{coHeader.number} · {coHeader.contract} · Vendor: {coHeader.vendor} · <Pill color="gray">{coHeader.status}</Pill></>}
        tabs={[
          { label: 'General', path: '' },
          { label: 'SOV - LI Association', active: true, path: '/line-item-association' },
          { label: 'Related Items (0)', path: '/related-items' },
          { label: 'Emails', path: '/emails' },
          { label: 'Financial Markups' },
          { label: 'Change History (4)', path: '/history' },
        ]}
      />

      <DetailPage.Card>
      <Box padding="lg">

        {/* Card title */}
        <Box marginBottom="lg">
          <Typography intent="h2">Line Item Association</Typography>
        </Box>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => { setMode('ga'); clearSelection(); }}
            style={{
              padding: '6px 16px', borderRadius: 4, border: `1px solid ${mode === 'ga' ? colors.blue45 : colors.gray20}`,
              background: mode === 'ga' ? colors.blue45 : '#fff', color: mode === 'ga' ? '#fff' : colors.gray60,
              fontWeight: 600, cursor: 'pointer', fontSize: 13,
            }}
          >
            Current approach (GA)
          </button>
          <button
            onClick={() => { setMode('bulk'); clearSelection(); }}
            style={{
              padding: '6px 16px', borderRadius: 4, border: `1px solid ${mode === 'bulk' ? colors.blue45 : colors.gray20}`,
              background: mode === 'bulk' ? colors.blue45 : '#fff', color: mode === 'bulk' ? '#fff' : colors.gray60,
              fontWeight: 600, cursor: 'pointer', fontSize: 13,
            }}
          >
            Proposed: Bulk assign (post-GA)
          </button>
        </div>

        {/* ── GA mode ── */}
        {mode === 'ga' && (
          <>
            <Box marginBottom="md">
              <Banner variant="info">
                <Banner.Icon icon={<Info />} />
                <Banner.Content>
                  <Banner.Title>Current approach (GA)</Banner.Title>
                  <Banner.Body>
                    Each CO line gets an inline dropdown. Matching budget codes surface first. Add a contract line creates a line in-place and auto-selects it in the dropdown. Users work row by row.
                  </Banner.Body>
                </Banner.Content>
              </Banner>
            </Box>

            {unassigned.length > 0 && (
              <Box marginBottom="md">
                <Banner variant="attention">
                  <Banner.Icon icon={<Warning />} />
                  <Banner.Content>
                    <Banner.Body>
                      <strong>{unassigned.length} line{unassigned.length > 1 ? 's' : ''}</strong> still need a contract line association before this change order can be submitted.
                    </Banner.Body>
                  </Banner.Content>
                </Banner>
              </Box>
            )}

            <Table.Container>
              <Table style={{ width: '100%' }}>
                <Table.Header>
                  <Table.HeaderRow>
                    <Table.HeaderCell snugfit>#</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell snugfit>Budget code</Table.HeaderCell>
                    <Table.HeaderCell snugfit>Tax code</Table.HeaderCell>
                    <Table.HeaderCell snugfit style={{ textAlign: 'right' }}>Qty</Table.HeaderCell>
                    <Table.HeaderCell snugfit>UOM</Table.HeaderCell>
                    <Table.HeaderCell snugfit style={{ textAlign: 'right' }}>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Contract line association</Table.HeaderCell>
                  </Table.HeaderRow>
                </Table.Header>
                <Table.Body>
                  {lines.map((line, i) => {
                    const associated = allContractLines.find(cl => cl.id === line.associatedContractLineId);
                    return (
                      <Table.BodyRow key={line.id} style={{}}>
                        <Table.BodyCell snugfit>
                          <Table.TextCell>{i + 1}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell>
                          <Table.TextCell>{line.description}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell snugfit>
                          <Table.TextCell><BudgetCodeCell code={line.budgetCode} name={line.budgetCodeName} /></Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell snugfit>
                          <Table.TextCell>{line.taxCode}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell snugfit>
                          <Table.TextCell style={{ justifyContent: 'flex-end' }}>{line.qty}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell snugfit>
                          <Table.TextCell>{line.uom}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell snugfit>
                          <Table.TextCell style={{ justifyContent: 'flex-end' }}>{formatCurrency(line.amount)}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell>
                          <Table.TextCell style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                            <AssociationDropdown
                              coLine={line}
                              contractLines={allContractLines}
                              value={line.associatedContractLineId}
                              onChange={val => updateAssociation(line.id, val)}
                              nextNewLineNumber={nextNewLineNumber}
                              onCreateNewLine={createNewLine}
                            />
                            {associated?.isNewContractLine && (
                              <div style={{ fontSize: 11, color: colors.blue45 }}>
                                ✓ New contract line created and selected
                              </div>
                            )}
                          </Table.TextCell>
                        </Table.BodyCell>
                      </Table.BodyRow>
                    );
                  })}
                </Table.Body>
              </Table>
            </Table.Container>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography intent="small" color="gray50">
                {assigned.length} of {lines.length} lines associated
              </Typography>
              <Button variant="primary" disabled={!allAssigned}>Save change order</Button>
            </div>
          </>
        )}

        {/* ── Bulk assign mode ── */}
        {mode === 'bulk' && (
          <>
            <Box marginBottom="md">
              <Banner variant="info">
                <Banner.Icon icon={<Info />} />
                <Banner.Content>
                  <Banner.Title>Proposed: Bulk assign (post-GA)</Banner.Title>
                  <Banner.Body>
                    Select multiple CO lines with checkboxes, then assign them all to the same contract line in one action. Especially useful for large change orders where many lines share the same original line. (CCMT-6499)
                  </Banner.Body>
                </Banner.Content>
              </Banner>
            </Box>


            {/* Bulk action toolbar — appears when lines are selected */}
            {selectedIds.size > 0 && (
              <div style={TOOLBAR}>
                <Typography intent="small" style={{ fontWeight: 600, color: colors.blue45 }}>
                  {selectedIds.size} line{selectedIds.size > 1 ? 's' : ''} selected
                </Typography>
                <span style={{ color: colors.gray20 }}>|</span>
                <Typography intent="small" color="gray50">Assign all to:</Typography>
                <select
                  style={{ ...SELECT, width: 280 }}
                  value={bulkTarget === '' ? '' : String(bulkTarget)}
                  onChange={e => setBulkTarget(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                >
                  <option value="">— Select contract line —</option>
                  {allContractLines.map(l => (
                    <option key={l.id} value={l.id}>{lineLabel(l)}</option>
                  ))}
                  <option value="__new__" disabled>+ Create new contract line</option>
                </select>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!bulkTarget}
                  onClick={applyBulkAssign}
                >
                  Apply
                </Button>
                <Button variant="tertiary" size="sm" onClick={clearSelection}>
                  Cancel
                </Button>
              </div>
            )}

            <Table.Container>
              <Table style={{ width: '100%' }}>
                <Table.Header>
                  <Table.HeaderRow>
                    <Table.HeaderCell snugfit style={{ textAlign: 'center' }}>
                      <Table.Checkbox
                        checked={selectedIds.size === lines.length}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.checked ? selectAll() : clearSelection()}
                        aria-label="Select all"
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell snugfit>#</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell snugfit>Budget code</Table.HeaderCell>
                    <Table.HeaderCell snugfit>Tax code</Table.HeaderCell>
                    <Table.HeaderCell snugfit style={{ textAlign: 'right' }}>Qty</Table.HeaderCell>
                    <Table.HeaderCell snugfit>UOM</Table.HeaderCell>
                    <Table.HeaderCell snugfit style={{ textAlign: 'right' }}>Amount</Table.HeaderCell>
                    <Table.HeaderCell>Contract line association</Table.HeaderCell>
                  </Table.HeaderRow>
                </Table.Header>
                <Table.Body>
                  {lines.map((line, i) => {
                    const isSelected = selectedIds.has(line.id);
                    const associated = allContractLines.find(cl => cl.id === line.associatedContractLineId);
                    return (
                      <Table.BodyRow
                        key={line.id}
                        style={{
                          background: isSelected ? colors.blue98 : undefined,
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleSelect(line.id)}
                      >
                        <Table.BodyCell snugfit onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                          <Table.TextCell style={{ justifyContent: 'center' }}>
                            <Table.Checkbox
                              checked={isSelected}
                              onChange={() => toggleSelect(line.id)}
                            />
                          </Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell snugfit>
                          <Table.TextCell>{i + 1}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell>
                          <Table.TextCell>{line.description}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell snugfit>
                          <Table.TextCell><BudgetCodeCell code={line.budgetCode} name={line.budgetCodeName} /></Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell snugfit>
                          <Table.TextCell>{line.taxCode}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell snugfit>
                          <Table.TextCell style={{ justifyContent: 'flex-end' }}>{line.qty}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell snugfit>
                          <Table.TextCell>{line.uom}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell snugfit>
                          <Table.TextCell style={{ justifyContent: 'flex-end' }}>{formatCurrency(line.amount)}</Table.TextCell>
                        </Table.BodyCell>
                        <Table.BodyCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                          <Table.TextCell style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
                            <AssociationDropdown
                              coLine={line}
                              contractLines={allContractLines}
                              value={line.associatedContractLineId}
                              onChange={val => updateAssociation(line.id, val)}
                              nextNewLineNumber={nextNewLineNumber}
                              onCreateNewLine={createNewLine}
                            />
                            {associated && (
                              <div style={{ fontSize: 11, color: colors.green45 }}>
                                ✓ {associated.description}
                              </div>
                            )}
                          </Table.TextCell>
                        </Table.BodyCell>
                      </Table.BodyRow>
                    );
                  })}
                </Table.Body>
              </Table>
            </Table.Container>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <Typography intent="small" color="gray50">
                  {assigned.length} of {lines.length} lines associated
                </Typography>
                {unassigned.length > 0 && (
                  <Typography intent="small" style={{ color: colors.orange45 }}>
                    ⚠ {unassigned.length} unassigned
                  </Typography>
                )}
              </div>
              <Button variant="primary" disabled={!allAssigned}>Save change order</Button>
            </div>
          </>
        )}
      </Box>
    </DetailPage.Card>

    {showToast && (
      <Toast
        variant="success"
        onDismiss={() => setShowToast(false)}
        style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}
      >
        Bulk assignment applied successfully.
      </Toast>
    )}
    </>
  );
}
