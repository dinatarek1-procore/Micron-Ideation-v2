import { themeAlpine } from 'ag-grid-enterprise';

/**
 * Matches `@procore/smart-grid-core` alpine params. AG Grid 35+ expects a Theme
 * object (not `theme="legacy"`) so paging and other chrome get CSS variables.
 */
const colors = {
  alpineActiveColor: '#2066df',
  backgroundColor: '#ffffff',
  borderColor: '#d6dadc',
  headerBackgroundColor: '#f4f5f6',
  oddRowBackgroundColor: '#ffffff',
  rowBorderColor: '#d6dadc',
  rowHoverColor: '#f4f5f6',
  selectedRowBackgroundColor: '#f9fafa',
  rangeSelectionBackgroundColor: '#e4ecfb',
};

export const smartGridAgTheme = themeAlpine.withParams({
  accentColor: colors.alpineActiveColor,
  backgroundColor: colors.backgroundColor,
  borderColor: colors.borderColor,
  headerBackgroundColor: colors.headerBackgroundColor,
  oddRowBackgroundColor: colors.oddRowBackgroundColor,
  rowHoverColor: colors.rowHoverColor,
  selectedRowBackgroundColor: colors.selectedRowBackgroundColor,
  rowBorder: { color: colors.rowBorderColor },
  rangeSelectionBackgroundColor: colors.rangeSelectionBackgroundColor,
  /** Sized to the intrinsic width of the filter Panel (Clear All / inputs / Apply) so the card fills the toolpanel without dead space and leaves more room for the grid. */
  sideBarPanelWidth: '320px',
});
