export interface ItemEmail {
  id: string;
  item_id: number;
  subject: string;
  created_at: string;
  body: string;
  from: { name: string; company_name: string };
  to: { name: string; company_name: string }[];
  attachments: unknown[];
  private: boolean;
}

/** Shape expected by @procore/engagement-emails `formatEmailListItem` (see package dist/modern/index.mjs). */
export interface EngagementEmailCommunicationsListRow {
  communication_id: string;
  id: string;
  subject: string;
  body: string;
  email_sent_at: string;
  private: boolean;
  attachments: unknown[];
  login_information: {
    id: number;
    login: string;
    name: string;
    company_name: string;
  };
  distribution: Array<{
    id: number;
    login: string;
    name: string;
    company_name: string;
  }>;
  bcc_distribution: Array<{
    id: number;
    login: string;
    name: string;
    company_name: string;
  }>;
}

function slugLogin(name: string, seed: string): string {
  const local = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '');
  return `${local || 'user'}.${seed}@prototype.local`;
}

export function mapItemEmailToEngagementCommunicationsListRow(
  e: ItemEmail
): EngagementEmailCommunicationsListRow {
  const senderId =
    10_000 + e.item_id * 100 + Number(e.id.split('-').pop() || '0');
  const senderLogin = slugLogin(e.from.name, `s${e.item_id}`);

  return {
    communication_id: e.id,
    id: e.id,
    subject: e.subject,
    body: e.body,
    email_sent_at: e.created_at,
    private: e.private,
    attachments: Array.isArray(e.attachments) ? e.attachments : [],
    login_information: {
      id: senderId,
      login: senderLogin,
      name: e.from.name,
      company_name: e.from.company_name,
    },
    distribution: e.to.map((recipient, i) => ({
      id: senderId + i + 1,
      login: slugLogin(recipient.name, `r${e.item_id}-${i}`),
      name: recipient.name,
      company_name: recipient.company_name,
    })),
    bcc_distribution: [],
  };
}

export function mapItemEmailsToEngagementCommunicationsList(
  list: ItemEmail[]
): EngagementEmailCommunicationsListRow[] {
  return list.map(mapItemEmailToEngagementCommunicationsListRow);
}

const EMAIL_TEMPLATES = [
  {
    subject: 'FW: RFI #35: Test',
    from: 'Tony Van Groningen',
    to: 'Ahmed Tarek',
    body: 'what even happens | Sent from Procore',
    when: '2026-04-15T18:14:00Z',
  },
  {
    subject: 'RE: Submittal Review — Acoustical Ceilings',
    from: 'Ahmed Tarek',
    to: 'Tony Van Groningen',
    body: 'Please see the updated shop drawings attached.',
    when: '2026-04-14T14:30:00Z',
  },
  {
    subject: 'RFI #35 — Original Question',
    from: 'Sophia Martinez',
    to: 'Ahmed Tarek',
    body: 'Can you clarify the ceiling plenum access requirements for Level 3?',
    when: '2026-04-13T09:15:00Z',
  },
  {
    subject: 'Weekly Coordination Notes — Week 15',
    from: 'Ahmed Tarek',
    to: 'Sophia Martinez',
    body: "Attached are the coordination notes from this week's OAC meeting.",
    when: '2026-04-12T16:45:00Z',
  },
];

let emailsByItem: Map<number, ItemEmail[]> = new Map();

function generateEmails(itemId: number): ItemEmail[] {
  return EMAIL_TEMPLATES.map((t, i) => ({
    id: `em-${itemId}-${i + 1}`,
    item_id: itemId,
    subject: t.subject,
    created_at: t.when,
    body: t.body,
    from: { name: t.from, company_name: 'Acme Builders' },
    to: [{ name: t.to, company_name: 'PnT Construction' }],
    attachments: [],
    private: false,
  }));
}

export function getEmailsForItem(itemId: number): ItemEmail[] {
  if (!emailsByItem.has(itemId)) {
    emailsByItem.set(itemId, generateEmails(itemId));
  }
  return emailsByItem.get(itemId)!;
}

/**
 * Synthetic communication ids from {@link generateEmails}: `em-{itemId}-{1-based index}`.
 */
function parsePrototypeCommunicationId(
  communicationId: string
): { itemId: number; index: number } | null {
  const m = /^em-(\d+)-(\d+)$/.exec(communicationId);
  if (!m) return null;
  return { itemId: Number(m[1]), index: Number(m[2]) };
}

/**
 * Response body for `GET .../email_communications/:id` — raw shape consumed by
 * `@procore/engagement-emails` `formatCommunication` / `formatEmail` (see package dist).
 */
export interface EngagementEmailCommunicationDetail {
  id: string;
  subject: string;
  private: boolean;
  emails: Array<{
    id: string;
    email_sent_at: string;
    body: string;
    sanitized_body_html?: string | null;
    login_information: EngagementEmailCommunicationsListRow['login_information'];
    distribution: EngagementEmailCommunicationsListRow['distribution'];
    cc_distribution: EngagementEmailCommunicationsListRow['distribution'];
    bcc_distribution: EngagementEmailCommunicationsListRow['bcc_distribution'];
    attachments: unknown[];
  }>;
}

export function getEmailCommunicationDetail(
  communicationId: string
): EngagementEmailCommunicationDetail | null {
  const parsed = parsePrototypeCommunicationId(communicationId);
  if (!parsed) return null;
  const list = getEmailsForItem(parsed.itemId);
  const row = list[parsed.index - 1];
  if (!row) return null;

  const listRow = mapItemEmailToEngagementCommunicationsListRow(row);

  return {
    id: communicationId,
    subject: listRow.subject,
    private: listRow.private,
    emails: [
      {
        id: listRow.id,
        email_sent_at: listRow.email_sent_at,
        body: listRow.body,
        login_information: listRow.login_information,
        distribution: listRow.distribution,
        cc_distribution: [],
        bcc_distribution: listRow.bcc_distribution,
        attachments: listRow.attachments,
      },
    ],
  };
}

export function resetItemEmailsStore(): void {
  emailsByItem = new Map();
}
