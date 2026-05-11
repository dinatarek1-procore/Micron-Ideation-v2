import { createConfig } from '@procore/json-toolinator';

import enTranslations from './locales/en.json';
import { createListView } from './views/list/index.js';
import { createListRecycleView } from './views/list/listRecycle.js';
import { createToolLandingView } from './views/toolLanding/index.js';
import { createToolLandingRecycleView } from './views/toolLanding/toolLandingRecycle.js';
import { createHomeView } from './views/home/index.js';
import { createDetailView } from './views/detail/index.js';
import { createScheduleOfValuesView } from './views/scheduleOfValues/scheduleOfValuesView.config.js';
import { createChangeOrdersView } from './views/changeOrders/changeOrdersView.config.js';
import { createGenericItemDetailView } from './views/genericItemDetail/index.js';
import { createGenericItemRelatedItemsView } from './views/genericItemDetail/genericItemRelatedItemsView.config.js';
import { createGenericItemEmailsView } from './views/genericItemDetail/genericItemEmailsView.config.js';
import { createGenericItemHistoryView } from './views/genericItemDetail/genericItemHistoryView.config.js';
import { createEditView } from './views/edit/index.js';
import { createCreateView } from './views/create/index.js';
import { createHubView } from './views/hub/index.js';
import { createItemEmailsView } from './views/itemExtensions/itemEmailsView.config.js';
import { createItemRelatedItemsView } from './views/itemExtensions/itemRelatedItemsView.config.js';
import { createItemDocumentsView } from './views/itemExtensions/itemDocumentsView.config.js';
import { createItemHistoryView } from './views/itemHistory/index.js';
import { createPermissionsView } from './views/permissions/index.js';
import {
  createSettingsPermissionsView,
  createSettingsView,
} from './views/settings/index.js';

export const config = createConfig({
  basePath:
    '/companies/$companyId/tools/prototype' as `/companies/$companyId/tools/${string}`,
  toolName: 'prototypeApp',
  permissions: { tool: {} },
  translations: enTranslations,
});

export const homeView = createHomeView(config);
export const listView = createListView(config);
export const listRecycleView = createListRecycleView(config);
export const toolLandingView = createToolLandingView(config);
export const toolLandingRecycleView = createToolLandingRecycleView(config);
export const permissionsView = createPermissionsView(config);
export const itemEmailsView = createItemEmailsView(config);
export const itemRelatedItemsView = createItemRelatedItemsView(config);
export const itemDocumentsView = createItemDocumentsView(config);
export const itemHistoryView = createItemHistoryView(config);
export const detailView = createDetailView(config);
export const scheduleOfValuesView = createScheduleOfValuesView(config);
export const changeOrdersView = createChangeOrdersView(config);
export const genericItemDetailView = createGenericItemDetailView(config);
export const genericItemRelatedItemsView =
  createGenericItemRelatedItemsView(config);
export const genericItemEmailsView = createGenericItemEmailsView(config);
export const genericItemHistoryView = createGenericItemHistoryView(config);
export const editView = createEditView(config);
export const createItemView = createCreateView(config);
export const hubView = createHubView(config);
export const settingsView = createSettingsView(config);
export const settingsPermissionsView = createSettingsPermissionsView(config);

export type PrototypeConfig = typeof config;
