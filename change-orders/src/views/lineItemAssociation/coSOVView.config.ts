import { createView } from '@procore/json-toolinator';
import { createItemQueryOptions, itemBreadcrumbTitle } from '../shared/itemQueries';
import { ChangeOrderSOV } from './ChangeOrderSOV';

export function createCOScheduleOfValuesView(config: any) {
  return (createView as any)('coScheduleOfValues', {
    config,
    path: '/items/$itemId/schedule-of-values',
    queries: (ctx: any) => ({ item: createItemQueryOptions(ctx) }),
    layout: {
      component: 'detailPage',
      width: 'xl',
      breadcrumbs: [
        { title: 'Change Orders', view: 'list' },
        {
          view: 'detail',
          title: (ctx: any) => itemBreadcrumbTitle(ctx),
        },
      ],
      tabs: [],
    },
    feature: { component: ChangeOrderSOV },
  } as any);
}
