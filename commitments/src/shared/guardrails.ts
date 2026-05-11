/**
 * Guardrail constants for the prototype blueprint simulator.
 * These define the expected counts and structure for validation.
 */

export const GUARDRAILS = {
  VIEWS: {
    EXPECTED_COUNT: 20,
    NAMES: [
      'create',
      'detail',
      'edit',
      'genericItemDetail',
      'genericItemEmails',
      'genericItemHistory',
      'genericItemRelatedItems',
      'home',
      'hub',
      'itemDocuments',
      'itemEmails',
      'itemHistory',
      'itemRelatedItems',
      'list',
      'listRecycle',
      'permissions',
      'settings',
      'settingsPermissions',
      'toolLanding',
      'toolLandingRecycle',
    ] as const,
  },

  MOCK_SERVER: {
    /** Rows in `seed.json` (total item records). */
    SEED_ITEM_COUNT: 19,
    /** Active list length after reset (seed minus demo Recycle Bin rows). */
    ACTIVE_ITEMS_INITIAL_COUNT: 16,
    /** Recycle Bin rows preloaded on reset for demos. */
    RECYCLE_BIN_SEED_COUNT: 3,
    EMAILS_PER_ITEM: 4,
    CHANGE_HISTORY_PER_ITEM: 11,
    RELATED_ITEMS_PER_ITEM: 5,
    DOCUMENTS_PER_ITEM: 3,
    HUB_OPEN_ITEMS_COUNT: 3,
    HUB_ANALYTICS_RFI_TOTAL: 12,
    HUB_ANALYTICS_SUBMITTAL_TOTAL: 7,
    PERMISSION_USERS_COUNT: 2,
  },

  BLUEPRINTS: {
    REQUIRED_FILES: [
      'blueprint.json',
      'data.schema.json',
      'form.schema.json',
      'form.uiSchema.json',
      'list.uiSchema.json',
      'tabs.json',
      'seed.json',
    ] as const,
    DIRS: ['prototype-tool', 'prototype-detail', 'prototype-hub'] as const,
  },

  ITEM_SCHEMA: {
    LIST_COLUMNS: [
      'referenceCode',
      'summary',
      'divisionCode',
      'status',
      'assignee',
      'dueDate',
    ] as const,
    DETAIL_FIELDS: [
      'manager',
      'receivedFrom',
      'assignees',
      'distributionList',
      'ballInCourt',
      'contractor',
      'specSection',
      'location',
    ] as const,
    TOTAL_FIELDS: 30,
  },

  DEMO_ROUTE: {
    BASE_PATH: '/companies/$companyId/tools/prototype',
    COMPANY_ID: '1',
    TARGET_SEQUENCE: [
      'list',
      'settings/permissions',
      'detail tabs',
      'create/edit',
    ] as const,
  },
} as const;

export type GuardrailKey = keyof typeof GUARDRAILS;
