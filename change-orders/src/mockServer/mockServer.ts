import { createServer, Response } from 'miragejs';
import { SystemEventNames } from '@procore/web-sdk-events';
import {
  listItems,
  listRecycledItems,
  getItemById,
  createItem,
  updateItem,
  moveItemToRecycleBin,
} from './itemsStore';
import {
  getEmailsForItem,
  getEmailCommunicationDetail,
  mapItemEmailsToEngagementCommunicationsList,
} from './itemEmailsStore';
import { getChangeHistoryForItem } from './itemChangeHistory';
import { getRelatedItemsForItem } from './itemRelatedItemsStore';
import { getDocumentsForItem } from './itemDocumentsStore';
import {
  getHubProject,
  getHubLinks,
  getHubOpenItems,
  getHubAnalytics,
  getHubSafety,
} from './hubDataStore';
import {
  listUserPermissions,
  updateUserPermission,
} from './userPermissionsStore';
import { getPermissionsManifest } from './permissionsManifest';
import {
  getPrototypeToolSettings,
  patchPrototypeToolSettings,
} from './prototypeToolSettingsStore';
import { getEnvMetadata, metadataEndpoint } from './environmentMetadata';
import { getProcoreEnvironment } from './procoreEnvironment';
import { allFlags } from './launchDarkly';
import { BOOT_ROUTE_URLS } from './bootRouteUrls';
import { systemEvents } from '../shared/events';
import enTranslations from '../locales/en.json';

export { resetItemsStore } from './itemsStore';
export { resetItemExtensionResourceStores } from './resetItemExtensionResourceStores';
export { resetUserPermissionsStore } from './userPermissionsStore';
export { resetPrototypeToolSettingsStore } from './prototypeToolSettingsStore';

interface MockServerOptions {
  environment?: string;
  logging?: boolean;
}

/** Avoid duplicate ENVIRONMENT_CONTEXT_SENT when multiple Mirage instances are created in one JSDOM session. */
let activeMirageServers = 0;
let environmentContextBridgeInstalled = false;

function ensureEnvironmentContextBridge() {
  if (environmentContextBridgeInstalled) return;
  environmentContextBridgeInstalled = true;
  systemEvents.subscribe(SystemEventNames.ENVIRONMENT_CONTEXT_REQUESTED, () => {
    if (activeMirageServers === 0) return;
    systemEvents.publish(
      SystemEventNames.ENVIRONMENT_CONTEXT_SENT,
      getEnvMetadata()
    );
  });
}

export function mockServer(options: MockServerOptions = {}) {
  const { logging = false } = options;
  ensureEnvironmentContextBridge();

  const server = createServer({
    logging,
    routes() {
      this.namespace = 'rest/v1.0';
      this.timing = 0;

      // Items CRUD
      this.get('/companies/:companyId/items', (_schema, request) => {
        const qp = request.queryParams ?? {};
        const recycledRaw = qp['filters[recycled]'] as string | undefined;
        const recycled =
          recycledRaw === 'true' ||
          recycledRaw === '1' ||
          recycledRaw === 'yes';
        const search = qp['filters[search]'] as string | undefined;
        const status = qp['filters[status]'] as string | undefined;
        const divisionCode = qp['filters[divisionCode]'] as string | undefined;
        const assignee = qp['filters[assignee]'] as string | undefined;
        const referenceCode = qp['filters[referenceCode]'] as
          | string
          | undefined;
        const summary = qp['filters[summary]'] as string | undefined;
        const dueDate = qp['filters[dueDate]'] as string | undefined;
        const dueDateFrom = qp['filters[dueDateFrom]'] as string | undefined;
        const dueDateTo = qp['filters[dueDateTo]'] as string | undefined;
        const page = Number(request.queryParams?.page) || 1;
        const perPage = Number(request.queryParams?.per_page) || 20;
        const listFn = recycled ? listRecycledItems : listItems;
        const result = listFn({
          search,
          status,
          divisionCode,
          assignee,
          referenceCode,
          summary,
          dueDate,
          dueDateFrom,
          dueDateTo,
          page,
          perPage,
        });
        return new Response(200, {}, result);
      });

      this.get('/companies/:companyId/items/:id', (_schema, request) => {
        const id = Number(request.params.id);
        const item = getItemById(id);
        if (!item) return new Response(404, {}, { error: 'Not found' });
        return new Response(200, {}, { data: item });
      });

      this.post('/companies/:companyId/items', (_schema, request) => {
        const body = JSON.parse(request.requestBody as string);
        const item = createItem(body);
        return new Response(201, {}, { data: item });
      });

      this.patch('/companies/:companyId/items/:id', (_schema, request) => {
        const id = Number(request.params.id);
        const body = JSON.parse(request.requestBody as string);
        const item = updateItem(id, body);
        if (!item) return new Response(404, {}, { error: 'Not found' });
        return new Response(200, {}, { data: item });
      });

      this.delete('/companies/:companyId/items/:id', (_schema, request) => {
        const id = Number(request.params.id);
        if (!moveItemToRecycleBin(id)) {
          return new Response(404, {}, { error: 'Not found' });
        }
        return new Response(204, {}, null as unknown as undefined);
      });

      this.get('/companies/:companyId/users', () => {
        return new Response(200, {}, { data: [] });
      });

      // Item extension tabs
      this.get(
        '/companies/:companyId/items/:itemId/emails',
        (_schema, request) => {
          const itemId = Number(request.params.itemId);
          const emails = getEmailsForItem(itemId);
          return new Response(200, {}, { data: emails, total: emails.length });
        }
      );

      this.get(
        '/companies/:companyId/items/:itemId/change_history',
        (_schema, request) => {
          const itemId = Number(request.params.itemId);
          const qp = request.queryParams ?? {};
          const page = Number(qp.page) || 1;
          const perPage = Number(qp.per_page) || 100;
          const sort = (qp.sort as string | undefined) ?? 'created_at';

          const history = [...getChangeHistoryForItem(itemId)];
          if (sort === 'created_at') {
            history.sort((a, b) => a.created_at.localeCompare(b.created_at));
          } else if (sort === '-created_at') {
            history.sort((a, b) => a.created_at.localeCompare(b.created_at));
            history.reverse();
          }

          const slice = history.slice((page - 1) * perPage, page * perPage);
          return new Response(
            200,
            { total: `${history.length}` },
            { data: slice }
          );
        }
      );

      this.get(
        '/companies/:companyId/items/:itemId/related_items',
        (_schema, request) => {
          const itemId = Number(request.params.itemId);
          const related = getRelatedItemsForItem(itemId);
          return new Response(
            200,
            {},
            { data: related, total: related.length }
          );
        }
      );

      this.get(
        '/companies/:companyId/items/:itemId/documents',
        (_schema, request) => {
          const itemId = Number(request.params.itemId);
          const docs = getDocumentsForItem(itemId);
          return new Response(200, {}, { data: docs, total: docs.length });
        }
      );

      this.get('/companies/:companyId/email_communications/emails', () => {
        return new Response(
          200,
          {},
          {
            emails: [],
            total: 0,
            new_communication_email: 'prototype@example.com',
          }
        );
      });

      // @procore/engagement-emails — project-scoped list (topic_type / topic_id from ItemEmailsList)
      this.get(
        '/project/:projectId/email_communications/emails',
        (_schema, request) => {
          const qp = request.queryParams ?? {};
          const topicId = Number((qp.topic_id as string | undefined) ?? '1');
          const list = getEmailsForItem(Number.isFinite(topicId) ? topicId : 1);
          const emails = mapItemEmailsToEngagementCommunicationsList(list);
          return new Response(
            200,
            {},
            {
              emails,
              total: emails.length,
              new_communication_email: 'prototype@example.com',
            }
          );
        }
      );

      // @procore/engagement-emails — communication thread (row click → getCommunication)
      this.get(
        '/project/:projectId/email_communications/:communicationId',
        (_schema, request) => {
          const communicationId = String(request.params.communicationId);
          const detail = getEmailCommunicationDetail(communicationId);
          if (!detail) {
            return new Response(404, {}, { error: 'Not found' });
          }
          return new Response(200, {}, detail);
        }
      );

      this.namespace = 'rest/v2.0';
      this.get('/companies/:companyId', () => {
        return new Response(200, {}, { data: { show_bcc: false } });
      });

      // @procore/related-items — v2 APIs (POST list, GET permissions, POST linked_types)
      this.post(
        '/companies/:companyId/projects/:projectId/related_items/list',
        (_schema, request) => {
          let holderIds: string[] = [];
          try {
            const body = JSON.parse(
              (request.requestBody as string) || '{}'
            ) as { holder_ids?: string[] };
            holderIds = body.holder_ids ?? [];
          } catch {
            holderIds = [];
          }
          const itemId = Number(holderIds[0] ?? '1');
          const rows = getRelatedItemsForItem(itemId);
          const data = rows.map((r, i) => ({
            related_items_id: r.id,
            display_name: r.related_title,
            can_delete: true,
            // Not a known @procore/related-items domain — uses DefaultHorizontalCard. `taskitem` renders
            // TasksCardFields, which calls I18n.t('category', { scope: 'relatedItems.tasks' }); package
            // locale defines `category` as an object map, which React cannot render as a label child.
            model_name: 'GenericToolItem',
            model_id: String(1000 + i),
            // Optional metadata for future richer mocks; default cards only use display_name/title paths.
            value: {
              title: r.related_title,
              status: 'Open',
              priority: 'High',
              number: `#${1000 + i}`,
              due_date: '2026-06-15',
            },
          }));
          return new Response(
            200,
            {
              total: String(data.length),
              'x-total-count': String(data.length),
            },
            { data }
          );
        }
      );

      this.get(
        '/companies/:companyId/projects/:projectId/related_items/permissions',
        () => new Response(200, {}, { data: { can_create: false } })
      );

      this.post(
        '/companies/:companyId/projects/:projectId/related_items/linked_types',
        () =>
          new Response(
            200,
            {},
            {
              data: [
                {
                  model_name: 'GenericToolItem',
                  display_name: 'Related records',
                  is_relatable: true,
                },
              ],
            }
          )
      );

      this.namespace = 'rest/v1.1';
      this.get('/companies/:companyId/me', () => {
        return new Response(
          200,
          {},
          { email_address: 'prototype@example.com' }
        );
      });

      this.namespace = 'rest/v1.0';

      // Hub endpoints
      this.get('/companies/:companyId/hub/project', () => {
        return new Response(200, {}, getHubProject());
      });

      this.get('/companies/:companyId/hub/links', () => {
        return new Response(200, {}, getHubLinks());
      });

      this.get('/companies/:companyId/hub/open-items', () => {
        return new Response(200, {}, getHubOpenItems());
      });

      this.get('/companies/:companyId/hub/analytics', () => {
        return new Response(200, {}, getHubAnalytics());
      });

      this.get('/companies/:companyId/hub/safety', () => {
        return new Response(200, {}, getHubSafety());
      });

      // Permissions
      this.get('/companies/:companyId/user_permissions', () => {
        return new Response(200, {}, { data: listUserPermissions() });
      });

      this.patch(
        '/companies/:companyId/user_permissions/:id',
        (_schema, request) => {
          const { id } = request.params;
          const body = JSON.parse(request.requestBody as string);
          const user = updateUserPermission(id, body.access_level_id);
          if (!user) return new Response(404, {}, { error: 'Not found' });
          return new Response(200, {}, { data: user });
        }
      );

      this.get('/companies/:companyId/settings/permissions_manifest', () => {
        return new Response(200, {}, getPermissionsManifest());
      });

      this.get('/settings/permissions', () => {
        return new Response(200, {}, getPermissionsManifest());
      });

      // Prototype tool settings (json-formulator General tab)
      this.get(
        '/companies/:companyId/prototype_tool_settings',
        (_schema, request) => {
          const companyId = String(request.params.companyId);
          return new Response(
            200,
            {},
            { data: getPrototypeToolSettings(companyId) }
          );
        }
      );

      this.patch(
        '/companies/:companyId/prototype_tool_settings',
        (_schema, request) => {
          const companyId = String(request.params.companyId);
          const body = JSON.parse(request.requestBody as string) as {
            data?: Record<string, unknown>;
          };
          const patch = (body?.data ?? body) as Record<string, unknown>;
          const updated = patchPrototypeToolSettings(companyId, patch as any);
          return new Response(200, {}, { data: updated });
        }
      );

      // Environment stubs (namespaced)
      this.get('/environment_metadata', () => {
        return new Response(200, {}, getEnvMetadata());
      });

      this.get('/companies/:companyId/procore_environment', (_schema, req) => {
        return new Response(
          200,
          {},
          getProcoreEnvironment(Number(req.params.companyId))
        );
      });

      // Versioned + third-party paths (empty namespace = full URL match)
      this.namespace = '';
      this.get(metadataEndpoint, () => {
        return new Response(200, {}, getEnvMetadata());
      });
      this.get(BOOT_ROUTE_URLS.earlyAccessEnrollees, () => {
        return new Response(200, {}, { data: [] });
      });

      this.get('https://app.launchdarkly.com/sdk/evalx/**', () => allFlags);
      this.get('https://app.launchdarkly.com/**', () => new Response(200));
      this.post('https://sessions.bugsnag.com', () => new Response(200));
      this.post('https://notify.bugsnag.com', () => new Response(200));
      // Root URL (trailing slash) is not matched by `/**` in all Mirage versions.
      this.get(
        'https://sessions.bugsnag.com/',
        () => new Response(200, {}, {})
      );
      this.get('https://notify.bugsnag.com/', () => new Response(200, {}, {}));
      this.get(
        'https://sessions.bugsnag.com/**',
        () => new Response(200, {}, {})
      );
      this.get(
        'https://notify.bugsnag.com/**',
        () => new Response(200, {}, {})
      );

      this.get(BOOT_ROUTE_URLS.remoteRegistry, () => ({
        remoteEntries: [],
      }));
      this.get(BOOT_ROUTE_URLS.remoteRegistryOverrides, () => ({
        remoteEntries: [],
      }));

      this.get(
        'https://translations.cdn.procoretech-qa.com/prototype-scaffold/src/locales/:locale.json.br',
        () => new Response(200, {}, enTranslations)
      );

      this.passthrough('https://a.mtstatic.com/**');
      this.passthrough('/webclients/**');
    },
  });

  activeMirageServers++;
  const originalShutdown = server.shutdown.bind(server);
  server.shutdown = () => {
    activeMirageServers = Math.max(0, activeMirageServers - 1);
    originalShutdown();
  };

  return server;
}
