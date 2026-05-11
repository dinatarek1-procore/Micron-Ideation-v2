import {
  buildCompositionPlaygroundConfig,
  type CompositionLayoutOption,
  type CompositionPlaygroundMakeFeature,
} from './playgroundCompositionBuild';
import {
  LAYOUT_PRESET_ORDER,
  LAYOUT_PRESETS,
  getPreset,
} from './layoutPresets';

const stubMakeFeature: CompositionPlaygroundMakeFeature = (type, data) => {
  if (type === 'table') {
    return {
      component: 'table' as const,
      queries: () => ({}),
      data: () => [],
      schema: data.schema,
    };
  }
  if (type === 'form') {
    const actions = Array.isArray(data.actions)
      ? (data.actions as Array<Record<string, unknown>>).map((a) => ({
          ...a,
          onClick: () => () => undefined,
        }))
      : undefined;
    return {
      component: 'form' as const,
      schema: data.schema ?? { type: 'object', properties: {} },
      readonly: (data.readonly as boolean) ?? true,
      initialData: data.initialData,
      ...(actions ? { actions } : {}),
    };
  }
  if (type === 'permissions') {
    return {
      component: 'permissions' as const,
      toolName: String(data.toolName ?? 'stub'),
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

describe('getPreset', () => {
  it('returns the preset for each layout key', () => {
    for (const key of LAYOUT_PRESET_ORDER) {
      expect(getPreset(key).layout).toBe(key);
    }
  });
});

describe('LAYOUT_PRESETS', () => {
  it('covers every CompositionLayoutOption exactly once in order', () => {
    const keys = new Set(LAYOUT_PRESET_ORDER);
    expect(LAYOUT_PRESET_ORDER.length).toBe(7);
    expect(keys.size).toBe(7);
    const all: CompositionLayoutOption[] = [
      'detailPage',
      'page',
      'settingsPage',
      'adminPage',
      'toolLandingPage',
      'panel',
      'modal',
    ];
    for (const k of all) {
      expect(keys.has(k)).toBe(true);
    }
  });

  it('detailPage preset layout JSON includes breadcrumbs but not settings cog', () => {
    const layout = JSON.parse(LAYOUT_PRESETS.detailPage.layoutJson) as {
      breadcrumbs?: unknown;
      hasNavigation?: boolean;
      settings?: unknown;
    };
    expect(layout.breadcrumbs).toBeDefined();
    expect(layout.hasNavigation).toBe(true);
    expect(layout.settings).toBeUndefined();
  });

  it('toolLandingPage preset layout JSON omits breadcrumbs and hasNavigation but includes settings', () => {
    const layout = JSON.parse(LAYOUT_PRESETS.toolLandingPage.layoutJson) as {
      breadcrumbs?: unknown;
      hasNavigation?: unknown;
      settings?: { view?: string };
    };
    expect(layout.breadcrumbs).toBeUndefined();
    expect(layout.hasNavigation).toBeUndefined();
    expect(layout.settings?.view).toBe('permissions');
  });

  it.each(LAYOUT_PRESET_ORDER)(
    '%s preset has valid JSON and builds config',
    (layoutKey) => {
      const p = LAYOUT_PRESETS[layoutKey];
      expect(() => JSON.parse(p.tabsJson)).not.toThrow();
      expect(() => JSON.parse(p.layoutJson)).not.toThrow();
      expect(() => JSON.parse(p.featureJson)).not.toThrow();

      const built = buildCompositionPlaygroundConfig({
        layout: p.layout,
        feature: p.feature,
        title: p.title,
        description: p.viewDescription,
        tabsJson: p.tabsJson,
        layoutJson: p.layoutJson,
        featureJson: p.featureJson,
        makeFeature: stubMakeFeature,
      });
      expect(built.ok).toBe(true);
      if (!built.ok) return;
      expect(Object.keys(built.config.views).length).toBeGreaterThan(0);
    }
  );
});
