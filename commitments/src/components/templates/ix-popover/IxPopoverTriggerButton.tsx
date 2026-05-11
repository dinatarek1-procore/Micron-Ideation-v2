/**
 * Default trigger for `IxQuickPopover` — a real `<button>`, not a link.
 * Forwards ref so `@procore/core-react` `Popover` can anchor the overlay.
 * Full rules: `REFERENCE.md` (Popover section).
 */

import { Button, type ButtonProps } from '@procore/core-react';
import { forwardRef } from 'react';

export const IxPopoverTriggerButton = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function IxPopoverTriggerButton(
  { type = 'button', variant = 'secondary', ...rest },
  ref
) {
  return <Button ref={ref} type={type} variant={variant} {...rest} />;
});

IxPopoverTriggerButton.displayName = 'IxPopoverTriggerButton';
