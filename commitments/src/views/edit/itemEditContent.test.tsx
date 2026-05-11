/**
 * @jest-environment jsdom
 */
import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';

import App from '@/app';
import { mockServer } from '@/mockServer/mockServer';
import { PROTOTYPE_TOOL_BASE } from '@/components/mfe-global-nav-package/standalone/src/lib/prototypeToolPaths';

/** RJSF / json-formulator may log React DOM prop warnings in jsdom (unknown props, `autofocus` vs `autoFocus`, etc.). */
function isBenignDomPropWarning(args: unknown[]): boolean {
  const text = args.map(String).join('\n');
  return (
    (text.includes('React does not recognize') &&
      text.includes('prop on a DOM element')) ||
    (text.includes('Invalid DOM property') && text.includes('Did you mean'))
  );
}

describe('ItemEditContent', () => {
  let server: ReturnType<typeof mockServer>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    server = mockServer({ logging: false });
  });

  afterAll(() => {
    server.shutdown();
  });

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('shows general section and save/cancel on edit route', async () => {
    render(<App />);

    await act(async () => {
      window.history.replaceState(
        null,
        '',
        `${PROTOTYPE_TOOL_BASE}/items/1/edit`
      );
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });

    await waitFor(
      () => {
        expect(
          screen.getAllByText('General Information').length
        ).toBeGreaterThan(0);
      },
      { timeout: 15_000 }
    );

    // getByRole walks computed styles; jsdom + styled-components can throw on invalid selectors.
    expect(screen.getByText('Save Changes')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
    const unexpected = consoleErrorSpy.mock.calls.filter(
      (c) => !isBenignDomPropWarning(c)
    );
    expect(unexpected).toEqual([]);
  });
});
