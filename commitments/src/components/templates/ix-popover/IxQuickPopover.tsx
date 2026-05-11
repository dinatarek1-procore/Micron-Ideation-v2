/**
 * IX quick popover — `@procore/core-react` `OverlayTrigger` with `arrow={false}` (no tail)
 * plus `Popover.Content` for the same surface styling as design-system popovers.
 * `Popover` itself hardcodes `arrow: true`, so we compose `OverlayTrigger` instead.
 *
 * Full rules: `.cursor/rules/ix-popover.mdc` (plus `skills/ds-cheat-sheet/REFERENCE.md`
 * for the governing IX reference). The long-term core-react proposal to accept
 * `arrow?: boolean` is tracked in `skills/ds-cheat-sheet/TOOLINATOR-EXTENSIONS.md`.
 *
 * Canonical usage in this scaffold: `PopoverComponentFilter` and
 * `PopoverComponentConfigure` (toolbar Filter / Configure buttons).
 */

import { OverlayTrigger, Popover, colors, spacing } from '@procore/core-react';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

type OverlayTriggerComponentProps = ComponentProps<typeof OverlayTrigger>;

type OverlayTriggerForwardedProps = OverlayTriggerComponentProps & {
  padding?: number;
  container?: HTMLElement | ShadowRoot;
};

export type IxQuickPopoverProps = Omit<
  OverlayTriggerComponentProps,
  'overlay' | 'children'
> & {
  /** Element that toggles the popover (typically `IxPopoverTriggerButton`). */
  children: ReactNode;
  /** Body rendered inside `Popover.Content`. */
  content: ReactNode;
  /** Portal root so the overlay is scoped (use for `max-width: 50%` vs workspace). */
  portalContainer?: HTMLElement | ShadowRoot | null;
  /** Gap between trigger and popover (px). Forwarded to the overlay anchor. */
  padding?: number;
  /** Panel width in px (IX default 300; use 360 for richer Formulator filter bodies). */
  width?: number;
  /** Accessible name when `role` is `"dialog"` (default). */
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

function contentSurfaceStyleForWidth(widthPx: number): CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 20,
    width: widthPx,
    minWidth: widthPx,
    maxWidth: widthPx,
    maxHeight: 'min(70vh, 360px)',
    overflow: 'hidden',
    boxSizing: 'border-box',
    boxShadow: `0 ${spacing.xs}px ${spacing.sm}px rgba(0, 0, 0, 0.12)`,
    border: `1px solid ${colors.gray85}`,
    borderRadius: spacing.xs,
    backgroundColor: colors.white,
  };
}

export function IxQuickPopover({
  children,
  content,
  portalContainer,
  placement = 'bottom-left',
  padding = 2,
  width = 300,
  restoreFocusOnHide = true,
  role = 'dialog',
  'aria-label': ariaLabel = 'Popover',
  'aria-labelledby': ariaLabelledBy,
  ...rest
}: IxQuickPopoverProps) {
  const labelled =
    ariaLabelledBy !== undefined
      ? { 'aria-labelledby': ariaLabelledBy }
      : { 'aria-label': ariaLabel };

  const triggerProps: OverlayTriggerForwardedProps = {
    ...rest,
    placement,
    padding,
    restoreFocusOnHide,
    role,
    ...labelled,
    container: portalContainer ?? undefined,
    shrinkOverlay: true,
    arrow: false,
    trackAriaExpanded: true,
    overlay: (
      <Popover.Content
        placement={placement}
        block
        style={contentSurfaceStyleForWidth(width)}
      >
        {content}
      </Popover.Content>
    ),
    children,
  };

  return <OverlayTrigger {...(triggerProps as OverlayTriggerComponentProps)} />;
}
