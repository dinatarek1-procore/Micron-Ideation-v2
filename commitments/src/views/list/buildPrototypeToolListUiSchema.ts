import dataSchema from '../../../blueprints/prototype-tool/data.schema.json';
import listUi from '../../../blueprints/prototype-tool/list.uiSchema.json';
import { GUARDRAILS } from '../../shared/guardrails';

import { TitleCellRenderer } from './titleCell';

const hiddenColumn = { 'ui:options': { cell: null } };

export function buildPrototypeToolListUiSchema(): Record<string, unknown> {
  const props = Object.keys(
    (dataSchema as { properties?: Record<string, unknown> }).properties ?? {}
  );
  const keep = new Set<string>(
    GUARDRAILS.ITEM_SCHEMA.LIST_COLUMNS as readonly string[]
  );
  const base = { ...(listUi as Record<string, unknown>) };
  const listFieldOptions =
    (base['ui:options'] as Record<string, unknown> | undefined) ?? {};
  const out: Record<string, unknown> = { ...base };

  for (const key of props) {
    if (!keep.has(key)) {
      out[key] = hiddenColumn;
    }
  }

  const summaryBase =
    (listFieldOptions.summary as Record<string, unknown> | undefined) ?? {};
  out.summary = {
    'ui:options': {
      ...summaryBase,
      cell: TitleCellRenderer,
    },
  };

  return out;
}
