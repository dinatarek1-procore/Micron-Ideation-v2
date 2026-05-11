/**
 * Tool landing (generic) view — client-side rows, not Mirage items list.
 */
import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { PROTOTYPE_TOOL_TOOL_LANDING_URL } from '@/components/mfe-global-nav-package/standalone/src/lib/prototypeToolPaths';
import App from '@/app';
import { mockServer } from '@/mockServer/mockServer';

describe('Tool landing (generic) view', () => {
  let server: ReturnType<typeof mockServer>;

  beforeAll(() => {
    server = mockServer({ logging: false });
  });

  afterAll(() => {
    server.shutdown();
  });

  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('renders generic TLN rows without requiring the items collection API', async () => {
    render(<App />);

    await act(async () => {
      window.history.replaceState(null, '', PROTOTYPE_TOOL_TOOL_LANDING_URL);
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });

    await waitFor(
      () => {
        expect(screen.getByTestId('view-toolLanding')).toBeTruthy();
      },
      { timeout: 10_000 }
    );

    await waitFor(
      () => {
        expect(screen.getAllByText('Tool Landing').length).toBeGreaterThan(0);
      },
      { timeout: 10_000 }
    );

    await waitFor(
      () => {
        expect(
          screen.getByTestId('tool-landing-generic-smart-grid')
        ).toBeTruthy();
      },
      { timeout: 15_000 }
    );

    await waitFor(
      () => {
        expect(document.body.textContent).toContain('TLN-0001');
      },
      { timeout: 15_000 }
    );
  });

  it('renders View and Edit actions on visible grid rows', async () => {
    render(<App />);

    await act(async () => {
      window.history.replaceState(null, '', PROTOTYPE_TOOL_TOOL_LANDING_URL);
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });

    await waitFor(
      () => {
        expect(
          screen.getByTestId('tool-landing-generic-smart-grid')
        ).toBeTruthy();
      },
      { timeout: 15_000 }
    );

    await waitFor(
      () => {
        expect(
          screen.getAllByRole('button', { name: 'View' }).length
        ).toBeGreaterThan(0);
      },
      { timeout: 15_000 }
    );
    expect(
      screen.getAllByRole('button', { name: 'Edit' }).length
    ).toBeGreaterThan(0);
  });

  it('shows read-only formulator detail form after selecting a row', async () => {
    render(<App />);

    await act(async () => {
      window.history.replaceState(null, '', PROTOTYPE_TOOL_TOOL_LANDING_URL);
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });

    await waitFor(
      () => {
        expect(screen.getByText('TLN-0001')).toBeTruthy();
      },
      { timeout: 15_000 }
    );

    await act(async () => {
      fireEvent.click(screen.getAllByText('TLN-0001')[0]);
    });

    await waitFor(
      () => {
        expect(
          screen.getByTestId('tool-landing-detail-formulator-form')
        ).toBeTruthy();
      },
      { timeout: 15_000 }
    );
  });
});
