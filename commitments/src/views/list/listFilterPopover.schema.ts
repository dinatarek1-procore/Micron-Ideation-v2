import type { JsonSchema, UiSchema } from '@procore/json-formulator';

import {
  LIST_DIVISION_SELECT_PARAMS,
  LIST_QUICK_ASSIGNEE_OPTIONS,
  LIST_QUICK_STATUS_OPTIONS,
} from './listSmartGridColumnDefs';
import { emptySmartGridToolbarFilterFormData } from './smartGridFilterMapping';

const fullRow = { colStart: 1, colWidth: 12 };
const halfLeft = { colStart: 1, colWidth: 6 };
const halfRight = { colStart: 7, colWidth: 6 };

function statusEnum(): string[] {
  return LIST_QUICK_STATUS_OPTIONS.filter((o) => o.id !== '').map((o) => o.id);
}

function assigneeEnum(): string[] {
  return LIST_QUICK_ASSIGNEE_OPTIONS.filter((o) => o.id !== '').map(
    (o) => o.id
  );
}

function divisionEnum(): string[] {
  return LIST_DIVISION_SELECT_PARAMS.options.map((o) => o.id);
}

export function getMirageListFilterPopoverSchema(): JsonSchema {
  return {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        title: 'State',
        enum: [...statusEnum()],
      },
      assignee: {
        type: 'string',
        title: 'Owner',
        enum: [...assigneeEnum()],
      },
      divisionCode: {
        type: 'string',
        title: 'Group',
        enum: [...divisionEnum()],
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

export function getMirageListFilterPopoverUiSchema(): UiSchema {
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

export function getMirageListFilterPopoverInitialData() {
  return emptySmartGridToolbarFilterFormData();
}
