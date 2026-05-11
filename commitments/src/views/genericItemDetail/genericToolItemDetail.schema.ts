import type { JsonSchema, UiSchema } from '@procore/json-formulator';

const col = (start: number, width = 3) => ({
  colStart: start,
  colWidth: width,
});

/** Static demo record for the generic RFI-style detail shell (not Mirage-backed). */
export const GENERIC_DEMO_RECORD = {
  number: 'RFI-001',
  dueDate: 'Jan 14, 2025',
  manager: 'Melissa McCarthy',
  status: 'Open',
  receivedFrom: '—',
  assignees: 'Arthur Vandelay (Art Vandelay Architecture & Planning)',
  distributionList: '—',
  ballInCourt: 'Assignees',
  responsibleContractor: '—',
  specSection: '—',
  location: '—',
  createdBy: 'Tony Van Groningen',
  subJob: '—',
  dateInitiated: 'Dec 15, 2024',
  costCode: '—',
  scheduleImpact: '—',
  costImpact: '—',
  reference: '—',
  privateChecked: false,
} as const;

export type GenericToolItemDetailFormData = {
  number: string;
  dueDate: string;
  manager: string;
  status: string;
  receivedFrom: string;
  assignees: string;
  distributionList: string;
  ballInCourt: string;
  responsibleContractor: string;
  specSection: string;
  location: string;
  createdBy: string;
  subJob: string;
  dateInitiated: string;
  costCode: string;
  scheduleImpact: string;
  costImpact: string;
  reference: string;
  privateChecked: boolean;
};

export function pickGenericToolItemDetailFormData(
  record: typeof GENERIC_DEMO_RECORD
): GenericToolItemDetailFormData {
  return {
    number: record.number,
    dueDate: record.dueDate,
    manager: record.manager,
    status: record.status,
    receivedFrom: record.receivedFrom,
    assignees: record.assignees,
    distributionList: record.distributionList,
    ballInCourt: record.ballInCourt,
    responsibleContractor: record.responsibleContractor,
    specSection: record.specSection,
    location: record.location,
    createdBy: record.createdBy,
    subJob: record.subJob,
    dateInitiated: record.dateInitiated,
    costCode: record.costCode,
    scheduleImpact: record.scheduleImpact,
    costImpact: record.costImpact,
    reference: record.reference,
    privateChecked: Boolean(record.privateChecked),
  };
}

const ro = { readOnly: true } as const;

export function getGenericToolItemDetailGeneralSchema(): JsonSchema {
  return {
    type: 'object',
    properties: {
      number: { type: 'string', title: 'Number', ...ro },
      dueDate: { type: 'string', title: 'Due Date', ...ro },
      manager: { type: 'string', title: 'Manager', ...ro },
      status: { type: 'string', title: 'Status', ...ro },
      receivedFrom: { type: 'string', title: 'Received From', ...ro },
      assignees: { type: 'string', title: 'Assignees', ...ro },
      distributionList: {
        type: 'string',
        title: 'Distribution List',
        ...ro,
      },
      ballInCourt: { type: 'string', title: 'Ball In Court', ...ro },
      responsibleContractor: {
        type: 'string',
        title: 'Responsible Contractor',
        ...ro,
      },
      specSection: { type: 'string', title: 'Spec Section', ...ro },
      location: { type: 'string', title: 'Location', ...ro },
      createdBy: { type: 'string', title: 'Created By', ...ro },
      subJob: { type: 'string', title: 'Sub Job', ...ro },
      dateInitiated: { type: 'string', title: 'Date Initiated', ...ro },
      costCode: { type: 'string', title: 'Cost Code', ...ro },
      scheduleImpact: { type: 'string', title: 'Schedule Impact', ...ro },
      costImpact: { type: 'string', title: 'Cost Impact', ...ro },
      reference: { type: 'string', title: 'Reference', ...ro },
      privateChecked: { type: 'boolean', title: 'Private', readOnly: true },
    },
  };
}

export function getGenericToolItemDetailGeneralUiSchema(): UiSchema {
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
              responsibleContractor: col(1),
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
    },
    privateChecked: {
      'ui:widget': 'checkbox',
    },
  };
}
