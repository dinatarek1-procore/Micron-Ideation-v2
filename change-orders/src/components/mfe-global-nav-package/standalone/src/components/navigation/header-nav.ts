/** Popover / portal panel surface (light dropdowns — not full ToolMenu) */
export const HEADER_DROPDOWN_PANEL_CLASS = 'header-dropdown-panel';

/**
 * Legacy StyledPicker shell: 40px row, 4px radius, gray fill from index.css [data-legacy-picker].
 * Use with `data-legacy-picker` on the button.
 */
export const HEADER_LEGACY_PICKER_BUTTON_CLASS =
  'flex min-h-10 w-full min-w-0 flex-col items-stretch gap-0 px-2 py-1 text-left outline-none';

export const HEADER_LEGACY_PICKER_LABEL_CLASS =
  'text-[12px] font-light leading-tight tracking-[0.4px] text-white/70';

export const HEADER_LEGACY_PICKER_VALUE_CLASS =
  'truncate text-sm font-normal leading-tight text-white';

/** Narrow tool / apps pickers (~140px flex-basis in legacy) */
export const HEADER_LEGACY_PICKER_NARROW_CLASS = 'max-w-[140px]';

/** @deprecated Use HEADER_LEGACY_PICKER_* + data-legacy-picker */
export const HEADER_NAV_TRIGGER_CLASS = HEADER_LEGACY_PICKER_BUTTON_CLASS;
