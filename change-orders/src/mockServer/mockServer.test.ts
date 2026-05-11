/**
 * Mock server tests using guardrail constants.
 * Scaffold template — runs in consumer project with Jest.
 */
import {
  mockServer,
  resetItemsStore,
  resetItemExtensionResourceStores,
  resetPrototypeToolSettingsStore,
  resetUserPermissionsStore,
} from './mockServer';
import { GUARDRAILS } from '../shared/guardrails';

let server: ReturnType<typeof mockServer>;

beforeEach(() => {
  resetItemsStore();
  resetItemExtensionResourceStores();
  resetUserPermissionsStore();
  resetPrototypeToolSettingsStore();
  server = mockServer({ logging: false });
});

afterEach(() => {
  server.shutdown();
});

async function get(url: string) {
  const res = await fetch(`/rest/v1.0${url}`);
  return { status: res.status, body: await res.json() };
}

async function post(url: string, body: object) {
  const res = await fetch(`/rest/v1.0${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

async function patch(url: string, body: object) {
  const res = await fetch(`/rest/v1.0${url}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

async function del(url: string) {
  const res = await fetch(`/rest/v1.0${url}`, { method: 'DELETE' });
  return { status: res.status };
}

async function getAbsolute(url: string) {
  const res = await fetch(url);
  return { status: res.status, body: await res.json() };
}

describe('mockServer — Items CRUD', () => {
  it(`GET /items returns ${GUARDRAILS.MOCK_SERVER.ACTIVE_ITEMS_INITIAL_COUNT} active items after seed`, async () => {
    const { body } = await get('/companies/1/items');
    expect(body.data).toHaveLength(
      GUARDRAILS.MOCK_SERVER.ACTIVE_ITEMS_INITIAL_COUNT
    );
    expect(body.total).toBe(GUARDRAILS.MOCK_SERVER.ACTIVE_ITEMS_INITIAL_COUNT);
  });

  it('GET /items?filters[recycled]=true returns seeded Recycle Bin rows', async () => {
    const { body } = await get('/companies/1/items?filters[recycled]=true');
    expect(body.total).toBe(GUARDRAILS.MOCK_SERVER.RECYCLE_BIN_SEED_COUNT);
    expect(body.data).toHaveLength(
      GUARDRAILS.MOCK_SERVER.RECYCLE_BIN_SEED_COUNT
    );
    const codes = body.data.map(
      (i: { referenceCode: string }) => i.referenceCode
    );
    expect(codes).toEqual(expect.arrayContaining(['ITEM-1002', 'ITEM-0998']));
  });

  it('GET /items?filters[search]=ITEM-1001 returns 1 match', async () => {
    const { body } = await get('/companies/1/items?filters[search]=ITEM-1001');
    expect(body.data).toHaveLength(1);
    expect(body.data[0].referenceCode).toBe('ITEM-1001');
  });

  it('GET /items?filters[status]=Open returns only Open items', async () => {
    const { body } = await get('/companies/1/items?filters[status]=Open');
    for (const item of body.data) {
      expect(item.status).toBe('Open');
    }
    expect(body.data.length).toBeGreaterThan(0);
  });

  it('GET /items/1 returns item with all fields populated', async () => {
    const { body } = await get('/companies/1/items/1');
    const item = body.data;
    expect(item.referenceCode).toBe('ITEM-1001');
    expect(item.manager).toBe('Jordan Lee');
    expect(item.assignees).toEqual(['Alex Kim', 'Jordan Lee']);
    expect(item.specSection).toContain('Cast-in-Place');
  });

  it('POST /items creates with auto-incremented id', async () => {
    const { body } = await post('/companies/1/items', { summary: 'New item' });
    expect(body.data.id).toBeGreaterThan(
      GUARDRAILS.MOCK_SERVER.SEED_ITEM_COUNT
    );
    expect(body.data.summary).toBe('New item');
  });

  it('PATCH /items/1 updates status', async () => {
    const { body } = await patch('/companies/1/items/1', { status: 'Closed' });
    expect(body.data.status).toBe('Closed');
  });

  it('DELETE /items/1 returns 204 and moves the row to Recycle Bin', async () => {
    const { status } = await del('/companies/1/items/1');
    expect(status).toBe(204);

    const active = await get('/companies/1/items');
    expect(active.body.data.some((i: { id: number }) => i.id === 1)).toBe(
      false
    );
    expect(active.body.total).toBe(
      GUARDRAILS.MOCK_SERVER.ACTIVE_ITEMS_INITIAL_COUNT - 1
    );

    const recycled = await get('/companies/1/items?filters[recycled]=true');
    expect(recycled.body.data.some((i: { id: number }) => i.id === 1)).toBe(
      true
    );
    expect(recycled.body.total).toBe(
      GUARDRAILS.MOCK_SERVER.RECYCLE_BIN_SEED_COUNT + 1
    );
  });
});

describe('mockServer — Item extension tabs', () => {
  it(`GET /items/1/emails returns ${GUARDRAILS.MOCK_SERVER.EMAILS_PER_ITEM} structured emails`, async () => {
    const { body } = await get('/companies/1/items/1/emails');
    expect(body.data).toHaveLength(GUARDRAILS.MOCK_SERVER.EMAILS_PER_ITEM);
    expect(body.data[0].from.name).toBe('Tony Van Groningen');
    expect(Array.isArray(body.data[0].to)).toBe(true);
  });

  it('GET /project/1/email_communications/emails returns engagement-style list for topic_id', async () => {
    const { status, body } = await get(
      '/project/1/email_communications/emails?per_page=150&page=1&topic_type=prototype_item&topic_id=1'
    );
    expect(status).toBe(200);
    expect(body.emails).toHaveLength(GUARDRAILS.MOCK_SERVER.EMAILS_PER_ITEM);
    expect(body.total).toBe(GUARDRAILS.MOCK_SERVER.EMAILS_PER_ITEM);
    expect(body.emails[0].subject).toBeDefined();
    // @procore/engagement-emails formatEmailListItem expects Procore API field names
    expect(Array.isArray(body.emails[0].distribution)).toBe(true);
    expect(body.emails[0].login_information.login).toMatch(
      /@prototype\.local$/
    );
    expect(Array.isArray(body.emails[0].bcc_distribution)).toBe(true);
    expect(body.emails[0].email_sent_at).toBeDefined();
  });

  it('GET /project/1/email_communications/em-1-1 returns communication detail for engagement-emails', async () => {
    const { status, body } = await get(
      '/project/1/email_communications/em-1-1'
    );
    expect(status).toBe(200);
    expect(body.id).toBe('em-1-1');
    expect(body.subject).toBeDefined();
    expect(Array.isArray(body.emails)).toBe(true);
    expect(body.emails).toHaveLength(1);
    expect(body.emails[0].body).toBeDefined();
    expect(body.emails[0].login_information.login).toMatch(
      /@prototype\.local$/
    );
    expect(Array.isArray(body.emails[0].distribution)).toBe(true);
    expect(Array.isArray(body.emails[0].cc_distribution)).toBe(true);
  });

  it(`GET /items/1/change_history returns ${GUARDRAILS.MOCK_SERVER.CHANGE_HISTORY_PER_ITEM} domain-specific rows`, async () => {
    const { body } = await get('/companies/1/items/1/change_history');
    expect(body.data).toHaveLength(
      GUARDRAILS.MOCK_SERVER.CHANGE_HISTORY_PER_ITEM
    );
    expect(body.data[0].column).toBe('Question');
    expect(body.data[0].new_value).toBe('Question 1');
  });

  it('GET /items/1/change_history exposes total in response header for change-history-table', async () => {
    const res = await fetch(
      '/rest/v1.0/companies/1/items/1/change_history?page=1&per_page=3&sort=created_at'
    );
    expect(res.headers.get('total')).toBe(
      `${GUARDRAILS.MOCK_SERVER.CHANGE_HISTORY_PER_ITEM}`
    );
    const body = (await res.json()) as { data: unknown[] };
    expect(body.data).toHaveLength(3);
  });

  it(`GET /items/1/related_items returns ${GUARDRAILS.MOCK_SERVER.RELATED_ITEMS_PER_ITEM} with notes`, async () => {
    const { body } = await get('/companies/1/items/1/related_items');
    expect(body.data).toHaveLength(
      GUARDRAILS.MOCK_SERVER.RELATED_ITEMS_PER_ITEM
    );
    expect(body.data[0].related_tool).toBe('Change Order Requests');
    expect(body.data[0].notes).toBe('It is linked');
  });

  it('POST v2 related_items/list returns card rows for holder_ids (RelatedItems UI)', async () => {
    const res = await fetch(
      '/rest/v2.0/companies/1/projects/1/related_items/list?holder_type=GenericToolItem&locale=en&page=1&per_page=50',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ holder_ids: ['1'] }),
      }
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      data: Array<{ display_name: string; related_items_id: string }>;
    };
    expect(body.data).toHaveLength(
      GUARDRAILS.MOCK_SERVER.RELATED_ITEMS_PER_ITEM
    );
    expect(body.data[0].display_name).toContain('Fire Rated');
    expect(body.data[0].related_items_id).toMatch(/^rel-1-/);
  });

  it(`GET /items/1/documents returns ${GUARDRAILS.MOCK_SERVER.DOCUMENTS_PER_ITEM} documents`, async () => {
    const { body } = await get('/companies/1/items/1/documents');
    expect(body.data).toHaveLength(GUARDRAILS.MOCK_SERVER.DOCUMENTS_PER_ITEM);
    expect(body.data[0].filename).toBe('specification.pdf');
    expect(body.data[0].uploaded_by).toBe('Sam Patel');
  });
});

describe('mockServer — Hub endpoints', () => {
  it('GET /hub/project returns Miller Design', async () => {
    const { body } = await get('/companies/1/hub/project');
    expect(body.name).toBe('Miller Design');
  });

  it(`GET /hub/open-items returns ${GUARDRAILS.MOCK_SERVER.HUB_OPEN_ITEMS_COUNT} items`, async () => {
    const { body } = await get('/companies/1/hub/open-items');
    expect(body).toHaveLength(GUARDRAILS.MOCK_SERVER.HUB_OPEN_ITEMS_COUNT);
    const types = body.map((i: { type: string }) => i.type);
    expect(types).toEqual(['RFI', 'Submittal', 'Punch']);
  });

  it('GET /hub/analytics returns correct totals', async () => {
    const { body } = await get('/companies/1/hub/analytics');
    expect(body.rfis.total).toBe(
      GUARDRAILS.MOCK_SERVER.HUB_ANALYTICS_RFI_TOTAL
    );
    expect(body.submittals.total).toBe(
      GUARDRAILS.MOCK_SERVER.HUB_ANALYTICS_SUBMITTAL_TOTAL
    );
  });
});

describe('mockServer — Permissions', () => {
  it(`GET /user_permissions returns ${GUARDRAILS.MOCK_SERVER.PERMISSION_USERS_COUNT} users`, async () => {
    const { body } = await get('/companies/1/user_permissions');
    expect(body.data).toHaveLength(
      GUARDRAILS.MOCK_SERVER.PERMISSION_USERS_COUNT
    );
  });

  it('PATCH /user_permissions/:id updates access level', async () => {
    const { body } = await patch('/companies/1/user_permissions/2', {
      access_level_id: 4,
    });
    expect(body.data.user_access_level.name).toBe('Admin');
  });

  it('GET /settings/permissions_manifest includes tool entry', async () => {
    const { body } = await get('/companies/1/settings/permissions_manifest');
    const toolEntry = body.tools.find((t: any) => t.name === 'tool');
    expect(toolEntry).toBeTruthy();
    expect(toolEntry.id).toBe(999);
  });
});

describe('mockServer — Prototype tool settings', () => {
  it('GET /prototype_tool_settings returns seeded defaults', async () => {
    const { body } = await get('/companies/1/prototype_tool_settings');
    expect(body.data.settings_1).toBe('option_a');
    expect(body.data.settings_2).toContain('Default text for settings 2');
  });

  it('PATCH /prototype_tool_settings merges and persists', async () => {
    const { body } = await patch('/companies/1/prototype_tool_settings', {
      data: { settings_2: 'Patched settings 2' },
    });
    expect(body.data.settings_2).toBe('Patched settings 2');
    const { body: again } = await get('/companies/1/prototype_tool_settings');
    expect(again.data.settings_2).toBe('Patched settings 2');
  });
});

describe('mockServer — Environment stubs', () => {
  it('GET /environment_metadata returns user info', async () => {
    const { body } = await get('/environment_metadata');
    expect(body.user.name).toBe('Procore Developer');
  });

  it('GET /rest/v1.1/environment_metadata (host SDK) returns user info', async () => {
    const { body } = await getAbsolute(
      '/rest/v1.1/environment_metadata?company_id=1'
    );
    expect(body.user.name).toBe('Procore Developer');
  });

  it('GET /rest/v2.0/.../early_access/enrollees_for_user returns data array', async () => {
    const { body } = await getAbsolute(
      '/rest/v2.0/companies/1/early_access/enrollees_for_user'
    );
    expect(body.data).toEqual([]);
  });
});

describe('mockServer — Store resets', () => {
  it('reset restores all stores to seed state', async () => {
    await post('/companies/1/items', { summary: 'Temporary' });
    const { body: before } = await get('/companies/1/items');
    expect(before.total).toBe(
      GUARDRAILS.MOCK_SERVER.ACTIVE_ITEMS_INITIAL_COUNT + 1
    );

    resetItemsStore();
    resetItemExtensionResourceStores();
    resetUserPermissionsStore();
    resetPrototypeToolSettingsStore();
    server.shutdown();
    server = mockServer({ logging: false });

    const { body: after } = await get('/companies/1/items');
    expect(after.total).toBe(GUARDRAILS.MOCK_SERVER.ACTIVE_ITEMS_INITIAL_COUNT);
  });
});
