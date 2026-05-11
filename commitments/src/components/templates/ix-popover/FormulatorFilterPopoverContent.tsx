/**
 * Rich toolbar filter body: json-formulator fields + Clear All / Apply footer.
 * Closes via `UNSAFE_useOverlayTriggerContext` after Apply or Clear All.
 */

import {
  Box,
  Button,
  UNSAFE_useOverlayTriggerContext,
  colors,
  spacing,
} from '@procore/core-react';
import { Form, type FormRef } from '@procore/json-formulator';
import type { JsonSchema, UiSchema } from '@procore/json-formulator';
import { useCallback, useEffect, useRef, type MouseEvent } from 'react';

import type { SmartGridToolbarFilterFormData } from '@/views/list/smartGridFilterMapping';
import { emptySmartGridToolbarFilterFormData } from '@/views/list/smartGridFilterMapping';

const LIVE_CHANGE_DEBOUNCE_MS = 280;

export type FormulatorFilterPopoverContentProps = {
  schema: JsonSchema;
  uiSchema: UiSchema;
  /** Seed when popover opens or when parent bumps `resetKey`. */
  initialData: SmartGridToolbarFilterFormData;
  /** Bump to re-mount the form from `initialData` (e.g. after chip remove). */
  resetKey?: number;
  onApply: (data: SmartGridToolbarFilterFormData) => void;
  /** Debounced updates while editing (does not close the popover). */
  onLiveChange?: (data: SmartGridToolbarFilterFormData) => void;
};

export function FormulatorFilterPopoverContent({
  schema,
  uiSchema,
  initialData,
  resetKey = 0,
  onApply,
  onLiveChange,
}: Readonly<FormulatorFilterPopoverContentProps>) {
  const { hide } = UNSAFE_useOverlayTriggerContext();
  const formRef = useRef<FormRef | null>(null);
  const latestRef = useRef<SmartGridToolbarFilterFormData>(initialData);
  const liveDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onLiveChangeRef = useRef(onLiveChange);

  useEffect(() => {
    onLiveChangeRef.current = onLiveChange;
  }, [onLiveChange]);

  useEffect(() => {
    latestRef.current = initialData;
  }, [initialData, resetKey]);

  const clearLiveDebounce = useCallback(() => {
    if (liveDebounceRef.current != null) {
      clearTimeout(liveDebounceRef.current);
      liveDebounceRef.current = null;
    }
  }, []);

  useEffect(() => () => clearLiveDebounce(), [clearLiveDebounce]);

  const scheduleLiveChange = useCallback(
    (next: SmartGridToolbarFilterFormData) => {
      const live = onLiveChangeRef.current;
      if (!live) return;
      clearLiveDebounce();
      liveDebounceRef.current = setTimeout(() => {
        liveDebounceRef.current = null;
        live(next);
      }, LIVE_CHANGE_DEBOUNCE_MS);
    },
    [clearLiveDebounce]
  );

  const handleClearAll = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      clearLiveDebounce();
      const cleared = emptySmartGridToolbarFilterFormData();
      latestRef.current = cleared;
      onApply(cleared);
      hide(e);
    },
    [clearLiveDebounce, hide, onApply]
  );

  const handleApply = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      clearLiveDebounce();
      onApply(latestRef.current);
      hide(e);
    },
    [clearLiveDebounce, hide, onApply]
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
      <Box
        style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: spacing.sm }}
      >
        <Form
          key={`filter-form-${resetKey}`}
          ref={formRef}
          initialData={initialData}
          liveValidate={false}
          onChange={(ev) => {
            const next = ev.formData as
              | SmartGridToolbarFilterFormData
              | undefined;
            if (next) {
              latestRef.current = next;
              scheduleLiveChange(next);
            }
          }}
          schema={schema}
          uiSchema={{
            ...uiSchema,
            'ui:submitButtonOptions': { norender: true },
          }}
        />
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
          onClick={handleClearAll}
        >
          Clear All
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleApply}
        >
          Apply
        </Button>
      </footer>
    </Box>
  );
}
