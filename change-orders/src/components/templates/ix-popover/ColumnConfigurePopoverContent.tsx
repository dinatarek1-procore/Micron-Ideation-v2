/**
 * Configure popover: column visibility, drag-to-reorder (pragmatic-drag-and-drop),
 * and row density presets for AG Grid. Changes call `onApply` as soon as they
 * commit; Done only closes the overlay.
 */

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import {
  Box,
  Button,
  Label,
  SegmentedController,
  Switch,
  Typography,
  UNSAFE_useOverlayTriggerContext,
  colors,
  spacing,
} from '@procore/core-react';
import { Grip } from '@procore/core-icons';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import styled from 'styled-components';

import { reorderColumnOrder } from '@/views/list/smartGridFilterMapping';

export type ColumnConfigureRow = {
  colId: string;
  headerName: string;
  hide: boolean;
};

export type ColumnConfigureApplyPayload = {
  columns: ColumnConfigureRow[];
  rowHeight: number;
};

export type ColumnConfigurePopoverContentProps = {
  columns: ColumnConfigureRow[];
  initialRowHeight: number;
  onApply: (payload: ColumnConfigureApplyPayload) => void;
};

const DENSITY_ROW_HEIGHT = {
  compact: 32,
  default: 40,
  comfortable: 56,
} as const;

type DensityKey = keyof typeof DENSITY_ROW_HEIGHT;

const DENSITY_ORDER: DensityKey[] = ['compact', 'default', 'comfortable'];

function payloadKey(columns: ColumnConfigureRow[], rowHeight: number): string {
  return JSON.stringify({
    rowHeight,
    cols: columns.map((c) => ({ i: c.colId, h: c.hide })),
  });
}

function densityKeyForHeight(h: number): DensityKey {
  if (h <= 32) return 'compact';
  if (h >= 56) return 'comfortable';
  return 'default';
}

const RowWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs}px;
  padding: ${spacing.xs}px 0;
  border-bottom: 1px solid ${colors.gray94};
`;

const GripButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${colors.gray45};
  cursor: grab;
  border-radius: 4px;
  &:hover {
    background: ${colors.gray96};
  }
`;

function ColumnOrderRow({
  column,
  index,
  onToggleHide,
  onReorder,
}: Readonly<{
  column: ColumnConfigureRow;
  index: number;
  onToggleHide: (colId: string, hide: boolean) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}>) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const gripRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const el = rowRef.current;
    const handle = gripRef.current;
    if (!el || !handle) return;

    return combine(
      draggable({
        element: el,
        dragHandle: handle,
        getInitialData: () => ({
          type: 'prototype-column-order',
          index,
          colId: column.colId,
        }),
      }),
      dropTargetForElements({
        element: el,
        getData: () => ({
          type: 'prototype-column-order',
          index,
          colId: column.colId,
        }),
        canDrop: ({ source }) =>
          (source.data as { type?: string }).type === 'prototype-column-order',
        onDrop: ({ source, self }) => {
          const src = source.data as { index?: number };
          const dest = self.data as { index?: number };
          const srcIndex = typeof src.index === 'number' ? src.index : -1;
          const destIndex = typeof dest.index === 'number' ? dest.index : -1;
          if (srcIndex >= 0 && destIndex >= 0 && srcIndex !== destIndex) {
            onReorder(srcIndex, destIndex);
          }
        },
      })
    );
  }, [column.colId, index, onReorder]);

  return (
    <RowWrap ref={rowRef}>
      <GripButton
        ref={gripRef}
        type="button"
        aria-label={`Reorder ${column.headerName}`}
      >
        <Grip />
      </GripButton>
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Typography intent="small" weight="bold">
          {column.headerName || column.colId}
        </Typography>
      </Box>
      <Switch
        checked={!column.hide}
        onChange={(e) => onToggleHide(column.colId, !e.target.checked)}
      >
        Show
      </Switch>
    </RowWrap>
  );
}

export function ColumnConfigurePopoverContent({
  columns: initialColumns,
  initialRowHeight,
  onApply,
}: Readonly<ColumnConfigurePopoverContentProps>) {
  const { hide } = UNSAFE_useOverlayTriggerContext();
  const snapshot = useMemo(
    () => ({
      columns: initialColumns.map((c) => ({ ...c })),
      rowHeight: initialRowHeight,
    }),
    [initialColumns, initialRowHeight]
  );

  const [rows, setRows] = useState<ColumnConfigureRow[]>(() =>
    snapshot.columns.map((c) => ({ ...c }))
  );
  const [density, setDensity] = useState<DensityKey>(
    densityKeyForHeight(snapshot.rowHeight)
  );

  const rowsRef = useRef(rows);
  const densityRef = useRef(density);
  const onApplyRef = useRef(onApply);
  rowsRef.current = rows;
  densityRef.current = density;
  onApplyRef.current = onApply;

  const lastAppliedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    setRows(snapshot.columns.map((c) => ({ ...c })));
    setDensity(densityKeyForHeight(snapshot.rowHeight));
  }, [snapshot]);

  /** Apply after commit so we never send a stale payload in the same tick as snapshot sync. */
  useEffect(() => {
    let cancelled = false;
    const t = window.setTimeout(() => {
      if (cancelled) return;
      const d = densityRef.current;
      const rowHeight = DENSITY_ROW_HEIGHT[d];
      const columns = rowsRef.current.map((r) => ({ ...r }));
      const key = payloadKey(columns, rowHeight);
      if (lastAppliedKeyRef.current === key) return;
      lastAppliedKeyRef.current = key;
      onApplyRef.current({ columns, rowHeight });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [rows, density]);

  const handleToggleHide = useCallback((colId: string, hide: boolean) => {
    setRows((prev) =>
      prev.map((r) => (r.colId === colId ? { ...r, hide } : r))
    );
  }, []);

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    setRows((prev) => reorderColumnOrder(prev, fromIndex, toIndex));
  }, []);

  const handleReset = useCallback(() => {
    setRows(snapshot.columns.map((c) => ({ ...c })));
    setDensity(densityKeyForHeight(snapshot.rowHeight));
  }, [snapshot]);

  const handleDone = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      hide(e);
    },
    [hide]
  );

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          padding: spacing.sm,
          borderBottom: `1px solid ${colors.gray94}`,
          flexShrink: 0,
        }}
      >
        <Typography as="div" intent="body" weight="bold">
          Configure
        </Typography>
        <Typography
          as="div"
          intent="small"
          style={{ color: colors.gray45, marginTop: spacing.xs }}
        >
          Reorder columns, show or hide them, and set row density.
        </Typography>
      </header>

      <Box
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          padding: `0 ${spacing.sm}px`,
        }}
      >
        <Label
          id="row-density-label"
          htmlFor="row-density-segmented"
          style={{ display: 'block', marginTop: spacing.sm }}
        >
          Row density
        </Label>
        <Box style={{ marginTop: spacing.xs, marginBottom: spacing.md }}>
          <SegmentedController
            id="row-density-segmented"
            block
            aria-labelledby="row-density-label"
            onChange={(value) => {
              const n = typeof value === 'number' ? value : Number(value);
              if (!Number.isNaN(n) && n >= 0 && n < DENSITY_ORDER.length) {
                setDensity(DENSITY_ORDER[n]!);
              }
            }}
          >
            <SegmentedController.Segment selected={density === 'compact'}>
              Small
            </SegmentedController.Segment>
            <SegmentedController.Segment selected={density === 'default'}>
              Medium
            </SegmentedController.Segment>
            <SegmentedController.Segment selected={density === 'comfortable'}>
              Large
            </SegmentedController.Segment>
          </SegmentedController>
        </Box>

        <Typography intent="small" weight="bold">
          Columns
        </Typography>
        {rows.map((col, index) => (
          <ColumnOrderRow
            key={col.colId}
            column={col}
            index={index}
            onReorder={handleReorder}
            onToggleHide={handleToggleHide}
          />
        ))}
      </Box>

      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: spacing.xs,
          flexShrink: 0,
          padding: spacing.sm,
          borderTop: `1px solid ${colors.gray94}`,
          backgroundColor: colors.white,
        }}
      >
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          onClick={() => handleReset()}
        >
          Reset
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleDone}
        >
          Done
        </Button>
      </footer>
    </Box>
  );
}
