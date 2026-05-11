---
name: json-toolinator-extensions
description: >-
  Extends Procore tools built with @procore/json-toolinator using createConfig,
  createView, custom layout and feature components (CommonProps), useViewContext,
  queries, and actions. Prescribes @procore/json-formulator for all forms,
  @procore/json-tabulator via the built-in table feature for common list views,
  and @procore/smart-grid-core with @procore/smart-grid-cells for complex grids
  inside custom feature components. Use when extending toolinator,
  json-formulator, json-tabulator, smart-grid, createView, form or table
  features, blueprint JSON schemas, prototype scaffold views, changeHistory,
  detailPage tabs, related-items, or item detail views.
---

# JSON Toolinator — extensions, forms, and tables

## Mental model

1. **`createConfig({ basePath, toolName, ... })`** — tool-level: analytics, flags, permissions, translations, support URLs.
2. **`createView(name, { config, path, layout, feature, queries?, visible? })`** — each route: **layout** wraps **feature**. Either side can be a **built-in string** or a **React component**.
3. **`useViewContext()`** — params, queries, permissions, flags, analytics, toasts, viewport, etc., inside layout and feature components.

Built-in layout keys: `adminPage`, `detailPage`, `modal`, `page`, `panel`, `settingsPage`, `toolLandingPage`. Built-in feature keys: `activityFeed`, `changeHistory`, `form`, `permissions`, `table`.

Resolution: if `layout.component` or `feature.component` is a React component, Toolinator uses it directly; otherwise it resolves the string from an internal registry (`json-toolinator-js-monorepo` / `packages/core/src/layouts/layout.tsx`, `features/feature.tsx`).

### When to use which built-in feature string

| Built-in `feature.component` | Use for                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `form`                       | JSON-driven create/edit surfaces (JSON Formulator).                            |
| `table`                      | JSON-driven lists (JSON Tabulator).                                            |
| `permissions`                | Tool permission matrix / access templates.                                     |
| `changeHistory`              | Audit-style rows from an API (`query` URL + `mappingFn` on the response body). |
| `activityFeed`               | Comment / activity streams where that feature matches product UX.              |

Prefer these strings over reimplementing the same UX in a custom component unless you need behavior the built-in options do not expose.

## Item detail record tabs (scaffold showcase)

The prototype **item** surface uses **`detailPage`** with **`layout.tabs`**: each tab is a separate **view name** (separate `createView` registration) that repeats the same tab strip via a shared `tabs: [...]` array. Study this when wiring **record shells** that mix built-in features and package integrations.

**Tab definitions** (titles and view ids): `src/views/shared/itemTabs.ts` (`prototypeItemTabs`).

**Parent overview** (`detail` view): `src/views/detail/index.ts` — `feature.component: ItemDetailGeneral` (custom read-only body using `useViewContext` + item query).

| Tab view           | `feature.component`                | What to copy                                                                                                                                                 |
| ------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `itemHistory`      | **`'changeHistory'`** (string)     | Built-in feature + `query` / `mappingFn` for list API envelope → rows. See `src/views/itemHistory/index.ts`.                                                 |
| `itemRelatedItems` | **`ItemRelatedItemsList`** (React) | Wraps **`@procore/related-items`** with `useViewContext` params. See `src/views/itemExtensions/itemRelatedItemsView.config.ts` + `ItemRelatedItemsList.tsx`. |
| `itemEmails`       | **`ItemEmailsList`** (React)       | Wraps **`@procore/engagement-emails`**. See `itemEmailsView.config.ts` + `ItemEmailsList.tsx`.                                                               |
| `itemDocuments`    | **`ItemDocumentsList`** (React)    | Lightweight prototype list (fetch); pattern is “custom feature” for domain-specific UI. See `itemDocumentsView.config.ts` + `ItemDocumentsList.tsx`.         |

Each sibling tab view repeats **`layout.tabs: [...prototypeItemTabs]`** and matching **`detailPage`** breadcrumbs so the shell stays consistent across routes (`itemExtensions/*View.config.ts`, `itemHistory/index.ts`).

**Static generic record (no tabs):** `src/views/genericItemDetail/GenericToolItemDetail.tsx` — custom feature only, for layout kit exploration without Mirage item data.

## Decision table (forms and tables)

| Need                                                                             | Default approach                                                                                                                                                                                 |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Any form (create, edit, settings)                                                | **JSON Formulator** — Toolinator `feature.component: 'form'` with `schema` + `uiSchema`, or a custom feature that renders `Form` from `@procore/json-formulator` with `JsonSchema` / `UiSchema`. |
| Simple / config-driven list (sort, filter, pagination from JSON)                 | **JSON Tabulator** — Toolinator `feature.component: 'table'` with schema and list UI config. Align with blueprint `list.uiSchema.json` and data shapes where applicable.                         |
| Complex grid (server-side data model, advanced columns/cells, heavy interaction) | **Smart Grid** — custom `feature.component` composing `@procore/smart-grid-core` and `@procore/smart-grid-cells` inside the Toolinator view.                                                     |

Avoid one-off raw `<form>` / hand-rolled field grids for flows that should match Procore tool patterns.

## Custom layouts and features (no fork)

- **Custom layout:** set `layout.component` to `ComponentType<CommonProps>`. Prefer a built-in layout string when the shell fits.
- **Custom feature:** set `feature.component` to `ComponentType<CommonProps> | null` for arbitrary UI, or use built-in `form` / `table` / etc. when JSON-driven surfaces fit.

Use **`useViewContext({ view, strict: false })`** (or strict mode with the typed `view`) for context-aware behavior.

## Forms — JSON Formulator for all forms

**Default:** all production-style forms go through **@procore/json-formulator**.

1. **Declarative (preferred when the built-in feature fits):**  
   `feature: { component: 'form', schema, uiSchema, ... }`  
   The Toolinator `form` feature is built on JSON Formulator (see `@procore/json-toolinator` README).

2. **Custom feature wrapper:** when you need extra chrome, wiring, or behavior not exposed by the built-in options, use **`feature.component: YourComponent`** and render **`Form`** from `@procore/json-formulator` with typed **`JsonSchema`** / **`UiSchema`**. Keep schema in dedicated modules (same pattern as blueprint `form.schema.json` / `form.uiSchema.json`).

3. **Extensions:** use **`@procore/json-formulator-extensions`** when the design requires extended widgets supported by your version.

**Reference in this scaffold:** `src/views/settings/SettingsGeneralForm.tsx`, `src/views/settings/settingsGeneral.schema.ts`.

## Common tables — JSON Tabulator

Prefer **`feature: { component: 'table', schema, uiSchema, ... }`** for standard list views. Sorting, filtering, and pagination are driven through **@procore/json-tabulator** as configured by Toolinator and your JSON.

Keep list configuration aligned with blueprint artifacts (**`list.uiSchema.json`**, data schema) when the prototype uses blueprints.

Move to a **custom feature** only when the declarative `table` feature’s JSON surface is insufficient.

## Complex tables — Smart Grid

When Tabulator-level JSON is not enough (e.g. server-side grid APIs, advanced cell renderers, `smart-grid-core` data flows), implement a **custom** `feature.component` that embeds **`@procore/smart-grid-core`** and **`@procore/smart-grid-cells`**, still under Toolinator routing and `useViewContext` for params and queries.

**Reference in this scaffold:**

- `src/views/list/ListToolLandingTabulator.tsx` — `/new` list via `@procore/json-tabulator` `Table` + blueprint list schema.
- `src/views/toolLanding/ToolLandingGenericSmartGrid.tsx` — generic tool landing grid.
- View registration: `src/views/list/index.tsx`, `src/views/toolLanding/index.tsx` (`feature.component` set to those modules).

## Integrations (app-level)

- **Data:** view- or feature-level **`queries`** — context-aware TanStack Query options.
- **Permissions / flags / analytics:** `createConfig` options and values from **`useViewContext`**.
- **HTTP / auth:** follow the host MFE or Procore Web SDK patterns; do not bypass established fetch/auth unless the tool is intentionally standalone.

## When to change `json-toolinator-js-monorepo` instead

Add a new built-in **`LayoutComponent`** / **`FeatureComponent`** string and registry entry only if **multiple products** need the same primitive and it cannot ship as a **shared React layout/feature** passed as `component: SharedThing`. Otherwise extend in the application. Canonical types: `packages/core/src/types.ts`.

## Further reading

Bundled **`reference.md`** in this skill lists monorepo paths, packages, and Storybook ports for deeper dives.
