import React from 'react';
import { Tool } from '@procore/json-toolinator';
import { config } from './app.config';
import enTranslations from './locales/en.json';
import { ItemSnapshotProvider } from './context/ItemSnapshotContext.js';
import { UnifiedAppShell } from './shell';

function App() {
  return (
    <ItemSnapshotProvider>
      <UnifiedAppShell>
        <Tool
          bugsnagApiKey=""
          config={config}
          getTranslations={async () => enTranslations as any}
          getTranslationsPath={() => '/'}
          localTranslations={{ en: enTranslations }}
        />
      </UnifiedAppShell>
    </ItemSnapshotProvider>
  );
}

export default App;
