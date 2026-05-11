import { Breakpoint, createView } from '@procore/json-toolinator';

import { genericItemTabs } from '@/views/shared/itemTabs';
import {
  genericItemDetailBreadcrumbs,
  genericItemDetailHeaderActionsHistory,
  genericItemDetailPageTitle,
} from './genericDetailPageChrome';
import { GenericItemHistoryList } from './GenericItemHistoryList';

export function createGenericItemHistoryView(config: any) {
  return createView('genericItemHistory', {
    config,
    path: '/sample-items/1/history',
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
      actions: [...genericItemDetailHeaderActionsHistory],
      tabs: [...genericItemTabs],
    } as any,
    feature: {
      component: GenericItemHistoryList,
    },
  });
}
