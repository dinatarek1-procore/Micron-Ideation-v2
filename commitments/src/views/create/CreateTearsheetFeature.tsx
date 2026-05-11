import React from 'react';
import type { CommonProps } from '@procore/json-toolinator';

import { ListToolLandingTabulator } from '@/views/list/ListToolLandingTabulator';

import { CreateFormTearsheetView } from './CreateFormTearsheetView';

/**
 * Feature component for the `/create` route. Renders the tool landing tabulator
 * as the background so the layout doesn't shift when Create is clicked, then
 * mounts the slide-out tearsheet on top (z-30 via TearsheetShell).
 *
 * CommonProps are forwarded to ListToolLandingTabulator so its type contract
 * is satisfied — Toolinator injects these when mounting the feature component.
 *
 * Full pattern rules: `.cursor/rules/ix-tearsheet.mdc`, `.cursor/rules/ix-patterns.mdc`.
 */
export function CreateTearsheetFeature(props: Readonly<CommonProps>) {
  return (
    <>
      <ListToolLandingTabulator {...props} />
      <CreateFormTearsheetView />
    </>
  );
}
