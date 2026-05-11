import type { JsonSchema, UiSchema } from '@procore/json-formulator';

const settings1OneOf = [
  { const: 'option_a', title: 'Option A' },
  { const: 'option_b', title: 'Option B' },
  { const: 'option_c', title: 'Option C' },
];

/** Full schema (e.g. tests, API typing); General tab renders primary + text as two anchor sections. */
export function getSettingsGeneralSchema(): JsonSchema {
  return {
    type: 'object',
    properties: {
      settings_1: {
        type: 'string',
        oneOf: settings1OneOf,
      },
      settings_2: { type: 'string' },
      settings_3: { type: 'string' },
      settings_4: { type: 'string' },
    },
    required: ['settings_1'],
  };
}

export function getSettingsPrimarySchema(): JsonSchema {
  return {
    type: 'object',
    properties: {
      settings_1: {
        type: 'string',
        oneOf: settings1OneOf,
      },
      settings_2: { type: 'string' },
    },
    required: ['settings_1'],
  };
}

export function getSettingsTextSchema(): JsonSchema {
  return {
    type: 'object',
    properties: {
      settings_3: { type: 'string' },
      settings_4: { type: 'string' },
    },
  };
}

export function getSettingsGeneralUiSchema(): UiSchema {
  return {
    'ui:submitButtonOptions': { norender: true },
    'ui:options': {
      core: {
        layout: {
          rows: [
            {
              settings_1: {
                colStart: 1,
                colWidth: 4,
              },
            },
            { settings_2: { colStart: 1 } },
            { settings_3: { colStart: 1 } },
            { settings_4: { colStart: 1 } },
          ],
        },
      },
      title: 'General',
      description:
        'Generic settings demo: one select and three string fields (two multi-line) for layout and validation patterns.',
    },
    settings_1: {
      'ui:widget': 'select',
      'ui:options': {
        default: 'option_a',
        onClear: false,
        title: 'Settings 1',
      },
    },
    settings_2: {
      'ui:widget': 'textarea',
      'ui:options': { title: 'Settings 2', rows: 3 },
    },
    settings_3: {
      'ui:widget': 'textarea',
      'ui:options': { title: 'Settings 3', rows: 4 },
    },
    settings_4: {
      'ui:options': { title: 'Settings 4' },
    },
  };
}

export function getSettingsPrimaryUiSchema(): UiSchema {
  return {
    'ui:submitButtonOptions': { norender: true },
    'ui:options': {
      core: {
        layout: {
          rows: [
            { settings_1: { colStart: 1, colWidth: 4 } },
            { settings_2: { colStart: 1 } },
          ],
        },
      },
      title: 'Primary fields',
      description: 'Select and first text area (Settings 1 and Settings 2).',
    },
    settings_1: {
      'ui:widget': 'select',
      'ui:options': {
        default: 'option_a',
        onClear: false,
        title: 'Settings 1',
      },
    },
    settings_2: {
      'ui:widget': 'textarea',
      'ui:options': { title: 'Settings 2', rows: 3 },
    },
  };
}

export function getSettingsTextUiSchema(): UiSchema {
  return {
    'ui:submitButtonOptions': { norender: true },
    'ui:options': {
      core: {
        layout: {
          rows: [
            { settings_3: { colStart: 1 } },
            { settings_4: { colStart: 1 } },
          ],
        },
      },
      title: 'Text fields',
      description:
        'Second textarea and single-line field (Settings 3 and Settings 4).',
    },
    settings_3: {
      'ui:widget': 'textarea',
      'ui:options': { title: 'Settings 3', rows: 4 },
    },
    settings_4: {
      'ui:options': { title: 'Settings 4' },
    },
  };
}
