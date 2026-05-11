import { getCompositionPlaygroundDemoLayoutExtras } from './playgroundCompositionBuild';
import blueprintManifest from '../../blueprints/reference-scaffold/blueprint.json';
import dataSchema from '../../blueprints/reference-scaffold/data.schema.json';
import listUiSchema from '../../blueprints/reference-scaffold/list.uiSchema.json';
import formSchema from '../../blueprints/reference-scaffold/form.schema.json';
import formUiSchema from '../../blueprints/reference-scaffold/form.uiSchema.json';
import tabs from '../../blueprints/reference-scaffold/tabs.json';
import seed from '../../blueprints/reference-scaffold/seed.json';

/** Single-file interchange for Storybook import/export (v1). */
export type BlueprintBundleV1 = {
  version: 1;
  blueprint: Record<string, unknown>;
  dataSchema: Record<string, unknown>;
  listUiSchema: Record<string, unknown>;
  formSchema: {
    edit: Record<string, unknown>;
    detail: Record<string, unknown>;
  };
  formUiSchema: {
    edit: Record<string, unknown>;
    detail: Record<string, unknown>;
  };
  tabs: Array<{ title: string; view: string; titleKey?: string }>;
  seed: unknown[];
};

export function referenceBlueprintBundle(): BlueprintBundleV1 {
  return {
    version: 1,
    blueprint: blueprintManifest as Record<string, unknown>,
    dataSchema: dataSchema as Record<string, unknown>,
    listUiSchema: listUiSchema as Record<string, unknown>,
    formSchema: formSchema as BlueprintBundleV1['formSchema'],
    formUiSchema: formUiSchema as BlueprintBundleV1['formUiSchema'],
    tabs: tabs as BlueprintBundleV1['tabs'],
    seed: seed as unknown[],
  };
}

/** Remove codegen-only cell tokens so Tabulator can render without custom imports. */
export function stripCodegenCellsFromListUiSchema(
  ui: Record<string, unknown>
): Record<string, unknown> {
  const clone = structuredClone(ui) as Record<string, unknown>;
  for (const key of Object.keys(clone)) {
    if (key === 'ui:options') continue;
    const field = clone[key];
    if (field && typeof field === 'object' && 'ui:options' in field) {
      const opts = (field as { 'ui:options': Record<string, unknown> })[
        'ui:options'
      ];
      const cell = opts.cell;
      if (typeof cell === 'string' && cell.startsWith('@')) {
        delete opts.cell;
      }
    }
  }
  return clone;
}

export function tabsForPlayground(
  tabList: Array<{ title: string; view: string; titleKey?: string }>
): Array<{ title: string; view?: string; titleKey?: string }> {
  return tabList.map(({ title, view, titleKey }) => ({
    title,
    view,
    ...(titleKey !== undefined ? { titleKey } : {}),
  }));
}

export type PlaygroundPatch = {
  tabsJson: string;
  layoutJson: string;
  featureJson: string;
};

/** Map a bundle to Composition Playground JSON text areas (form feature, readonly, first seed row). */
export function bundleToPlaygroundState(
  bundle: BlueprintBundleV1
): PlaygroundPatch {
  const initial =
    Array.isArray(bundle.seed) &&
    bundle.seed[0] &&
    typeof bundle.seed[0] === 'object'
      ? (bundle.seed[0] as Record<string, unknown>)
      : {};
  const featureJson = JSON.stringify(
    {
      schema: bundle.formSchema.edit,
      readonly: true,
      initialData: initial,
    },
    null,
    2
  );
  const name =
    typeof bundle.blueprint.name === 'string'
      ? bundle.blueprint.name
      : 'blueprint';
  const firstTabView =
    Array.isArray(bundle.tabs) &&
    bundle.tabs[0] &&
    typeof bundle.tabs[0].view === 'string'
      ? bundle.tabs[0].view
      : 'main';
  return {
    tabsJson: JSON.stringify(tabsForPlayground(bundle.tabs), null, 2),
    layoutJson: JSON.stringify(
      {
        pills: [{ title: name, color: 'blue' }],
        ...getCompositionPlaygroundDemoLayoutExtras({
          firstTabView,
          layout: 'detailPage',
        }),
      },
      null,
      2
    ),
    featureJson,
  };
}

export function parseBlueprintBundleJson(
  raw: string
): { ok: true; bundle: BlueprintBundleV1 } | { ok: false; message: string } {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return { ok: false, message: 'Bundle must be a JSON object.' };
    }
    const o = parsed as Record<string, unknown>;
    if (o.version !== 1) {
      return {
        ok: false,
        message: 'Unsupported bundle version (expected version: 1).',
      };
    }
    if (!o.blueprint || typeof o.blueprint !== 'object') {
      return { ok: false, message: 'Missing blueprint object.' };
    }
    if (!o.formSchema || typeof o.formSchema !== 'object') {
      return { ok: false, message: 'Missing formSchema object.' };
    }
    const fs = o.formSchema as Record<string, unknown>;
    if (!fs.edit || !fs.detail) {
      return {
        ok: false,
        message: 'formSchema must have edit and detail keys.',
      };
    }
    if (!Array.isArray(o.tabs) || !Array.isArray(o.seed)) {
      return { ok: false, message: 'tabs and seed must be arrays.' };
    }
    return {
      ok: true,
      bundle: o as unknown as BlueprintBundleV1,
    };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'Invalid JSON',
    };
  }
}

export function downloadJsonFile(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Build a v1 bundle from current playground JSON (tabs + feature); keeps list/data/form UI from base. */
export function playgroundStateToBundle(
  tabsJson: string,
  featureJson: string,
  base: BlueprintBundleV1 = referenceBlueprintBundle()
): { ok: true; bundle: BlueprintBundleV1 } | { ok: false; message: string } {
  let tabsParsed: unknown;
  try {
    tabsParsed = JSON.parse(tabsJson);
  } catch (e) {
    return {
      ok: false,
      message: `tabs: ${e instanceof Error ? e.message : 'invalid'}`,
    };
  }
  if (!Array.isArray(tabsParsed)) {
    return { ok: false, message: 'tabs JSON must be an array' };
  }
  let featParsed: unknown;
  try {
    featParsed = JSON.parse(featureJson);
  } catch (e) {
    return {
      ok: false,
      message: `feature: ${e instanceof Error ? e.message : 'invalid'}`,
    };
  }
  if (!featParsed || typeof featParsed !== 'object') {
    return { ok: false, message: 'feature JSON must be an object' };
  }
  const f = featParsed as Record<string, unknown>;
  if (!f.schema || typeof f.schema !== 'object') {
    return { ok: false, message: 'feature JSON must include schema' };
  }
  const edit = f.schema as Record<string, unknown>;
  const initialData =
    f.initialData && typeof f.initialData === 'object'
      ? (f.initialData as Record<string, unknown>)
      : {};
  const seed = [initialData, ...base.seed.slice(1)] as unknown[];
  return {
    ok: true,
    bundle: {
      ...base,
      tabs: tabsParsed as BlueprintBundleV1['tabs'],
      formSchema: { ...base.formSchema, edit },
      seed,
    },
  };
}
