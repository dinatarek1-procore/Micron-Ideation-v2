import '@procore/core-css/dist/core.css';
import './components/mfe-global-nav-package/standalone/src/index.css';
/** After Tailwind: AG Grid base + Alpine (@font-face agGridAlpine). Order avoids base layer fighting theme. */
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './agGridAlpineIconFont.css';

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { replaceRootPathWithPrototypeHome } from '@/components/mfe-global-nav-package/standalone/src/lib/prototypeToolPaths';
import { mockServer } from './mockServer/mockServer';
import App from './app';

replaceRootPathWithPrototypeHome();
mockServer({ environment: 'development', logging: false });

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
