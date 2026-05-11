/**
 * Configure control + configuration popover for toolbars (e.g. table chrome).
 * Re-exports IX popover primitives for discovery; prefer `@/components/ix-popover` for tree-shaking-only imports.
 */

import {
  ConfigurationPopoverContent,
  type ConfigurationPopoverConfig,
  IxPopoverTriggerButton,
  IxQuickPopover,
} from '@/components/templates/ix-popover';
import { Sliders } from '@procore/core-icons';
import type { ReactNode } from 'react';

export const DEFAULT_CONFIGURE_POPOVER_CONFIG: ConfigurationPopoverConfig = {
  title: 'Configuration',
  subtitle: 'Toggle options for this view.',
  items: [
    { id: 'opt-1', label: 'Option 1' },
    { id: 'opt-2', label: 'Option 2' },
    { id: 'opt-3', label: 'Option 3' },
    { id: 'opt-4', label: 'Option 4' },
  ],
};

export type ConfigureToolbarPopoverButtonProps = {
  config?: ConfigurationPopoverConfig;
  onSave?: (values: Record<string, boolean>) => void;
  /** Rich body (e.g. column configure + density). When set, `config` is ignored. */
  content?: ReactNode;
  /** Popover surface width in px (default 300). */
  width?: number;
};

/** Same look as the toolbar Configure control; opens `ConfigurationPopoverContent` on click. */
export function ConfigureToolbarPopoverButton({
  config = DEFAULT_CONFIGURE_POPOVER_CONFIG,
  onSave,
  content,
  width,
}: ConfigureToolbarPopoverButtonProps) {
  return (
    <IxQuickPopover
      placement="bottom-right"
      aria-label="Configuration"
      width={width}
      content={
        content ?? (
          <ConfigurationPopoverContent config={config} onSave={onSave} />
        )
      }
    >
      <IxPopoverTriggerButton variant="secondary" icon={<Sliders />}>
        Configure
      </IxPopoverTriggerButton>
    </IxQuickPopover>
  );
}

export {
  ConfigurationPopoverContent,
  IxPopoverTriggerButton,
  IxQuickPopover,
} from '@/components/templates/ix-popover';
export type {
  ConfigurationPopoverConfig,
  ConfigurationPopoverContentProps,
  IxQuickPopoverProps,
} from '@/components/templates/ix-popover';
