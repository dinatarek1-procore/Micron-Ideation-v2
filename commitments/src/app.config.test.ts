/**
 * View config tests using guardrail constants.
 * Scaffold template — runs in consumer project with Jest.
 */
import React from 'react';
import { config } from './app.config';
import { GUARDRAILS } from './shared/guardrails';
import { HubDashboard } from './views/hub/HubDashboard';
import { PrototypeHome } from './views/home/PrototypeHome';
import {
  PROTOTYPE_TOOL_NEW_RECYCLE_BIN_URL,
  PROTOTYPE_TOOL_TOOL_LANDING_RECYCLE_BIN_URL,
} from '@/components/mfe-global-nav-package/standalone/src/lib/prototypeToolPaths';

import { ListToolLandingTabulator } from './views/list/ListToolLandingTabulator';
import { ListRecycleFeature } from './views/list/listRecycle';
import { ToolLandingGenericSmartGrid } from './views/toolLanding/ToolLandingGenericSmartGrid';
import { ToolLandingRecycleFeature } from './views/toolLanding/toolLandingRecycle';
import { ItemDetailGeneral } from './views/detail/ItemDetailGeneral';
import { ItemChangeHistoryList } from './views/itemHistory/ItemChangeHistoryList';
import { GenericToolItemDetail } from './views/genericItemDetail/GenericToolItemDetail';
import { ItemEditContent } from './views/edit/ItemEditContent';
import { CreateFormTearsheetView } from './views/create/CreateFormTearsheetView';
import { prototypePermissionsTableFeature } from './views/permissions/permissionsFeature';
import { SettingsGeneralForm } from './views/settings/SettingsGeneralForm';

describe('app.config', () => {
  it(`has basePath matching guardrail: ${GUARDRAILS.DEMO_ROUTE.BASE_PATH}`, () => {
    expect(config.basePath).toBe(GUARDRAILS.DEMO_ROUTE.BASE_PATH);
  });

  it(`registers exactly ${GUARDRAILS.VIEWS.EXPECTED_COUNT} views`, () => {
    const viewNames = Object.keys((config as any).views ?? {});
    expect(viewNames).toHaveLength(GUARDRAILS.VIEWS.EXPECTED_COUNT);
    expect(viewNames.sort()).toEqual([...GUARDRAILS.VIEWS.NAMES].sort());
  });

  it('list view uses toolLandingPage + JSON Tabulator at /new', () => {
    const view = (config as any).views?.list;
    expect(view?.layout?.component).toBe('toolLandingPage');
    expect(view?.layout?.title).toBe('New tool');
    expect(view?.path).toBe('/new');
    expect(view?.feature?.component).toBe(ListToolLandingTabulator);
    expect(view?.layout?.tabs).toEqual([
      expect.objectContaining({ title: 'All items', view: 'list' }),
      expect.objectContaining({
        title: 'Recycle Bin',
        href: PROTOTYPE_TOOL_NEW_RECYCLE_BIN_URL,
      }),
    ]);
    expect(view?.layout?.actions).toHaveLength(2);
    expect(view?.layout?.actions?.[0]).toEqual(
      expect.objectContaining({
        title: 'Create',
        view: 'create',
        variant: 'primary',
      })
    );
  });

  it('listRecycle view uses JSON Tabulator recycle mode at /new/recycle-bin', () => {
    const view = (config as any).views?.listRecycle;
    expect(view?.layout?.component).toBe('toolLandingPage');
    expect(view?.layout?.title).toBe('Recycle Bin');
    expect(view?.path).toBe('/new/recycle-bin');
    expect(view?.feature?.component).toBe(ListRecycleFeature);
    expect(view?.layout?.actions).toEqual([]);
  });

  it('toolLanding view uses toolLandingPage + generic Smart Grid at /tool-landing', () => {
    const view = (config as any).views?.toolLanding;
    expect(view?.layout?.component).toBe('toolLandingPage');
    expect(view?.layout?.title).toBe('Tool Landing');
    expect(view?.path).toBe('/tool-landing');
    expect(view?.feature?.component).toBe(ToolLandingGenericSmartGrid);
    expect(view?.layout?.tabs).toEqual([
      expect.objectContaining({ title: 'All items', view: 'toolLanding' }),
      expect.objectContaining({
        title: 'Recycle Bin',
        href: PROTOTYPE_TOOL_TOOL_LANDING_RECYCLE_BIN_URL,
      }),
    ]);
  });

  it('toolLandingRecycle view uses JSON Tabulator recycle mode at /tool-landing/recycle-bin', () => {
    const view = (config as any).views?.toolLandingRecycle;
    expect(view?.path).toBe('/tool-landing/recycle-bin');
    expect(view?.layout?.component).toBe('toolLandingPage');
    expect(view?.layout?.title).toBe('Recycle Bin');
    expect(view?.feature?.component).toBe(ToolLandingRecycleFeature);
    expect(view?.layout?.actions).toEqual([]);
  });

  it('genericItemDetail view uses detailPage + static GenericToolItemDetail at /sample-items/1', () => {
    const view = (config as any).views?.genericItemDetail;
    expect(view?.layout?.component).toBe('detailPage');
    expect(view?.layout?.width).toBe('block');
    expect(typeof view?.layout?.hasNavigation).toBe('function');
    expect(React.isValidElement(view?.layout?.title)).toBe(true);
    expect(
      view?.layout?.breadcrumbs?.map((c: { title: string }) => c.title)
    ).toEqual(['Tool Name', 'Item Name']);
    expect(view?.path).toBe('/sample-items/1');
    expect(view?.feature?.component).toBe(GenericToolItemDetail);
    expect(view?.queries).toBeUndefined();
    const actions = view?.layout?.actions as
      | Array<{ title: string }>
      | undefined;
    expect(actions).toHaveLength(7);
    const titles = actions?.map((a) => a.title);
    expect(titles?.[0]).toBe('Action [Item name]');
    expect(titles?.[1]).toBe('Edit');
    expect(titles?.[2]).toBe('Export');
    expect(titles?.[3]).toBe('Project Hub');
    expect(titles?.[4]).toBe('Home');
    expect(titles?.[5]).toBe('New tool (prototype)');
    expect(titles?.[6]).toBe('Demo item detail');
  });

  it('generic item extension views use tab-specific header actions (Detail Record parity)', () => {
    const related = (config as any).views?.genericItemRelatedItems;
    expect(related?.layout?.actions?.[0]?.title).toBe('Link Related Item');
    expect(related?.layout?.actions).toHaveLength(1);

    const emails = (config as any).views?.genericItemEmails;
    expect(emails?.layout?.actions?.[0]?.title).toBe('Compose Email');
    expect(emails?.layout?.actions?.[1]?.title).toBe('Settings');
    expect(emails?.layout?.actions).toHaveLength(2);

    const history = (config as any).views?.genericItemHistory;
    expect(history?.layout?.actions?.[0]?.title).toBe('Export');
    expect(history?.layout?.actions?.[0]?.variant).toBe('secondary');
    expect(history?.layout?.actions).toHaveLength(1);
  });

  it('generic item detail tabs: General plain label; other tabs show counts', () => {
    const view = (config as any).views?.genericItemDetail;
    const titles = view?.layout?.tabs?.map((t: { title: string }) => t.title);
    expect(titles?.[0]).toBe('General');
    expect(titles?.[1]).toBe('Related Items (5)');
    expect(titles?.[2]).toBe('Emails (4)');
    expect(titles?.[3]).toBe('Change History (11)');
  });

  it('home view uses page + PrototypeHome at tool root', () => {
    const view = (config as any).views?.home;
    expect(view?.layout?.component).toBe('page');
    expect(view?.path).toBe('/');
    expect(view?.feature?.component).toBe(PrototypeHome);
  });

  it('detail view uses detailPage + ItemDetailGeneral', () => {
    const view = (config as any).views?.detail;
    expect(view?.layout?.component).toBe('detailPage');
    expect(view?.layout?.width).toBe('block');
    expect(typeof view?.layout?.hasNavigation).toBe('function');
    expect(view?.feature?.component).toBe(ItemDetailGeneral);
  });

  it('detail view has tearsheets with edit', () => {
    const view = (config as any).views?.detail;
    expect(view?.layout?.tearsheets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ view: 'edit', block: true }),
      ])
    );
  });

  it('detail view has all 5 tabs', () => {
    const view = (config as any).views?.detail;
    expect(view?.layout?.tabs?.[0]).toEqual(
      expect.objectContaining({ title: 'Overview', view: 'detail' })
    );
    const tabViews = view?.layout?.tabs?.map((t: any) => t.view);
    expect(tabViews).toHaveLength(5);
    expect(tabViews).toContain('detail');
    expect(tabViews).toContain('itemRelatedItems');
    expect(tabViews).toContain('itemEmails');
    expect(tabViews).toContain('itemDocuments');
    expect(tabViews).toContain('itemHistory');
  });

  it('detail view has item query', () => {
    const view = (config as any).views?.detail;
    expect(typeof view?.queries).toBe('function');
    const resolved = view.queries({ params: { companyId: '1', itemId: '2' } });
    expect(Array.isArray(resolved.item?.queryKey)).toBe(true);
    expect(resolved.item?.queryKey?.[0]).toBe('item');
    expect(typeof resolved.item?.queryFn).toBe('function');
  });

  it('edit view uses ItemEditContent and relative path', () => {
    const view = (config as any).views?.edit;
    expect(view?.feature?.component).toBe(ItemEditContent);
    expect(view?.path).toBe('edit');
  });

  it('create view path contains create', () => {
    const view = (config as any).views?.create;
    expect(view?.path).toContain('create');
    expect(view?.feature?.component).toBe(CreateFormTearsheetView);
  });

  it('hub view uses custom component', () => {
    const view = (config as any).views?.hub;
    expect(view?.feature?.component).toBe(HubDashboard);
  });

  it('itemHistory view wraps change history table in a titled DetailPage card', () => {
    const view = (config as any).views?.itemHistory;
    expect(view?.feature?.component).toBe(ItemChangeHistoryList);
    expect(view?.layout?.width).toBe('block');
  });

  it('permissions view uses settingsPage layout', () => {
    const view = (config as any).views?.permissions;
    expect(view?.layout?.component).toBe('settingsPage');
    expect(view?.feature?.query).toBeTruthy();
    expect(view?.feature?.mutation).toBeTruthy();
    expect(view?.feature?.toolName).toBeTruthy();
  });

  it('settings template views use settingsPage layout, tabs, form + permissions feature', () => {
    const general = (config as any).views?.settings;
    const settingsPermissionsTab = (config as any).views?.settingsPermissions;
    expect(general?.path).toBe('/settings');
    expect(settingsPermissionsTab?.path).toBe('/settings/user-access');
    expect(general?.layout?.component).toBe('settingsPage');
    expect(settingsPermissionsTab?.layout?.component).toBe('settingsPage');
    expect(general?.layout?.hasNavigation).toBe(true);
    expect(general?.layout?.title).toBe('Settings');
    expect(general?.feature?.component).toBe(SettingsGeneralForm);
    expect(settingsPermissionsTab?.feature).toEqual(
      prototypePermissionsTableFeature
    );
    expect(general?.queries?.({ params: { companyId: '1' } })).toMatchObject({
      prototypeToolSettings: expect.objectContaining({
        queryKey: expect.arrayContaining(['prototype-tool-settings', '1']),
      }),
    });
    expect(general?.layout?.tabs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'General', view: 'settings' }),
        expect.objectContaining({
          title: 'Permissions',
          view: 'settingsPermissions',
        }),
      ])
    );
    expect(Array.isArray(general?.feature?.actions)).toBe(true);
    expect((general?.feature?.actions as unknown[]).length).toBeGreaterThan(0);
    expect(settingsPermissionsTab?.feature?.actions).toBeUndefined();
  });
});
