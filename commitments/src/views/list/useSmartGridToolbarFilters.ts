import { useCallback, useMemo, useState } from 'react';

import {
  buildAgGridFilterPartialFromFormData,
  buildExtraQueryParamsFromFormData,
  buildFilterChips,
  clearFilterField,
  countActiveFilterFields,
  emptySmartGridToolbarFilterFormData,
  type SmartGridFilterChip,
  type SmartGridToolbarFilterFormData,
} from './smartGridFilterMapping';

export type UseSmartGridToolbarFiltersResult = {
  filterData: SmartGridToolbarFilterFormData;
  /** Apply toolbar filter form (popover Apply / Clear All). */
  applyFilterData: (next: SmartGridToolbarFilterFormData) => void;
  /** Remove one field and bump form remount key for the filter popover. */
  clearField: (field: keyof SmartGridToolbarFilterFormData) => void;
  clearAllFilters: () => void;
  /** Pass to `FormulatorFilterPopoverContent` so chip removes re-seed the form. */
  filterFormResetKey: number;
  activeCount: number;
  chips: SmartGridFilterChip[];
};

/**
 * Client-side state for the rich toolbar filter (json-formulator popover + chips row).
 * Parent applies `buildAgGridFilterPartialFromFormData(filterData)` to the grid and
 * merges `buildExtraQueryParamsFromFormData(filterData)` into server requests where needed.
 */
export function useSmartGridToolbarFilters(): UseSmartGridToolbarFiltersResult {
  const [filterData, setFilterData] = useState<SmartGridToolbarFilterFormData>(
    () => emptySmartGridToolbarFilterFormData()
  );
  const [filterFormResetKey, setFilterFormResetKey] = useState(0);

  const applyFilterData = useCallback(
    (next: SmartGridToolbarFilterFormData) => {
      setFilterData(next);
    },
    []
  );

  const clearField = useCallback(
    (field: keyof SmartGridToolbarFilterFormData) => {
      setFilterData((d) => clearFilterField(d, field));
      setFilterFormResetKey((k) => k + 1);
    },
    []
  );

  const clearAllFilters = useCallback(() => {
    setFilterData(emptySmartGridToolbarFilterFormData());
    setFilterFormResetKey((k) => k + 1);
  }, []);

  const activeCount = useMemo(
    () => countActiveFilterFields(filterData),
    [filterData]
  );
  const chips = useMemo(() => buildFilterChips(filterData), [filterData]);

  return {
    filterData,
    applyFilterData,
    clearField,
    clearAllFilters,
    filterFormResetKey,
    activeCount,
    chips,
  };
}

export {
  buildAgGridFilterPartialFromFormData,
  buildExtraQueryParamsFromFormData,
};
