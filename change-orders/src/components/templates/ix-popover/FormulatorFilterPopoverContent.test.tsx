/**
 * @jest-environment jsdom
 */
import React from 'react';
import * as CoreReact from '@procore/core-react';
import { render, screen, fireEvent } from '@testing-library/react';

import { emptySmartGridToolbarFilterFormData } from '@/views/list/smartGridFilterMapping';

jest.mock('@procore/json-formulator', () => {
  const ReactActual = require('react') as typeof import('react');
  const actual = jest.requireActual('@procore/json-formulator') as Record<
    string,
    unknown
  >;
  return {
    ...actual,
    Form: ReactActual.forwardRef(function FilterPopoverTestMockForm(
      props: {
        onChange?: (ev: { formData: Record<string, unknown> }) => void;
      },
      _ref: unknown
    ) {
      return (
        <button
          type="button"
          data-testid="filter-popover-mock-form-change"
          onClick={() => {
            const { emptySmartGridToolbarFilterFormData: emptyForm } =
              require('@/views/list/smartGridFilterMapping') as {
                emptySmartGridToolbarFilterFormData: () => Record<
                  string,
                  unknown
                >;
              };
            props.onChange?.({
              formData: {
                ...emptyForm(),
                referenceCode: 'ABC',
              },
            });
          }}
        >
          Fire form change
        </button>
      );
    }),
  };
});

import { FormulatorFilterPopoverContent } from './FormulatorFilterPopoverContent';
import {
  getMirageListFilterPopoverSchema,
  getMirageListFilterPopoverUiSchema,
} from '@/views/list/listFilterPopover.schema';

const mockHide = jest.fn();

describe('FormulatorFilterPopoverContent', () => {
  beforeEach(() => {
    mockHide.mockClear();
    jest.spyOn(CoreReact, 'UNSAFE_useOverlayTriggerContext').mockReturnValue({
      hide: mockHide,
      show: jest.fn(),
      toggle: jest.fn(),
    } as ReturnType<typeof CoreReact.UNSAFE_useOverlayTriggerContext>);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Apply calls onApply with form data and closes the overlay', () => {
    const onApply = jest.fn();
    render(
      <FormulatorFilterPopoverContent
        schema={getMirageListFilterPopoverSchema()}
        uiSchema={getMirageListFilterPopoverUiSchema()}
        initialData={emptySmartGridToolbarFilterFormData()}
        onApply={onApply}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onApply.mock.calls[0]![0]).toEqual(
      emptySmartGridToolbarFilterFormData()
    );
    expect(mockHide).toHaveBeenCalled();
  });

  it('Clear All resets via onApply with empty data and closes', () => {
    const onApply = jest.fn();
    render(
      <FormulatorFilterPopoverContent
        schema={getMirageListFilterPopoverSchema()}
        uiSchema={getMirageListFilterPopoverUiSchema()}
        initialData={{
          ...emptySmartGridToolbarFilterFormData(),
          status: 'Open',
        }}
        onApply={onApply}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear All' }));
    expect(onApply).toHaveBeenCalledWith(emptySmartGridToolbarFilterFormData());
    expect(mockHide).toHaveBeenCalled();
  });

  it('debounces onLiveChange after form changes', () => {
    jest.useFakeTimers();
    try {
      const onApply = jest.fn();
      const onLiveChange = jest.fn();
      render(
        <FormulatorFilterPopoverContent
          schema={getMirageListFilterPopoverSchema()}
          uiSchema={getMirageListFilterPopoverUiSchema()}
          initialData={emptySmartGridToolbarFilterFormData()}
          onApply={onApply}
          onLiveChange={onLiveChange}
        />
      );
      fireEvent.click(screen.getByTestId('filter-popover-mock-form-change'));
      expect(onLiveChange).not.toHaveBeenCalled();
      jest.advanceTimersByTime(279);
      expect(onLiveChange).not.toHaveBeenCalled();
      jest.advanceTimersByTime(2);
      expect(onLiveChange).toHaveBeenCalledTimes(1);
      expect(onLiveChange.mock.calls[0]![0]).toEqual(
        expect.objectContaining({ referenceCode: 'ABC' })
      );
      fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
      expect(onApply).toHaveBeenCalledWith(
        expect.objectContaining({ referenceCode: 'ABC' })
      );
    } finally {
      jest.useRealTimers();
    }
  });
});
