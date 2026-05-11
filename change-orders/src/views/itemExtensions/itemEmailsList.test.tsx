/**
 * @jest-environment jsdom
 */
import React from 'react';
import { Box } from '@procore/core-react';
import { render, screen } from '@testing-library/react';

import { ItemEmailsList } from './ItemEmailsList';

jest.mock('@procore/engagement-emails', () => {
  const Provider = ({ children }: { children?: React.ReactNode }) => (
    <Box data-testid="emails-provider">{children}</Box>
  );
  const EmailsInner = () => <Box data-testid="emails-component" />;
  const Emails = Object.assign(EmailsInner, { Provider });
  return { __esModule: true, Emails };
});

const mockUseViewContext = jest.fn();

jest.mock('@procore/json-toolinator', () => ({
  ...jest.requireActual('@procore/json-toolinator'),
  useViewContext: (...args: unknown[]) => mockUseViewContext(...args),
}));

describe('ItemEmailsList', () => {
  beforeEach(() => {
    mockUseViewContext.mockReturnValue({
      params: { companyId: '1', itemId: '2' },
      queries: {
        item: { data: { data: { summary: 'Test item' } } },
      },
    });
  });

  it('renders engagement Emails stub', () => {
    render(<ItemEmailsList />);
    expect(screen.getByTestId('emails-provider')).toBeTruthy();
    expect(screen.getByTestId('emails-component')).toBeTruthy();
  });
});
