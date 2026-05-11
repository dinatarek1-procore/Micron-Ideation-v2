# Procore Content Design: Reference

Detailed tables and lists for look-up. Use with [SKILL.md](../SKILL.md).

---

## Confirmation modals and buttons

- **Use confirmation modals for:** (1) potentially destructive actions (e.g. permanent delete, overwrite), or (2) clarifying the outcome of an action when that outcome is otherwise unclear. Do not use them for straightforward positive outcomes like "saved" or "created". Use toasts, success banners, or inline success instead.
- **Button labels:** No longer than two words, except the canonical **AI-assisted** pattern **`[Verb] with AI`** (see §1 Voice and Tone in [SKILL.md](../SKILL.md)). **Always title case** on the visible label, using the same short-word treatment as headers in [SKILL.md](../SKILL.md) §3 Grammar and Formatting (Capitalization). Examples: **Delete Report**, **Cancel**, **Go to Submittals** (if "Go to" counts as two words and fits; otherwise shorten to **View Submittals** or similar).
- **Body copy in modals:** Do not bold or capitalize common action words (edit, view, save). Use normal sentence case. Reserve bold/capitalization for step-by-step instructions that reference a specific UI element (e.g. "Select **Save**").
- **User-facing punctuation:** No em dashes (—). Use comma, period, colon, or parentheses instead. See §3 Grammar and Formatting in [SKILL.md](../SKILL.md).
- **AI-assisted actions:** Use **`[Verb] with AI`** (title case), e.g. **Summarize with AI**, **Generate with AI**. Full rules: §1 Voice and Tone in [SKILL.md](../SKILL.md).

---

## UI Length Guidance (Optional)

Use this table when character limits are relevant to the UI surface, localization risk, or handoff requirements. These are defaults, not hard global limits. Product teams may set different field limits based on research.

| Element          | Max characters | Notes                                                                                                                               |
| ---------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Button label     | 2 words        | Default; canonical **AI-assisted** labels use **`[Verb] with AI`** (three words). See §1 Voice and Tone in [SKILL.md](../SKILL.md). |
| Tooltip          | 150 chars      | One sentence                                                                                                                        |
| Error message    | 200 chars      | Problem + solution. Apologetic, non-blaming tone. See §1 Voice and Tone (Error messages) in [SKILL.md](../SKILL.md).                |
| Toast/success    | 100 chars      | Brief confirmation                                                                                                                  |
| Banner body      | 250 chars      | Info + action                                                                                                                       |
| Modal body       | 300 chars      | Context + consequence                                                                                                               |
| Placeholder text | 40 chars       | Example, not instruction                                                                                                            |

---

## Action Glossary (Summary)

Use this section for core UI terminology by default. For tool/domain-specific terminology from the Master Glossary, use `references/master-glossary-contexts.md` with explicit context matching.

- **Do not swap glossary verbs for colloquial alternatives** “for readability.” When an action row applies, use that verb (or the context-matched Master equivalent). Same intent across the product should use the same recommended term. See Rule Priority and `Terminology (Glossary)` in [SKILL.md](../SKILL.md).

| Action           | Usage                                                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Add              | Sub-items to existing items; adding people/companies to Directory                                                          |
| Configure        | Admin preferences for tool, project, or account                                                                            |
| Copy             | Duplicating content from one item into another (e.g. copy from previous Timesheet). For full object copy use **Duplicate** |
| Create           | New items in Procore                                                                                                       |
| Delete           | Permanent removal (e.g. Drawings, Locations, Daily Log). Use **Move to Recycle Bin** for Recycle Bin                       |
| Distribute       | Notifying people (email, activity feed, etc.). Use **Send** for email only                                                 |
| Duplicate        | One-to-one copy of entire object. Use **Copy** for content between objects                                                 |
| Edit / Bulk Edit | Changing info; Bulk Edit = multiple items                                                                                  |
| Enable           | Turning on a feature, tool, button, or item                                                                                |
| Export           | Saving/exporting as PDF, CSV, BCF, etc.                                                                                    |
| Generate         | Automatic creation from other items only (e.g. generate submittals from specs). Not when user creates from another item    |
| Go               | Navigate to another place (e.g. “Go to Submittals”)                                                                        |
| Grant Permission | Setting or changing user access levels                                                                                     |
| Import           | Bulk adding from import template                                                                                           |
| Move             | Changing location within Procore (e.g. file to folder, item to Recycle Bin)                                                |
| Publish          | Making project info (models, drawings, specs) available to others                                                          |
| Respond          | Replying to items                                                                                                          |
| Retrieve         | Taking item from Recycle Bin back to tool list                                                                             |
| Review           | View and manage in same action                                                                                             |
| Save             | Saving edits to existing item                                                                                              |
| Send             | Sending email, feedback, or notifications                                                                                  |
| Update           | Refreshing to view new content from another device/screen                                                                  |
| Upload           | From computer to Procore                                                                                                   |
| View             | Seeing general information                                                                                                 |

---

## Banned internal / engineering names (user-facing)

Do not use in customer-facing UI or copy governed by this skill (case-insensitive): **Helix**, **Overflow menu**, **Tearsheet**, **MFE**. Full guidance: [SKILL.md](../SKILL.md) §2 Terminology (Avoid internal / engineering names).

---

## Master Glossary Integration (Context-Bound Terms)

- Runtime source for master terms: `references/master-glossary-contexts.md` (same folder as this file)
- Precedence: core UI glossary wins by default; master terms apply only with explicit context match.
- If context is ambiguous, ask the user before applying a master term.
- If context mismatches, keep the core term and flag:
  `[CONTEXT MISMATCH: term "X" belongs to "Y" context; using core term "Z" unless you confirm override]`

---

## Field Label Glossary (Key Groups)

**Address:** Address Line 1 (street), Address Line 2 (unit/suite), City, State, ZIP Code

**Date/Time:** Date, Date Created, Due Date, Date Updated, Start Date, Completion Date, End Date, Date [Past Tense Verb] (e.g. Date Delivered), Hours

**Person:** Person (Directory user), Contact, Assignee, Person Affected, Creator; use [Noun] for “person who…” (Receiver, Assignee, Initiator). Avoid “Received By,” “Assigned To.” [Item] Manager for workflow owner. Role (e.g. Architect, Engineer)

**Other:** Attachments, Comments, Responses, Company, Responsible Company, Cost Code, Cost Impact, Description, Details, Subject, Email Address, Location, Number (# if space limited), Quantity, Phone Number, Fax Number, Priority, Private (checkbox), Revision, Schedule Impact, Specification Section, Name, [Item] Name, First Name, Last Name, Trade, Type, [Item] Type

---

## Date and Time Presets (US English)

| Preset | Date example                | Time example                     |
| ------ | --------------------------- | -------------------------------- |
| Short  | 1/31/2021                   | 2:30 PM                          |
| Medium | Jan 31, 2021                | 2:30:09 PM                       |
| Long   | January 31, 2021            | 2:30:09 PM EST                   |
| Full   | Wednesday, January 31, 2021 | 2:30:09 PM Eastern Standard Time |

Weekday/month: abbreviate only when space is limited; second and third letters lowercase, no periods. Time: space before AM/PM; include minutes when on the hour. Time zone: always distinguish standard vs daylight; capitalize (e.g. Eastern Standard Time).

---

## Measurements and Abbreviations

When superscript isn’t available, use caret: e.g. `yd^3`.

| Measurement             | Abbreviation(s)        |
| ----------------------- | ---------------------- |
| Cubic foot              | ft³, ft^3              |
| Cubic meter             | m³, m^3                |
| Cubic yard              | yd³, yd^3              |
| Each                    | ea                     |
| Inch                    | in                     |
| Linear foot             | If                     |
| Lump sum                | ls                     |
| Price per [measurement] | $/[abbrev], e.g. $/ft² |
| Square foot             | ft², ft^2              |
| Square meter            | m², m^2                |
| Square yard             | yd², yd^2              |
| Ton                     | ton                    |
| Tonne                   | t                      |
| Yard                    | yd                     |

---

## Translation and Space (Global)

| English characters | Avg. character increase | Avg. space required |
| ------------------ | ----------------------- | ------------------- |
| Up to 10           | 100–300%                | 100–200%            |
| 11–20              | 180–200%                | 100–180%            |
| 21–30              | 160–180%                | 60–80%              |
| 31–50              | 140–160%                | 40–60%              |
| 51–70              | 151–170%                | 31–40%              |
| Over 70            | ~130%                   | ~30%                |

Shorter English strings reduce translation and layout issues.

---

## Contractions

Contractions are allowed but expand in some languages. Prefer “cannot” (no space) if spelling out “can’t.”

---

## Source Files in This Project

- **Glossaries.md** — Common words, field labels
- **Grammar Rules.md** — Capitalization, punctuation, dates, numbers, acronyms
- **Writing for AI.md** — Conversation design
- **Writing Globally.md** — Translation and clear language
- **Writing Accessibility.md** — Alt text, ARIA, IA
- **Inclusive Language.md** — Inclusive product writing
- **Product Personality.md** — Voice and tone

To add terms to glossaries, contact #ux-content via Slack.
