import type { AnyUISchema } from '@procore/json-tabulator';
import type { TypedI18n } from '@procore/json-toolinator';

import listUiSchemaJson from '../../blueprints/reference-scaffold/list.uiSchema.json';
import type { Translations } from '../shared/translations.types';
import { TitleCellRenderer } from '../views/list/titleCell';

/** Maps list column field names to en.json keys (blueprint JSON keeps English fallbacks). */
const LIST_COLUMN_I18N = {
  title: 'tool.views.list.columns.title',
  status: 'tool.views.list.columns.status',
  priority: 'tool.views.list.columns.priority',
  assignee: 'tool.views.list.columns.assignee',
  category: 'tool.views.list.columns.category',
  due_date: 'tool.views.list.columns.dueDate',
} as const;

/**
 * Builds the live Tabulator UI schema from `blueprints/reference-scaffold/list.uiSchema.json`,
 * applying i18n titles and the real title cell renderer (replaces `@TitleCellRenderer`).
 */
export function buildReferenceListUiSchema(
  i18n: TypedI18n<Translations>,
  pageSize: number
): AnyUISchema {
  const ui = structuredClone(listUiSchemaJson) as Record<string, unknown>;

  for (const field of Object.keys(LIST_COLUMN_I18N) as Array<
    keyof typeof LIST_COLUMN_I18N
  >) {
    const i18nKey = LIST_COLUMN_I18N[field];
    const node = ui[field];
    if (!node || typeof node !== 'object') continue;
    const opts = {
      ...((node as { 'ui:options'?: Record<string, unknown> })['ui:options'] ??
        {}),
    };
    opts.title = i18n.t(i18nKey);
    if (field === 'title') {
      opts.cell = TitleCellRenderer;
    }
    (node as { 'ui:options': Record<string, unknown> })['ui:options'] = opts;
  }

  const rootOpts = {
    ...((ui['ui:options'] as Record<string, unknown> | undefined) ?? {}),
    pagination: { pageSize },
  };
  ui['ui:options'] = rootOpts;

  return ui as AnyUISchema;
}
