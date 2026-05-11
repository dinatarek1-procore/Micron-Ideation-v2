export interface ItemDocument {
  id: string;
  item_id: number;
  filename: string;
  version: string;
  uploaded_at: string;
  uploaded_by: string;
  size_bytes: number;
}

const DOC_TEMPLATES = [
  {
    filename: 'specification.pdf',
    version: 'v3',
    uploaded_by: 'Sam Patel',
    size_bytes: 1_024_000,
    uploaded_at: '2026-04-10T10:00:00Z',
  },
  {
    filename: 'photo-progress.jpg',
    version: 'v1',
    uploaded_by: 'Alex Kim',
    size_bytes: 512_000,
    uploaded_at: '2026-04-14T14:30:00Z',
  },
  {
    filename: 'markup.dwg',
    version: 'v2',
    uploaded_by: 'Jordan Lee',
    size_bytes: 2_048_000,
    uploaded_at: '2026-04-15T09:15:00Z',
  },
];

let docsByItem: Map<number, ItemDocument[]> = new Map();

function generateDocs(itemId: number): ItemDocument[] {
  return DOC_TEMPLATES.map((t, i) => ({
    id: `doc-${itemId}-${i + 1}`,
    item_id: itemId,
    ...t,
  }));
}

export function getDocumentsForItem(itemId: number): ItemDocument[] {
  if (!docsByItem.has(itemId)) {
    docsByItem.set(itemId, generateDocs(itemId));
  }
  return docsByItem.get(itemId)!;
}

export function resetItemDocumentsStore(): void {
  docsByItem = new Map();
}
