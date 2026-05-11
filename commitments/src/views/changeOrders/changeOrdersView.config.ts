import { createView } from '@procore/json-toolinator';

import {
  createItemQueryOptions,
  itemBreadcrumbTitle,
} from '../shared/itemQueries';
import { ChangeOrdersIndex } from './ChangeOrdersIndex';

export function createChangeOrdersView(config: any) {
  return (createView as any)('changeOrders', {
    config,
    path: '/items/$itemId/change-orders',
    queries: (ctx: any) => ({
      item: createItemQueryOptions(ctx),
    }),
    layout: {
      component: 'detailPage',
      width: 'xl',
      breadcrumbs: [
        { title: 'Commitments', view: 'list' },
        {
          view: 'detail',
          title: (ctx: { queries?: { item?: { data?: unknown } } }) =>
            itemBreadcrumbTitle(ctx),
        },
      ],
      tabs: [],
    },
    feature: {
      component: ChangeOrdersIndex,
    },
  } as any);
}
