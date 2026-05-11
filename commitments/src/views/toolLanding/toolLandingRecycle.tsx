import React from 'react';
import type { CommonProps } from '@procore/json-toolinator';
import { createView } from '@procore/json-toolinator';

import { PROTOTYPE_TOOL_TOOL_LANDING_URL } from '@/components/mfe-global-nav-package/standalone/src/lib/prototypeToolPaths';

import { ListToolLandingTabulator } from '../list/ListToolLandingTabulator';

export function ToolLandingRecycleFeature(props: Readonly<CommonProps>) {
  return <ListToolLandingTabulator {...props} recycleBinMode />;
}

export function createToolLandingRecycleView(config: any) {
  return createView('toolLandingRecycle', {
    config,
    path: '/tool-landing/recycle-bin',
    layout: {
      component: 'toolLandingPage',
      title: 'Recycle Bin',
      settings: {
        title: 'Configure settings',
        view: 'settings',
      },
      tabs: [
        { title: 'All items', href: PROTOTYPE_TOOL_TOOL_LANDING_URL },
        { title: 'Recycle Bin', view: 'toolLandingRecycle' },
      ],
      actions: [],
    },
    feature: {
      component: ToolLandingRecycleFeature,
    },
  });
}
