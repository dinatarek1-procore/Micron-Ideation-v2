import type { ReactNode } from 'react';
import styled from 'styled-components';

export interface DefaultShellLayoutProps {
  /** When omitted or `false`, the page header zone is not rendered (full-height workspace). */
  pageHeader?: ReactNode;
  children: ReactNode;
  pageActions?: ReactNode;
  className?: string;
}

const LayoutRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background: var(--shell-workspace-bg, #f5f5f5);
`;

const PageHeaderZone = styled.div`
  flex-shrink: 0;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
`;

const WorkspaceZone = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  overflow-y: auto;
  background: var(--shell-workspace-bg, #f5f5f5);

  /* Stretch the tool root so tool layouts (e.g. ToolLandingPage) can use height: 100% */
  & > * {
    flex: 1;
    min-height: 0;
    min-width: 0;
    align-self: stretch;
  }
`;

const PageActionsZone = styled.div`
  flex-shrink: 0;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
  padding: var(--shell-action-bar-py, 0.75rem) var(--shell-action-bar-px, 1rem);
`;

export function DefaultShellLayout({
  pageHeader,
  children,
  pageActions,
  className,
}: DefaultShellLayoutProps) {
  return (
    <LayoutRoot className={className}>
      {pageHeader != null && pageHeader !== false && (
        <PageHeaderZone id="shell-page-header">{pageHeader}</PageHeaderZone>
      )}
      <WorkspaceZone id="shell-workspace">{children}</WorkspaceZone>
      {pageActions != null && pageActions !== false && (
        <PageActionsZone id="shell-page-actions">{pageActions}</PageActionsZone>
      )}
    </LayoutRoot>
  );
}
