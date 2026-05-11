import React from 'react';
import type { CommonProps } from '@procore/json-toolinator';
import { createView } from '@procore/json-toolinator';

import { PROTOTYPE_TOOL_LIST_URL } from '@/components/mfe-global-nav-package/standalone/src/lib/prototypeToolPaths';

import { ListToolLandingTabulator } from './ListToolLandingTabulator';

export function ListRecycleFeature(props: Readonly<CommonProps>) {
  return <ListToolLandingTabulator {...props} recycleBinMode />;
}

export function createListRecycleView(config: any) {
  return createView('listRecycle', {
    config,
    path: '/new/recycle-bin',
    layout: {
      component: 'toolLandingPage',
      title: 'Recycle Bin',
      settings: {
        title: 'Configure settings',
        view: 'permissions',
      },
      tabs: [
        { title: 'All items', href: PROTOTYPE_TOOL_LIST_URL },
        { title: 'Recycle Bin', view: 'listRecycle' },
      ],
      actions: [],
    },
    feature: {
      component: ListRecycleFeature,
    },
  });
}
