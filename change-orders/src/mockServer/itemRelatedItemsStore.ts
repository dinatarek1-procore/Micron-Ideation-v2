export interface RelatedItem {
  id: string;
  item_id: number;
  related_tool: string;
  related_title: string;
  linked_at: string;
  linked_by: string;
  notes: string;
}

const RELATED_TEMPLATES = [
  {
    related_tool: 'Change Order Requests',
    related_title: '#001: CE #11 — Fire Rated Plan Modification',
    linked_by: 'Alex Kim',
    notes: 'It is linked',
    linked_at: '2022-12-20T00:00:00Z',
  },
  {
    related_tool: 'Change Order Requests',
    related_title: '#002: CE #14 — Structural Reinforcement',
    linked_by: 'Jordan Lee',
    notes: 'Assignee',
    linked_at: '2023-01-15T00:00:00Z',
  },
  {
    related_tool: 'Submittals',
    related_title: '#003: SD-05 — Acoustical Ceiling Shop Drawings',
    linked_by: 'Sam Patel',
    notes: 'Rfi/Question 1',
    linked_at: '2023-02-10T00:00:00Z',
  },
  {
    related_tool: 'RFIs',
    related_title: '#004: RFI-042 — Ceiling Plenum Access',
    linked_by: 'Alex Kim',
    notes: 'It is linked',
    linked_at: '2023-03-05T00:00:00Z',
  },
  {
    related_tool: 'Punch Items',
    related_title: '#005: PL-007 — Corridor Finish Touch-ups',
    linked_by: 'Casey Rivera',
    notes: 'It is linked',
    linked_at: '2023-04-20T00:00:00Z',
  },
];

let relatedByItem: Map<number, RelatedItem[]> = new Map();

function generateRelatedItems(itemId: number): RelatedItem[] {
  return RELATED_TEMPLATES.map((t, i) => ({
    id: `rel-${itemId}-${i + 1}`,
    item_id: itemId,
    ...t,
  }));
}

export function getRelatedItemsForItem(itemId: number): RelatedItem[] {
  if (!relatedByItem.has(itemId)) {
    relatedByItem.set(itemId, generateRelatedItems(itemId));
  }
  return relatedByItem.get(itemId)!;
}

export function resetItemRelatedItemsStore(): void {
  relatedByItem = new Map();
}
