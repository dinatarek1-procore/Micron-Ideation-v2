export type ToolListItem = {
  id: string;
  referenceCode: string;
  summary: string;
  divisionCode: string;
  status: string;
  assignee: string;
  dueDate: string;
  description: string;
  recordedOn: string;
  responsibleOrg: string;
};

export const MOCK_TOOL_RECORDS: ToolListItem[] = [
  {
    id: '1',
    referenceCode: 'ITEM-1001',
    summary: 'Sample record — primary example row',
    divisionCode: 'GRP-01',
    status: 'Open',
    assignee: 'User A',
    dueDate: 'Jan 15, 2026',
    description:
      'Placeholder copy for layout and interaction testing. Replace with real content when wiring data.',
    recordedOn: 'Jan 2, 2026',
    responsibleOrg: 'Organization A',
  },
  {
    id: '2',
    referenceCode: 'ITEM-1002',
    summary: 'Sample record — secondary example',
    divisionCode: 'GRP-02',
    status: 'Open',
    assignee: 'User B',
    dueDate: 'Jan 22, 2026',
    description:
      'Additional placeholder text to demonstrate multi-line detail content in the panel.',
    recordedOn: 'Jan 5, 2026',
    responsibleOrg: 'Organization B',
  },
  {
    id: '3',
    referenceCode: 'ITEM-0998',
    summary: 'Sample record — closed state',
    divisionCode: 'GRP-01',
    status: 'Closed',
    assignee: '—',
    dueDate: 'Dec 10, 2025',
    description: 'Closed placeholder row for filter and list behavior.',
    recordedOn: 'Nov 28, 2025',
    responsibleOrg: 'Organization C',
  },
  {
    id: '4',
    referenceCode: 'ITEM-1004',
    summary: 'Sample record — another open item',
    divisionCode: 'GRP-03',
    status: 'Open',
    assignee: 'User C',
    dueDate: 'Jan 18, 2026',
    description:
      'More placeholder copy. Use this area for specifications, notes, or linked context.',
    recordedOn: 'Jan 8, 2026',
    responsibleOrg: 'Organization A',
  },
];

export function filterToolRecordsByTab(
  rows: ToolListItem[],
  tab: 'all' | 'open' | 'closed'
): ToolListItem[] {
  if (tab === 'all') return rows;
  if (tab === 'open') return rows.filter((r) => r.status === 'Open');
  return rows.filter((r) => r.status === 'Closed');
}

export function toolRecordTabCounts(rows: ToolListItem[]) {
  return {
    all: rows.length,
    open: rows.filter((r) => r.status === 'Open').length,
    closed: rows.filter((r) => r.status === 'Closed').length,
  };
}
