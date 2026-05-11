import { createView } from '@procore/json-toolinator';

import {
  createItemQueryOptions,
  itemBreadcrumbTitle,
} from '../shared/itemQueries';
import { prototypeItemTabs } from '../shared/itemTabs';

import { ItemRelatedItemsList } from './ItemRelatedItemsList';

export function createItemRelatedItemsView(config: any) {
  return (createView as any)('itemRelatedItems', {
    config,
    path: '/items/$itemId/related-items',
    queries: (ctx: any) => ({
      item: createItemQueryOptions(ctx),
    }),
    layout: {
      component: 'detailPage',
      breadcrumbs: [
        { title: 'Prototype Tool', view: 'list' },
        {
          view: 'detail',
          title: (ctx: { queries?: { item?: { data?: unknown } } }) =>
            itemBreadcrumbTitle(ctx),
        },
      ],
      tabs: [...prototypeItemTabs],
    },
    feature: {
      component: ItemRelatedItemsList,
    },
  } as any);
}
