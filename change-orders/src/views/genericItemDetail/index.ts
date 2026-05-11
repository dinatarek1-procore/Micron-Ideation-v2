import { Breakpoint, createView } from '@procore/json-toolinator';

import { genericItemTabs } from '@/views/shared/itemTabs';
import {
  genericItemDetailBreadcrumbs,
  genericItemDetailHeaderActionsGeneral,
  genericItemDetailPageTitle,
} from './genericDetailPageChrome';
import { GenericToolItemDetail } from './GenericToolItemDetail';

/**
 * Standalone detail chrome + generic body — not the Mirage-backed `/items/$itemId` prototype record.
 * Static path so ellipsis / view switches do not require route params.
 */
export function createGenericItemDetailView(config: any) {
  return createView('genericItemDetail', {
    config,
    path: '/sample-items/1',
    layout: {
      component: 'detailPage',
      /** Same as planroom `show`: full-width body (default `md` leaves large side gutters). */
      width: 'block',
      /** Same pattern as planroom `show`: body nav rail on wide viewports. */
      hasNavigation: ({
        viewport: { breakpoint },
      }: {
        viewport: { breakpoint: number };
      }) => breakpoint > Breakpoint.TabletLg,
      /** React node: Toolinator types `title` as string; DetailPage `<H1>` accepts React children at runtime. */
      title: genericItemDetailPageTitle,
      breadcrumbs: [...genericItemDetailBreadcrumbs],
      actions: [...genericItemDetailHeaderActionsGeneral],
      tabs: [...genericItemTabs],
    } as any,
    feature: {
      component: GenericToolItemDetail,
    },
  });
}
