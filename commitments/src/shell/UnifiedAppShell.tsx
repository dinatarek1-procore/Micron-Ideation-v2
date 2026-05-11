'use client';

import { I18nProvider, type Locale } from '@procore/core-react';
import React, { type ReactNode } from 'react';
import styled from 'styled-components';
import { NavigationProvider } from '@/components/mfe-global-nav-package/standalone/src/lib/navigation-context';
import { UnifiedHeader } from '@/components/mfe-global-nav-package/standalone/src/components/navigation/unified-header';
import { DefaultShellLayout } from '@/components/mfe-global-nav-package/standalone/src/components/shell/DefaultShellLayout';
import { Sidepanel } from '@/components/mfe-global-nav-package/standalone/src/components/shell/Sidepanel';

const AppShellRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--shell-workspace-bg, #f5f5f5);
`;

const MountPoint = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

export interface UnifiedAppShellProps {
  children: ReactNode;
  /** Optional strip below UnifiedHeader (breadcrumbs, page title row, etc.). Omitted = workspace only. */
  pageHeader?: ReactNode;
  pageActions?: ReactNode;
  /** I18nProvider locale */
  locale?: Locale;
  idMountPoint?: string;
  showSidepanel?: boolean;
  className?: string;
}

/**
 * Single application shell: global nav header + workspace + optional Ask AI sidepanel.
 *
 * The shell does NOT own a TanStack RouterProvider. json-toolinator hosts the only browser-history
 * RouterProvider on the page. Two competing RouterProviders sharing window.history fight over
 * popstate events and cause an infinite render loop. The nav components use shellNavigate() /
 * useShellPathname() (direct window.history calls) instead.
 */
export function UnifiedAppShell({
  children,
  pageHeader,
  pageActions,
  locale = 'en' satisfies Locale,
  idMountPoint = 'mount-point',
  showSidepanel = true,
  className,
}: UnifiedAppShellProps) {
  return (
    <I18nProvider locale={locale} enableCDN={false}>
      <NavigationProvider>
        <AppShellRoot className={className}>
          <UnifiedHeader />
          <MountPoint id={idMountPoint}>
            <DefaultShellLayout
              pageHeader={pageHeader}
              pageActions={pageActions}
            >
              {children}
            </DefaultShellLayout>
            {showSidepanel ? <Sidepanel /> : null}
          </MountPoint>
        </AppShellRoot>
      </NavigationProvider>
    </I18nProvider>
  );
}
