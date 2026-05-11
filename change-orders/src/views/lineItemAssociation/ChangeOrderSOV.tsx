import React, { useState } from 'react';
import { Banner, Box, Button, DetailPage, Pill, Table, Typography, colors } from '@procore/core-react';
import { Warning } from '@procore/core-icons';
import { useParams } from '@tanstack/react-router';
import { GUARDRAILS } from '@/shared/guardrails';
import { ProtoPageHeader } from '../shared/ProtoPageHeader';
import {
  contractLines,
  coHeader,
  initialCOLines,
  formatCurrency,
  type COLine,
  type ContractLine,
} from './coData';


const SELECT: React.CSSProperties = {
  width: '100%', border: `1px solid ${colors.gray20}`, borderRadius: 4,
  padding: '6px 8px', fontSize: 13, background: '#fff', cursor: 'pointer',
};

const SELECT_UNSET: React.CSSProperties = {
  ...SELECT, borderColor: colors.orange30, background: colors.yellow98,
};

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

interface GroupedLines {
  contractLine: ContractLine | null; // null = new scope
  coLines: COLine[];
}

function groupByContractLine(coLines: COLine[], contractLines: ContractLine[]): GroupedLines[] {
  const groups: Map<number | null, GroupedLines> = new Map();

  for (const coLine of coLines) {
    const key = coLine.associatedContractLineId;
    if (!groups.has(key)) {
      groups.set(key, {
        contractLine: contractLines.find(cl => cl.id === key) ?? null,
        coLines: [],
      });
    }
    groups.get(key)!.coLines.push(coLine);
  }

  // Sort: associated lines first, new scope last
  return [...groups.values()].sort((a, b) => {
    if (a.contractLine === null) return 1;
    if (b.contractLine === null) return -1;
    return a.contractLine.lineNumber.localeCompare(b.contractLine.lineNumber);
  });
}

export function ChangeOrderSOV() {
  const [lines, setLines] = useState<COLine[]>(initialCOLines);
  const [allContractLines, setAllContractLines] = useState(contractLines);
  const [view, setView] = useState<'flat' | 'grouped'>('grouped');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const { companyId, itemId } = useParams({ strict: false });
  const base = GUARDRAILS.DEMO_ROUTE.BASE_PATH.replace('$companyId', String(companyId ?? GUARDRAILS.DEMO_ROUTE.COMPANY_ID));
  const liAssociationHref = itemId ? `${base}/items/${itemId}/line-item-association` : null;

  const totalAmount = lines.reduce((sum, l) => sum + l.amount, 0);
  const unassignedCount = lines.filter(l => l.associatedContractLineId === null).length;
  const grouped = groupByContractLine(lines, allContractLines);

  function toggleGroup(key: string) {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function updateAssociation(coLineId: number, contractLineId: number | null) {
    setLines(prev => prev.map(l => l.id === coLineId ? { ...l, associatedContractLineId: contractLineId } : l));
  }

  function createNewContractLine(coLine: COLine): ContractLine {
    const newLine: ContractLine = {
      id: allContractLines.length + 100,
      lineNumber: String(allContractLines.length + 1).padStart(3, '0'),
      description: coLine.description,
      budgetCode: coLine.budgetCode,
      originalAmount: 0,
      isNewContractLine: true,
    };
    setAllContractLines(prev => [...prev, newLine]);
    return newLine;
  }

  function handleDropdownChange(coLine: COLine, value: string) {
    if (value === '__new__') {
      const newLine = createNewContractLine(coLine);
      updateAssociation(coLine.id, newLine.id);
    } else if (value === '__none__') {
      updateAssociation(coLine.id, null);
    } else {
      updateAssociation(coLine.id, parseInt(value, 10));
    }
  }

  function renderAssociationDropdown(coLine: COLine) {
    const matching = allContractLines.filter(l => l.budgetCode === coLine.budgetCode);
    const others = allContractLines.filter(l => l.budgetCode !== coLine.budgetCode);
    const isUnset = coLine.associatedContractLineId === null;

    return (
      <select
        style={isUnset ? SELECT_UNSET : { ...SELECT, fontSize: 12 }}
        value={coLine.associatedContractLineId === null ? '__none__' : String(coLine.associatedContractLineId)}
        onChange={e => handleDropdownChange(coLine, e.target.value)}
        onClick={e => e.stopPropagation()}
      >
        <option value="__none__">{isUnset ? '— Select contract line —' : 'New scope'}</option>
        {matching.length > 0 && (
          <optgroup label={`Matching: ${coLine.budgetCode}`}>
            {matching.map(l => <option key={l.id} value={l.id}>{lineLabel(l)}</option>)}
          </optgroup>
        )}
        {others.length > 0 && (
          <optgroup label="Other lines">
            {others.map(l => <option key={l.id} value={l.id}>{lineLabel(l)}</option>)}
          </optgroup>
        )}
        <optgroup label="─────────">
          <option value="__new__">+ Create new contract line</option>
        </optgroup>
      </select>
    );
  }

  return (
    <>
      <ProtoPageHeader
        title={coHeader.title}
        subtitle={<>{coHeader.number} · {coHeader.contract} · <Pill color="gray">Draft</Pill></>}
        tabs={[
          { label: 'General', path: '' },
          { label: 'Schedule of Values (1)', active: true, path: '/schedule-of-values' },
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
          <Typography intent="h2">Schedule of Values</Typography>
        </Box>

        {/* Unassigned warning */}
        {unassignedCount > 0 && (
          <Box marginBottom="md">
            <Banner variant="attention">
              <Banner.Icon icon={<Warning />} />
              <Banner.Content>
                <Banner.Body>
                  <strong>{unassignedCount} line{unassignedCount > 1 ? 's' : ''}</strong> need a contract line association before this change order can be submitted.
                </Banner.Body>
              </Banner.Content>
            </Banner>
          </Box>
        )}

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
          <Typography intent="small" color="gray50">View:</Typography>
          {(['grouped', 'flat'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '4px 12px', borderRadius: 4, fontSize: 13, cursor: 'pointer',
                border: `1px solid ${view === v ? colors.blue45 : colors.gray20}`,
                background: view === v ? colors.blue45 : '#fff',
                color: view === v ? '#fff' : colors.gray60,
                fontWeight: view === v ? 600 : 400,
              }}
            >
              {v === 'grouped' ? 'Grouped by contract line' : 'Flat list'}
            </button>
          ))}
          {liAssociationHref && (
            <a
              href={liAssociationHref}
              style={{
                padding: '4px 12px', borderRadius: 4, fontSize: 13, cursor: 'pointer',
                border: `1px solid ${colors.gray20}`,
                background: '#fff',
                color: colors.gray60,
                fontWeight: 400,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Bulk LI association
            </a>
          )}
        </div>

        {/* ── Grouped view ── */}
        {view === 'grouped' && (
          <Table.Container>
            <Table style={{ width: '100%' }}>
              <Table.Header>
                <Table.HeaderRow>
                  <Table.HeaderCell snugfit></Table.HeaderCell>
                  <Table.HeaderCell snugfit>#</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell snugfit>Budget code</Table.HeaderCell>
                  <Table.HeaderCell snugfit>Tax code</Table.HeaderCell>
                  <Table.HeaderCell snugfit style={{ textAlign: 'right' }}>Qty</Table.HeaderCell>
                  <Table.HeaderCell snugfit>UOM</Table.HeaderCell>
                  <Table.HeaderCell snugfit style={{ textAlign: 'right' }}>Amount</Table.HeaderCell>
                  <Table.HeaderCell>Contract line</Table.HeaderCell>
                </Table.HeaderRow>
              </Table.Header>
              <Table.Body>
                {grouped.map((group, gi) => {
                  const groupKey = group.contractLine ? String(group.contractLine.id) : 'new-scope';
                  const isExpanded = !collapsedGroups.has(groupKey);
                  return (
                    <React.Fragment key={gi}>
                      <Table.Group colSpan={9} style={{ cursor: 'pointer' }} onClick={() => toggleGroup(groupKey)}>
                        <Table.Carat expanded={isExpanded} onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggleGroup(groupKey); }} />
                        <Table.GroupTitle>
                          {group.contractLine ? lineLabel(group.contractLine) : 'New scope'}
                        </Table.GroupTitle>
                        {!group.contractLine && (
                          <span style={{ fontSize: 12, color: colors.orange45, marginLeft: 8 }}>— will create new contract lines</span>
                        )}
                        <span style={{ fontSize: 12, color: colors.gray50, marginLeft: 'auto' }}>
                          {group.coLines.length} line{group.coLines.length > 1 ? 's' : ''} ·{' '}
                          {formatCurrency(group.coLines.reduce((s, l) => s + l.amount, 0))}
                        </span>
                      </Table.Group>
                      {isExpanded && group.coLines.map((coLine, li) => (
                        <Table.BodyRow key={coLine.id}>
                          <Table.BodyCell snugfit></Table.BodyCell>
                          <Table.BodyCell snugfit>
                            <Table.TextCell style={{ color: colors.gray50 }}>{li + 1}</Table.TextCell>
                          </Table.BodyCell>
                          <Table.BodyCell>
                            <Table.TextCell>{coLine.description}</Table.TextCell>
                          </Table.BodyCell>
                          <Table.BodyCell snugfit>
                            <Table.TextCell><BudgetCodeCell code={coLine.budgetCode} name={coLine.budgetCodeName} /></Table.TextCell>
                          </Table.BodyCell>
                          <Table.BodyCell snugfit>
                            <Table.TextCell>{coLine.taxCode}</Table.TextCell>
                          </Table.BodyCell>
                          <Table.BodyCell snugfit>
                            <Table.TextCell style={{ justifyContent: 'flex-end' }}>{coLine.qty}</Table.TextCell>
                          </Table.BodyCell>
                          <Table.BodyCell snugfit>
                            <Table.TextCell>{coLine.uom}</Table.TextCell>
                          </Table.BodyCell>
                          <Table.BodyCell snugfit>
                            <Table.TextCell style={{ justifyContent: 'flex-end' }}>{formatCurrency(coLine.amount)}</Table.TextCell>
                          </Table.BodyCell>
                          <Table.BodyCell style={{ width: 240 }}>
                            <Table.TextCell>{renderAssociationDropdown(coLine)}</Table.TextCell>
                          </Table.BodyCell>
                        </Table.BodyRow>
                      ))}
                    </React.Fragment>
                  );
                })}
              </Table.Body>
            </Table>
          </Table.Container>
        )}

        {/* ── Flat view ── */}
        {view === 'flat' && (
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
                  <Table.HeaderCell>Associated contract line item</Table.HeaderCell>
                </Table.HeaderRow>
              </Table.Header>
              <Table.Body>
                {lines.map((line, i) => (
                  <Table.BodyRow key={line.id}>
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
                      <Table.TextCell>{renderAssociationDropdown(line)}</Table.TextCell>
                    </Table.BodyCell>
                  </Table.BodyRow>
                ))}
              </Table.Body>
            </Table>
          </Table.Container>
        )}

        {/* Totals rows — production style */}
        <div style={{ borderTop: `1px solid ${colors.gray90}` }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 16px', borderBottom: `1px solid ${colors.gray90}` }}>
            <span style={{ fontSize: 13, color: colors.gray50, minWidth: 120, textAlign: 'right' }}>Total:</span>
            <span style={{ fontSize: 13, fontWeight: 600, minWidth: 120, textAlign: 'right' }}>{formatCurrency(totalAmount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 16px', borderBottom: `1px solid ${colors.gray90}` }}>
            <span style={{ fontSize: 13, color: colors.gray50, minWidth: 120, textAlign: 'right' }}>Tax:</span>
            <span style={{ fontSize: 13, minWidth: 120, textAlign: 'right', color: colors.gray50 }}>—</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 16px' }}>
            <span style={{ fontSize: 13, fontWeight: 600, minWidth: 120, textAlign: 'right' }}>Grand Total:</span>
            <span style={{ fontSize: 13, fontWeight: 600, minWidth: 120, textAlign: 'right' }}>{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Financial summary panel — right-aligned, below table */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <div style={{ minWidth: 240, borderTop: `2px solid ${colors.gray15}`, paddingTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
              <Typography intent="small" color="gray50">Subtotal</Typography>
              <Typography intent="small">{formatCurrency(totalAmount)}</Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', marginBottom: 6 }}>
              <Typography intent="small" color="gray50">Estimated taxes</Typography>
              <Typography intent="small" color="gray50">$0</Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 0', borderTop: `1px solid ${colors.gray90}` }}>
              <Typography intent="body" style={{ fontWeight: 600 }}>Grand Total</Typography>
              <Typography intent="body" style={{ fontWeight: 600 }}>{formatCurrency(totalAmount)}</Typography>
            </div>
          </div>
        </div>

        {/* Save action */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary">Save</Button>
        </div>
      </Box>
    </DetailPage.Card>
    </>
  );
}
