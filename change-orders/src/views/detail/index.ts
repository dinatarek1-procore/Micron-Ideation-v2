import { Breakpoint, createView } from '@procore/json-toolinator';

import {
  createItemQueryOptions,
  itemBreadcrumbTitle,
} from '../shared/itemQueries';
import { prototypeItemTabs } from '../shared/itemTabs';

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
      title: (ctx: { queries?: { item?: { data?: unknown } } }) =>
        itemBreadcrumbTitle(ctx),
      breadcrumbs: [{ title: 'New tool', view: 'list' }],
      actions: [
        { title: 'Edit', view: 'edit', variant: 'primary' },
        genericItemDetailPrototypeNavAction,
      ],
      tabs: [...prototypeItemTabs],
      tearsheets: [{ block: true, view: 'edit' }],
    },
    feature: {
      component: ItemDetailGeneral,
    },
  });
}
