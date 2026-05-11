import React from 'react';
import styled from 'styled-components';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import {
  Button,
  H3,
  TextArea,
  TextInput,
  colors,
  spacing,
} from '@procore/core-react';
import { queryOptions } from '@tanstack/react-query';
import { Tool } from '@procore/json-toolinator';

import { baseMeta, sharedToolArgs } from './shared';
import {
  buildCompositionPlaygroundConfig,
  compositionPlaygroundPreviewKey,
  getCompositionPlaygroundInitialEntry,
  getShellRouteSegmentFromTabsJson,
  type CompositionFeatureOption,
  type CompositionLayoutOption,
} from '../../src/blueprint/playgroundCompositionBuild';
import {
  LAYOUT_PRESET_ORDER,
  getPreset,
} from '../../src/blueprint/layoutPresets';
import { PromoCalloutToolFeature } from './designer-example/PromoCallout';
import {
  bundleToPlaygroundState,
  downloadJsonFile,
  parseBlueprintBundleJson,
  playgroundStateToBundle,
} from '../../src/blueprint/bundle';

type LayoutOption = CompositionLayoutOption;
type FeatureOption = CompositionFeatureOption;

const features: FeatureOption[] = [
  'form',
  'table',
  'changeHistory',
  'permissions',
  'custom',
];
const prefix = 'prototyper-composition-playground';

/** Bump when preset defaults change so stale `feature` / JSON in localStorage cannot desync from layout. */
const PLAYGROUND_STORAGE_META_KEY = `${prefix}-meta-v`;
const PLAYGROUND_STORAGE_META_VERSION = 3;

function migratePlaygroundLocalStorage() {
  if (typeof localStorage === 'undefined') return;
  if (
    localStorage.getItem(PLAYGROUND_STORAGE_META_KEY) ===
    String(PLAYGROUND_STORAGE_META_VERSION)
  ) {
    return;
  }
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(`${prefix}-`) && key !== PLAYGROUND_STORAGE_META_KEY) {
      localStorage.removeItem(key);
    }
  }
  localStorage.setItem(
    PLAYGROUND_STORAGE_META_KEY,
    String(PLAYGROUND_STORAGE_META_VERSION)
  );
}

function mapPermissionsQueryBody(body: unknown): unknown[] {
  if (Array.isArray(body)) return body;
  if (body && typeof body === 'object' && 'data' in body) {
    const data = (body as { data: unknown }).data;
    return Array.isArray(data) ? data : [];
  }
  return [];
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md}px;
  min-height: 760px;
`;
const MainWorkspace = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
  border: 1px solid ${colors.gray85};
  border-radius: 4px;
  overflow: hidden;
  background: ${colors.white};
`;
const ControlsDrawerShell = styled.div<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: row;
  flex: 0 0 auto;
  min-width: 0;
  overflow: hidden;
  max-width: ${(p) => (p.$collapsed ? '44px' : 'min(400px, 46vw)')};
  border-right: 1px solid ${colors.gray85};
  background: ${colors.gray96};
  transition: max-width 0.2s ease;
`;
const ControlsDrawerToggle = styled.button`
  flex: 0 0 44px;
  width: 44px;
  align-self: stretch;
  border: none;
  border-right: 1px solid ${colors.gray85};
  background: ${colors.gray96};
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  color: ${colors.gray40};
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 0.04em;
  &:hover {
    background: ${colors.gray90};
    color: ${colors.gray30};
  }
`;
const ControlsDrawerBody = styled.div`
  flex: 1;
  min-width: 0;
  width: min(356px, calc(46vw - 44px));
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm}px;
  padding: ${spacing.sm}px ${spacing.md}px ${spacing.sm}px 0;
  overflow: auto;
`;
const DrawerSectionLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.gray30};
  flex-shrink: 0;
`;
const PreviewColumn = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm}px;
  padding: ${spacing.md}px;
  overflow: hidden;
`;
const Preview = styled.div`
  border: 1px solid ${colors.gray85};
  border-radius: 4px;
  flex: 1;
  min-height: 360px;
  min-width: 0;
  overflow: hidden;
`;
const ErrorText = styled.div`
  color: ${colors.red50};
  font-size: 12px;
  white-space: pre-wrap;
`;
/** Caps layout picker height (~half a typical column) and scrolls. */
const TemplateListScroll = styled.div`
  max-height: min(200px, 35vh);
  overflow-x: hidden;
  overflow-y: auto;
  min-height: 0;
  flex-shrink: 0;
  padding: ${spacing.xs}px;
  border: 1px solid ${colors.gray85};
  border-radius: 4px;
  background: ${colors.white};
`;
const TemplateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs}px;
`;
const TemplateCard = styled.button<{ $selected: boolean }>`
  text-align: left;
  width: 100%;
  padding: ${spacing.xs}px ${spacing.sm}px;
  border-radius: 4px;
  border: 2px solid ${(p) => (p.$selected ? colors.blue50 : colors.gray85)};
  background: ${colors.white};
  cursor: pointer;
  font: inherit;
  flex-shrink: 0;
  &:hover {
    border-color: ${colors.blue50};
  }
`;
const CardLabel = styled.div`
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 2px;
`;
const CardDescription = styled.div`
  font-size: 11px;
  color: ${colors.gray40};
  line-height: 1.3;
`;
const AdvancedDetails = styled.details`
  margin-top: 0;
  border: 1px solid ${colors.gray85};
  border-radius: 4px;
  padding: ${spacing.sm}px;
  background: ${colors.white};
`;
const AdvancedSummary = styled.summary`
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  user-select: none;
`;

function load(key: string, fallback: string) {
  if (typeof localStorage === 'undefined') return fallback;
  return localStorage.getItem(`${prefix}-${key}`) ?? fallback;
}
function save(key: string, value: string) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(`${prefix}-${key}`, value);
}

function rows() {
  return Promise.resolve([
    { id: 1, label: 'Alpha' },
    { id: 2, label: 'Beta' },
  ]);
}

function makeFeature(type: FeatureOption, data: Record<string, unknown>) {
  if (type === 'table') {
    return {
      component: 'table' as const,
      queries: () => ({
        rows: queryOptions({ queryKey: ['playground-table'], queryFn: rows }),
      }),
      // @ts-expect-error inferred query shape
      data: (ctx: { queries: { rows: { data?: unknown[] } } }) =>
        ctx.queries.rows.data ?? [],
      schema: data.schema,
    };
  }
  if (type === 'changeHistory') {
    return {
      component: 'changeHistory' as const,
      query: ({
        params: { companyId, itemId },
      }: {
        params: { companyId: string; itemId?: string };
      }) => ({
        url: `/rest/v2.0/companies/${companyId}/prototype/items/${itemId ?? '42'}/change_history`,
        mappingFn: (payload: { data?: unknown }) => payload?.data ?? [],
      }),
    };
  }
  if (type === 'permissions') {
    return {
      component: 'permissions' as const,
      toolName: (data.toolName as string) ?? 'Prototype tool',
      query: ({
        params: { companyId },
      }: {
        params: { companyId: string };
      }) => ({
        url: `/rest/v2.0/companies/${companyId}/prototype/user_permissions`,
        mappingFn: mapPermissionsQueryBody,
      }),
      mutation: ({
        params: { companyId },
      }: {
        params: { companyId: string };
      }) => ({
        url: `/rest/v2.0/companies/${companyId}/prototype/user_permissions`,
      }),
    };
  }
  if (type === 'custom') return { component: PromoCalloutToolFeature };
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

function safeInitialLayout(): LayoutOption {
  const raw = load('layout', 'detailPage');
  if (LAYOUT_PRESET_ORDER.includes(raw as LayoutOption)) {
    return raw as LayoutOption;
  }
  return 'detailPage';
}

const meta: Meta = {
  title: 'Composition/Playground',
  ...baseMeta,
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const Playground: StoryFn = () => {
  const playgroundStorageMigrated = React.useRef(false);
  if (!playgroundStorageMigrated.current) {
    playgroundStorageMigrated.current = true;
    migratePlaygroundLocalStorage();
  }

  const importInputRef = React.useRef<HTMLInputElement>(null);
  const [bundleMessage, setBundleMessage] = React.useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = React.useState(0);
  const [controlsDrawerOpen, setControlsDrawerOpen] = React.useState(
    () => load('layouts-panel-open', '1') !== '0'
  );

  const initialLayout = React.useMemo(() => safeInitialLayout(), []);
  const initialPreset = getPreset(initialLayout);

  const [layout, setLayout] = React.useState<LayoutOption>(initialLayout);
  const [feature, setFeature] = React.useState<FeatureOption>(
    () => load('feature', initialPreset.feature) as FeatureOption
  );
  const [title, setTitle] = React.useState(() =>
    load('title', initialPreset.title)
  );
  const [description, setDescription] = React.useState(() =>
    load('description', initialPreset.viewDescription)
  );
  const [tabsJson, setTabsJson] = React.useState(() =>
    load('tabs', initialPreset.tabsJson)
  );
  const [layoutJson, setLayoutJson] = React.useState(() =>
    load('layout-json', initialPreset.layoutJson)
  );
  const [featureJson, setFeatureJson] = React.useState(() =>
    load('feature-json', initialPreset.featureJson)
  );

  React.useEffect(() => save('layout', layout), [layout]);
  React.useEffect(() => save('feature', feature), [feature]);
  React.useEffect(() => save('title', title), [title]);
  React.useEffect(() => save('description', description), [description]);
  React.useEffect(() => save('tabs', tabsJson), [tabsJson]);
  React.useEffect(() => save('layout-json', layoutJson), [layoutJson]);
  React.useEffect(() => save('feature-json', featureJson), [featureJson]);
  React.useEffect(
    () => save('layouts-panel-open', controlsDrawerOpen ? '1' : '0'),
    [controlsDrawerOpen]
  );

  const applyTemplate = (key: LayoutOption) => {
    const p = getPreset(key);
    setLayout(p.layout);
    setFeature(p.feature);
    setTitle(p.title);
    setDescription(p.viewDescription);
    setTabsJson(p.tabsJson);
    setLayoutJson(p.layoutJson);
    setFeatureJson(p.featureJson);
    setBundleMessage(null);
    setRefreshCounter((c) => c + 1);
  };

  const built = React.useMemo(
    () =>
      buildCompositionPlaygroundConfig({
        layout,
        feature,
        title,
        description,
        tabsJson,
        layoutJson,
        featureJson,
        makeFeature,
      }),
    [layout, feature, title, description, tabsJson, layoutJson, featureJson]
  );

  const previewKey = React.useMemo(
    () =>
      compositionPlaygroundPreviewKey({
        layout,
        feature,
        title,
        description,
        tabsJson,
        layoutJson,
        featureJson,
        refreshCounter,
      }),
    [
      layout,
      feature,
      title,
      description,
      tabsJson,
      layoutJson,
      featureJson,
      refreshCounter,
    ]
  );

  const handleExportBundle = () => {
    const result = playgroundStateToBundle(tabsJson, featureJson);
    if (!result.ok) {
      setBundleMessage(result.message);
      return;
    }
    const name =
      typeof result.bundle.blueprint.name === 'string'
        ? result.bundle.blueprint.name
        : 'blueprint';
    downloadJsonFile(`${name}-bundle.v1.json`, result.bundle);
    setBundleMessage(`Exported ${name}-bundle.v1.json`);
  };

  const handleImportBundleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const parsed = parseBlueprintBundleJson(text);
      if (!parsed.ok) {
        setBundleMessage(parsed.message);
        return;
      }
      const patch = bundleToPlaygroundState(parsed.bundle);
      setFeature('form');
      setLayout('detailPage');
      setTitle(
        typeof parsed.bundle.blueprint.toolName === 'string'
          ? String(parsed.bundle.blueprint.toolName)
          : 'Imported blueprint'
      );
      setDescription('Imported from blueprint bundle JSON.');
      setTabsJson(patch.tabsJson);
      setLayoutJson(patch.layoutJson);
      setFeatureJson(patch.featureJson);
      setBundleMessage(
        'Imported blueprint bundle. Open Advanced to edit JSON.'
      );
      setRefreshCounter((c) => c + 1);
    };
    reader.readAsText(file);
  };

  return (
    <Root>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <H3>Composition playground</H3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <Button variant="secondary" size="sm" onClick={handleExportBundle}>
            Export blueprint bundle
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => importInputRef.current?.click()}
          >
            Import bundle…
          </Button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportBundleFile(f);
              e.target.value = '';
            }}
          />
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 12, color: colors.gray40 }}>
        Pick a shell to preview. Export a v1 blueprint bundle for Toolinator /
        Visual Builder. Technical JSON lives under{' '}
        <strong>Advanced configuration</strong>.
      </p>
      {bundleMessage ? (
        <div style={{ fontSize: 12, color: colors.gray40 }}>
          {bundleMessage}
        </div>
      ) : null}
      <MainWorkspace>
        <ControlsDrawerShell $collapsed={!controlsDrawerOpen}>
          <ControlsDrawerToggle
            type="button"
            aria-expanded={controlsDrawerOpen}
            aria-controls="playground-controls-drawer"
            title={
              controlsDrawerOpen
                ? 'Collapse view controls'
                : 'Open view controls'
            }
            onClick={() => setControlsDrawerOpen((o) => !o)}
          >
            {controlsDrawerOpen ? 'Close' : 'Controls'}
          </ControlsDrawerToggle>
          {controlsDrawerOpen ? (
            <ControlsDrawerBody id="playground-controls-drawer">
              <DrawerSectionLabel>Layout templates</DrawerSectionLabel>
              <TemplateListScroll aria-label="Layout templates">
                <TemplateList>
                  {LAYOUT_PRESET_ORDER.map((key) => {
                    const p = getPreset(key);
                    return (
                      <TemplateCard
                        key={key}
                        type="button"
                        $selected={layout === key}
                        onClick={() => applyTemplate(key)}
                      >
                        <CardLabel>{p.label}</CardLabel>
                        <CardDescription>{p.description}</CardDescription>
                      </TemplateCard>
                    );
                  })}
                </TemplateList>
              </TemplateListScroll>
              <DrawerSectionLabel>View</DrawerSectionLabel>
              <label
                htmlFor="pg-title"
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                Title
              </label>
              <TextInput
                id="pg-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label
                htmlFor="pg-desc"
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                Description
              </label>
              <TextInput
                id="pg-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <AdvancedDetails>
                <AdvancedSummary>Advanced configuration</AdvancedSummary>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.sm,
                    marginTop: spacing.sm,
                  }}
                >
                  <label
                    htmlFor="pg-feature"
                    style={{ fontSize: 12, fontWeight: 600 }}
                  >
                    Feature type
                  </label>
                  {/* eslint-disable-next-line jsx-a11y/no-onchange */}
                  <select
                    id="pg-feature"
                    value={feature}
                    onChange={(e) =>
                      setFeature(e.target.value as FeatureOption)
                    }
                  >
                    {features.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="pg-tabs"
                    style={{ fontSize: 12, fontWeight: 600 }}
                  >
                    Tabs JSON
                  </label>
                  <TextArea
                    id="pg-tabs"
                    rows={8}
                    value={tabsJson}
                    onChange={(e) => setTabsJson(e.target.value)}
                  />
                  <label
                    htmlFor="pg-layout"
                    style={{ fontSize: 12, fontWeight: 600 }}
                  >
                    Layout extras JSON
                  </label>
                  <TextArea
                    id="pg-layout"
                    rows={8}
                    value={layoutJson}
                    onChange={(e) => setLayoutJson(e.target.value)}
                  />
                  <label
                    htmlFor="pg-feature-json"
                    style={{ fontSize: 12, fontWeight: 600 }}
                  >
                    Feature JSON
                  </label>
                  <TextArea
                    id="pg-feature-json"
                    rows={14}
                    value={featureJson}
                    onChange={(e) => setFeatureJson(e.target.value)}
                  />
                </div>
              </AdvancedDetails>
            </ControlsDrawerBody>
          ) : null}
        </ControlsDrawerShell>
        <PreviewColumn>
          <H3 style={{ margin: 0 }}>Live preview</H3>
          {!built.ok ? <ErrorText>{built.message}</ErrorText> : null}
          {built.ok ? (
            <Preview>
              <Tool
                key={previewKey}
                {...sharedToolArgs}
                config={built.config}
                UNSAFE_initialEntries={[
                  getCompositionPlaygroundInitialEntry(layout, {
                    shellRouteSegment:
                      getShellRouteSegmentFromTabsJson(tabsJson),
                  }),
                ]}
              />
            </Preview>
          ) : null}
        </PreviewColumn>
      </MainWorkspace>
    </Root>
  );
};
