import {
  createConfig,
  createView,
  type AnyConfig,
} from '@procore/json-toolinator';

export type CompositionLayoutOption =
  | 'detailPage'
  | 'page'
  | 'settingsPage'
  | 'adminPage'
  | 'toolLandingPage'
  | 'panel'
  | 'modal';

const ITEM_SCOPED_LAYOUTS: ReadonlySet<CompositionLayoutOption> = new Set([
  'detailPage',
  'settingsPage',
  'adminPage',
]);

/** True for layouts whose primary routes live under `/items/$itemId` (vs tool root `/`). */
export function isItemScopedLayout(layout: CompositionLayoutOption): boolean {
  return ITEM_SCOPED_LAYOUTS.has(layout);
}

const LAYOUTS_WITH_GLOBAL_CHROME: ReadonlySet<CompositionLayoutOption> =
  new Set(['detailPage', 'page', 'settingsPage', 'adminPage']);

/**
 * True when Toolinator renders breadcrumbs / page chrome for this layout.
 * toolLandingPage, panel, and modal do not use the same breadcrumb + hasNavigation shell.
 */
export function compositionLayoutUsesGlobalChrome(
  layout: CompositionLayoutOption
): boolean {
  return LAYOUTS_WITH_GLOBAL_CHROME.has(layout);
}

const COMPOSITION_PLAYGROUND_BASE_PREVIEW =
  '/companies/1/tools/composition-playground';

/**
 * Legacy names for the old shell + child modal route (tests / bundles may still reference).
 * Composition playground now uses a single route with `layout.embedded` modal instead.
 */
export const COMPOSITION_PLAYGROUND_MODAL_VIEW = 'dialog';
export const COMPOSITION_PLAYGROUND_MODAL_PATH = 'modal';

/** View id for the tool landing settings cog (`/settings`); always permissions in the playground. */
export const COMPOSITION_PLAYGROUND_SETTINGS_ROUTE_VIEW = 'permissions';

export type CompositionPlaygroundInitialEntryOptions = {
  /**
   * First tab’s view id, used as the shell URL segment for modal layout
   * (`…/{shell}/modal`). Must match the path built for that tab view.
   */
  shellRouteSegment?: string;
};

/** First tab `view` from tabs JSON; defaults to `main` when missing or invalid. */
export function getShellRouteSegmentFromTabsJson(tabsJson: string): string {
  try {
    const tabs = JSON.parse(tabsJson) as Array<{ view?: string }>;
    if (!Array.isArray(tabs)) return 'main';
    const first = tabs.find(
      (t) => typeof t.view === 'string' && t.view.length > 0
    );
    return first?.view ?? 'main';
  } catch {
    return 'main';
  }
}

/** Initial memory-router entry for the Composition Playground preview iframe. */
export function getCompositionPlaygroundInitialEntry(
  layout: CompositionLayoutOption,
  options?: CompositionPlaygroundInitialEntryOptions
): string {
  const base = isItemScopedLayout(layout)
    ? `${COMPOSITION_PLAYGROUND_BASE_PREVIEW}/items/42`
    : COMPOSITION_PLAYGROUND_BASE_PREVIEW;
  if (layout === 'modal') {
    // Inline embedded modal (no `/modal` child): land on the shell tab segment only.
    const shell = options?.shellRouteSegment ?? 'main';
    return `${base}/${shell}`;
  }
  return base;
}

/**
 * Teaching defaults merged into layout extras JSON (Playground + bundle load).
 * Settings cog (`layout.settings`) is only included for toolLandingPage — other shells
 * use different patterns (e.g. settings as its own route, not a title cog).
 */
export function getCompositionPlaygroundDemoLayoutExtras(options?: {
  firstTabView?: string;
  /** Defaults to detailPage when omitted (backward compatible). */
  layout?: CompositionLayoutOption;
}): Record<string, unknown> {
  const firstTabView = options?.firstTabView ?? 'main';
  const layout = options?.layout ?? 'detailPage';
  const base: Record<string, unknown> = {
    width: 'md',
  };
  if (layout === 'toolLandingPage') {
    base.settings = {
      title: 'Permissions',
      view: COMPOSITION_PLAYGROUND_SETTINGS_ROUTE_VIEW,
    };
  }
  if (!compositionLayoutUsesGlobalChrome(layout)) {
    return base;
  }
  return {
    ...base,
    breadcrumbs: [
      { title: 'Tools', href: '/companies/1/tools' },
      { title: 'This item', view: firstTabView },
    ],
    hasNavigation: true,
  };
}

export type CompositionFeatureOption =
  | 'form'
  | 'table'
  | 'changeHistory'
  | 'permissions'
  | 'custom';

export type CompositionPlaygroundMakeFeature = (
  type: CompositionFeatureOption,
  data: Record<string, unknown>
) => unknown;

function parseNamedJson(
  name: string,
  value: string
): { ok: true; value: unknown } | { ok: false; message: string } {
  try {
    return { ok: true, value: JSON.parse(value) };
  } catch (error) {
    return {
      ok: false,
      message: `${name}: ${error instanceof Error ? error.message : 'Invalid JSON'}`,
    };
  }
}

export type BuildCompositionPlaygroundConfigInput = {
  layout: CompositionLayoutOption;
  feature: CompositionFeatureOption;
  title: string;
  description: string;
  tabsJson: string;
  layoutJson: string;
  featureJson: string;
  makeFeature: CompositionPlaygroundMakeFeature;
};

export type CompositionPlaygroundPreviewKeyInput = Omit<
  BuildCompositionPlaygroundConfigInput,
  'makeFeature'
> & {
  refreshCounter?: number;
};

/** Stable key so `Tool` remounts when playground inputs change (Toolinator keeps router in a ref). */
export function compositionPlaygroundPreviewKey(
  input: CompositionPlaygroundPreviewKeyInput
): string {
  return JSON.stringify({
    layout: input.layout,
    feature: input.feature,
    title: input.title,
    description: input.description,
    tabsJson: input.tabsJson,
    layoutJson: input.layoutJson,
    featureJson: input.featureJson,
    refreshCounter: input.refreshCounter ?? 0,
  });
}

/**
 * Same logic as Composition/Playground story `useMemo`: parse JSON, register views on a fresh config.
 */
export function buildCompositionPlaygroundConfig(
  input: BuildCompositionPlaygroundConfigInput
): { ok: true; config: AnyConfig } | { ok: false; message: string } {
  const parsedTabs = parseNamedJson('tabs JSON', input.tabsJson);
  const parsedLayout = parseNamedJson('layout extras JSON', input.layoutJson);
  const parsedFeature = parseNamedJson('feature JSON', input.featureJson);
  if (!parsedTabs.ok) return { ok: false, message: parsedTabs.message };
  if (!parsedLayout.ok) return { ok: false, message: parsedLayout.message };
  if (!parsedFeature.ok) return { ok: false, message: parsedFeature.message };
  if (!Array.isArray(parsedTabs.value)) {
    return { ok: false, message: 'tabs JSON must be an array' };
  }

  const tabs = parsedTabs.value as Array<{
    title: string;
    view?: string;
    href?: string;
  }>;
  const names = tabs.map((t) => t.view).filter((x): x is string => Boolean(x));
  const viewNames = names.length > 0 ? names : ['main'];
  const config = createConfig({
    basePath: '/companies/$companyId/tools/composition-playground',
    toolName: 'Composition playground',
  });
  const layoutExtras = parsedLayout.value as Record<string, unknown>;
  const featureConfig = input.makeFeature(
    input.feature,
    parsedFeature.value as Record<string, unknown>
  );

  const itemScoped = isItemScopedLayout(input.layout);

  if (input.layout === 'modal') {
    /**
     * Single route with `embedded: true` so ModalLayout renders header/body/footer inline
     * in the live preview (no overlay portal or `/modal` child route).
     */
    viewNames.forEach((viewName, idx) => {
      let path: string;
      if (itemScoped) {
        path = idx === 0 ? '/items/$itemId' : `/items/$itemId/${viewName}`;
      } else {
        path = idx === 0 ? `/${viewName}` : `/${viewName}`;
      }
      createView(viewName, {
        config,
        path,
        layout: {
          component: 'modal',
          embedded: true,
          title: input.title,
          description: input.description,
          tabs: [...tabs],
          ...layoutExtras,
        } as never,
        feature: featureConfig as never,
      });
    });
  } else {
    viewNames.forEach((viewName, idx) => {
      let path: string;
      if (itemScoped) {
        path = idx === 0 ? '/items/$itemId' : `/items/$itemId/${viewName}`;
      } else {
        path = idx === 0 ? '/' : `/${viewName}`;
      }
      createView(viewName, {
        config,
        path,
        layout: {
          component: input.layout,
          title: input.title,
          description: input.description,
          tabs: [...tabs],
          ...layoutExtras,
        } as never,
        feature: featureConfig as never,
      });
    });
  }

  const settingsExtra = layoutExtras.settings;
  if (
    settingsExtra &&
    typeof settingsExtra === 'object' &&
    !Array.isArray(settingsExtra)
  ) {
    const settingsViewName = (settingsExtra as { view?: unknown }).view;
    if (
      typeof settingsViewName === 'string' &&
      settingsViewName.length > 0 &&
      !config.views[settingsViewName]
    ) {
      const settingsFeature = input.makeFeature('permissions', {
        toolName: config.toolName,
      });
      createView(settingsViewName, {
        config,
        path: '/settings',
        layout: {
          component: 'settingsPage',
          title: 'Permissions',
          description: 'Tool permissions for the composition playground.',
          tabs: [],
          hasNavigation: true,
          width: 'md',
        } as never,
        feature: settingsFeature as never,
      });
    }
  }

  return { ok: true, config };
}
