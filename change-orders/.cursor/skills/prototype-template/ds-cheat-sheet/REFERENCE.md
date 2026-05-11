# NGX Design System — Reference Cheat Sheet

Quick-lookup tables for use during implementation. For full rules, see the governing documents.

> **Stack status legend** (added 2026-04 for the Procore prototype-template scaffold)
>
> - **Supported** — works today with existing primitives (`@procore/core-react`, Toolinator, Formulator, Tabulator, Smart Grid).
> - **Scaffold** — works via scaffold wiring (composition templates, helpers added in this repo).
> - **Toolinator proposal** — requires a framework extension; tracked in [`TOOLINATOR-EXTENSIONS.md`](./TOOLINATOR-EXTENSIONS.md).
> - **Out of scope** — domain-specific or tied to a different stack; the scaffold does not enforce.
>
> Status labels are inline against the table or rule they apply to. Rules without a label default to **Supported**.

---

## Pattern Decision Tree

```
START: What is the user doing?
│
├─ Creating a NEW record?
│    └─ Pattern 3 — Slide-Out (37% default, 63% when content needs it; z-30; right-to-left; data-entry = autosave via useDebouncedAutosave, no Save/Cancel)
│
├─ Reviewing or editing an EXISTING record alongside a list?
│    └─ Pattern 1 — Split-View (Grid 37% LEFT, Detail 63% RIGHT)
│
├─ Viewing complex info that needs full width?
│    └─ Pattern 2 — Full-Workspace (single pane, 100%)
│         └─ When context panel opens → shifts to Pattern 4
│
└─ Detail + supplemental context (comments, activity)?
     └─ Pattern 4 — Context-Shift (Detail 63% LEFT, Context 37% RIGHT)
```

---

## View Type → Pattern Mapping

**Status:** Pattern 2 views (Home, Detail, Settings) are **Supported** by Toolinator layouts (`toolLandingPage`, `detailPage`, `settingsPage`). Pattern 1 (Anchor View) is **Scaffold** today via `SplitViewShell`; a first-class `splitViewPage` Toolinator layout is a **Toolinator proposal**. Unified Viewer is **Out of scope** — no primitive exists in the scaffold.

| View Type      | Default Pattern              | Create Action       |
| -------------- | ---------------------------- | ------------------- |
| Home View      | Pattern 2                    | N/A                 |
| Anchor View    | Pattern 1 (after row select) | Pattern 3 Slide-Out |
| Detail View    | Pattern 2 → Pattern 4        | N/A (edit in-place) |
| Settings View  | Pattern 2 (internal sidebar) | N/A                 |
| Unified Viewer | z-80 (full takeover)         | N/A                 |

---

## Z-Index Canonical Stack

**Status:** **Supported** for z-30 (`Tearsheet`), z-20 (`Popover` / `OverlayTrigger`), z-50 (`Modal`), z-10 (`Tooltip`), z-0 (shell layouts) — all enforced by `@procore/core-react` primitives. Unified Viewer (z-80) is **Out of scope**.

```
z-80   Unified Viewer    Full-screen BIM/document/photo
z-50   Modal             Destructive confirmations — scrim: bg-black/50 fixed inset-0
z-30   Slide-Out         Create/filter workflows — scrim: bg-white/30 absolute (workspace)
z-20   Popover           Quick contextual interactions — NO scrim
z-10   Tooltip           Read-only hover info — NO scrim
z-0    Shell             Sidebar, Header, Workspace, Assist — always present
```

**Scrim positioning:**

- `z-30` Slide-Out scrim → `absolute inset-0` inside workspace container only
- `z-50` Modal scrim → `fixed inset-0` covers entire viewport including header

---

## Slide-Out Types and Footer Rules

**Status:**

- **Contextual View** and **System Config** (Apply/Cancel) — **Supported** via `@procore/core-react` `Tearsheet` + `Panel.FooterActions` (wrapped by the scaffold's `TearsheetShell`).
- **Data Entry** and **File Management** (no Save/Cancel, autosave only) — **Scaffold**. Wire via `useDebouncedAutosave` + `<TearsheetAutosaveIndicator>` as the `TearsheetShell` footer. Reference implementation: [`src/views/create/CreateFormTearsheetView.tsx`](../../../../packages/prototype-template/bundled/scaffold/src/views/create/CreateFormTearsheetView.tsx). Layer `localStorageKey` on Formulator for tab-refresh recovery on top of the debounced server save. Toolinator-wired Creates that use `feature: 'form'` (instead of a custom view) require a small Toolinator extension (`onChangeDebounced` on `FormFeature`) — tracked as a **Toolinator proposal** in `TOOLINATOR-EXTENSIONS.md`.

**Tearsheet sizing (scaffold):** Default width is **37% of the workspace**; use **63%** when content density demands it. Slide in from the **right**. This supersedes the earlier "w-[480px]" rule for the prototype-template scaffold.

| Type            | Example                      | Footer Rule                              |
| --------------- | ---------------------------- | ---------------------------------------- |
| Data Entry      | Create RFI, Create Submittal | NO Save/Cancel — autosave only           |
| File Management | Attach documents             | NO Save/Cancel — autosave only           |
| Contextual View | Filter Panel, View Details   | Apply/Cancel buttons — deliberate commit |
| System Config   | Notification preferences     | Apply/Cancel buttons — deliberate commit |

---

## Popover (all at z-20, no scrim)

**Status:** **Scaffold** — use `IxQuickPopover` (in `src/components/templates/ix-popover/IxQuickPopover.tsx`) which composes `@procore/core-react` `OverlayTrigger` + `Popover.Content` with `arrow={false}`. Raw `Popover` from `@procore/core-react` hardcodes `arrow: true`; do not use it directly for IX-compliant popovers. A core-react proposal to accept `arrow?: boolean` is filed in `TOOLINATOR-EXTENSIONS.md` (core-react proposals section).

### Use

**Purpose:** A popover is a floating container useful for communicating small amounts of clarifying information. It is revealed when acting upon a trigger, primarily a button, but can be any pressable component.

Use for **quick and casual** actions like a trivial inline **Save**, **Apply Filter**, or **Add**. These actions should be completed in seconds, are nonessential to the workflow, and should pose little risk of data loss if the popover is dismissed or interrupted. **“Save” here means** a small, immediate commit (e.g. one field or preset), **not** form-level Save for a whole create/edit workflow — those belong in a Slide-Out or autosave patterns elsewhere.

Users can click outside or press **Esc** to dismiss.

Intended for **single-column** activities where no tabs or navigation is needed.

### Do not use

- **Destructive actions** (e.g. permanent deletions, financial approvals) — easy dismissal is non-blocking; use a **Modal** instead.
- **Cannot be triggered from links** — use a button or other pressable control.
- **Not inside a Modal** as the trigger context. Does not interrupt a **two-pane workspace** shell.

### Size and content

Must be **lightweight** and visually tied to its trigger. The visual tie can be accomplished by placing it within **2px** of the element and, when possible, aligned with an edge. The drop shadow should not overlap with the trigger. The trigger is primarily a **button** or another **pressable** component.

Content must be **scannable** (about **2–3 scrolls** of content at most).

**Max size:** **50%** of the container the trigger lives in (the positioning/workspace region). It should not extend past the edge of that container.

**Implementation:** `src/components/ix-popover/IxQuickPopover.tsx` applies tether padding and a **non-collapsing** max width (`min`/`minWidth` so the panel cannot shrink to zero inside the popover’s inline layout shell). For **true “50% of region”** behavior, pass **`portalContainer`** set to that region **and** override styles if needed (percent widths need a definite containing-block width).

**Smart Grid toolbars:** For non-trivial filter fields (several controls with validation), use `FormulatorFilterPopoverContent` (`src/components/templates/ix-popover/FormulatorFilterPopoverContent.tsx`) inside `FilterToolbarPopoverButton` with `IxQuickPopover` **`width={360}`** (via `FilterToolbarPopoverButton`’s `width` prop). For column visibility, drag-to-reorder, and row density presets, use `ColumnConfigurePopoverContent` with **`width={320}`**. The AG Grid sidebar (`filters` / `columns` tool panels) stays enabled as a power-user fallback alongside these popovers.

### Complexity

Fills the gap between **Inline Editing** (too simple) and the **Slide-Out** (too heavy).

Limit editing to tasks that can be accomplished in **seconds**.

Must be **single-step** — do not use for multi-step workflows or wizards.

Avoid **nested** interactions (popover in a popover) or complex elements (rich text editors).

For a **single toggle or selection**, consider simpler **Inline Editing** first.

### Implementation vibe check

Ask yourself: _If the user accidentally clicks the background and this popover vanishes, how much work did they just lose?_

- If the answer is **a lot**, use a **Slide-Out** (or appropriate blocking pattern).
- If the answer is **hardly anything**, the popover is the correct choice.

### Hard rules (compliance)

**Popovers NEVER contain:** delete actions, destructive buttons, or **form-level Save** (whole-form commit). Trivial inline actions only.

---

## Token Quick Reference

**Status:** The Tailwind-class tokens below (`bg-background-primary`, `bg-asphalt-100`, `text-foreground-primary`, etc.) do not exist in the prototype-template scaffold — this repo uses `@procore/core-react` styled-components with `colors` and `spacing` exports. Treat this block as **conceptual semantic roles**; the core-react equivalents are in [`.cursor/rules/ix-tokens.mdc`](../../../../.cursor/rules/ix-tokens.mdc). Any concept with no core-react equivalent is flagged in `TOOLINATOR-EXTENSIONS.md`.

### Background

| Semantic Token            | Use Case                                    |
| ------------------------- | ------------------------------------------- |
| `bg-background-primary`   | Main surface, cards, panels, headers        |
| `bg-background-secondary` | Subtle fills, filter chips row, toolbar row |
| `bg-background-tertiary`  | Selected state on table rows                |
| `bg-background-disabled`  | Disabled input fields                       |
| `bg-asphalt-100`          | Active (clicked) table row — non-negotiable |
| `bg-asphalt-900`          | Sidebar (dark)                              |

### Text

| Semantic Token              | Use Case                                    |
| --------------------------- | ------------------------------------------- |
| `text-foreground-primary`   | Body text, values, primary content          |
| `text-foreground-secondary` | Labels, helper text, table headers          |
| `text-foreground-tertiary`  | Timestamps, metadata, secondary hints       |
| `text-foreground-inverse`   | Text on dark backgrounds                    |
| `text-danger-600`           | Error text, overdue indicators              |
| `text-success-800`          | Success states ("Saved" autosave indicator) |

### Border

| Semantic Token                | Use Case                        |
| ----------------------------- | ------------------------------- |
| `border-border-default`       | Standard dividers, card borders |
| `border-border-hover`         | Interactive border on hover     |
| `border-border-input-default` | Input field border (default)    |
| `border-border-input-hover`   | Input field border (hover)      |
| `border-border-input-focus`   | Input field border (focus)      |
| `border-border-inactive`      | Locked/disabled chips           |

### Status Colors

| Semantic Token                                    | Use Case                      |
| ------------------------------------------------- | ----------------------------- |
| `bg-danger-25 text-danger-600`                    | Incomplete/error status badge |
| `bg-badge-secondary-bg text-badge-secondary-text` | Draft status badge            |
| `bg-informative-600 text-white`                   | Active/info status badge      |
| `text-danger-600`                                 | Overdue due date indicator    |

---

## Locked Component Styling (Non-Customizable)

**Status: Out of scope.** The values below are from the original Tailwind/Pattern Component Library stack. They do not apply to the prototype-template scaffold (`@procore/core-react` + styled-components). Do not copy these classes into scaffold code. The semantic roles they represent (active row background, hover state, save-button treatment) are covered by `ix-tokens.mdc` for the equivalent core-react usage.

These values are enforced by the Pattern Component Library and must not be overridden:

```
TableActionRow container:
  px-4 py-3 border-b border-border-default bg-background-primary

SplitViewHeader container:
  bg-background-primary border-b border-border-default

ManualSaveFooter:
  bg-background-primary border-t border-border-default shadow-lg

Save button: bg-asphalt-950 text-white
Cancel button: bg-background-secondary text-foreground-primary

TableRow active: bg-asphalt-100 (NO borders, NO other bg override)
TableRow hover: bg-background-secondary
TableRow selected (checkbox): bg-background-tertiary
```

---

## Form Zone Architecture — Quick Spec

**Status:**

- **Zone 1 (Identity Strip), Zone 2 (Primary Content), Zone 4 (Action Bar)** — **Scaffold** via `@procore/core-react` `Panel.Header`, `Panel.Body`, `Panel.Footer` + `Form.*` fields from `@procore/json-formulator`. Sticky Zone 1 for Tier 3+ forms is a Formulator convention.
- **Zone 3 (Context Panel)** — no primitive exists today. Tracked as a **core-react proposal** in `TOOLINATOR-EXTENSIONS.md` (320px collapsible right rail with bottom-sheet fallback).
- The Tailwind class values below are conceptual; use equivalent core-react tokens per `ix-tokens.mdc`.

### Zone 1 — Identity Strip

```
bg-background-primary · border-b border-border-default
Form type:     text-xs font-medium text-foreground-tertiary uppercase tracking-wider
Form number:   text-2xl font-extrabold text-foreground-primary — NEVER truncate
Status badge:  StatusBadge component — never custom
Overdue date:  text-danger-600 + explicit indicator
Sticky:        Required on Tier 3, 4, 5 forms
```

### Zone 2 — Primary Content

```
Single column ONLY
Field-to-field: gap-2 (8px)
Label to input: gap-1 (4px)
Above section header: mt-6 (24px)
Below section header: mt-3 (12px)

Field label:  text-sm font-medium text-foreground-secondary · sentence case
Field value:  text-sm font-medium text-foreground-primary (primary)
              text-sm font-normal text-foreground-secondary (secondary)
Section hdr:  text-xs font-bold text-foreground-tertiary uppercase tracking-widest

Field order:
  Primary:   Status · Due Date · Assigned To · Total Amount · Question/Description
  Secondary: Submitter · Submitted Date · Spec Section · Drawing Reference
  Tertiary:  Created By · Created Date · System IDs → hidden behind "Show more"
```

### Zone 3 — Context Panel

```
Desktop: w-80 (320px) right rail
Tablet:  bottom sheet trigger always visible
Mobile:  sheet trigger only
Collapsible — user can dismiss to expand Zone 2
NEVER requires navigation to access
```

### Zone 4 — Action Bar

```
bg-background-primary border-t border-border-default
Primary action: right-aligned · bg-foreground-primary text-foreground-inverse
Secondary:      left-aligned · outlined/ghost
Max 2 visible actions — overflow to "..." menu
Role-aware: same status = different CTA for each role
```

---

## Form Complexity Tiers

**Status:** **Scaffold**. Tier 1–5 behaviors are decisions the prototype author makes at `@procore/json-formulator` schema authoring time; the scaffold provides templates for Tier 1–2 (Quick Create Tearsheet). Tier 5 Guided Process is not yet scaffolded — build on Formulator + Tearsheet or file a new template request.

| Tier                  | Field Count | Zone 1 Sticky | Notes                              |
| --------------------- | ----------- | ------------- | ---------------------------------- |
| 1 — Quick Capture     | 3–8         | Static        | Pattern A                          |
| 2 — Structured Record | 8–20        | Static        | Pattern B                          |
| 3 — Routed Document   | 15–30       | **Required**  | Pattern C · RFIs, Submittals       |
| 4 — Financial Form    | 20–40       | **Required**  | Pattern D · Change Orders, Budgets |
| 5 — Guided Process    | 40+         | **Required**  | Pattern E · Multi-step             |

Quick Create / Guided Create (Slide-Out entry point): Tier 1–2 = Quick Create · Tier 5 = Guided Create

---

## Destructive Action Tiers

**Status:**

- **Tier 1 (Undo toast)** — **Supported** via `@procore/toast-alert`.
- **Tier 2 (Modal)** — **Supported** via `@procore/core-react` `Modal` (z-50).
- **Tier 3 (typed confirmation + cascade list)** — no pre-built primitive. Tracked as a **core-react proposal** in `TOOLINATOR-EXTENSIONS.md`.

| Tier | Risk                  | UI                                                  | Duration |
| ---- | --------------------- | --------------------------------------------------- | -------- |
| 1    | Low-risk, reversible  | Undo toast only — no modal                          | 5–7s     |
| 2    | Irreversible, bounded | Modal (z-50) · [Cancel] [Delete Entity]             | —        |
| 3    | Critical, cascading   | Modal + typed confirmation + enumerate consequences | —        |

**Role scope:** Author=own drafts · Controller=managed set · Reviewer/Consumer=none

---

## Filter Panel Spec

**Status:** **Scaffold**. The IX-compliant filter panel is a Tearsheet (Contextual View type, Apply/Cancel footer). Width follows the scaffold's Tearsheet rule (**37% default, 63% when needed**, right-to-left) — supersedes the legacy `w-[480px]`. The Filter button trigger uses `IxQuickPopover` for quick inline filtering (see `IxPopoverTriggerButton` + `ConfigurationPopoverContent` for the trigger + content pattern used in table toolbars).

```
Component type:  Slide-Out — Contextual View
Width:           37% default, 63% when content needs it (right-to-left) — scaffold rule supersedes legacy w-[480px]
Z-index:         z-30
Trigger:         "Filters" button inside TableActionRow
Footer:          Apply Filters + Cancel (deliberate commit — Contextual View type)
Chips row:       below TableActionRow, above data table
Chip style:      rounded-full bg-background-primary border border-border-default
Locked chip:     bg-asphalt-100 text-foreground-tertiary border-border-inactive cursor-not-allowed

Logic:
  AND across different fields (intersection)
  OR within same field (union)
  Permissions = silent pre-filter (always applied before view filters)

Dynamic values ("Me", "Today") → resolve at render · never hardcode at save time
Clear All → never removes locked filters
Major changes (filter add/remove) → triggers "unsaved changes" state
Minor changes (sort, column show/hide) → silent, no save prompt
```

---

## Construction Domain — Entity Associations

**Status: Out of scope.** Domain-specific behaviors for Procore construction entities. Treat as design context only; the prototype-template scaffold is generic across tools and does not enforce these auto-population rules.

| When this is selected   | Auto-populate / validate                                                    |
| ----------------------- | --------------------------------------------------------------------------- |
| Company                 | Filter Contacts to that company · Auto-fill Trade · Show insurance warnings |
| Location                | Suggest Drawings for that area · Pre-select responsible Company             |
| Spec Section            | Suggest Submittal types · Auto-suggest Subcontractor · Link Cost Codes      |
| Cost Code               | Validate against remaining budget                                           |
| Financial impact > $10k | Require attachments · Trigger owner notification                            |
| RFI due date < today+3  | Warn "Expedited" · Suggest Priority = High                                  |
| Schedule Task linked    | Show float · Warn on delay · Suggest related tasks                          |

---

## Construction Button Labels

**Status: Out of scope.** Construction-specific label suggestions. Use as a design reference; do not promote to enforced scaffold rules. Copy standards for buttons live in the `procore-content-design` skill.

| Generic  | Construction-Specific                    |
| -------- | ---------------------------------------- |
| Submit   | Submit for Review · Submit Answer        |
| Reject   | Revise & Resubmit · Reject with Comments |
| Approve  | Approve Submittal · Approve & Distribute |
| Delete   | Void [Entity] (with confirmation)        |
| Complete | Verify Complete · Close [Entity]         |

---

## User Role × Action Matrix (Zone 4)

**Status: Out of scope.** Domain-specific role → CTA mappings for RFIs, Submittals, Change Orders. Treat as design context; the scaffold does not implement role-based action switching.

| Role           | RFI "Open"           | Submittal "In Review" | Change Order "Pending" |
| -------------- | -------------------- | --------------------- | ---------------------- |
| **Author**     | Follow Up            | Follow Up             | Edit                   |
| **Controller** | Reassign             | Assign Reviewer       | Approve / Reject       |
| **Reviewer**   | Respond              | Approve / Return      | Review                 |
| **Consumer**   | _(none — read-only)_ | _(none — read-only)_  | _(none — read-only)_   |

Full matrix → see Form-Based Detail Page PRD Section 03.

---

## Gold Standard Reference Implementations

**Status: Out of scope.** The file paths below (`/src/app/components/rfis/…`) are from an earlier Next.js prototype project, NOT this scaffold. Do not copy those files. When you need an RFI-like table, build on `@procore/json-tabulator` or `@procore/smart-grid` inside a `SplitViewCard` + `SplitViewShell` — see [`ix-split-view.mdc`](../../../../.cursor/rules/ix-split-view.mdc).

| Reference            | Location                                        | Demonstrates                                        |
| -------------------- | ----------------------------------------------- | --------------------------------------------------- |
| RFI table            | `/src/app/components/rfis/rfi-table.tsx`        | TableRow active state, TableCell, horizontal scroll |
| RFI action row       | `/src/app/components/rfis/table-action-row.tsx` | TableActionRow extension pattern                    |
| RFI detail view      | `/src/app/components/rfis/rfi-detail-view.tsx`  | SplitViewDetail, ManualSaveFooter, dirty state      |
| Document index table | `/DOCUMENT_INDEX_TABLE_GOLD_STANDARD.md`        | Filter chips, locked filters, Clear All             |

---

_Full rules in governing documents. This reference covers the 80% case._
_Run `scripts/check-compliance.sh [file-or-directory]` to scan for token and pattern violations._
