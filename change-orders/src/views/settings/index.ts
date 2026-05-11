import { createView, type FormFeatureRef } from '@procore/json-toolinator';

import { prototypePermissionsTableFeature } from '../permissions/permissionsFeature.js';
import { getPrototypeToolSettingsOptions } from './settingsGeneral.api.js';
import { SettingsGeneralForm } from './SettingsGeneralForm.js';
import { settingsTemplateTabs } from './settingsTemplateTabs.js';

const settingsLayout = {
  component: 'settingsPage' as const,
  title: 'Settings',
  hasNavigation: true,
  breadcrumbs: [{ title: 'Home', view: 'home' }],
  tabs: [...settingsTemplateTabs],
};

/** General tab: `/settings` with Save/Cancel footer actions. */
export function createSettingsView(config: any) {
  return createView('settings', {
    config,
    path: '/settings',
    layout: settingsLayout,
    queries: ({ params }: any) => ({
      prototypeToolSettings: getPrototypeToolSettingsOptions({
        companyId: String(params.companyId),
      }),
    }),
    feature: {
      component: SettingsGeneralForm,
      actions: [
        { title: 'Cancel', view: 'home', variant: 'tertiary' },
        {
          title: 'Save',
          variant: 'primary',
          onClick:
            ({ featureRef }) =>
            () => {
              (featureRef.current as FormFeatureRef | null)?.submit?.();
            },
        },
      ],
    },
  });
}

/** Permissions tab: same built-in permissions table as `/settings/permissions`. */
export function createSettingsPermissionsView(config: any) {
  return createView('settingsPermissions', {
    config,
    path: '/settings/user-access',
    layout: settingsLayout,
    feature: prototypePermissionsTableFeature,
  });
}
