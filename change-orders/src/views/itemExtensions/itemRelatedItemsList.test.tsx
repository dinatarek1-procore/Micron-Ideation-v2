/**
 * @jest-environment jsdom
 */
import React from 'react';
import { Box } from '@procore/core-react';
import { render, screen } from '@testing-library/react';

import { ItemRelatedItemsList } from './ItemRelatedItemsList';

jest.mock('@procore/related-items', () => ({
  __esModule: true,
  RelatedItems: () => <Box data-testid="related-items-component" />,
}));

const mockUseViewContext = jest.fn();

jest.mock('@procore/json-toolinator', () => ({
  ...jest.requireActual('@procore/json-toolinator'),
  useViewContext: (...args: unknown[]) => mockUseViewContext(...args),
}));

describe('ItemRelatedItemsList', () => {
  beforeEach(() => {
    mockUseViewContext.mockReturnValue({
      params: { companyId: '1', itemId: '2' },
    });
  });

  it('renders RelatedItems stub', () => {
    render(<ItemRelatedItemsList />);
    expect(screen.getByTestId('related-items-component')).toBeTruthy();
  });
});
