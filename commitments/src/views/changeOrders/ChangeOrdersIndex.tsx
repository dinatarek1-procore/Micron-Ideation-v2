import React, { useState } from 'react';
import { Box, Button, DetailPage, Panel, Pill, Table, Typography, colors } from '@procore/core-react';
import { ProtoPageHeader } from '../shared/ProtoPageHeader';
import { sovLines, contractData, formatCurrency, newScopeCOs, type ApprovedCO } from '../scheduleOfValues/sovData';
import { ChangeOrderTaggingModal } from '../scheduleOfValues/ChangeOrderTaggingModal';

function BudgetCodeCell({ code, name }: { code: string; name: string }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{code}</div>
      <div style={{ fontSize: 11, color: colors.gray50, marginTop: 1 }}>{name}</div>
    </div>
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

interface CODisplayRow {
  co: ApprovedCO;
  revision: number;
  executed: boolean;
  dateInitiated: string;
  dueDate?: string;
  reviewDate?: string;
}

const allCORows: CODisplayRow[] = [
  ...sovLines.flatMap((line) =>
    line.approvedCOs.map((co) => ({
      co,
      revision: 0,
      executed: false,
      dateInitiated: '10/15/2024',
      dueDate: undefined,
      reviewDate: '4/8/2025',
    }))
  ),
  {
    co: newScopeCOs[0],
    revision: 1,
    executed: false,
    dateInitiated: '11/02/2024',
    dueDate: undefined,
    reviewDate: '4/15/2025',
  },
];

export function ChangeOrdersIndex() {
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CODisplayRow | null>(null);

  return (
    <>
      <ProtoPageHeader
        title={contractData.vendor}
        subtitle={<>{contractData.number} · {contractData.title}</>}
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowTagModal(true)}>
            Create change order
          </Button>
        }
        tabs={[
          { label: 'General', path: '' },
          { label: 'Schedule of Values', path: '/schedule-of-values' },
          { label: 'Change Orders (3)', active: true, path: '/change-orders' },
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
            <Typography intent="h2">Change Orders</Typography>
          </Box>

          {/* Sub-section header + Export button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Typography intent="h3">Commitment Change Orders</Typography>
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', fontSize: 13, fontWeight: 500,
                border: `1px solid ${colors.gray20}`, borderRadius: 4,
                background: '#fff', cursor: 'pointer', color: colors.gray15,
              }}
            >
              Export CCOs
              <span style={{ fontSize: 10, color: colors.gray50 }}>▾</span>
            </button>
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
            {/* Left: search + filters */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                border: `1px solid ${colors.gray20}`, borderRadius: 4,
                padding: '6px 10px', background: '#fff', width: 200,
              }}>
                <span style={{ color: colors.gray50, fontSize: 13 }}>🔍</span>
                <span style={{ fontSize: 13, color: colors.gray70 }}>Search</span>
              </div>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', fontSize: 13, fontWeight: 500,
                border: `1px solid ${colors.gray20}`, borderRadius: 4,
                background: '#fff', cursor: 'pointer', color: colors.gray15,
              }}>
                ⚙ Filters
              </button>
            </div>

            {/* Right: group by + configure */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select style={{
                border: `1px solid ${colors.gray20}`, borderRadius: 4,
                padding: '6px 10px', fontSize: 13, background: '#fff',
                color: colors.gray50, cursor: 'pointer',
              }}>
                <option>Select a column to group</option>
                <option>Status</option>
                <option>Budget code</option>
              </select>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', fontSize: 13, fontWeight: 500,
                border: `1px solid ${colors.gray20}`, borderRadius: 4,
                background: '#fff', cursor: 'pointer', color: colors.gray15,
              }}>
                ⊞ Configure
              </button>
            </div>
          </div>

          {/* Change orders table */}
          <Table.Container>
            <Table style={{ width: '100%' }}>
              <Table.Header>
                <Table.HeaderRow>
                  <Table.HeaderCell snugfit>Number</Table.HeaderCell>
                  <Table.HeaderCell snugfit>Revision</Table.HeaderCell>
                  <Table.HeaderCell>Title</Table.HeaderCell>
                  <Table.HeaderCell snugfit>Status</Table.HeaderCell>
                  <Table.HeaderCell snugfit>Executed</Table.HeaderCell>
                  <Table.HeaderCell snugfit>Tax Code</Table.HeaderCell>
                  <Table.HeaderCell snugfit style={{ textAlign: 'right' }}>Amount</Table.HeaderCell>
                  <Table.HeaderCell snugfit>Date Initiated</Table.HeaderCell>
                  <Table.HeaderCell snugfit>Due Date</Table.HeaderCell>
                  <Table.HeaderCell snugfit>Review Date</Table.HeaderCell>
                </Table.HeaderRow>
              </Table.Header>
              <Table.Body>
                {allCORows.map((row) => (
                  <Table.BodyRow
                    key={row.co.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedRow(row)}
                  >
                    <Table.BodyCell snugfit>
                      <Table.TextCell>
                        <span style={{ color: colors.blue45, fontWeight: 600, textDecoration: 'underline' }}>
                          {row.co.coNumber}
                        </span>
                      </Table.TextCell>
                    </Table.BodyCell>
                    <Table.BodyCell snugfit>
                      <Table.TextCell>{row.revision}</Table.TextCell>
                    </Table.BodyCell>
                    <Table.BodyCell>
                      <Table.TextCell>{row.co.description}</Table.TextCell>
                    </Table.BodyCell>
                    <Table.BodyCell snugfit>
                      <Table.TextCell>
                        <Pill color="green">{row.co.status}</Pill>
                      </Table.TextCell>
                    </Table.BodyCell>
                    <Table.BodyCell snugfit>
                      <Table.TextCell>{row.executed ? 'Yes' : 'No'}</Table.TextCell>
                    </Table.BodyCell>
                    <Table.BodyCell snugfit>
                      <Table.TextCell>{row.co.taxCode}</Table.TextCell>
                    </Table.BodyCell>
                    <Table.BodyCell snugfit>
                      <Table.TextCell style={{ justifyContent: 'flex-end', color: colors.green45, fontWeight: 600 }}>
                        +{formatCurrency(row.co.amount)}
                      </Table.TextCell>
                    </Table.BodyCell>
                    <Table.BodyCell snugfit>
                      <Table.TextCell>{row.dateInitiated}</Table.TextCell>
                    </Table.BodyCell>
                    <Table.BodyCell snugfit>
                      <Table.TextCell style={{ color: colors.gray50 }}>{row.dueDate ?? '—'}</Table.TextCell>
                    </Table.BodyCell>
                    <Table.BodyCell snugfit>
                      <Table.TextCell>{row.reviewDate ?? '—'}</Table.TextCell>
                    </Table.BodyCell>
                  </Table.BodyRow>
                ))}
              </Table.Body>
            </Table>
          </Table.Container>
        </Box>
      </DetailPage.Card>

      {/* CO detail tearsheet */}
      {selectedRow && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000 }}
            onClick={() => setSelectedRow(null)}
          />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, zIndex: 1001, display: 'flex', flexDirection: 'column' }}>
            <Panel>
              <Panel.Header onClose={() => setSelectedRow(null)}>
                <Panel.Title>{selectedRow.co.coNumber}</Panel.Title>
              </Panel.Header>

              <Panel.Body>
                <Panel.Section>
                  <Typography intent="h3" style={{ marginBottom: 4 }}>
                    {selectedRow.co.description}
                  </Typography>
                  <div style={{ marginBottom: 20 }}>
                    <Pill color="green">{selectedRow.co.status}</Pill>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                    <DetailRow label="Amount">
                      <span style={{ color: colors.green45, fontWeight: 600 }}>
                        +{formatCurrency(selectedRow.co.amount)}
                      </span>
                    </DetailRow>
                    <DetailRow label="Budget code">
                      <BudgetCodeCell code={selectedRow.co.budgetCode} name={selectedRow.co.budgetCodeName} />
                    </DetailRow>
                    <DetailRow label="Qty">{selectedRow.co.qty}</DetailRow>
                    <DetailRow label="UOM">{selectedRow.co.uom}</DetailRow>
                    <DetailRow label="Revision">{selectedRow.revision}</DetailRow>
                    <DetailRow label="Executed">{selectedRow.executed ? 'Yes' : 'No'}</DetailRow>
                    <DetailRow label="Date Initiated">{selectedRow.dateInitiated}</DetailRow>
                    <DetailRow label="Review Date">{selectedRow.reviewDate ?? '—'}</DetailRow>
                    <DetailRow label="Contract">
                      <span style={{ color: colors.gray60 }}>{contractData.number} · {contractData.title}</span>
                    </DetailRow>
                    <DetailRow label="Vendor">{contractData.vendor}</DetailRow>
                  </div>
                </Panel.Section>
              </Panel.Body>

              <Panel.Footer>
                <Panel.FooterActions>
                  <Button variant="tertiary" onClick={() => setSelectedRow(null)}>Close</Button>
                  <Button variant="primary">View change order</Button>
                </Panel.FooterActions>
              </Panel.Footer>
            </Panel>
          </div>
        </>
      )}

      {showTagModal && (
        <ChangeOrderTaggingModal onClose={() => setShowTagModal(false)} />
      )}
    </>
  );
}
