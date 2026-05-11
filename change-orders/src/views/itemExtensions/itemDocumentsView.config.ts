import { createView } from '@procore/json-toolinator';

import {
  createItemQueryOptions,
  itemBreadcrumbTitle,
} from '../shared/itemQueries';
import { prototypeItemTabs } from '../shared/itemTabs';

import { ItemDocumentsList } from './ItemDocumentsList';

export function createItemDocumentsView(config: any) {
  return createView('itemDocuments', {
    config,
    path: '/items/$itemId/documents',
    queries: (ctx) => ({
      item: createItemQueryOptions(ctx),
    }),
    layout: {
      component: 'detailPage',
      title: 'Documents',
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
      component: ItemDocumentsList,
    },
  });
}
