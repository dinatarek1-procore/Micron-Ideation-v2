import { createView } from '@procore/json-toolinator';

import {
  createItemQueryOptions,
  itemBreadcrumbTitle,
} from '../shared/itemQueries';
import { ScheduleOfValues } from './ScheduleOfValues';

export function createScheduleOfValuesView(config: any) {
  return (createView as any)('scheduleOfValues', {
    config,
    path: '/items/$itemId/schedule-of-values',
    queries: (ctx: any) => ({
      item: createItemQueryOptions(ctx),
    }),
    layout: {
      component: 'detailPage',
      width: 'xl',
      breadcrumbs: [
        { title: 'Commitments', view: 'list' },
        {
          view: 'detail',
          title: (ctx: { queries?: { item?: { data?: unknown } } }) =>
            itemBreadcrumbTitle(ctx),
        },
      ],
      tabs: [],
    },
    feature: {
      component: ScheduleOfValues,
    },
  } as any);
}
