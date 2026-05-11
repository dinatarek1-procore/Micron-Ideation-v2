import { createView } from '@procore/json-toolinator';
import { createItemQueryOptions, itemBreadcrumbTitle } from '../shared/itemQueries';
import { BulkLineItemAssociation } from './BulkLineItemAssociation';

export function createCOLineItemAssociationView(config: any) {
  return (createView as any)('coLineItemAssociation', {
    config,
    path: '/items/$itemId/line-item-association',
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
    feature: { component: BulkLineItemAssociation },
  } as any);
}
