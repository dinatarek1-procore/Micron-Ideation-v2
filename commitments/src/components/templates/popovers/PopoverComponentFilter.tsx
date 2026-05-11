/**
 * Filter control + generic filter popover for toolbars (same surface pattern as Configure).
 */

import {
  ConfigurationPopoverContent,
  type ConfigurationPopoverConfig,
  IxPopoverTriggerButton,
  IxQuickPopover,
} from '@/components/templates/ix-popover';
import { Filter } from '@procore/core-icons';
import type { ReactNode } from 'react';

export const DEFAULT_FILTER_POPOVER_CONFIG: ConfigurationPopoverConfig = {
  title: 'Filter',
  subtitle: 'Refine which rows are shown.',
  items: [
    { id: 'filter-a', label: 'Filter option A' },
    { id: 'filter-b', label: 'Filter option B' },
    { id: 'filter-c', label: 'Filter option C' },
    { id: 'filter-d', label: 'Filter option D' },
  ],
};

export type FilterToolbarPopoverButtonProps = {
  config?: ConfigurationPopoverConfig;
  onSave?: (values: Record<string, boolean>) => void;
  /** Rich body (e.g. json-formulator). When set, `config` / default toggles are ignored. */
  content?: ReactNode;
  /** Shown after the label, e.g. `Filter (3)`. */
  activeCount?: number;
  /** Popover surface width in px (default 300; use 360 for Formulator filter forms). */
  width?: number;
};

export function FilterToolbarPopoverButton({
  config = DEFAULT_FILTER_POPOVER_CONFIG,
  onSave,
  content,
  activeCount,
  width,
}: FilterToolbarPopoverButtonProps) {
  const countSuffix =
    activeCount != null && activeCount > 0 ? ` (${activeCount})` : '';
  const label = `Filter${countSuffix}`;

  return (
    <IxQuickPopover
      placement="bottom-left"
      aria-label={label}
      width={width}
      content={
        content ?? (
          <ConfigurationPopoverContent config={config} onSave={onSave} />
        )
      }
    >
      <IxPopoverTriggerButton variant="secondary" icon={<Filter />}>
        {label}
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
