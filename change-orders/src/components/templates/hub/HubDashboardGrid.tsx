import type { ReactNode } from 'react';
import { spacing } from '@procore/core-react';
import styled from 'styled-components';

const GridRoot = styled.div`
  width: 100%;
  max-width: min(100%, 1400px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${spacing.md}px;
`;

export type HubGridSpan = 4 | 6 | 8 | 12;

const HubGridCellBase = styled.div<{ $span: HubGridSpan }>`
  grid-column: span ${(p) => p.$span};
  min-width: 0;

  @media (max-width: 767px) {
    grid-column: span 12;
  }
`;

export type HubGridCellProps = {
  span: HubGridSpan;
  children: ReactNode;
  className?: string;
};

export function HubGridCell({ span, children, className }: HubGridCellProps) {
  return (
    <HubGridCellBase $span={span} className={className}>
      {children}
    </HubGridCellBase>
  );
}

export type HubDashboardGridProps = {
  children: ReactNode;
  className?: string;
};

export function HubDashboardGrid({
  children,
  className,
}: HubDashboardGridProps) {
  return <GridRoot className={className}>{children}</GridRoot>;
}
