/**
 * Integration checks for Mirage boot routes Toolinator hits during environment init.
 */
import { SystemEventNames } from '@procore/web-sdk-events';
import { getEnvMetadata } from './environmentMetadata';
import { getBootRouteFetchSpecs } from './bootRouteUrls';
import { mockServer } from './mockServer';
import { systemEvents } from '@/shared/events';

describe('mockServer boot routes', () => {
  let server: ReturnType<typeof mockServer>;

  beforeAll(() => {
    server = mockServer({ logging: false });
  });

  afterAll(() => {
    server.shutdown();
  });

  it('returns ok for every boot fetch URL', async () => {
    const specs = getBootRouteFetchSpecs('http://localhost');
    expect(specs.length).toBeGreaterThan(0);

    for (const spec of specs) {
      const res = await fetch(spec.url);
      if (!res.ok) {
        throw new Error(
          `[${spec.key}] ${spec.url} -> HTTP ${res.status} ${res.statusText}`
        );
      }
      const text = await res.text();
      const assertBody = spec.assertBody;
      if (assertBody) {
        expect(() => assertBody(text)).not.toThrow();
      }
    }
  });

  it('responds to ENVIRONMENT_CONTEXT_REQUESTED via systemEvents', async () => {
    const expected = getEnvMetadata();
    const payload = await new Promise<unknown>((resolve, reject) => {
      const timer = setTimeout(
        () =>
          reject(
            new Error(
              'Timed out waiting for ENVIRONMENT_CONTEXT_SENT (bridge broken?)'
            )
          ),
        500
      );

      systemEvents.subscribe(
        SystemEventNames.ENVIRONMENT_CONTEXT_SENT,
        (message: unknown) => {
          clearTimeout(timer);
          resolve(message);
        }
      );

      systemEvents.publish(
        SystemEventNames.ENVIRONMENT_CONTEXT_REQUESTED,
        {},
        {}
      );
    });

    const unwrap = (message: unknown): unknown => {
      if (!message || typeof message !== 'object') return message;
      const o = message as Record<string, unknown>;
      if ('payload' in o && o.payload) return unwrap(o.payload);
      if (
        'data' in o &&
        o.data &&
        typeof o.data === 'object' &&
        'user' in (o.data as Record<string, unknown>)
      ) {
        return o.data;
      }
      if (
        'message' in o &&
        o.message &&
        typeof o.message === 'object' &&
        'user' in (o.message as Record<string, unknown>)
      ) {
        return o.message;
      }
      return message;
    };

    expect(unwrap(payload)).toEqual(expected);
  });
});
