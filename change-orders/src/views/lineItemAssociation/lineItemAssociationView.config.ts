import { createView } from '@procore/json-toolinator';
import { BulkLineItemAssociation } from './BulkLineItemAssociation';

export function createLineItemAssociationView(config: any) {
  return (createView as any)('lineItemAssociation', {
    config,
    path: '/line-item-association',
    layout: {
      component: 'detailPage',
      width: 'xl',
      title: () => 'CO-004 — Line Item Association',
      breadcrumbs: [{ title: 'Change Orders', view: 'list' }],
      tabs: [],
    },
    feature: {
      component: BulkLineItemAssociation,
    },
  } as any);
}
