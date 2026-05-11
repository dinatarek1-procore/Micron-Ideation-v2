# Toolinator composability extensions (design proposal)

**Audience:** Procore platform design + engineering.
**Intent:** Identify the IX rules from [`REFERENCE.md`](./REFERENCE.md) that our common packages (Toolinator, Formulator, core-react) can't satisfy today, and propose **extensions we can build** so IX compliance becomes the default in every generated prototype — not something each author has to remember.

This is not a gap list. It's a roadmap for shared work. Each extension leads with the **design outcome** it unlocks and follows with implementation notes for engineering readers. Design prioritizes; engineering scopes.

## Template each proposal follows

```
### <Outcome in design language>

What a prototype author gets today: <concrete description>.
What the extension unlocks: <concrete improvement; the IX rule it satisfies>.
Per-prototype manual work saved: <blast radius across prototypes>.
Implementation location: <package and file path>.
Effort: XS | S | M | L.
```

---

## Toolinator proposals

### Pattern 1 Split-View as a config layout

**What a prototype author gets today.** Pattern 1 requires hand-rolling a custom feature component that embeds the scaffold's `SplitViewShell` wrapper, plus manual state wiring between the list (Tabulator or Smart Grid) and the detail pane.

**What the extension unlocks.** Prototype authors pick `layout.component: 'splitViewPage'` in a Toolinator config and drop a Tabulator or Smart Grid feature into the left pane and a detail feature into the right — no bespoke composition. Enables REFERENCE.md's "Pattern 1 (Grid 37% LEFT, Detail 63% RIGHT)" as a first-class layout.

**Per-prototype manual work saved.** Every Anchor-View tool today.

**Implementation location.** [`json-toolinator-js-monorepo/packages/core/src/types.ts`](../../../../../../json-toolinator-js-monorepo/packages/core/src/types.ts) (new `SplitViewPageLayoutOptions`) + a new `splitViewPageLayout.tsx` that composes `@procore/core-react` `SplitViewCard`. The layout should accept two `feature` slots (list, detail).

**Effort.** L.

---

### Autosave data-entry slide-outs wired through Toolinator's FormFeature

**What a prototype author gets today.** Custom views (e.g. the scaffold's `CreateFormTearsheetView`) already have IX-compliant autosave via `useDebouncedAutosave` — no Save/Cancel footer, a "Saved Ns ago" indicator instead. But Toolinator-wired Creates that use `feature: 'form'` in config only fire `onSubmit`; authors would have to fork the feature to replicate the autosave pattern.

**What the extension unlocks.** Setting one option on the `FormFeature` (e.g. `autosave: true` + `onChangeDebounced: (data) => Promise<void>` + `debounceMs?: number`) gives the same IX-compliant autosave behavior inside Toolinator config-driven Creates. No custom view needed.

**Per-prototype manual work saved.** Every Toolinator-wired Create that today would have to fall back to a custom view to get autosave.

**Implementation location.** [`json-toolinator-js-monorepo/packages/core/src/features/formFeature.tsx`](../../../../../../json-toolinator-js-monorepo/packages/core/src/features/formFeature.tsx) — add `autosave?: boolean` + `onChangeDebounced` + `debounceMs?` to `FormFeatureOptions`. Wire into `<Form>` `onChange` using the same debounce pattern the scaffold's `useDebouncedAutosave` uses.

**Effort.** S-M.

**Note.** The scaffold pattern is the reference implementation — Toolinator should replicate its behavior so a Toolinator-wired Create looks and feels identical to a hand-wired one.

---

### Configurable title-bar overflow threshold

**What a prototype author gets today.** `titleActionsTemplate` hardcodes the overflow threshold at 3. Layouts with differing action densities get the same rule.

**What the extension unlocks.** Layouts choose how many actions appear inline before overflow (Jeremy's feedback, 2026-04).

**Per-prototype manual work saved.** Every layout with custom action counts.

**Implementation location.** [`json-toolinator-js-monorepo/packages/core/src/types.ts`](../../../../../../json-toolinator-js-monorepo/packages/core/src/types.ts) — add `titleActionsVisibleMax?: number` to `GenericLayoutOptions`. Use the value in `titleActionsTemplate.tsx` instead of the literal `3`.

**Effort.** S.

---

### Formulator client-side autosave via Toolinator config

**What a prototype author gets today.** Formulator's `<Form>` supports `localStorageKey` for refresh recovery, but Toolinator's `FormFeature` never passes it through. Consumers would have to fork the feature to use Formulator's existing autosave.

**What the extension unlocks.** Any Toolinator-wired Create gets Formulator's existing refresh recovery via a one-line `localStorageKey` config value. No UX change — just preventing lost drafts on tab refresh.

**Per-prototype manual work saved.** Every Toolinator-wired form.

**Implementation location.** [`json-toolinator-js-monorepo/packages/core/src/features/formFeature.tsx`](../../../../../../json-toolinator-js-monorepo/packages/core/src/features/formFeature.tsx) — add `localStorageKey?: StorageKey` to `FormFeatureOptions` and forward it to `<Form>`.

**Effort.** XS.

---

### Slot-based layout overrides

**What a prototype author gets today.** Small IX deviations (e.g. a banner next to the title, an extra footer note) require forking a whole Toolinator layout or dropping down to a custom feature.

**What the extension unlocks.** Each layout exposes named slots (`titleExtras`, `footerBanner`, etc.) so one-off additions don't require a custom layout.

**Per-prototype manual work saved.** Scoped to layouts that need small deviations; adds up across tools.

**Implementation location.** Each layout in [`json-toolinator-js-monorepo/packages/core/src/layouts`](../../../../../../json-toolinator-js-monorepo/packages/core/src/layouts). Introduce a consistent slot API across `toolLandingPage`, `detailPage`, `settingsPage`, `adminPage`.

**Effort.** M.

---

## core-react proposals (lower priority, filed for visibility)

### `Popover` accepts `arrow?: boolean`

**Today.** Raw `@procore/core-react` `Popover` hardcodes `arrow: true`. Scaffold uses `IxQuickPopover` as a workaround.

**Unlocks.** Remove the scaffold workaround; `Popover arrow={false}` becomes IX-compliant directly.

**Effort.** XS.

---

### `Tearsheet` size preset

**Today.** Scaffold sets width via a styled `div` wrapper (`37vw` default, `63vw` wide). Every consumer replicates the pattern.

**Unlocks.** `<Tearsheet size="slideOut">` or `<Tearsheet size="wide">` built-in.

**Effort.** XS.

---

### Form Zone 3 Context Panel primitive

**Today.** No pre-built primitive. Consumers improvise with a second `SplitViewCard.Panel` or a styled sidebar.

**Unlocks.** `ContextPanel` component in `@procore/core-react` — 320px collapsible right rail on desktop, bottom-sheet trigger on tablet/mobile. Satisfies REFERENCE.md "Zone 3 — Context Panel".

**Effort.** L.

---

### Tier 3 destructive confirmation modal variant

**Today.** No pre-built typed-confirmation primitive. Consumers compose `Modal` + a text input + manual match logic.

**Unlocks.** `Modal` variant (or new `DestructiveConfirmModal`) that takes a `confirmText`, a cascade list, and a destructive button that enables only when input matches. Satisfies REFERENCE.md "Tier 3 — Critical, cascading".

**Effort.** M.

---

## Already enforced (no proposal needed)

- Z-index stack — `Tearsheet` at z-30, `Popover`/`OverlayTrigger` at z-20, `Modal` at z-50, `Tooltip` at z-10. All encoded by `@procore/core-react`.
- Pattern 1 primitives — `SplitViewCard.*` exists and behaves correctly.
- Pattern 2 — `ToolLandingPage`, `DetailPage`, `SettingsPage`, `AdminPage` layouts exist in Toolinator.
- Zones 1 / 2 / 4 — `Panel.Header` / `Panel.Body` / `Panel.Footer` + `Form.*` fields compose these.
- Tokens — core-react `colors` / `spacing` exports cover the semantic roles translated in `ix-tokens.mdc`.

---

## How this doc gets used

1. **Storybook compliance lab** (`stories/ix/compliance/`) is the primary design-review artifact. Each proposal here has a matching compliance story showing "IX target vs stack today vs Toolinator-extended."
2. **Design prioritizes.** Which proposals matter for the next cohort of prototypes? Which IX rules are must-have vs nice-to-have?
3. **Engineering scopes.** For each prioritized proposal, estimate based on the implementation location and effort.
4. **Shipping.** Each proposal becomes a separate branch in its owning package (Toolinator, Formulator, core-react). When an extension lands, the status flips from `toolinator-proposal` to `supported` in `REFERENCE.md` and in each relevant `.mdc` rule's `implementationStatus`.

Nothing in this doc should imply engineering is blocked on design or vice versa. The purpose is to give design a concrete list to prioritize and give engineering a concrete list to build from.
