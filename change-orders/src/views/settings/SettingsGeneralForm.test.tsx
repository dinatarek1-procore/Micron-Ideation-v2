/**
 * @jest-environment jsdom
 */
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { SettingsGeneralForm } from './SettingsGeneralForm';

const mockUseViewContext = jest.fn();

jest.mock('@procore/json-toolinator', () => ({
  ...jest.requireActual('@procore/json-toolinator'),
  useViewContext: (...args: unknown[]) => mockUseViewContext(...args),
}));

jest.mock('./settingsGeneral.api', () => ({
  useUpdatePrototypeToolSettingsMutation: () => ({
    mutateAsync: jest.fn().mockResolvedValue(undefined),
  }),
}));

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
}

describe('SettingsGeneralForm', () => {
  beforeEach(() => {
    mockUseViewContext.mockReturnValue({
      queries: {
        prototypeToolSettings: {
          data: {
            settings_1: 'option_a',
            settings_2: 'Desc',
            settings_3: 'Instr',
            settings_4: 'Thanks',
          },
        },
      },
      params: { companyId: '1' },
      toasts: {
        showToast: { success: jest.fn(), error: jest.fn() },
      },
      featureRef: React.createRef(),
    });
  });

  it('renders json-formulator shell and split section titles', () => {
    renderWithClient(<SettingsGeneralForm />);
    expect(screen.getByTestId('pbs-settings-general-form')).toBeTruthy();
    expect(screen.getByText('Primary fields')).toBeTruthy();
    expect(screen.getByText('Text fields')).toBeTruthy();
  });
});
