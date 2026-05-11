import { createView } from '@procore/json-toolinator';

import { PrototypeHome } from './PrototypeHome.js';

export function createHomeView(config: any) {
  return createView('home', {
    config,
    path: '/',
    layout: {
      component: 'page',
      title: 'Prototype kit',
    },
    feature: {
      component: PrototypeHome,
    },
  });
}
