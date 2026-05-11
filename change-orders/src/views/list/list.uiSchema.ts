import type { AnyUISchema } from '@procore/json-tabulator';

import { buildPrototypeToolListUiSchema } from './buildPrototypeToolListUiSchema';

/**
 * Live uiSchema for the list `table` feature: blueprint columns + title cell renderer,
 * with pagination page size from the tool blueprint.
 */
export function buildListUiSchema(pageSize: number): AnyUISchema {
  const ui = buildPrototypeToolListUiSchema() as Record<string, unknown>;
  ui['ui:tableOptions'] = {
    ...((ui['ui:tableOptions'] as Record<string, unknown> | undefined) ?? {}),
    pagination: true,
    paginationPageSize: pageSize,
  };
  return ui as AnyUISchema;
}
