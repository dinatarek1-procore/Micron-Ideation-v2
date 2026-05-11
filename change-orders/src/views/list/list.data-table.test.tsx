/**
 * List view renders Toolinator custom feature (JSON Tabulator Table) against Mirage.
 */
import React from 'react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { PROTOTYPE_TOOL_LIST_URL } from '@/components/mfe-global-nav-package/standalone/src/lib/prototypeToolPaths';
import App from '@/app';
import { mockServer } from '@/mockServer/mockServer';

describe('List view data table', () => {
  let server: ReturnType<typeof mockServer>;
  let xhrOpenSpy: jest.SpyInstance;
  let fetchSpy: jest.SpyInstance;

  beforeAll(() => {
    server = mockServer({ logging: false });
  });

  afterAll(() => {
    server.shutdown();
  });

  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    xhrOpenSpy = jest.spyOn(XMLHttpRequest.prototype, 'open');
    fetchSpy = jest.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    xhrOpenSpy.mockRestore();
    fetchSpy.mockRestore();
  });

  it('loads rows from Mirage (seed item 1) on the list route', async () => {
    render(<App />);

    await act(async () => {
      window.history.replaceState(null, '', PROTOTYPE_TOOL_LIST_URL);
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });

    await waitFor(
      () => {
        expect(screen.getByTestId('view-list')).toBeTruthy();
      },
      { timeout: 10_000 }
    );

    // Tool landing title from list view layout (may appear in page chrome + section)
    await waitFor(
      () => {
        expect(screen.getAllByText('New tool').length).toBeGreaterThan(0);
      },
      { timeout: 10_000 }
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('list-tool-json-tabulator')).toBeTruthy();
      },
      { timeout: 15_000 }
    );

    await waitFor(
      () => {
        expect(document.body.textContent).toContain(
          'Sample record — primary example row'
        );
      },
      { timeout: 15_000 }
    );

    const tabulatorHost = screen.getByTestId(
      'prototype-tool-new-json-tabulator'
    );
    await waitFor(
      () => {
        expect(
          within(tabulatorHost).getAllByText('View').length
        ).toBeGreaterThan(0);
      },
      { timeout: 15_000 }
    );
    expect(within(tabulatorHost).getAllByText('Edit').length).toBeGreaterThan(
      0
    );

    // Data table may use XHR (not fetch); assert Mirage items list was requested for company 1.
    await waitFor(
      () => {
        const xhrUrls = xhrOpenSpy.mock.calls.map((args) => String(args[1]));
        const fetchUrls = fetchSpy.mock.calls.map((args) => {
          const raw = args[0];
          return typeof raw === 'string' ? raw : String((raw as Request).url);
        });
        const hit = [...xhrUrls, ...fetchUrls].some(
          (u) =>
            u.includes('companies/1/items') && !/\/items\/\d+(\?|$)/.test(u)
        );
        expect(hit).toBe(true);
      },
      { timeout: 15_000 }
    );

    const res = await fetch('/rest/v1.0/companies/1/items?page=1&per_page=20');
    expect(res.ok).toBe(true);
    const body = (await res.json()) as { data: { referenceCode: string }[] };
    expect(body.data.some((row) => row.referenceCode === 'ITEM-1001')).toBe(
      true
    );
  });
});
