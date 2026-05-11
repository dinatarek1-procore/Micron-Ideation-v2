/**
 * Placeholder ToolMenu content matching legacy mega-menu references (company = dark panel, project = light panel).
 * Paths are placeholders except where a demo route exists in the standalone app.
 */
import {
  PROTOTYPE_TOOL_LIST_URL,
  PROTOTYPE_TOOL_PERMISSIONS_URL,
} from './prototypeToolPaths';

export interface MegaMenuLink {
  id: string;
  label: string;
  /** Route or hash; use existing paths for wired demos */
  href: string;
  /** Company dark menu: show leading star (reference: Portfolio, Directory) */
  starred?: boolean;
}

export interface MegaMenuBlockSingle {
  kind: 'single';
  title: string;
  links: MegaMenuLink[];
}

export interface MegaMenuBlockSplit {
  kind: 'split';
  title: string;
  left: MegaMenuLink[];
  right: MegaMenuLink[];
}

export type MegaMenuBlock = MegaMenuBlockSingle | MegaMenuBlockSplit;

/** One visual column: one or more stacked section blocks (e.g. company col1 = Core + Custom) */
export interface MegaMenuColumn {
  id: string;
  blocks: MegaMenuBlock[];
}

/** Project / light mega-menu — five columns */
export const PROJECT_TOOL_MENU_COLUMNS: MegaMenuColumn[] = [
  {
    id: 'core',
    blocks: [
      {
        kind: 'single',
        title: 'Core Tools',
        links: [
          { id: 'home', label: 'Home', href: PROTOTYPE_TOOL_LIST_URL },
          { id: 'reports', label: 'Reports', href: '#' },
          { id: 'documents', label: 'Documents', href: '#' },
          {
            id: 'directory',
            label: 'Directory',
            href: PROTOTYPE_TOOL_LIST_URL,
          },
          { id: 'tasks', label: 'Tasks', href: '#' },
          { id: 'admin', label: 'Admin', href: '#' },
        ],
      },
    ],
  },
  {
    id: 'pm',
    blocks: [
      {
        kind: 'split',
        title: 'Project Management',
        left: [
          { id: 'emails', label: 'Emails', href: '#' },
          { id: 'bidding', label: 'Bidding', href: '#' },
          { id: 'rfis', label: 'RFIs', href: PROTOTYPE_TOOL_LIST_URL },
          { id: 'submittals', label: 'Submittals', href: '#' },
          { id: 'instructions', label: 'Instructions', href: '#' },
          { id: 'transmittals', label: 'Transmittals', href: '#' },
          { id: 'meetings', label: 'Meetings', href: '#' },
          { id: 'schedule', label: 'Schedule', href: '#' },
          { id: 'photos', label: 'Photos', href: '#' },
          { id: 'drawings', label: 'Drawings', href: '#' },
        ],
        right: [
          { id: 'specifications', label: 'Specifications', href: '#' },
          { id: 'assemble', label: 'Assemble', href: '#' },
          {
            id: 'coordination-issues',
            label: 'Coordination Issues',
            href: '#',
          },
          { id: 'inspections', label: 'Inspections', href: '#' },
          { id: 'incidents', label: 'Incidents', href: '#' },
          { id: 'observations', label: 'Observations', href: '#' },
          { id: 'punch-list', label: 'Punch List', href: '#' },
          { id: 'daily-log', label: 'Daily Log', href: '#' },
          { id: 'forms', label: 'Forms', href: '#' },
        ],
      },
    ],
  },
  {
    id: 'financial',
    blocks: [
      {
        kind: 'single',
        title: 'Financial Management',
        links: [
          { id: 'prime-contract', label: 'Prime Contract', href: '#' },
          { id: 'budget', label: 'Budget', href: '#' },
          { id: 'direct-costs', label: 'Direct Costs', href: '#' },
          {
            id: 'commitments',
            label: 'Commitments',
            href: PROTOTYPE_TOOL_LIST_URL,
          },
          { id: 'change-orders', label: 'Change Orders', href: '#' },
          { id: 'change-events', label: 'Change Events', href: '#' },
        ],
      },
    ],
  },
  {
    id: 'resource',
    blocks: [
      {
        kind: 'single',
        title: 'Resource Management',
        links: [
          { id: 'timesheets', label: 'Timesheets', href: '#' },
          { id: 'crews', label: 'Crews', href: '#' },
        ],
      },
    ],
  },
  {
    id: 'custom',
    blocks: [
      {
        kind: 'single',
        title: 'Custom Tools',
        links: [{ id: 'custom-tool-1', label: 'Custom Tool 1', href: '#' }],
      },
    ],
  },
];

/** Company / dark mega-menu — five columns, first column stacks Core Tools + Custom Tools */
export const COMPANY_TOOL_MENU_COLUMNS: MegaMenuColumn[] = [
  {
    id: 'core-custom',
    blocks: [
      {
        kind: 'single',
        title: 'Core Tools',
        links: [
          { id: 'programs', label: 'Programs', href: '#' },
          { id: 'portfolio', label: 'Portfolio', href: '#', starred: true },
          {
            id: 'directory',
            label: 'Directory',
            href: PROTOTYPE_TOOL_LIST_URL,
            starred: true,
          },
          { id: 'reports', label: 'Reports', href: '#' },
          { id: 'documents', label: 'Documents', href: '#' },
          {
            id: 'permissions',
            label: 'Permissions',
            href: PROTOTYPE_TOOL_PERMISSIONS_URL,
          },
          { id: 'admin', label: 'Admin', href: '#' },
        ],
      },
      {
        kind: 'single',
        title: 'Custom Tools',
        links: [
          { id: 'dashboard', label: 'Dashboard', href: '#' },
          { id: 'custom-tool-1', label: 'Custom Tool 1', href: '#' },
        ],
      },
    ],
  },
  {
    id: 'pm',
    blocks: [
      {
        kind: 'single',
        title: 'Project Management',
        links: [
          { id: 'dashboard', label: 'Dashboard', href: '#' },
          { id: 'timecard', label: 'Timecard', href: '#' },
          { id: 'schedule', label: 'Schedule', href: '#' },
          { id: 'program', label: 'Program', href: '#' },
          { id: 'inspections', label: 'Inspections', href: '#' },
        ],
      },
    ],
  },
  {
    id: 'financial',
    blocks: [
      {
        kind: 'single',
        title: 'Financial Management',
        links: [
          { id: 'fm-dashboard', label: 'Dashboard', href: '#' },
          { id: 'erp', label: 'ERP Integrations', href: '#' },
        ],
      },
    ],
  },
  {
    id: 'resource',
    blocks: [
      {
        kind: 'single',
        title: 'Resource Management',
        links: [
          { id: 'equipment', label: 'Equipment', href: '#' },
          { id: 'timesheets', label: 'Timesheets', href: '#' },
        ],
      },
    ],
  },
  {
    id: 'preconstruction',
    blocks: [
      {
        kind: 'single',
        title: 'Preconstruction',
        links: [{ id: 'planroom', label: 'Planroom', href: '#' }],
      },
    ],
  },
];
