import { createView } from '@procore/json-toolinator';

import {
  createItemQueryOptions,
  itemBreadcrumbTitle,
} from '../shared/itemQueries';
import { prototypeItemTabs } from '../shared/itemTabs';

import { ItemChangeHistoryList } from './ItemChangeHistoryList';

export function createItemHistoryView(config: any) {
  return (createView as any)('itemHistory', {
    config,
    path: '/items/$itemId/history',
    queries: (ctx: any) => ({
      item: createItemQueryOptions(ctx),
    }),
    layout: {
      component: 'detailPage',
      /** `@procore/core-react` DetailPage: full-width body (default is `md`, which leaves large side gutters). */
      width: 'block',
      title: 'Change History',
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
      component: ItemChangeHistoryList,
    },
  } as any);
}
