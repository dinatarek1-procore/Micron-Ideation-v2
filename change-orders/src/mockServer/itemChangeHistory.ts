export interface ChangeHistoryRow {
  id: string;
  column: string;
  created_at: string;
  created_by: string;
  old_value: string;
  new_value: string;
}

const HISTORY_ROWS = [
  {
    column: 'Question',
    created_by: 'Unknown',
    old_value: '(None)',
    new_value: 'Question 1',
    created_at: '2024-12-16T09:31:00Z',
  },
  {
    column: 'Full position',
    created_by: 'Unknown',
    old_value: '(None)',
    new_value: 'Assignee',
    created_at: '2024-12-16T09:31:00Z',
  },
  {
    column: 'Added rfi/qu...',
    created_by: 'Unknown',
    old_value: '(None)',
    new_value: 'Tool Name Manager',
    created_at: '2024-12-16T09:31:00Z',
  },
  {
    column: 'Assignee',
    created_by: 'Unknown',
    old_value: '(None)',
    new_value: 'Assignee',
    created_at: '2024-12-16T09:31:00Z',
  },
  {
    column: 'Ball In Court',
    created_by: 'Unknown',
    old_value: '(None)',
    new_value: 'Ball in court 1',
    created_at: '2024-12-16T09:31:00Z',
  },
  {
    column: 'Distribution...',
    created_by: 'Unknown',
    old_value: '(None)',
    new_value: 'Distribution member 1',
    created_at: '2024-12-16T09:31:00Z',
  },
  {
    column: 'Status',
    created_by: 'System Admin',
    old_value: 'Draft',
    new_value: 'Open',
    created_at: '2024-12-17T10:00:00Z',
  },
  {
    column: 'Received Fr...',
    created_by: 'System Admin',
    old_value: '(None)',
    new_value: 'Received from user',
    created_at: '2024-12-17T10:15:00Z',
  },
  {
    column: 'Due Date',
    created_by: 'System Admin',
    old_value: '(None)',
    new_value: '01/15/2026',
    created_at: '2024-12-18T08:30:00Z',
  },
  {
    column: 'Cost Code',
    created_by: 'System Admin',
    old_value: '(None)',
    new_value: '03-300',
    created_at: '2024-12-18T08:45:00Z',
  },
  {
    column: 'Private',
    created_by: 'System Admin',
    old_value: 'No',
    new_value: 'Yes',
    created_at: '2024-12-19T14:00:00Z',
  },
];

export function getChangeHistoryForItem(itemId: number): ChangeHistoryRow[] {
  return HISTORY_ROWS.map((row, i) => ({
    id: `ch-${itemId}-${i + 1}`,
    ...row,
  }));
}
