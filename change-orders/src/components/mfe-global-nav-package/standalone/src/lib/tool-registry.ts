import type React from 'react';
import {
  Home,
  Help,
  Cog,
  FileListBulleted,
  Building,
} from '@procore/core-icons';
import {
  PROTOTYPE_TOOL_HUB_URL,
  PROTOTYPE_TOOL_LIST_URL,
} from './prototypeToolPaths';

export type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

export interface ToolDefinition {
  id: string;
  name: string;
  category: string;
  icon: IconComponent;
  path: string;
  context: 'company' | 'project';
  mobileCritical?: boolean;
  badges?: ('beta' | 'new' | 'updated' | 'merged' | 'legacy' | 'pilot')[];
  description?: string;
}

export interface MenuSection {
  id: string;
  label: string;
  icon: IconComponent;
  illustration?: string;
  tools: string[];
}

export const COMPANY_TOOLS: Record<string, ToolDefinition> = {
  'company-home': {
    id: 'company-home',
    name: 'Home',
    category: 'core',
    icon: Home,
    path: PROTOTYPE_TOOL_LIST_URL,
    context: 'company',
  },
  'company-directory': {
    id: 'company-directory',
    name: 'Directory',
    category: 'admin',
    icon: Building,
    // No standalone directory view — land on list for the prototype.
    path: PROTOTYPE_TOOL_LIST_URL,
    context: 'company',
  },
};

export const PROJECT_TOOLS: Record<string, ToolDefinition> = {
  'project-home': {
    id: 'project-home',
    name: 'Project Home',
    category: 'core',
    icon: Home,
    path: PROTOTYPE_TOOL_HUB_URL,
    context: 'project',
  },
  rfis: {
    id: 'rfis',
    name: 'RFIs',
    category: 'coordination',
    icon: Help,
    path: PROTOTYPE_TOOL_LIST_URL,
    context: 'project',
    mobileCritical: true,
  },
  commitments: {
    id: 'commitments',
    name: 'Commitments',
    category: 'financial',
    icon: Building,
    path: PROTOTYPE_TOOL_LIST_URL,
    context: 'project',
  },
  'open-items': {
    id: 'open-items',
    name: 'Open Items',
    category: 'coordination',
    icon: FileListBulleted,
    path: PROTOTYPE_TOOL_LIST_URL,
    context: 'project',
  },
  'uui-studio': {
    id: 'uui-studio',
    name: 'UUI Studio',
    category: 'advanced',
    icon: Cog,
    path: PROTOTYPE_TOOL_LIST_URL,
    context: 'project',
    badges: ['beta'],
    description: 'Component explorer and theme browser (dev)',
  },
};

export const COMPANY_MENU_SECTIONS: MenuSection[] = [
  {
    id: 'shell',
    label: 'Company',
    icon: Home,
    tools: ['company-home', 'company-directory'],
  },
];

export const PROJECT_MENU_SECTIONS: MenuSection[] = [
  {
    id: 'shell-project',
    label: 'Project',
    icon: Home,
    tools: ['project-home', 'rfis', 'commitments', 'open-items', 'uui-studio'],
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return COMPANY_TOOLS[id] ?? PROJECT_TOOLS[id];
}

export function getToolsByIds(ids: string[]): ToolDefinition[] {
  return ids
    .map((id) => getToolById(id))
    .filter((t): t is ToolDefinition => t !== undefined);
}
