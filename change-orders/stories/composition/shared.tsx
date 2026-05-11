import React, { useEffect, useRef } from 'react';
import type { Meta } from '@storybook/react-webpack5';
import { Tool } from '@procore/json-toolinator';

import {
  environment,
  init as initEnvironment,
} from '../../src/config/environment';
import { resetItemsStore } from '../../src/mockServer/itemsStore';
import { resetUserPermissionsStore } from '../../src/mockServer/userPermissionsStore';
import { resetItemExtensionResourceStores } from '../../src/mockServer/resetItemExtensionResourceStores';
import { mockServer } from '../../src/mockServer/mockServer';
import {
  getTranslations,
  getTranslationsPath,
} from '../../src/shared/translations';
import { translations } from '../../src/shared/translations.types';

export function MirageDecorator({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const serverRef = useRef<ReturnType<typeof mockServer> | null>(null);

  if (globalThis.window !== undefined && serverRef.current === null) {
    initEnvironment();
    resetItemsStore();
    resetUserPermissionsStore();
    resetItemExtensionResourceStores();
    serverRef.current = mockServer({
      environment: 'development',
      logging: false,
    });
  }

  useEffect(() => {
    return () => {
      serverRef.current?.shutdown();
      serverRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

export const baseMeta: Partial<Meta<typeof Tool>> = {
  component: Tool,
  decorators: [
    (Story) => (
      <MirageDecorator>
        <Story />
      </MirageDecorator>
    ),
  ],
};

export const sharedToolArgs = {
  bugsnagApiKey: environment.BUGSNAG_API_KEY ?? '',
  getTranslations,
  getTranslationsPath,
  localTranslations: { en: translations },
  UNSAFE_useMemoryRouter: true,
};
