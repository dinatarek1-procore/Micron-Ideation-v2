import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useViewContext } from '@procore/json-toolinator';
import { Form, type FormRef } from '@procore/json-formulator';
import { ConnectedFileSelectWidget } from '@procore/json-formulator-extensions';

import { GUARDRAILS } from '@/shared/guardrails';
import { useDebouncedAutosave } from '@/shared/useDebouncedAutosave';
import {
  TearsheetShell,
  TearsheetAutosaveIndicator,
  buildFormDraftKey,
} from '@/components/templates/tearsheet';

import {
  getCreateInitialData,
  getCreateSchema,
  getCreateUiSchema,
  type CreateFormData,
} from './create.schema';

/**
 * IX Pattern 3 — Quick Create slide-out with **autosave** (no Save / Cancel
 * footer), satisfying REFERENCE.md "Data Entry → NO Save/Cancel — autosave
 * only". Saves fire on debounced `onChange` via `useDebouncedAutosave`.
 *
 *   - First change: POST → creates a draft, stores the returned id.
 *   - Subsequent changes: PATCH the draft id.
 *   - Close: flush any pending save, navigate to the draft's detail view.
 *   - Tab refresh: Formulator's `localStorageKey` re-hydrates the in-progress
 *     form body from `localStorage` (covers the gap between the last POST and
 *     an unlucky tab close / refresh).
 *
 * `totalHours` is kept in sync with `workers × hours` via `onChange` so the
 * read-only computed field stays accurate without a server round-trip.
 *
 * Full rules: `.cursor/rules/ix-tearsheet.mdc`.
 */

const TITLE_ID = 'create-entry-tearsheet-title';

const createFormWidgets = {
  connectedFileSelect: ConnectedFileSelectWidget,
};

function coerceNumber(value: unknown): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function hasAnyContent(data: CreateFormData): boolean {
  return (
    coerceNumber(data.workers) > 0 ||
    coerceNumber(data.hours) > 0 ||
    (typeof data.comments === 'string' && data.comments.trim() !== '') ||
    !!data.company ||
    !!data.location ||
    !!data.trade
  );
}

export function CreateFormTearsheetView() {
  const { params, navigate, queryClient } = useViewContext({ strict: false });
  const { companyId } = params;
  const companyIdStr = String(companyId ?? '1');
  const companyIdNum = Number(companyIdStr) || 1;

  const [open, setOpen] = useState(true);
  const formRef = useRef<FormRef | null>(null);
  const savedIdRef = useRef<string | null>(null);
  const syncingTotalHours = useRef(false);

  const draftKey = buildFormDraftKey('create-entry', {
    companyId: companyIdStr,
  });

  const { initialData, schema, uiSchema } = useMemo(
    () => ({
      initialData: getCreateInitialData(),
      schema: getCreateSchema(),
      uiSchema: getCreateUiSchema({ companyId: companyIdNum }),
    }),
    [companyIdNum]
  );

  const autosave = useDebouncedAutosave<CreateFormData>({
    onSave: async (data) => {
      if (!hasAnyContent(data)) return;

      const { totalHours: _totalHours, comments, ...rest } = data;
      const existingId = savedIdRef.current;
      const url = existingId
        ? `/rest/v1.0/companies/${companyIdStr}/items/${existingId}`
        : `/rest/v1.0/companies/${companyIdStr}/items`;
      const method = existingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rest,
          comments,
          summary: `${rest.log} · ${rest.date}`,
          description: comments ?? '',
          location: rest.location ?? '',
        }),
      });
      if (!res.ok) throw new Error(`Autosave failed (${res.status})`);

      if (!existingId) {
        const body = await res.json();
        const created = body?.data ?? body;
        const id = created?.id == null ? null : String(created.id);
        if (id) savedIdRef.current = id;
      }

      await queryClient.invalidateQueries({
        queryKey: ['items', companyIdStr],
      });
    },
  });

  const handleFormChange = useCallback(
    (ev: { formData?: CreateFormData }) => {
      const data = ev.formData;
      if (!data || syncingTotalHours.current) return;

      const workers = coerceNumber(data.workers);
      const hours = coerceNumber(data.hours);
      const nextTotal = workers * hours;
      const currentTotal = coerceNumber(data.totalHours);

      if (currentTotal !== nextTotal) {
        syncingTotalHours.current = true;
        const patch: CreateFormData = { ...data, totalHours: nextTotal };
        (
          formRef.current as unknown as {
            onChange?: (p: { formData: CreateFormData }) => void;
          }
        )?.onChange?.({ formData: patch });
        queueMicrotask(() => {
          syncingTotalHours.current = false;
        });
      }

      autosave.onChange(data);
    },
    [autosave]
  );

  const handleClose = async () => {
    await autosave.flush();
    setOpen(false);

    const savedId = savedIdRef.current;
    if (savedId) {
      formRef.current?.reset();
      await navigate({
        to: `${GUARDRAILS.DEMO_ROUTE.BASE_PATH}/items/$itemId`,
        params: {
          companyId: companyIdStr,
          itemId: savedId,
        },
      });
    } else {
      await navigate({ ignoreBlocker: true, to: '..' });
    }
  };

  return (
    <TearsheetShell
      open={open}
      onClose={() => {
        void handleClose();
      }}
      title="Create Entry"
      titleId={TITLE_ID}
      footer={
        <TearsheetAutosaveIndicator
          status={autosave.status}
          lastSavedAt={autosave.lastSavedAt}
          error={autosave.error}
        />
      }
    >
      <Form
        formContext={{ companyId: companyIdNum, projectId: 31 }}
        initialData={initialData}
        liveValidate={false}
        localStorageKey={draftKey}
        onChange={handleFormChange}
        ref={formRef}
        schema={schema}
        uiSchema={uiSchema}
        widgets={createFormWidgets}
      />
    </TearsheetShell>
  );
}
