/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';

import {
  emptySmartGridToolbarFilterFormData,
  mergeToolbarIntoAgGridFilterModel,
} from './smartGridFilterMapping';
import { useSmartGridToolbarFilters } from './useSmartGridToolbarFilters';

describe('useSmartGridToolbarFilters', () => {
  it('clearField removes one key and bumps filterFormResetKey', () => {
    const { result } = renderHook(() => useSmartGridToolbarFilters());
    act(() => {
      result.current.applyFilterData({
        ...emptySmartGridToolbarFilterFormData(),
        status: 'Open',
        referenceCode: 'TLN-0001',
      });
    });
    expect(result.current.activeCount).toBe(2);
    const keyBefore = result.current.filterFormResetKey;
    act(() => {
      result.current.clearField('status');
    });
    expect(result.current.filterData.status).toBe('');
    expect(result.current.filterData.referenceCode).toBe('TLN-0001');
    expect(result.current.filterFormResetKey).toBe(keyBefore + 1);
  });
});

describe('mergeToolbarIntoAgGridFilterModel', () => {
  it('keeps non-toolbar keys like search while applying toolbar filters', () => {
    const data = {
      ...emptySmartGridToolbarFilterFormData(),
      status: 'Open',
    };
    const merged = mergeToolbarIntoAgGridFilterModel(
      { search: { filter: 'needle' } } as Record<string, unknown>,
      data
    );
    expect(merged.search).toEqual({ filter: 'needle' });
    expect(merged.status).toEqual({ filter: 'Open' });
  });

  it('removes toolbar keys when form fields are cleared', () => {
    const merged = mergeToolbarIntoAgGridFilterModel(
      { search: { filter: 'x' }, status: { filter: 'Open' } } as Record<
        string,
        unknown
      >,
      emptySmartGridToolbarFilterFormData()
    );
    expect(merged.search).toEqual({ filter: 'x' });
    expect(merged.status).toBeUndefined();
  });
});
