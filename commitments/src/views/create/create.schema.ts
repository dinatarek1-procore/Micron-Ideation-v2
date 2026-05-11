import type { JsonSchema, UiSchema } from '@procore/json-formulator';

const logEnum = ['Manpower', 'Equipment', 'Materials'] as const;

const companyEnum = [
  'North Coast Builders',
  'Sunrise Electric',
  'Harbor Steel Co.',
] as const;

const locationEnum = ['Site A', 'Site B', 'Warehouse'] as const;

const tradeEnum = ['Concrete', 'Electrical', 'Plumbing'] as const;

const fullRow = { colStart: 1, colWidth: 12 };
const colLeft = { colStart: 1, colWidth: 6 };
const colRight = { colStart: 7, colWidth: 6 };

/** File entry shape accepted by ConnectedFileSelect (see json-formulator-extensions stories). */
export type CreateAttachmentEntry = {
  id?: string;
  name?: string;
  [key: string]: unknown;
};

export type CreateFormData = {
  log: string;
  date: string;
  company?: string;
  workers: number;
  hours: number;
  totalHours: number;
  location?: string;
  trade?: string;
  comments?: string;
  attachments?: CreateAttachmentEntry[];
};

function defaultDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Default form values for the Manpower-style create entry tearsheet. */
export function getCreateInitialData(): CreateFormData {
  return {
    log: 'Manpower',
    date: defaultDate(),
    workers: 0,
    hours: 0,
    totalHours: 0,
    comments: '',
    attachments: [],
  };
}

/**
 * Manpower log entry form (Create Entry). Uses json-formulator section layout
 * (`variant: 'panel'`) so each group renders as a `Panel.Section` card.
 */
export function getCreateSchema(): JsonSchema {
  return {
    type: 'object',
    required: ['workers', 'hours'],
    properties: {
      log: {
        type: 'string',
        title: 'Log',
        default: 'Manpower',
        enum: [...logEnum],
      },
      date: {
        type: 'string',
        title: 'Date',
        format: 'date',
        description: 'Date the work occurred.',
        default: defaultDate(),
      },
      company: {
        type: 'string',
        title: 'Company',
        enum: [...companyEnum],
      },
      workers: {
        type: 'number',
        title: 'Workers',
        default: 0,
        minimum: 0,
      },
      hours: {
        type: 'number',
        title: 'Hours',
        default: 0,
        minimum: 0,
      },
      totalHours: {
        type: 'number',
        title: 'Total Hours',
        readOnly: true,
        default: 0,
      },
      location: {
        type: 'string',
        title: 'Location',
        enum: [...locationEnum],
      },
      trade: {
        type: 'string',
        title: 'Trade',
        enum: [...tradeEnum],
      },
      comments: {
        type: 'string',
        title: 'Comments',
      },
      attachments: {
        type: 'array',
        title: 'Attachments',
        items: { type: 'object' },
        default: [],
      },
    },
  };
}

export type CreateUiSchemaContext = {
  companyId: number;
  companyName?: string;
};

export function getCreateUiSchema(ctx: CreateUiSchemaContext): UiSchema {
  const companyName = ctx.companyName ?? 'Prototype company';

  return {
    'ui:submitButtonOptions': { norender: true },
    'ui:options': {
      core: {
        layout: {
          variant: 'panel',
          sections: [
            {
              rows: [{ log: colLeft, date: colRight }],
            },
            {
              rows: [{ company: fullRow }],
            },
            {
              rows: [
                { workers: colLeft, hours: colRight },
                { totalHours: fullRow },
              ],
            },
            {
              rows: [{ location: fullRow }, { trade: fullRow }],
            },
            {
              rows: [{ comments: fullRow }],
            },
            {
              rows: [{ attachments: fullRow }],
            },
          ],
        },
      },
    },
    log: {
      'ui:widget': 'select',
      'ui:options': { onClear: false },
    },
    date: { 'ui:widget': 'date' },
    company: {
      'ui:widget': 'select',
      'ui:options': { placeholder: 'Select' },
    },
    workers: {
      'ui:widget': 'number',
      'ui:options': { step: 1 },
    },
    hours: {
      'ui:widget': 'number',
      'ui:options': { step: 1 },
    },
    location: {
      'ui:widget': 'select',
      'ui:options': { placeholder: 'Select' },
    },
    trade: {
      'ui:widget': 'select',
      'ui:options': { placeholder: 'Select' },
    },
    comments: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 4,
        placeholder: 'Leave a comment or note here.',
      },
    },
    attachments: {
      'ui:options': {
        widget: 'connectedFileSelect',
        company: { id: ctx.companyId, name: companyName },
      },
    },
  };
}
