import { Breakpoint, createView } from '@procore/json-toolinator';

import {
  createItemQueryOptions,
  itemBreadcrumbTitle,
} from '../shared/itemQueries';
import { genericItemDetailPrototypeNavAction } from '../genericItemDetail/genericDetailPageChrome';
import { ItemDetailGeneral } from './ItemDetailGeneral';

export function createDetailView(config: any) {
  return createView('detail', {
    config,
    path: '/items/$itemId',
    queries: (ctx) => ({
      item: createItemQueryOptions(ctx),
    }),
    layout: {
      component: 'detailPage',
      width: 'block',
      hasNavigation: ({ viewport: { breakpoint } }) =>
        breakpoint > Breakpoint.TabletLg,
      breadcrumbs: [{ title: 'New tool', view: 'list' }],
      actions: [genericItemDetailPrototypeNavAction],
      tabs: [],
      tearsheets: [{ block: true, view: 'edit' }],
    },
    feature: {
      component: ItemDetailGeneral,
    },
  });
}
