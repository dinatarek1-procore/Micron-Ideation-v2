import { createView } from '@procore/json-toolinator';

import {
  createItemQueryOptions,
  itemBreadcrumbTitle,
} from '../shared/itemQueries';
import { prototypeItemTabs } from '../shared/itemTabs';

import { ItemEmailsList } from './ItemEmailsList';

export function createItemEmailsView(config: any) {
  return (createView as any)('itemEmails', {
    config,
    path: '/items/$itemId/emails',
    queries: (ctx: any) => ({
      item: createItemQueryOptions(ctx),
    }),
    layout: {
      component: 'detailPage',
      title: 'Emails',
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
      component: ItemEmailsList,
    },
  } as any);
}
