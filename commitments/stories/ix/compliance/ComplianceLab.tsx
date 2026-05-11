import React, { type ReactNode } from 'react';
import styled from 'styled-components';
import { colors, spacing, Typography } from '@procore/core-react';

/**
 * Shared three-panel layout for IX compliance-lab stories. Each panel renders:
 *
 *   - IX target      — the behavior REFERENCE.md calls for.
 *   - Stack today    — what a prototype built on current common components
 *                      (core-react, Toolinator, Formulator) actually produces.
 *   - Toolinator-    — the same behavior assuming the proposed framework
 *     extended        extension in TOOLINATOR-EXTENSIONS.md lands.
 *
 * A badge summarizes the implementation status per panel so designers can see
 * at a glance which parts are shipped, wired in the scaffold, or pending a
 * framework change.
 */

export type ComplianceStatus =
  | 'supported'
  | 'scaffold-wiring'
  | 'toolinator-proposal'
  | 'core-react-proposal'
  | 'out-of-scope';

export interface ComplianceColumnProps {
  title: string;
  status: ComplianceStatus;
  description?: string;
  children: ReactNode;
}

export interface ComplianceLabProps {
  /** Short IX-rule citation, e.g. "Pattern 1 Split-View — 37/63, Tabulator/Smart Grid list". */
  rule: string;
  /** Link back to REFERENCE.md or the governing .mdc rule. */
  referenceLabel?: string;
  columns: [
    ComplianceColumnProps,
    ComplianceColumnProps,
    ComplianceColumnProps,
  ];
}

const LabContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md}px;
  padding: ${spacing.md}px;
  background: ${colors.gray96};
  min-height: 100vh;
`;

const RuleCitation = styled.div`
  padding: ${spacing.sm}px ${spacing.md}px;
  background: ${colors.white};
  border: 1px solid ${colors.gray85};
  border-radius: ${spacing.xs}px;
`;

const ColumnsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.md}px;
  align-items: stretch;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.white};
  border: 1px solid ${colors.gray85};
  border-radius: ${spacing.xs}px;
  overflow: hidden;
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm}px;
  padding: ${spacing.sm}px ${spacing.md}px;
  border-bottom: 1px solid ${colors.gray85};
  background: ${colors.gray96};
`;

const ColumnBody = styled.div`
  padding: ${spacing.md}px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm}px;
`;

const ColumnDescription = styled.div`
  font-size: 13px;
  line-height: 1.4;
  color: ${colors.gray45};
`;

const STATUS_LABEL: Record<ComplianceStatus, string> = {
  supported: 'Supported',
  'scaffold-wiring': 'Scaffold wiring',
  'toolinator-proposal': 'Toolinator proposal',
  'core-react-proposal': 'core-react proposal',
  'out-of-scope': 'Out of scope',
};

const STATUS_COLOR: Record<ComplianceStatus, { bg: string; fg: string }> = {
  supported: { bg: colors.green90, fg: colors.green20 },
  'scaffold-wiring': { bg: colors.orange90, fg: colors.orange20 },
  'toolinator-proposal': { bg: colors.blue90, fg: colors.blue20 },
  'core-react-proposal': { bg: colors.purple90, fg: colors.purple20 },
  'out-of-scope': { bg: colors.gray85, fg: colors.gray30 },
};

const Badge = styled.span<{ $status: ComplianceStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${({ $status }) => STATUS_COLOR[$status].bg};
  color: ${({ $status }) => STATUS_COLOR[$status].fg};
`;

function ComplianceColumn({
  title,
  status,
  description,
  children,
}: ComplianceColumnProps) {
  return (
    <Column>
      <ColumnHeader>
        <Typography intent="h3" style={{ margin: 0, fontSize: 14 }}>
          {title}
        </Typography>
        <Badge $status={status}>{STATUS_LABEL[status]}</Badge>
      </ColumnHeader>
      <ColumnBody>
        {description ? (
          <ColumnDescription>{description}</ColumnDescription>
        ) : null}
        {children}
      </ColumnBody>
    </Column>
  );
}

export function ComplianceLab({
  rule,
  referenceLabel,
  columns,
}: ComplianceLabProps) {
  return (
    <LabContainer>
      <RuleCitation>
        <Typography intent="label" color="gray45" style={{ marginRight: 8 }}>
          IX rule:
        </Typography>
        <Typography intent="body" style={{ fontWeight: 600 }}>
          {rule}
        </Typography>
        {referenceLabel ? (
          <Typography
            intent="small"
            color="gray60"
            style={{ display: 'block', marginTop: 4 }}
          >
            {referenceLabel}
          </Typography>
        ) : null}
      </RuleCitation>
      <ColumnsRow>
        {columns.map((col, i) => (
          <ComplianceColumn key={i} {...col} />
        ))}
      </ColumnsRow>
    </LabContainer>
  );
}
