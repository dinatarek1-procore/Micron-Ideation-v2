import { getChangeHistoryForItem } from '@/mockServer/itemChangeHistory';
import { getEmailsForItem } from '@/mockServer/itemEmailsStore';
import { getRelatedItemsForItem } from '@/mockServer/itemRelatedItemsStore';

/** Detail strip shared by Overview + item extension routes (Toolinator tab contract). */
export const prototypeItemTabs = [
  { title: 'General', view: 'detail' },
  { title: 'Schedule of Values (1)', view: 'scheduleOfValues' },
  { title: 'Change Orders (3)', view: 'changeOrders' },
  { title: 'Related Items (0)', view: 'itemRelatedItems' },
  { title: 'Emails', view: 'itemEmails' },
  { title: 'Financial Markups', view: 'itemDocuments' },
  { title: 'Change History (4)', view: 'itemHistory' },
] as const;

/** Static demo item for `/sample-items/1` — counts match Mirage seed getters. */
const GENERIC_SAMPLE_ITEM_ID = 1;

/** Tab strip shared by all genericItemDetail views (static /sample-items/1 path). */
export const genericItemTabs = [
  /** Detail Record: general tab has no count in the label. */
  { title: 'General', view: 'genericItemDetail' },
  {
    title: `Related Items (${getRelatedItemsForItem(GENERIC_SAMPLE_ITEM_ID).length})`,
    view: 'genericItemRelatedItems',
  },
  {
    title: `Emails (${getEmailsForItem(GENERIC_SAMPLE_ITEM_ID).length})`,
    view: 'genericItemEmails',
  },
  {
    title: `Change History (${getChangeHistoryForItem(GENERIC_SAMPLE_ITEM_ID).length})`,
    view: 'genericItemHistory',
  },
] as const;
