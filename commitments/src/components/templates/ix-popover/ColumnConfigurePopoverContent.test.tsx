/**
 * @jest-environment jsdom
 */
import React from 'react';
import * as CoreReact from '@procore/core-react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { ColumnConfigurePopoverContent } from './ColumnConfigurePopoverContent';
import { reorderColumnOrder } from '@/views/list/smartGridFilterMapping';

const mockHide = jest.fn();

describe('reorderColumnOrder', () => {
  it('moves an item from index 0 to the end', () => {
    expect(reorderColumnOrder(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
  });
});

describe('ColumnConfigurePopoverContent', () => {
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

  it('hiding a column and choosing Large (comfortable) density apply live; Done closes', async () => {
    const onApply = jest.fn();
    render(
      <ColumnConfigurePopoverContent
        columns={[
          { colId: 'c1', headerName: 'One', hide: false },
          { colId: 'c2', headerName: 'Two', hide: false },
        ]}
        initialRowHeight={40}
        onApply={onApply}
      />
    );

    await waitFor(() => expect(onApply).toHaveBeenCalled());
    onApply.mockClear();

    const toggles = screen.getAllByRole('switch');
    fireEvent.click(toggles[0]!);

    await waitFor(() => expect(onApply).toHaveBeenCalled());
    expect(onApply).toHaveBeenLastCalledWith(
      expect.objectContaining({
        rowHeight: 40,
        columns: expect.arrayContaining([
          expect.objectContaining({ colId: 'c1', hide: true }),
          expect.objectContaining({ colId: 'c2', hide: false }),
        ]),
      })
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Large' }));

    await waitFor(() =>
      expect(onApply).toHaveBeenLastCalledWith(
        expect.objectContaining({
          rowHeight: 56,
          columns: expect.arrayContaining([
            expect.objectContaining({ colId: 'c1', hide: true }),
            expect.objectContaining({ colId: 'c2', hide: false }),
          ]),
        })
      )
    );

    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(mockHide).toHaveBeenCalled();
  });
});
