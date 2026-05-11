import React from 'react';
import { createView } from '@procore/json-toolinator';
import { Plus } from '@procore/core-icons';

import { PROTOTYPE_TOOL_TOOL_LANDING_RECYCLE_BIN_URL } from '@/components/mfe-global-nav-package/standalone/src/lib/prototypeToolPaths';

import { CreateTearsheetFeature } from './CreateTearsheetFeature';

/**
 * Create view — uses the same `toolLandingPage` layout as the tool landing so
 * the underlying grid remains visible while the Pattern 3 slide-out (Tearsheet)
 * opens on top. Navigating to this route no longer shifts the layout to a
 * blank `detailPage`.
 *
 * Full pattern rules: `.cursor/rules/ix-tearsheet.mdc`, `.cursor/rules/ix-patterns.mdc`.
 */
export function createCreateView(config: any) {
  return createView('create', {
    config,
    path: '/create',
    layout: {
      component: 'toolLandingPage',
      title: 'Tool Landing',
      settings: {
        title: 'Configure settings',
        view: 'settings',
      },
      tabs: [
        { title: 'All items', view: 'toolLanding' },
        {
          title: 'Recycle Bin',
          href: PROTOTYPE_TOOL_TOOL_LANDING_RECYCLE_BIN_URL,
        },
      ],
      actions: [
        {
          title: 'Primary',
          variant: 'primary',
          icon: <Plus />,
          view: 'create',
        },
        {
          title: 'Secondary',
          variant: 'secondary',
          view: 'create',
        },
        { title: 'Project Hub', view: 'hub' },
        { title: 'Home', view: 'home' },
        { title: 'New tool (prototype)', view: 'list' },
      ],
    },
    feature: {
      component: CreateTearsheetFeature,
    },
  });
}
