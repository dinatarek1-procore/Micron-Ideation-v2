# IX Design System Cheat Sheet

Quick-reference for Procore NGX interaction patterns used in prototypes. Use this skill when designing or generating UI that needs to match production IX patterns (Split-View, Slide-Out, Popover, Full-Workspace, Context-Shift, Form Zones, Destructive Tiers).

The governing document is [`REFERENCE.md`](./REFERENCE.md) (same folder). This `SKILL.md` is the quick-access entry point; the digest Cursor rules under `.cursor/rules/ix-*.mdc` cover day-to-day decisions.

## Status legend

REFERENCE.md contains rules authored against an earlier Procore prototype stack. Not every rule is enforceable in this scaffold today. Each rule now carries one of these labels (added inline in REFERENCE.md):

- **Supported** — works today with existing primitives (`@procore/core-react`, `@procore/json-toolinator`, `@procore/json-formulator`, `@procore/json-tabulator`, `@procore/smart-grid`).
- **Scaffold** — works via scaffold wiring (composition templates, helpers).
- **Toolinator proposal** — requires a framework extension captured in [`TOOLINATOR-EXTENSIONS.md`](./TOOLINATOR-EXTENSIONS.md).
- **Out of scope** — domain-specific or tied to a different stack; the scaffold does not enforce.

## When to load this skill

- Authoring or reviewing a view that renders a table + detail pane (Pattern 1 Split-View).
- Adding a Create or filter slide-out (Pattern 3). Tearsheet defaults to **37% width, right-to-left**, expand to **63%** when content demands it. **Data-entry** slide-outs use **autosave** (no Save / Cancel) via `useDebouncedAutosave` + `TearsheetAutosaveIndicator` — see `src/views/create/CreateFormTearsheetView.tsx` for the reference wiring. **Contextual views** (filter, config) still use **Apply / Cancel**. Formulator's `localStorageKey` layers client-side refresh recovery on top of the debounced server save.
- Adding a popover or overflow menu (use `IxQuickPopover`, never a raw `@procore/core-react` `Popover`).
- Picking a modal vs slide-out for a destructive action (Tier 1/2/3).
- Designing form fields and deciding on Zone 1 (identity strip), Zone 2 (primary content), Zone 3 (context panel), Zone 4 (action bar).
- Resolving tokens — REFERENCE.md's Tailwind-class tokens translate to `@procore/core-react` `colors` / `spacing` exports; see [`ix-tokens.mdc`](../../../.cursor/rules/ix-tokens.mdc) for the mapping.

## Do-not-do list

- Do **not** port handcrafted tables or table controls from earlier prototype projects. Use `@procore/json-tabulator` or `@procore/smart-grid` inside `SplitViewCard` instead.
- Do **not** copy the "Gold Standard Reference Implementations" paths at the bottom of REFERENCE.md — those files do not exist in this stack.
- Do **not** copy the "Locked Component Styling" Tailwind-class block — the scaffold uses styled-components with core-react tokens.
- Do **not** promote the Construction-domain button labels or role matrices to enforced rules — the scaffold is generic across tools; these examples stay as design context only.

## Related files

- [`REFERENCE.md`](./REFERENCE.md) — full rules, annotated with status per table.
- [`TOOLINATOR-EXTENSIONS.md`](./TOOLINATOR-EXTENSIONS.md) — design-facing proposal for framework changes that would make more IX rules enforced by default.
- `.cursor/rules/ix-patterns.mdc`, `ix-tearsheet.mdc`, `ix-popover.mdc`, `ix-split-view.mdc`, `ix-actions.mdc`, `ix-form-zones.mdc`, `ix-destructive.mdc`, `ix-tokens.mdc` — per-surface-area digest rules.
- Storybook `stories/ix/` — one demo per pattern plus a compliance lab showing "IX target vs stack today vs proposed Toolinator extension" side by side.
