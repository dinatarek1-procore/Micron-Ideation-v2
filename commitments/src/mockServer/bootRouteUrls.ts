import { metadataEndpoint } from './environmentMetadata';

/**
 * Single source of truth for boot-time Mirage routes / external stubs.
 * Layer 1 tests assert these patterns appear in `mockServer.ts`.
 * Layer 2 tests fetch the concrete URLs from `getBootRouteFetchSpecs()`.
 */
export const BOOT_ROUTE_URLS = {
  environmentMetadataV11: metadataEndpoint,
  earlyAccessEnrollees:
    '/rest/v2.0/companies/:companyId/early_access/enrollees_for_user',
  settingsPermissions: '/rest/v1.0/settings/permissions',
  remoteRegistry: '/webclients/prototype/remote-registry/remote-registry.json',
  remoteRegistryOverrides:
    '/webclients/prototype/remote-registry-overrides/remote-registry-overrides.json',
  launchDarklyEvalx: 'https://app.launchdarkly.com/sdk/evalx',
  bugsnagSessions: 'https://sessions.bugsnag.com',
  bugsnagNotify: 'https://notify.bugsnag.com',
  translationsCdn:
    'https://translations.cdn.procoretech-qa.com/prototype-scaffold/src/locales',
  /** Marker substring expected in `mockServer.ts` for the web-sdk-events bridge. */
  systemEventEnvironmentContextRequested: 'ENVIRONMENT_CONTEXT_REQUESTED',
} as const;

export type BootRouteKey = keyof typeof BOOT_ROUTE_URLS;

const DEFAULT_ORIGIN = 'http://localhost:3000';

export type BootRouteFetchSpec = {
  key: BootRouteKey;
  /** Full URL to pass to `fetch()` inside tests */
  url: string;
  /** Optional assertion on response body */
  assertBody?: (text: string) => void;
};

/**
 * Builds concrete GET URLs for integration-style boot route tests.
 * `origin` should match the test host (e.g. jsdom default or Mirage passthrough origin).
 */
export function getBootRouteFetchSpecs(
  origin: string = DEFAULT_ORIGIN
): BootRouteFetchSpec[] {
  const base = origin.replace(/\/$/, '');
  return [
    {
      key: 'environmentMetadataV11',
      url: `${base}${BOOT_ROUTE_URLS.environmentMetadataV11}?company_id=1`,
    },
    {
      key: 'earlyAccessEnrollees',
      url: `${base}/rest/v2.0/companies/1/early_access/enrollees_for_user`,
    },
    {
      key: 'settingsPermissions',
      url: `${base}${BOOT_ROUTE_URLS.settingsPermissions}`,
    },
    {
      key: 'remoteRegistry',
      url: `${base}${BOOT_ROUTE_URLS.remoteRegistry}`,
      assertBody: (text) => {
        const parsed = JSON.parse(text) as { remoteEntries?: unknown[] };
        if (!Array.isArray(parsed.remoteEntries)) {
          throw new Error('remote-registry.json must include remoteEntries[]');
        }
      },
    },
    {
      key: 'remoteRegistryOverrides',
      url: `${base}${BOOT_ROUTE_URLS.remoteRegistryOverrides}`,
      assertBody: (text) => {
        const parsed = JSON.parse(text) as { remoteEntries?: unknown[] };
        if (!Array.isArray(parsed.remoteEntries)) {
          throw new Error(
            'remote-registry-overrides.json must include remoteEntries[]'
          );
        }
      },
    },
    {
      key: 'launchDarklyEvalx',
      url: `${BOOT_ROUTE_URLS.launchDarklyEvalx}/mock-client/mock-env`,
    },
    {
      key: 'bugsnagSessions',
      url: `${BOOT_ROUTE_URLS.bugsnagSessions}/`,
    },
    {
      key: 'bugsnagNotify',
      url: `${BOOT_ROUTE_URLS.bugsnagNotify}/`,
    },
    {
      key: 'translationsCdn',
      url: `${BOOT_ROUTE_URLS.translationsCdn}/en.json.br`,
    },
  ];
}
