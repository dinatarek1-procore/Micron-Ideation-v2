import { createView } from '@procore/json-toolinator';

import { prototypePermissionsTableFeature } from './permissionsFeature.js';

export function createPermissionsView(config: any) {
  return createView('permissions', {
    config,
    path: '/settings/permissions',
    layout: {
      component: 'settingsPage',
      title: 'Permissions',
      breadcrumbs: [
        { title: 'Prototype Tool', view: 'list' },
        { title: 'Permissions', view: 'permissions' },
      ],
    },
    feature: prototypePermissionsTableFeature,
  });
}
