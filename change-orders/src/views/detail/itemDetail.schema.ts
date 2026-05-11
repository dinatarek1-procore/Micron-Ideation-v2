import type { JsonSchema, UiSchema } from '@procore/json-formulator';

import type { Item } from '@/mockServer/itemsStore';
import {
  getItemEditSchema,
  getItemEditUiSchema,
  pickItemEditFormData,
} from '@/views/edit/itemEdit.schema';

/** Row fields surfaced in the tool landing split-panel detail form. */
export type ToolLandingDetailFormSource = {
  status: string;
  dueDate: string;
  assignee: string;
  description: string;
  responsibleOrg: string;
  recordedOn: string;
  divisionCode: string;
  priority: string;
};

function withAllPropertiesReadOnly(schema: JsonSchema): JsonSchema {
  if (schema.type !== 'object' || !schema.properties) {
    return schema;
  }
  const properties: Record<string, JsonSchema> = {};
  for (const [key, def] of Object.entries(schema.properties)) {
    if (def && typeof def === 'object' && !Array.isArray(def)) {
      properties[key] = { ...(def as object), readOnly: true } as JsonSchema;
    } else {
      properties[key] = def as JsonSchema;
    }
  }
  return { ...schema, properties };
}

export function getItemDetailGeneralSchema(): JsonSchema {
  return withAllPropertiesReadOnly(getItemEditSchema());
}

export function getItemDetailGeneralUiSchema(): UiSchema {
  const base = getItemEditUiSchema() as Record<string, unknown>;
  const opts =
    (base['ui:options'] as Record<string, unknown> | undefined) ?? {};
  return {
    ...base,
    'ui:options': {
      ...opts,
      description: 'Core item fields (read-only).',
    },
  } as UiSchema;
}

const col = (start: number, width = 3) => ({
  colStart: start,
  colWidth: width,
});

export function getItemDetailCommercialSchema(): JsonSchema {
  return {
    type: 'object',
    properties: {
      priority: { type: 'string', title: 'Priority', readOnly: true },
      recordedOn: { type: 'string', title: 'Recorded On', readOnly: true },
      responsibleOrg: {
        type: 'string',
        title: 'Responsible Org',
        readOnly: true,
      },
      divisionCode: { type: 'string', title: 'Division', readOnly: true },
      cost: { type: 'number', title: 'Cost', readOnly: true },
      summary: { type: 'string', title: 'Summary', readOnly: true },
      referenceCode: {
        type: 'string',
        title: 'Reference Code',
        readOnly: true,
      },
    },
  };
}

export function getItemDetailCommercialUiSchema(): UiSchema {
  return {
    'ui:submitButtonOptions': { norender: true },
    'ui:options': {
      core: {
        layout: {
          rows: [
            {
              priority: col(1),
              recordedOn: col(4),
              responsibleOrg: col(7),
              divisionCode: col(10),
            },
            {
              cost: col(1),
              summary: col(4),
              referenceCode: col(7),
            },
          ],
        },
      },
    },
  };
}

export function pickItemDetailFormData(item: Item) {
  return {
    ...pickItemEditFormData(item),
    priority: item.priority ?? '',
    recordedOn: item.recordedOn ?? '',
    responsibleOrg: item.responsibleOrg ?? '',
    divisionCode: item.divisionCode ?? '',
    cost:
      typeof item.cost === 'number' && !Number.isNaN(item.cost) ? item.cost : 0,
    summary: item.summary ?? '',
    referenceCode: item.referenceCode ?? '',
  };
}

export function getToolLandingDetailSchema(): JsonSchema {
  return {
    type: 'object',
    properties: {
      status: { type: 'string', title: 'State', readOnly: true },
      dueDate: { type: 'string', title: 'Due', readOnly: true },
      assignee: { type: 'string', title: 'Owner', readOnly: true },
      description: { type: 'string', title: 'Description', readOnly: true },
      responsibleOrg: {
        type: 'string',
        title: 'Organization',
        readOnly: true,
      },
      recordedOn: { type: 'string', title: 'Recorded', readOnly: true },
      divisionCode: { type: 'string', title: 'Group', readOnly: true },
      priority: { type: 'string', title: 'Priority', readOnly: true },
    },
  };
}

export function getToolLandingDetailUiSchema(): UiSchema {
  return {
    'ui:submitButtonOptions': { norender: true },
    'ui:options': {
      core: {
        layout: {
          rows: [
            {
              status: col(1),
              dueDate: col(4),
              assignee: col(7),
              priority: col(10),
            },
            {
              description: { colStart: 1, colWidth: 12 },
            },
            {
              responsibleOrg: col(1),
              recordedOn: col(4),
              divisionCode: col(7),
            },
          ],
        },
      },
    },
  };
}

export function pickToolLandingDetailFormData(
  row: ToolLandingDetailFormSource
) {
  return {
    status: row.status,
    dueDate: row.dueDate,
    assignee: row.assignee,
    description: row.description,
    responsibleOrg: row.responsibleOrg,
    recordedOn: row.recordedOn,
    divisionCode: row.divisionCode,
    priority: row.priority,
  };
}
