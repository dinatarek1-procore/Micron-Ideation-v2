import { bundleToPlaygroundState, referenceBlueprintBundle } from './bundle';
import {
  COMPOSITION_PLAYGROUND_MODAL_VIEW,
  buildCompositionPlaygroundConfig,
  compositionLayoutUsesGlobalChrome,
  compositionPlaygroundPreviewKey,
  getCompositionPlaygroundDemoLayoutExtras,
  getCompositionPlaygroundInitialEntry,
  isItemScopedLayout,
  type CompositionFeatureOption,
  type CompositionPlaygroundMakeFeature,
} from './playgroundCompositionBuild';

const stubMakeFeature: CompositionPlaygroundMakeFeature = (type, data) => {
  if (type === 'form') {
    const actions = Array.isArray(data.actions)
      ? (data.actions as Array<Record<string, unknown>>).map((a) => ({
          ...a,
          onClick: () => () => undefined,
        }))
      : undefined;
    return {
      component: 'form' as const,
      schema: data.schema,
      readonly: (data.readonly as boolean) ?? true,
      initialData: data.initialData,
      ...(actions ? { actions } : {}),
    };
  }
  if (type === 'permissions') {
    return {
      component: 'permissions' as const,
      toolName: String(data.toolName ?? 'stub-tool'),
      query: () => ({ url: '', mappingFn: () => undefined }),
      mutation: () => ({ url: '' }),
    };
  }
  return {
    component: 'form' as const,
    schema: { type: 'object', properties: {} },
    readonly: true,
  };
};

describe('compositionPlaygroundPreviewKey', () => {
  it('changes when tabs JSON changes', () => {
    const a = compositionPlaygroundPreviewKey({
      layout: 'detailPage',
      feature: 'form',
      title: 't',
      description: 'd',
      tabsJson: '[]',
      layoutJson: '{}',
      featureJson: '{}',
    });
    const b = compositionPlaygroundPreviewKey({
      layout: 'detailPage',
      feature: 'form',
      title: 't',
      description: 'd',
      tabsJson: '[{"title":"x","view":"y"}]',
      layoutJson: '{}',
      featureJson: '{}',
    });
    expect(a).not.toBe(b);
  });

  it('changes when refreshCounter changes with otherwise identical inputs', () => {
    const base = {
      layout: 'detailPage' as const,
      feature: 'form' as const,
      title: 't',
      description: 'd',
      tabsJson: '[]',
      layoutJson: '{}',
      featureJson: '{}',
    };
    expect(
      compositionPlaygroundPreviewKey({ ...base, refreshCounter: 0 })
    ).not.toBe(compositionPlaygroundPreviewKey({ ...base, refreshCounter: 1 }));
  });
});

describe('isItemScopedLayout', () => {
  it('is true for detail, settings, admin layouts', () => {
    expect(isItemScopedLayout('detailPage')).toBe(true);
    expect(isItemScopedLayout('settingsPage')).toBe(true);
    expect(isItemScopedLayout('adminPage')).toBe(true);
  });

  it('is false for tool root layouts', () => {
    expect(isItemScopedLayout('toolLandingPage')).toBe(false);
    expect(isItemScopedLayout('page')).toBe(false);
    expect(isItemScopedLayout('panel')).toBe(false);
    expect(isItemScopedLayout('modal')).toBe(false);
  });
});

describe('getCompositionPlaygroundInitialEntry', () => {
  it('uses item path for item-scoped layouts', () => {
    expect(getCompositionPlaygroundInitialEntry('detailPage')).toContain(
      '/items/42'
    );
  });

  it('uses tool root for toolLandingPage', () => {
    expect(getCompositionPlaygroundInitialEntry('toolLandingPage')).toBe(
      '/companies/1/tools/composition-playground'
    );
    expect(
      getCompositionPlaygroundInitialEntry('toolLandingPage')
    ).not.toContain('/items/');
  });

  it('lands on the shell tab route for modal layout (embedded modal, no /modal segment)', () => {
    expect(getCompositionPlaygroundInitialEntry('modal')).toBe(
      '/companies/1/tools/composition-playground/main'
    );
    expect(
      getCompositionPlaygroundInitialEntry('modal', {
        shellRouteSegment: 'overview',
      })
    ).toBe('/companies/1/tools/composition-playground/overview');
  });
});

describe('compositionLayoutUsesGlobalChrome', () => {
  it('is true for page layouts that render breadcrumbs in Toolinator', () => {
    expect(compositionLayoutUsesGlobalChrome('detailPage')).toBe(true);
    expect(compositionLayoutUsesGlobalChrome('page')).toBe(true);
    expect(compositionLayoutUsesGlobalChrome('settingsPage')).toBe(true);
    expect(compositionLayoutUsesGlobalChrome('adminPage')).toBe(true);
  });

  it('is false for tool landing, panel, and modal', () => {
    expect(compositionLayoutUsesGlobalChrome('toolLandingPage')).toBe(false);
    expect(compositionLayoutUsesGlobalChrome('panel')).toBe(false);
    expect(compositionLayoutUsesGlobalChrome('modal')).toBe(false);
  });
});

describe('getCompositionPlaygroundDemoLayoutExtras', () => {
  it('includes breadcrumbs and hasNavigation for detailPage', () => {
    const extras = getCompositionPlaygroundDemoLayoutExtras({
      firstTabView: 'main',
      layout: 'detailPage',
    });
    expect(extras.breadcrumbs).toBeDefined();
    expect(extras.hasNavigation).toBe(true);
    expect(extras.width).toBe('md');
    expect(extras.settings).toBeUndefined();
  });

  it('omits breadcrumbs and hasNavigation for toolLandingPage but includes settings', () => {
    const extras = getCompositionPlaygroundDemoLayoutExtras({
      firstTabView: 'main',
      layout: 'toolLandingPage',
    });
    expect(extras.breadcrumbs).toBeUndefined();
    expect(extras.hasNavigation).toBeUndefined();
    expect(extras.width).toBe('md');
    expect((extras.settings as { view?: string })?.view).toBe('permissions');
  });

  it('matches detailPage when layout is omitted', () => {
    const explicit = getCompositionPlaygroundDemoLayoutExtras({
      firstTabView: 'x',
      layout: 'detailPage',
    });
    const implicit = getCompositionPlaygroundDemoLayoutExtras({
      firstTabView: 'x',
    });
    expect(implicit).toEqual(explicit);
  });
});

describe('buildCompositionPlaygroundConfig', () => {
  it('registers one view per tab from reference blueprint patch', () => {
    const patch = bundleToPlaygroundState(referenceBlueprintBundle());
    const built = buildCompositionPlaygroundConfig({
      layout: 'detailPage',
      feature: 'form',
      title: 'Reference',
      description: 'Test',
      tabsJson: patch.tabsJson,
      layoutJson: patch.layoutJson,
      featureJson: patch.featureJson,
      makeFeature: stubMakeFeature,
    });
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    expect(Object.keys(built.config.views).sort()).toEqual(
      [
        'detail',
        'itemDocuments',
        'itemEmails',
        'itemHistory',
        'itemRelatedItems',
      ].sort()
    );
  });

  it('registers permissions view for tool landing settings cog', () => {
    const built = buildCompositionPlaygroundConfig({
      layout: 'toolLandingPage',
      feature: 'form',
      title: 'T',
      description: 'D',
      tabsJson: '[{"title":"Main","view":"main"}]',
      layoutJson: JSON.stringify(
        getCompositionPlaygroundDemoLayoutExtras({
          firstTabView: 'main',
          layout: 'toolLandingPage',
        })
      ),
      featureJson:
        '{"schema":{"type":"object","properties":{}},"readonly":true}',
      makeFeature: stubMakeFeature,
    });
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    expect(built.config.views.permissions).toBeDefined();
    expect(
      (built.config.views.permissions?.feature as { component?: string })
        ?.component
    ).toBe('permissions');
  });

  it('succeeds with breadcrumbs in layout extras for detailPage', () => {
    const built = buildCompositionPlaygroundConfig({
      layout: 'detailPage',
      feature: 'form',
      title: 'T',
      description: 'D',
      tabsJson: '[{"title":"Main","view":"main"}]',
      layoutJson: JSON.stringify({
        breadcrumbs: [
          { title: 'Tools', href: '/companies/1/tools' },
          { title: 'Item', view: 'main' },
        ],
      }),
      featureJson:
        '{"schema":{"type":"object","properties":{}},"readonly":true}',
      makeFeature: stubMakeFeature,
    });
    expect(built.ok).toBe(true);
  });

  it('uses /items/$itemId paths for detailPage', () => {
    const built = buildCompositionPlaygroundConfig({
      layout: 'detailPage',
      feature: 'form',
      title: 'T',
      description: 'D',
      tabsJson: '[{"title":"Main","view":"main"}]',
      layoutJson: '{}',
      featureJson:
        '{"schema":{"type":"object","properties":{}},"readonly":true}',
      makeFeature: stubMakeFeature,
    });
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    expect(built.config.views.main?.path).toBe('/items/$itemId');
  });

  it('uses root path for first view with toolLandingPage', () => {
    const built = buildCompositionPlaygroundConfig({
      layout: 'toolLandingPage',
      feature: 'form',
      title: 'T',
      description: 'D',
      tabsJson: '[{"title":"Main","view":"main"}]',
      layoutJson: '{}',
      featureJson:
        '{"schema":{"type":"object","properties":{}},"readonly":true}',
      makeFeature: stubMakeFeature,
    });
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    expect(built.config.views.main?.path).toBe('/');
  });

  it('registers a single embedded modal view for modal layout', () => {
    const built = buildCompositionPlaygroundConfig({
      layout: 'modal',
      feature: 'form',
      title: 'T',
      description: 'D',
      tabsJson: '[{"title":"Main","view":"main"}]',
      layoutJson: '{}',
      featureJson:
        '{"schema":{"type":"object","properties":{}},"readonly":true}',
      makeFeature: stubMakeFeature,
    });
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    expect(built.config.views.main?.path).toBe('/main');
    expect(built.config.views.main?.layout.component).toBe('modal');
    expect(
      (built.config.views.main?.layout as { embedded?: boolean }).embedded
    ).toBe(true);
    expect(
      built.config.views[COMPOSITION_PLAYGROUND_MODAL_VIEW]
    ).toBeUndefined();
  });

  it('succeeds when feature JSON includes form actions', () => {
    const built = buildCompositionPlaygroundConfig({
      layout: 'detailPage',
      feature: 'form',
      title: 'T',
      description: 'D',
      tabsJson: '[{"title":"Main","view":"main"}]',
      layoutJson: '{}',
      featureJson: JSON.stringify({
        schema: { type: 'object', properties: {} },
        readonly: false,
        actions: [
          { title: 'Cancel', variant: 'secondary' },
          { title: 'Save', variant: 'primary' },
        ],
      }),
      makeFeature: stubMakeFeature,
    });
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    const feature = built.config.views.main?.feature as {
      actions?: unknown[];
    };
    expect(Array.isArray(feature?.actions)).toBe(true);
    expect(feature?.actions?.length).toBe(2);
  });

  it('returns error for invalid tabs JSON', () => {
    const built = buildCompositionPlaygroundConfig({
      layout: 'detailPage',
      feature: 'form' as CompositionFeatureOption,
      title: 't',
      description: 'd',
      tabsJson: 'not json',
      layoutJson: '{}',
      featureJson:
        '{"schema":{"type":"object","properties":{}},"readonly":true}',
      makeFeature: stubMakeFeature,
    });
    expect(built.ok).toBe(false);
    if (built.ok) return;
    expect(built.message).toMatch(/tabs JSON/i);
  });
});
