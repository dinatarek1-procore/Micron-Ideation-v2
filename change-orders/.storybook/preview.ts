import type { Preview } from '@storybook/react';

import '@procore/core-css/dist/core.css';
import '../src/components/mfe-global-nav-package/standalone/src/index.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    chromatic: { disableSnapshot: true },
  },
};

export default preview;
