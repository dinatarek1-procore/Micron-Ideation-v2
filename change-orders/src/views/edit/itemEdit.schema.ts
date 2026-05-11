import type { JsonSchema, UiSchema } from '@procore/json-formulator';

import type { Item } from '@/mockServer/itemsStore';

const col = (start: number, width = 3) => ({
  colStart: start,
  colWidth: width,
});

/** Matches `seed.json` item `status` values and list Smart Grid filters. */
const ITEM_STATUS_ENUM = ['Open', 'Closed', 'In Progress'] as const;

/** Subset of `Item` edited on the general edit form (schema-driven). */
export type ItemEditFormData = Pick<
  Item,
  | 'number'
  | 'dueDate'
  | 'manager'
  | 'status'
  | 'receivedFrom'
  | 'assignees'
  | 'distributionList'
  | 'ballInCourt'
  | 'contractor'
  | 'specSection'
  | 'location'
  | 'createdBy'
  | 'subJob'
  | 'dateInitiated'
  | 'costCode'
  | 'scheduleImpact'
  | 'costImpact'
  | 'reference'
  | 'privateChecked'
>;

export function pickItemEditFormData(item: Item): ItemEditFormData {
  return {
    number: item.number,
    dueDate: item.dueDate ?? '',
    manager: item.manager ?? '',
    status: item.status ?? 'Open',
    receivedFrom: item.receivedFrom ?? '',
    assignees: Array.isArray(item.assignees) ? [...item.assignees] : [],
    distributionList: Array.isArray(item.distributionList)
      ? [...item.distributionList]
      : [],
    ballInCourt: item.ballInCourt ?? '',
    contractor: item.contractor ?? '',
    specSection: item.specSection ?? '',
    location: item.location ?? '',
    createdBy: item.createdBy ?? '',
    subJob: item.subJob ?? '',
    dateInitiated: item.dateInitiated ?? '',
    costCode: item.costCode ?? '',
    scheduleImpact: item.scheduleImpact ?? '',
    costImpact: item.costImpact ?? '',
    reference: item.reference ?? '',
    privateChecked: Boolean(item.privateChecked),
  };
}

/**
 * Edit form schema aligned with Mirage `Item` / `seed.json` (free-text demo fields).
 * Avoids `oneOf`/`const` option lists that do not match seeded values, which caused
 * immediate AJV errors on load when paired with `liveValidate`.
 */
export function getItemEditSchema(): JsonSchema {
  return {
    type: 'object',
    properties: {
      number: { type: 'string', title: 'Number' },
      dueDate: { type: 'string', title: 'Due Date', format: 'date' },
      manager: { type: 'string', title: 'Manager' },
      status: {
        type: 'string',
        title: 'Status',
        enum: [...ITEM_STATUS_ENUM],
      },
      receivedFrom: { type: 'string', title: 'Received From' },
      assignees: {
        type: 'array',
        title: 'Assignees',
        uniqueItems: true,
        items: { type: 'string' },
      },
      distributionList: {
        type: 'array',
        title: 'Distribution List',
        uniqueItems: true,
        items: { type: 'string' },
      },
      ballInCourt: {
        type: 'string',
        title: 'Ball In Court',
        readOnly: true,
      },
      contractor: { type: 'string', title: 'Responsible Contractor' },
      specSection: { type: 'string', title: 'Spec Section' },
      location: { type: 'string', title: 'Location' },
      createdBy: {
        type: 'string',
        title: 'Created By',
        readOnly: true,
      },
      subJob: { type: 'string', title: 'Sub Job' },
      dateInitiated: {
        type: 'string',
        title: 'Date Initiated',
        format: 'date',
      },
      costCode: { type: 'string', title: 'Cost Code' },
      scheduleImpact: { type: 'string', title: 'Schedule Impact' },
      costImpact: { type: 'string', title: 'Cost Impact' },
      reference: { type: 'string', title: 'Reference' },
      privateChecked: { type: 'boolean', title: 'Private' },
    },
  };
}

export function getItemEditUiSchema(): UiSchema {
  return {
    'ui:submitButtonOptions': { norender: true },
    'ui:options': {
      core: {
        layout: {
          rows: [
            {
              number: col(1),
              dueDate: col(4),
              manager: col(7),
              status: col(10),
            },
            {
              receivedFrom: col(1),
              assignees: col(4),
              distributionList: col(7),
              ballInCourt: col(10),
            },
            {
              contractor: col(1),
              specSection: col(4),
              location: col(7),
              createdBy: col(10),
            },
            {
              subJob: col(1),
              dateInitiated: col(4),
              costCode: col(7),
              scheduleImpact: col(10),
            },
            {
              costImpact: col(1),
              reference: col(4),
            },
            {
              privateChecked: { colStart: 1, colWidth: 12 },
            },
          ],
        },
      },
      description: 'Edit item fields (schema-driven form).',
    },
    dueDate: { 'ui:widget': 'date' },
    dateInitiated: { 'ui:widget': 'date' },
    status: {
      'ui:widget': 'select',
      'ui:options': { onClear: false },
    },
    privateChecked: {
      'ui:widget': 'checkbox',
    },
  };
}
