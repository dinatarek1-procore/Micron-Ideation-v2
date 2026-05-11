import type { ColumnConfigureRow } from '@/components/templates/ix-popover/ColumnConfigurePopoverContent';

/** localStorage key for Smart Grid column order, visibility, and row height (list / new tool). */
export const LIST_SMART_GRID_TOOLBAR_CONFIG_KEY =
  'prototype-tool-new-smart-grid-config-v1';

/** localStorage key for Tool landing generic Smart Grid toolbar config. */
export const TOOL_LANDING_SMART_GRID_TOOLBAR_CONFIG_KEY =
  'prototype-tool-landing-generic-smart-grid-config-v1';

export const TOOL_LANDING_RECYCLE_SMART_GRID_TOOLBAR_CONFIG_KEY =
  'prototype-tool-landing-generic-smart-grid-recycle-config-v1';

export type StoredSmartGridToolbarConfigV1 = {
  version: 1;
  columns: ColumnConfigureRow[];
  rowHeight: number;
};

export function readStoredSmartGridToolbarConfig(
  key: string
): StoredSmartGridToolbarConfigV1 | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSmartGridToolbarConfigV1;
    if (parsed?.version !== 1 || !Array.isArray(parsed.columns)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredSmartGridToolbarConfig(
  key: string,
  payload: StoredSmartGridToolbarConfigV1
): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    /* ignore quota / private mode */
  }
}
