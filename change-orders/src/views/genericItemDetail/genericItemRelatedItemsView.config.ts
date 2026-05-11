import { Breakpoint, createView } from '@procore/json-toolinator';

import { genericItemTabs } from '@/views/shared/itemTabs';
import {
  genericItemDetailBreadcrumbs,
  genericItemDetailHeaderActionsRelated,
  genericItemDetailPageTitle,
} from './genericDetailPageChrome';
import { GenericItemRelatedItemsList } from './GenericItemRelatedItemsList';

export function createGenericItemRelatedItemsView(config: any) {
  return createView('genericItemRelatedItems', {
    config,
    path: '/sample-items/1/related-items',
    layout: {
      component: 'detailPage',
      width: 'block',
      hasNavigation: ({
        viewport: { breakpoint },
      }: {
        viewport: { breakpoint: number };
      }) => breakpoint > Breakpoint.TabletLg,
      title: genericItemDetailPageTitle,
      breadcrumbs: [...genericItemDetailBreadcrumbs],
      actions: [...genericItemDetailHeaderActionsRelated],
      tabs: [...genericItemTabs],
    } as any,
    feature: {
      component: GenericItemRelatedItemsList,
    },
  });
}
