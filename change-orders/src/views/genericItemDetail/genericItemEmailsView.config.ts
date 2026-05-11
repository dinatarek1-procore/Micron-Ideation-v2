import { Breakpoint, createView } from '@procore/json-toolinator';

import { genericItemTabs } from '@/views/shared/itemTabs';
import {
  genericItemDetailBreadcrumbs,
  genericItemDetailHeaderActionsEmails,
  genericItemDetailPageTitle,
} from './genericDetailPageChrome';
import { GenericItemEmailsList } from './GenericItemEmailsList';

export function createGenericItemEmailsView(config: any) {
  return createView('genericItemEmails', {
    config,
    path: '/sample-items/1/emails',
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
      actions: [...genericItemDetailHeaderActionsEmails],
      tabs: [...genericItemTabs],
    } as any,
    feature: {
      component: GenericItemEmailsList,
    },
  });
}
