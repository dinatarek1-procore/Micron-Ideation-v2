import React from 'react';
import { EllipsisVertical, Plus } from '@procore/core-icons';
import { createView } from '@procore/json-toolinator';

import { PROTOTYPE_TOOL_NEW_RECYCLE_BIN_URL } from '@/components/mfe-global-nav-package/standalone/src/lib/prototypeToolPaths';

import { ListToolLandingTabulator } from './ListToolLandingTabulator';

export function createListView(config: any) {
  return createView('list', {
    config,
    path: '/new',
    layout: {
      component: 'toolLandingPage',
      title: 'New tool',
      settings: {
        title: 'Configure settings',
        view: 'permissions',
      },
      tabs: [
        { title: 'All items', view: 'list' },
        { title: 'Recycle Bin', href: PROTOTYPE_TOOL_NEW_RECYCLE_BIN_URL },
      ],
      actions: [
        {
          title: 'Create',
          variant: 'primary',
          icon: <Plus />,
          view: 'create',
        },
        {
          title: '',
          icon: <EllipsisVertical />,
          variant: 'tertiary',
          children: [
            { title: 'Project Hub', view: 'hub' },
            { title: 'Home', view: 'home' },
            { title: 'New tool (prototype)', view: 'list' },
          ],
        },
      ],
    },
    feature: {
      component: ListToolLandingTabulator,
    },
  });
}
