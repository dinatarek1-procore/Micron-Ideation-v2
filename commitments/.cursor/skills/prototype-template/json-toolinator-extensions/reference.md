# JSON Toolinator extensions — reference

Paths below use **clone names** common across Procore front-end work; adjust if your forks use different directory names.

## `@procore/json-toolinator` (Tool Framework)

| Topic                                                                | Location                                                     |
| -------------------------------------------------------------------- | ------------------------------------------------------------ |
| Package overview, peers, quick start                                 | `json-toolinator-js-monorepo/packages/core/README.md`        |
| Layout resolution (string vs component)                              | `packages/core/src/layouts/layout.tsx`                       |
| Feature resolution                                                   | `packages/core/src/features/feature.tsx`                     |
| Types (`LayoutComponent`, `FeatureComponent`, actions, view options) | `packages/core/src/types.ts`                                 |
| View context hook                                                    | `packages/core/src/components/viewContext/useViewContext.ts` |
| Storybook (tool, layouts, features, actions)                         | Port **6030** (`yarn storybook` from `packages/core`)        |

## `@procore/json-formulator`

| Topic                            | Location                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| Package docs / Storybook         | `json-formulator-js-monorepo` (see `packages/core/README.md` and Storybook config) |
| `Form`, `JsonSchema`, `UiSchema` | Published types and README in the package consumed by the scaffold                 |

**This scaffold:** `src/views/settings/SettingsGeneralForm.tsx`, `src/views/settings/settingsGeneral.schema.ts`; dependencies in `package.json`: `@procore/json-formulator`, `@procore/json-formulator-extensions`.

## `@procore/json-tabulator`

| Topic                    | Location                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| Package docs / Storybook | `json-tabulator-js-monorepo`                                                                   |
| Table feature wiring     | Toolinator `packages/core/src/features/tableFeature.tsx` (and related utils under `features/`) |

**This scaffold:** table-oriented blueprints use `list.uiSchema.json` and list data shapes; views under `src/views/` register Toolinator `table` features where applicable.

## Smart Grid

| Topic                 | Location                                                                                |
| --------------------- | --------------------------------------------------------------------------------------- |
| Core / cells packages | `smart-grid-js-monorepo` (e.g. `@procore/smart-grid-core`, `@procore/smart-grid-cells`) |

**This scaffold:** `src/views/list/ListToolLandingTabulator.tsx` (JSON Tabulator + `blueprints/prototype-tool` list schema), `src/views/toolLanding/ToolLandingGenericSmartGrid.tsx`, `src/views/list/listSmartGridColumnDefs.ts`, `src/views/list/listSmartGridFilterPanel.css`; dependencies in `package.json` for `@procore/json-tabulator` and `smart-grid-*`.

## Item detail record tabs (scaffold)

| Topic                                                 | Location                                                                              |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Tab strip (view ids + titles)                         | `src/views/shared/itemTabs.ts`                                                        |
| Overview / parent detail route                        | `src/views/detail/index.ts` — `ItemDetailGeneral` custom feature                      |
| Built-in **`changeHistory`** tab                      | `src/views/itemHistory/index.ts`                                                      |
| Related Items tab (custom + `@procore/related-items`) | `src/views/itemExtensions/itemRelatedItemsView.config.ts`, `ItemRelatedItemsList.tsx` |
| Emails tab (custom + `@procore/engagement-emails`)    | `src/views/itemExtensions/itemEmailsView.config.ts`, `ItemEmailsList.tsx`             |
| Documents tab (custom prototype)                      | `src/views/itemExtensions/itemDocumentsView.config.ts`, `ItemDocumentsList.tsx`       |
| Toolinator shape tests for these views                | `src/views/views.toolinator-shapes.test.ts`                                           |

## Prototype simulator CLI

| Topic                             | Location                                                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Bundled skills install            | `prototype-template skills --install` → `.cursor/skills/prototype-template/`                                                         |
| Blueprint form/list JSON contract | `prototype-template` bundled blueprints under `blueprints/<id>/` (`form.schema.json`, `form.uiSchema.json`, `list.uiSchema.json`, …) |
