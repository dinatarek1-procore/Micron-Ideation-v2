import React, { useState, type ReactNode } from 'react';
import { SplitViewCard, useSplitViewCard } from '@procore/core-react';

/**
 * Thin IX Pattern 1 (Split-View) shell. Composes `@procore/core-react`
 * `SplitViewCard` + `useSplitViewCard` so consumers only have to provide:
 *
 *   - `list`:   a table rendered in the left pane. Use `@procore/json-tabulator`
 *               or `@procore/smart-grid` — do NOT handcraft an HTML table.
 *   - `detail`: a read-only or edit view rendered in the right pane when a row
 *               is selected.
 *
 * The shell owns `selected` state and the Panel's open/close state so both
 * render-props can stay presentational.
 *
 * Full rules: `.cursor/rules/ix-split-view.mdc`. A first-class `splitViewPage`
 * Toolinator layout is tracked in `skills/ds-cheat-sheet/TOOLINATOR-EXTENSIONS.md`.
 */

export interface SplitViewShellListRenderArgs<T> {
  onRowActivate: (row: T) => void;
  selected: T | null;
  isOpen: boolean;
}

export interface SplitViewShellDetailRenderArgs<T> {
  selected: T;
  close: () => void;
}

export interface SplitViewShellProps<T> {
  list: (args: SplitViewShellListRenderArgs<T>) => ReactNode;
  detail: (args: SplitViewShellDetailRenderArgs<T>) => ReactNode;
  isInitiallyOpen?: boolean;
  isClosable?: boolean;
  'aria-labelledby'?: string;
}

function InnerShell<T>({
  list,
  detail,
}: Pick<SplitViewShellProps<T>, 'list' | 'detail'>) {
  const { isOpen, show, hide } = useSplitViewCard();
  const [selected, setSelected] = useState<T | null>(null);

  const onRowActivate = (row: T) => {
    setSelected(row);
    show();
  };

  const close = () => {
    hide();
  };

  return (
    <>
      <SplitViewCard.Main>
        {list({ onRowActivate, selected, isOpen })}
      </SplitViewCard.Main>
      <SplitViewCard.Panel>
        {selected ? detail({ selected, close }) : null}
      </SplitViewCard.Panel>
    </>
  );
}

export function SplitViewShell<T>({
  list,
  detail,
  isInitiallyOpen = false,
  isClosable = true,
  'aria-labelledby': ariaLabelledBy,
}: SplitViewShellProps<T>) {
  return (
    <SplitViewCard
      isInitiallyOpen={isInitiallyOpen}
      isClosable={isClosable}
      aria-labelledby={ariaLabelledBy}
    >
      <InnerShell list={list} detail={detail} />
    </SplitViewCard>
  );
}
