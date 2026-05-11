import type { JsonSchema, UiSchema } from '@procore/json-formulator';

import { emptySmartGridToolbarFilterFormData } from '@/views/list/smartGridFilterMapping';

const fullRow = { colStart: 1, colWidth: 12 };
const halfLeft = { colStart: 1, colWidth: 6 };
const halfRight = { colStart: 7, colWidth: 6 };

const GENERIC_STATUS_ENUM = ['Open', 'Closed', 'In Progress'] as const;

const GENERIC_DIVISION_ENUM = [
  'Operations',
  'Field',
  'HQ',
  'Estimating',
] as const;

const GENERIC_ASSIGNEE_ENUM = [
  'Jamie Ortiz',
  'Morgan Lee',
  'Riley Chen',
  'Sam Patel',
  'Taylor Brooks',
  'Jordan Ng',
] as const;

export function getToolLandingGenericFilterPopoverSchema(): JsonSchema {
  return {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        title: 'State',
        enum: [...GENERIC_STATUS_ENUM],
      },
      assignee: {
        type: 'string',
        title: 'Owner',
        enum: [...GENERIC_ASSIGNEE_ENUM],
      },
      divisionCode: {
        type: 'string',
        title: 'Group',
        enum: [...GENERIC_DIVISION_ENUM],
      },
      referenceCode: {
        type: 'string',
        title: 'Reference',
      },
      dueDateFrom: {
        type: 'string',
        title: 'Due from',
        format: 'date',
      },
      dueDateTo: {
        type: 'string',
        title: 'Due to',
        format: 'date',
      },
    },
  };
}

export function getToolLandingGenericFilterPopoverUiSchema(): UiSchema {
  return {
    'ui:submitButtonOptions': { norender: true },
    'ui:options': {
      core: {
        layout: {
          variant: 'panel',
          sections: [
            { rows: [{ status: halfLeft, assignee: halfRight }] },
            { rows: [{ divisionCode: fullRow }] },
            { rows: [{ referenceCode: fullRow }] },
            { rows: [{ dueDateFrom: halfLeft, dueDateTo: halfRight }] },
          ],
        },
      },
    },
    status: {
      'ui:widget': 'select',
      'ui:options': { placeholder: 'All' },
    },
    assignee: {
      'ui:widget': 'select',
      'ui:options': { placeholder: 'Any' },
    },
    divisionCode: {
      'ui:widget': 'select',
      'ui:options': { placeholder: 'Any group' },
    },
    referenceCode: {
      'ui:options': { placeholder: 'Contains…' },
    },
    dueDateFrom: { 'ui:widget': 'date' },
    dueDateTo: { 'ui:widget': 'date' },
  };
}

export function getToolLandingGenericFilterPopoverInitialData() {
  return emptySmartGridToolbarFilterFormData();
}
