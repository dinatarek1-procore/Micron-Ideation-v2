import React, { type ReactNode } from 'react';
import styled from 'styled-components';
import { Panel, Tearsheet } from '@procore/core-react';

/**
 * IX Slide-Out (Tearsheet) shell. Enforces the scaffold width rule:
 *
 *   - `'default'` (37vw) — Quick Create, filter panels, most contextual views.
 *   - `'wide'`    (63vw) — Tier 3+ forms or multi-section content.
 *
 * Tearsheet animates in from the right (core-react default). Footer content
 * (Save / Cancel or Apply / Cancel) is passed as the `footer` prop so callers
 * do not build custom footer chrome.
 *
 * For `<Form>` content from `@procore/json-formulator`, pass a
 * `localStorageKey` so Formulator's built-in client-side autosave recovery
 * kicks in (persists every `onChange` to `localStorage`; re-hydrates on mount).
 *
 * Full rules: `.cursor/rules/ix-tearsheet.mdc`. Server-side autosave without
 * Save / Cancel is tracked in `skills/ds-cheat-sheet/TOOLINATOR-EXTENSIONS.md`.
 */

export type TearsheetShellWidth = 'default' | 'wide';

export interface TearsheetShellProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Ids for aria-labelledby wiring. */
  titleId?: string;
  children: ReactNode;
  /**
   * Footer content. Omit for IX-compliant data-entry slide-outs that autosave
   * on change (use `TearsheetAutosaveIndicator` as the footer in its place if
   * you want a visible "Saved Ns ago" indicator). Keep a Save/Apply + Cancel
   * footer for Contextual View / System Config types where a deliberate commit
   * is part of the UX.
   */
  footer?: ReactNode;
  /** `'default'` = 37vw (Quick Create); `'wide'` = 63vw (content-dense). */
  width?: TearsheetShellWidth;
}

const WidthWrapper = styled.div<{ $width: TearsheetShellWidth }>`
  width: ${({ $width }) => ($width === 'wide' ? '63vw' : '37vw')};
  min-width: 320px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

export function TearsheetShell({
  open,
  onClose,
  title,
  titleId,
  children,
  footer,
  width = 'default',
}: TearsheetShellProps) {
  return (
    <Tearsheet
      open={open}
      onClose={onClose}
      role="dialog"
      aria-labelledby={titleId}
    >
      <WidthWrapper $width={width}>
        <Panel aria-labelledby={titleId}>
          <Panel.Header>
            <Panel.Title id={titleId} intent="h2">
              {title}
            </Panel.Title>
          </Panel.Header>
          <Panel.Body>{children}</Panel.Body>
          {footer ? (
            <Panel.Footer>
              <Panel.FooterActions>{footer}</Panel.FooterActions>
            </Panel.Footer>
          ) : null}
        </Panel>
      </WidthWrapper>
    </Tearsheet>
  );
}
