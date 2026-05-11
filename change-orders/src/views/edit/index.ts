import { createView } from '@procore/json-toolinator';

import { createItemQueryOptions } from '../shared/itemQueries';

import { ItemEditContent } from './ItemEditContent';

export function createEditView(config: any) {
  return createView('edit', {
    config,
    path: 'edit',
    queries: (ctx) => ({
      item: createItemQueryOptions(ctx),
    }),
    layout: {
      component: 'detailPage',
      title: 'Edit Item',
      width: 'block',
    },
    feature: {
      component: ItemEditContent,
    },
  });
}
