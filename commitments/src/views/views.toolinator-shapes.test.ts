import { createConfig } from '@procore/json-toolinator';
import { createCreateView } from './create/index';
import { createDetailView } from './detail/index';
import { createGenericItemDetailView } from './genericItemDetail/index';
import { createEditView } from './edit/index';
import { createHomeView } from './home/index';
import { createHubView } from './hub/index';
import { createListView } from './list/index';
import { createListRecycleView } from './list/listRecycle';
import { createToolLandingView } from './toolLanding/index';
import { createToolLandingRecycleView } from './toolLanding/toolLandingRecycle';
import { createPermissionsView } from './permissions/index';
import {
  createSettingsPermissionsView,
  createSettingsView,
} from './settings/index';
import { createItemEmailsView } from './itemExtensions/itemEmailsView.config';
import { createItemRelatedItemsView } from './itemExtensions/itemRelatedItemsView.config';
import { createItemDocumentsView } from './itemExtensions/itemDocumentsView.config';
import { createItemHistoryView } from './itemHistory/index';

const LAYOUT_COMPONENTS = new Set([
  'page',
  'detailPage',
  'toolLandingPage',
  'settingsPage',
  'adminPage',
  'panel',
  'modal',
]);

function assertViewShape(view: {
  path?: string;
  layout?: { component?: string };
}) {
  expect(typeof view.path).toBe('string');
  expect((view.path as string).length).toBeGreaterThan(0);
  const comp = view.layout?.component;
  expect(typeof comp).toBe('string');
  expect(LAYOUT_COMPONENTS.has(comp as string)).toBe(true);
}

describe('Toolinator view configs', () => {
  const config = createConfig({
    basePath:
      '/companies/$companyId/tools/prototype' as `/companies/$companyId/tools/${string}`,
    toolName: 'prototypeApp',
    translations: {} as const,
  });

  it('registers hero + core views with path and known layout components', () => {
    const views = [
      createHomeView(config),
      createListView(config),
      createListRecycleView(config),
      createToolLandingView(config),
      createToolLandingRecycleView(config),
      createGenericItemDetailView(config),
      createDetailView(config),
      createEditView(config),
      createCreateView(config),
      createHubView(config),
      createPermissionsView(config),
      createSettingsView(config),
      createSettingsPermissionsView(config),
    ];
    for (const v of views) {
      assertViewShape(v as never);
    }
  });

  it('registers item extension views with detailPage layout', () => {
    const views = [
      createItemEmailsView(config),
      createItemRelatedItemsView(config),
      createItemDocumentsView(config),
      createItemHistoryView(config),
    ];
    for (const v of views) {
      assertViewShape(v as never);
    }
  });
});
