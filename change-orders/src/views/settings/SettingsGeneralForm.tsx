import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Form, type FormRef, type FormStatus } from '@procore/json-formulator';
import { useViewContext } from '@procore/json-toolinator';
import { Box, SettingsPage } from '@procore/core-react';

import type { PrototypeToolSettings } from '@/mockServer/prototypeToolSettingsStore';

import { useUpdatePrototypeToolSettingsMutation } from './settingsGeneral.api';
import {
  getSettingsPrimarySchema,
  getSettingsPrimaryUiSchema,
  getSettingsTextSchema,
  getSettingsTextUiSchema,
} from './settingsGeneral.schema';

type GeneralFormValues = {
  settings_1: string;
  settings_2: string;
  settings_3: string;
  settings_4: string;
};

const defaultFormValues: GeneralFormValues = {
  settings_1: 'option_a',
  settings_2: '',
  settings_3: '',
  settings_4: '',
};

function buildInitialSlices(settings: Partial<PrototypeToolSettings>) {
  return {
    primary: {
      settings_1: settings.settings_1 ?? 'option_a',
      settings_2: settings.settings_2 ?? '',
    },
    text: {
      settings_3: settings.settings_3 ?? '',
      settings_4: settings.settings_4 ?? '',
    },
  };
}

function sanitizeBody(data: GeneralFormValues): Partial<PrototypeToolSettings> {
  return {
    settings_1: data.settings_1,
    settings_2: data.settings_2.trim(),
    settings_3: data.settings_3.trim(),
    settings_4: data.settings_4.trim(),
  };
}

export function SettingsGeneralForm() {
  const {
    queries: { prototypeToolSettings: { data = {} } = {} },
    params: { companyId },
    toasts,
    featureRef,
  } = useViewContext({ strict: false });

  const { mutateAsync: updateSettings } =
    useUpdatePrototypeToolSettingsMutation();

  const settings = data as Partial<PrototypeToolSettings>;
  const { primary: initialPrimary, text: initialText } =
    buildInitialSlices(settings);
  const formHydrationKey = JSON.stringify({
    settings_1: initialPrimary.settings_1,
    settings_2: initialPrimary.settings_2,
    settings_3: initialText.settings_3,
    settings_4: initialText.settings_4,
  });

  const [mergedFormData, setMergedFormData] = useState<GeneralFormValues>(
    () => ({
      ...defaultFormValues,
      ...initialPrimary,
      ...initialText,
    })
  );

  useEffect(() => {
    const { primary, text } = buildInitialSlices(settings);
    setMergedFormData({ ...defaultFormValues, ...primary, ...text });
  }, [formHydrationKey, settings]);

  const [statusPrimary, setStatusPrimary] = useState<FormStatus>({
    isDirty: false,
    isSubmitting: false,
  });
  const [statusText, setStatusText] = useState<FormStatus>({
    isDirty: false,
    isSubmitting: false,
  });

  const primaryFormRef = useRef<FormRef | null>(null);
  const textFormRef = useRef<FormRef | null>(null);

  const mergedStatus: FormStatus = {
    isDirty: statusPrimary.isDirty || statusText.isDirty,
    isSubmitting: statusPrimary.isSubmitting || statusText.isSubmitting,
  };

  useImperativeHandle(
    featureRef,
    () => ({
      ...mergedStatus,
      formData: mergedFormData,
      reset: () => {
        primaryFormRef.current?.reset?.();
        textFormRef.current?.reset?.();
      },
      setFormData: (next: object | undefined) => {
        if (!next) return;
        const n = next as Partial<GeneralFormValues>;
        setMergedFormData((prev) => {
          const merged: GeneralFormValues = {
            settings_1: n.settings_1 ?? prev.settings_1,
            settings_2: n.settings_2 ?? prev.settings_2,
            settings_3: n.settings_3 ?? prev.settings_3,
            settings_4: n.settings_4 ?? prev.settings_4,
          };
          primaryFormRef.current?.onChange?.({
            formData: {
              settings_1: merged.settings_1,
              settings_2: merged.settings_2,
            },
          } as Parameters<NonNullable<FormRef['onChange']>>[0]);
          textFormRef.current?.onChange?.({
            formData: {
              settings_3: merged.settings_3,
              settings_4: merged.settings_4,
            },
          } as Parameters<NonNullable<FormRef['onChange']>>[0]);
          return merged;
        });
      },
      submit: async () => {
        try {
          await updateSettings({
            companyId: String(companyId),
            body: sanitizeBody(mergedFormData),
          });
          toasts.showToast.success('Settings saved.');
        } catch (e) {
          console.error('Submit error:', e);
          toasts.showToast.error('Could not save settings.');
        }
      },
    }),
    [companyId, mergedFormData, mergedStatus, toasts.showToast, updateSettings]
  );

  const formLiveValidate = { liveValidate: true } as const;

  return (
    <Box data-testid="pbs-settings-general-form">
      <SettingsPage.Card navigationLabel="Primary fields">
        <SettingsPage.Section>
          <Form
            {...formLiveValidate}
            enableConfirmNavigation
            initialData={initialPrimary}
            key={`primary-${formHydrationKey}`}
            onChange={({ formData: next }) => {
              setMergedFormData((prev) => ({ ...prev, ...next }));
            }}
            onStatusChanged={setStatusPrimary}
            ref={primaryFormRef}
            schema={getSettingsPrimarySchema()}
            uiSchema={getSettingsPrimaryUiSchema()}
          />
        </SettingsPage.Section>
      </SettingsPage.Card>
      <SettingsPage.Card navigationLabel="Text fields">
        <SettingsPage.Section>
          <Form
            {...formLiveValidate}
            initialData={initialText}
            key={`text-${formHydrationKey}`}
            onChange={({ formData: next }) => {
              setMergedFormData((prev) => ({ ...prev, ...next }));
            }}
            onStatusChanged={setStatusText}
            ref={textFormRef}
            schema={getSettingsTextSchema()}
            uiSchema={getSettingsTextUiSchema()}
          />
        </SettingsPage.Section>
      </SettingsPage.Card>
    </Box>
  );
}
