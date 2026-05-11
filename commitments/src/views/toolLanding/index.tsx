import React from 'react';
import { Plus } from '@procore/core-icons';
import { createView } from '@procore/json-toolinator';
import type { CommonProps } from '@procore/json-toolinator';

import { PROTOTYPE_TOOL_TOOL_LANDING_RECYCLE_BIN_URL } from '@/components/mfe-global-nav-package/standalone/src/lib/prototypeToolPaths';

import { ListToolLandingTabulator } from '../list/ListToolLandingTabulator';

function ToolLandingFeature(props: Readonly<CommonProps>) {
  return <ListToolLandingTabulator {...props} />;
}

export function createToolLandingView(config: any) {
  return createView('toolLanding', {
    config,
    path: '/tool-landing',
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
      component: ToolLandingFeature,
    },
  });
}
