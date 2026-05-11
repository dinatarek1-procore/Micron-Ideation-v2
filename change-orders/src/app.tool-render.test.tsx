/**
 * Renders the real App shell + Toolinator against Mirage (catches env-init hangs).
 */
import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import {
  PROTOTYPE_TOOL_HOME_URL,
  PROTOTYPE_TOOL_LIST_URL,
  shellNavigate,
} from '@/components/mfe-global-nav-package/standalone/src/lib/prototypeToolPaths';
import App from './app';
import { mockServer } from './mockServer/mockServer';

describe('App Tool render', () => {
  let server: ReturnType<typeof mockServer>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    server = mockServer({ logging: false });
  });

  afterAll(() => {
    server.shutdown();
  });

  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('reaches prototype home then tool landing without console.error', async () => {
    render(<App />);

    await act(async () => {
      window.history.replaceState(null, '', PROTOTYPE_TOOL_HOME_URL);
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });

    await waitFor(
      () => {
        expect(screen.getByTestId('pbs-prototype-home')).toBeTruthy();
      },
      { timeout: 10_000 }
    );

    await act(async () => {
      shellNavigate(PROTOTYPE_TOOL_LIST_URL);
    });

    await waitFor(
      () => {
        expect(screen.getByTestId('view-list')).toBeTruthy();
      },
      { timeout: 10_000 }
    );

    const substantiveErrors = consoleErrorSpy.mock.calls.filter((call) => {
      const text = call.map((a: unknown) => String(a)).join(' ');
      // smart-grid-cells filter UI forwards AG Grid / filter props to core-react Input;
      // React logs those as console.error — not an app regression.
      if (text.includes('React does not recognize')) return false;
      if (text.includes('Unknown event handler property')) return false;
      // AG Grid logs this when @procore/data-table applies row updates under server-side
      // row model (json-tabulator /new list). Not controlled by prototype scaffold code.
      if (text.includes('api.setRowData can only be called when')) return false;
      return true;
    });
    expect(substantiveErrors).toHaveLength(0);
  });
});
