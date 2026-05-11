import React, { useState } from 'react';
import { Box, Button, DetailPage, Panel, Pill, Table, Typography, colors, spacing } from '@procore/core-react';
import { ProtoPageHeader } from '../shared/ProtoPageHeader';
import {
  sovLines,
  newScopeCOs,
  contractData,
  formatCurrency,
  revisedAmount,
  approvedCOTotal,
  totalOriginal,
  totalApprovedCOs,
  totalRevised,
  type SovLine,
  type ApprovedCO,
} from './sovData';
import { ChangeOrderTaggingModal } from './ChangeOrderTaggingModal';


function BudgetCodeCell({ code, name }: { code: string; name: string }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: colors.gray15 }}>{code}</div>
      <div style={{ fontSize: 11, color: colors.gray50, marginTop: 1 }}>{name}</div>
    </div>
  );
}

function SovOriginalRow({ line, expanded, onToggle }: { line: SovLine; expanded: boolean; onToggle: () => void }) {
  const hasCOs = line.approvedCOs.length > 0;
  const coTotal = approvedCOTotal(line);
  const revised = revisedAmount(line);

  return (
    <Table.BodyRow style={{ cursor: hasCOs ? 'pointer' : 'default' }} onClick={hasCOs ? onToggle : undefined}>
      <Table.BodyCell snugfit>
        <Table.TextCell>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {hasCOs
              ? <Table.Carat expanded={expanded} onClick={(e: React.MouseEvent) => { e.stopPropagation(); onToggle(); }} />
              : <span style={{ display: 'inline-block', width: 24 }} />}
            <strong>{line.lineNumber}</strong>
          </div>
        </Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell>
        <Table.TextCell>{line.description}</Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell><BudgetCodeCell code={line.budgetCode} name={line.budgetCodeName} /></Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell style={{ color: colors.gray50 }}>—</Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell style={{ justifyContent: 'flex-end' }}>{formatCurrency(line.originalAmount)}</Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell style={{ justifyContent: 'flex-end', color: coTotal > 0 ? colors.green45 : colors.gray30 }}>
          {coTotal > 0 ? `+${formatCurrency(coTotal)}` : '—'}
        </Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell style={{ justifyContent: 'flex-end', fontWeight: 600 }}>{formatCurrency(revised)}</Table.TextCell>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}

function CORRow({ co, onClick }: { co: ApprovedCO; onClick: () => void }) {
  return (
    <Table.BodyRow style={{ cursor: 'pointer' }} onClick={onClick}>
      <Table.BodyCell snugfit>
        <Table.TextCell style={{ color: colors.gray45 }}>└</Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell>
        <Table.TextCell style={{ paddingLeft: 12, gap: 6 }}>
          <Pill color="blue">CO</Pill>{' '}
          <span style={{ color: colors.blue45, fontWeight: 600, textDecoration: 'underline' }}>
            {co.coNumber}
          </span>{' '}— {co.description}
        </Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell><BudgetCodeCell code={co.budgetCode} name={co.budgetCodeName} /></Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell>{co.taxCode}</Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell style={{ justifyContent: 'flex-end', color: colors.gray45 }}>—</Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell style={{ justifyContent: 'flex-end', color: colors.green45 }}>+{formatCurrency(co.amount)}</Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell style={{ justifyContent: 'flex-end' }}>{formatCurrency(co.amount)}</Table.TextCell>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}

function NewScopeRow({ co, onClick }: { co: ApprovedCO; onClick: () => void }) {
  return (
    <Table.BodyRow style={{ cursor: 'pointer' }} onClick={onClick}>
      <Table.BodyCell snugfit>
        <Table.TextCell style={{ color: '#999' }}>—</Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell>
        <Table.TextCell style={{ gap: 6 }}>
          <Pill color="UNSAFE_orange">New scope</Pill>{' '}
          <span style={{ color: colors.blue45, fontWeight: 600, textDecoration: 'underline' }}>
            {co.coNumber}
          </span>{' '}— {co.description}
        </Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell><BudgetCodeCell code={co.budgetCode} name={co.budgetCodeName} /></Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell>{co.taxCode}</Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell style={{ justifyContent: 'flex-end', color: '#999' }}>—</Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell style={{ justifyContent: 'flex-end', color: colors.green45 }}>+{formatCurrency(co.amount)}</Table.TextCell>
      </Table.BodyCell>
      <Table.BodyCell snugfit>
        <Table.TextCell style={{ justifyContent: 'flex-end', fontWeight: 600 }}>{formatCurrency(co.amount)}</Table.TextCell>
      </Table.BodyCell>
    </Table.BodyRow>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: colors.gray50, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, color: colors.gray15 }}>{children}</div>
    </div>
  );
}

export function ScheduleOfValues() {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedCO, setSelectedCO] = useState<ApprovedCO | null>(null);

  function toggleRow(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <>
      <ProtoPageHeader
        title={contractData.vendor}
        subtitle={<>{contractData.number} · {contractData.title}</>}
        tabs={[
          { label: 'General', path: '' },
          { label: 'Schedule of Values', active: true, path: '/schedule-of-values' },
          { label: 'Change Orders (3)', path: '/change-orders' },
          { label: 'RFQs' },
          { label: 'Compliance' },
          { label: 'Invoices (0)' },
          { label: 'Lien Rights' },
          { label: 'Payments Issued (0)' },
          { label: 'Emails', path: '/emails' },
          { label: 'Change History', path: '/history' },
          { label: 'Financial Markup' },
          { label: 'Advanced Settings' },
        ]}
      />

      <DetailPage.Card>
        <Box padding="lg">
          {/* Card title */}
          <Box marginBottom="lg">
            <Typography intent="h2">Schedule of Values</Typography>
          </Box>

          {/* Legend */}
          <Box marginBottom="md">
            <Flex gap="md" alignItems="center">
              <Typography intent="small" color="gray50">
                ▶ Expand to view associated change orders
              </Typography>
              <Typography intent="small" color="gray50">
                · Only{' '}
                approved change orders are shown
              </Typography>
            </Flex>
          </Box>

          {/* SOV table */}
          <Table.Container>
            <Table style={{ width: '100%' }}>
              <Table.Header>
                <Table.HeaderRow>
                  <Table.HeaderCell snugfit>#</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell snugfit>Budget code</Table.HeaderCell>
                  <Table.HeaderCell snugfit>Tax code</Table.HeaderCell>
                  <Table.HeaderCell snugfit style={{ textAlign: 'right' }}>Original amount</Table.HeaderCell>
                  <Table.HeaderCell snugfit style={{ textAlign: 'right' }}>Approved COs</Table.HeaderCell>
                  <Table.HeaderCell snugfit style={{ textAlign: 'right' }}>Revised total</Table.HeaderCell>
                </Table.HeaderRow>
              </Table.Header>
              <Table.Body>
                {sovLines.map((line) => (
                  <React.Fragment key={line.id}>
                    <SovOriginalRow
                      line={line}
                      expanded={expanded.has(line.id)}
                      onToggle={() => toggleRow(line.id)}
                    />
                    {expanded.has(line.id) && line.approvedCOs.map((co) => (
                      <CORRow key={co.id} co={co} onClick={() => setSelectedCO(co)} />
                    ))}
                  </React.Fragment>
                ))}

                {newScopeCOs.length > 0 && (
                  <>
                    <Table.Group colSpan={7}>
                      <Table.GroupTitle>New scope</Table.GroupTitle>
                    </Table.Group>
                    {newScopeCOs.map((co) => <NewScopeRow key={co.id} co={co} onClick={() => setSelectedCO(co)} />)}
                  </>
                )}

                {/* Totals footer */}
                <Table.BodyRow style={{ background: colors.gray96, fontWeight: 600 }}>
                  <Table.BodyCell colSpan={4}>
                    <Table.TextCell><strong>Total</strong></Table.TextCell>
                  </Table.BodyCell>
                  <Table.BodyCell snugfit>
                    <Table.TextCell style={{ justifyContent: 'flex-end' }}>{formatCurrency(totalOriginal)}</Table.TextCell>
                  </Table.BodyCell>
                  <Table.BodyCell snugfit>
                    <Table.TextCell style={{ justifyContent: 'flex-end', color: colors.green45 }}>+{formatCurrency(totalApprovedCOs)}</Table.TextCell>
                  </Table.BodyCell>
                  <Table.BodyCell snugfit>
                    <Table.TextCell style={{ justifyContent: 'flex-end' }}>{formatCurrency(totalRevised)}</Table.TextCell>
                  </Table.BodyCell>
                </Table.BodyRow>
              </Table.Body>
            </Table>
          </Table.Container>
        </Box>
      </DetailPage.Card>

      {showTagModal && (
        <ChangeOrderTaggingModal onClose={() => setShowTagModal(false)} />
      )}

      {selectedCO && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000 }}
            onClick={() => setSelectedCO(null)}
          />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, zIndex: 1001, display: 'flex', flexDirection: 'column' }}>
            <Panel>
              <Panel.Header onClose={() => setSelectedCO(null)}>
                <Panel.Title>{selectedCO.coNumber}</Panel.Title>
              </Panel.Header>
              <Panel.Body>
                <Panel.Section>
                  <Typography intent="h3" style={{ marginBottom: 4 }}>
                    {selectedCO.description}
                  </Typography>
                  <div style={{ marginBottom: 20 }}>
                    <Pill color="green">{selectedCO.status}</Pill>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                    <DetailRow label="Amount">
                      <span style={{ color: colors.green45, fontWeight: 600 }}>
                        +{formatCurrency(selectedCO.amount)}
                      </span>
                    </DetailRow>
                    <DetailRow label="Budget code">
                      <BudgetCodeCell code={selectedCO.budgetCode} name={selectedCO.budgetCodeName} />
                    </DetailRow>
                    <DetailRow label="Qty">{selectedCO.qty}</DetailRow>
                    <DetailRow label="UOM">{selectedCO.uom}</DetailRow>
                    <DetailRow label="Contract">
                      <span style={{ color: colors.gray60 }}>{contractData.number} · {contractData.title}</span>
                    </DetailRow>
                    <DetailRow label="Vendor">{contractData.vendor}</DetailRow>
                  </div>
                </Panel.Section>
              </Panel.Body>
              <Panel.Footer>
                <Panel.FooterActions>
                  <Button variant="tertiary" onClick={() => setSelectedCO(null)}>Close</Button>
                </Panel.FooterActions>
              </Panel.Footer>
            </Panel>
          </div>
        </>
      )}
    </>
  );
}

// Flex and other missing imports helper — pull from core-react
function Flex({
  children,
  justifyContent,
  alignItems,
  gap,
  style,
}: {
  children: React.ReactNode;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  style?: React.CSSProperties;
}) {
  const gapMap: Record<string, string> = { sm: '8px', md: '12px', lg: '16px' };
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: justifyContent as any,
        alignItems: alignItems as any,
        gap: gap ? gapMap[gap] ?? gap : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
