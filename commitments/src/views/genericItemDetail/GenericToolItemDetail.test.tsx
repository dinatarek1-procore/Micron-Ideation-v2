/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';

import { GenericToolItemDetail } from './GenericToolItemDetail';

describe('GenericToolItemDetail', () => {
  it('renders static demo fields', () => {
    render(<GenericToolItemDetail />);
    expect(screen.getByTestId('pbs-generic-tool-item-detail')).toBeTruthy();
    expect(screen.getByText('General Information')).toBeTruthy();
    expect(screen.getByText('RFI-001')).toBeTruthy();
    expect(screen.getByText('Section Name')).toBeTruthy();
  });
});
