import { createView } from '@procore/json-toolinator';

import { HubDashboard } from './HubDashboard';

export function createHubView(config: any) {
  return createView('hub', {
    config,
    path: '/hub',
    layout: {
      component: 'page',
      title: 'Project Hub',
      breadcrumbs: [{ title: 'Home', view: 'home' }],
    },
    feature: {
      component: HubDashboard,
    },
  });
}
