import {
  getCompositionPlaygroundDemoLayoutExtras,
  type CompositionFeatureOption,
  type CompositionLayoutOption,
} from './playgroundCompositionBuild';

/** Curated playground state for one Toolinator layout shell (designer templates). */
export type LayoutPreset = {
  layout: CompositionLayoutOption;
  label: string;
  description: string;
  feature: CompositionFeatureOption;
  title: string;
  viewDescription: string;
  tabsJson: string;
  layoutJson: string;
  featureJson: string;
};

function layoutJsonWithPills(
  layout: CompositionLayoutOption,
  firstTabView = 'main'
): string {
  return JSON.stringify(
    {
      pills: [
        { title: 'Active', color: 'green' },
        { title: 'Schema-driven', color: 'blue' },
      ],
      ...getCompositionPlaygroundDemoLayoutExtras({ firstTabView, layout }),
    },
    null,
    2
  );
}

function layoutJsonMinimalChrome(layout: CompositionLayoutOption): string {
  return JSON.stringify(
    {
      ...getCompositionPlaygroundDemoLayoutExtras({
        firstTabView: 'main',
        layout,
      }),
    },
    null,
    2
  );
}

const DETAIL_TABS_JSON = JSON.stringify(
  [
    { title: 'Overview', view: 'main' },
    { title: 'Details', view: 'secondary', tooltip: 'Extra detail tab' },
    {
      title: 'Docs',
      href: 'https://developers.procore.com',
      target: '_blank',
    },
    { title: 'Coming soon', view: 'future', disabled: true },
  ],
  null,
  2
);

const SIMPLE_TWO_TAB_JSON = JSON.stringify(
  [
    { title: 'Overview', view: 'main' },
    { title: 'More', view: 'secondary' },
  ],
  null,
  2
);

const SINGLE_TAB_JSON = JSON.stringify(
  [{ title: 'Main', view: 'main' }],
  null,
  2
);

const FORM_WITH_ACTIONS_JSON = JSON.stringify(
  {
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', title: 'Title' },
        description: { type: 'string', title: 'Description' },
      },
    },
    readonly: false,
    actions: [
      { title: 'Cancel', variant: 'secondary' },
      { title: 'Save', variant: 'primary' },
    ],
  },
  null,
  2
);

const FORM_READONLY_JSON = JSON.stringify(
  {
    schema: {
      type: 'object',
      properties: {
        setting: { type: 'string', title: 'Setting name' },
        value: { type: 'string', title: 'Value' },
      },
    },
    readonly: true,
  },
  null,
  2
);

/** Feature JSON for permissions preset; `toolName` is passed through to Toolinator. */
const PERMISSIONS_FEATURE_JSON = JSON.stringify(
  { toolName: 'Composition playground' },
  null,
  2
);

const FORM_MINIMAL_JSON = JSON.stringify(
  {
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Name' },
      },
    },
    readonly: false,
  },
  null,
  2
);

const FORM_COMPACT_ACTIONS_JSON = JSON.stringify(
  {
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Name' },
      },
    },
    readonly: false,
    actions: [{ title: 'Done', variant: 'primary' }],
  },
  null,
  2
);

/** Table feature JSON: schema drives column config; mock rows come from makeFeature queries. */
const TABLE_FEATURE_JSON = JSON.stringify(
  {
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', title: 'ID' },
        label: { type: 'string', title: 'Label' },
      },
    },
  },
  null,
  2
);

export const LAYOUT_PRESET_ORDER: readonly CompositionLayoutOption[] = [
  'detailPage',
  'toolLandingPage',
  'settingsPage',
  'adminPage',
  'page',
  'panel',
  'modal',
] as const;

export const LAYOUT_PRESETS: Record<CompositionLayoutOption, LayoutPreset> = {
  detailPage: {
    layout: 'detailPage',
    label: 'Detail page',
    description:
      'Breadcrumbs, navigation, tabbed item views, footer actions, and settings cog. Routes under /items/… — aligns with bundled blueprints `prototype-detail` + `prototype-tool` item routes.',
    feature: 'form',
    title: 'Item detail',
    viewDescription: 'Full item shell with tabs and Save/Cancel.',
    tabsJson: DETAIL_TABS_JSON,
    layoutJson: layoutJsonWithPills('detailPage', 'main'),
    featureJson: FORM_WITH_ACTIONS_JSON,
  },
  toolLandingPage: {
    layout: 'toolLandingPage',
    label: 'Tool landing page',
    description:
      'Tool root layout: tabs and a cog that opens permissions (`/settings`), no breadcrumbs or footer chrome. Matches `prototype-tool` list landing.',
    feature: 'table',
    title: 'Tool overview',
    viewDescription: 'Landing view with a sample table.',
    tabsJson: SIMPLE_TWO_TAB_JSON,
    layoutJson: layoutJsonWithPills('toolLandingPage', 'main'),
    featureJson: TABLE_FEATURE_JSON,
  },
  settingsPage: {
    layout: 'settingsPage',
    label: 'Settings page',
    description:
      'Same global chrome as detail (breadcrumbs, nav) with the company permissions table.',
    feature: 'permissions',
    title: 'Tool permissions',
    viewDescription: 'User permissions for this tool (mirrored mock data).',
    tabsJson: SINGLE_TAB_JSON,
    layoutJson: layoutJsonWithPills('settingsPage', 'main'),
    featureJson: PERMISSIONS_FEATURE_JSON,
  },
  adminPage: {
    layout: 'adminPage',
    label: 'Admin page',
    description:
      'Item-scoped admin shell with breadcrumbs and navigation, like settings for a single record.',
    feature: 'form',
    title: 'Admin',
    viewDescription: 'Administrative fields for this item.',
    tabsJson: SINGLE_TAB_JSON,
    layoutJson: layoutJsonWithPills('adminPage', 'main'),
    featureJson: FORM_READONLY_JSON,
  },
  page: {
    layout: 'page',
    label: 'Page',
    description:
      'Standard page layout with breadcrumbs and width; simpler than detail (no item footer region).',
    feature: 'form',
    title: 'Simple page',
    viewDescription: 'Single-page form.',
    tabsJson: SINGLE_TAB_JSON,
    layoutJson: layoutJsonWithPills('page', 'main'),
    featureJson: FORM_MINIMAL_JSON,
  },
  panel: {
    layout: 'panel',
    label: 'Panel',
    description:
      'Slide-over panel: title and tabs in a compact header, no breadcrumb bar.',
    feature: 'form',
    title: 'Side panel',
    viewDescription: 'Compact panel content.',
    tabsJson: SINGLE_TAB_JSON,
    layoutJson: layoutJsonMinimalChrome('panel'),
    featureJson: FORM_COMPACT_ACTIONS_JSON,
  },
  modal: {
    layout: 'modal',
    label: 'Modal',
    description:
      'Modal chrome (header, body, actions) shown inline in the preview—same layout as a real modal without the overlay.',
    feature: 'form',
    title: 'Quick edit',
    viewDescription: 'Short task in a modal.',
    tabsJson: SINGLE_TAB_JSON,
    layoutJson: layoutJsonMinimalChrome('modal'),
    featureJson: FORM_COMPACT_ACTIONS_JSON,
  },
};

export function getPreset(layout: CompositionLayoutOption): LayoutPreset {
  return LAYOUT_PRESETS[layout];
}
