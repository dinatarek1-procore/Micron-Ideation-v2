---
name: procore-content-design
description: Apply Procore content design and UX writing standards when creating or reviewing user-facing copy, UI text, conversational AI, or designs. Use when writing for Procore, checking designs against Procore standards, or when the user mentions content design, UX writing, voice and tone, or Procore style. Triggers on "content design", "UX writing", "tooltip review", "error message copy", "Procore style", "conversation design". Do NOT trigger for marketing campaign copy, legal/compliance text, developer-facing API documentation, or internal engineering docs.
metadata:
  status: trial
---

## Companion Files

```text
procore-content-design/
├── SKILL.md        <- Main workflow and rules (you are here)
└── references/
    ├── README.md                  <- Human setup guide (not loaded by agent at runtime)
    ├── reference.md               <- Detailed tables: glossary, field labels, dates, measurements
    │                                Load when a workflow step needs exact terms, labels, or formats.
    └── master-glossary-contexts.md <- Runtime term map (Master Glossary + context metadata)
                                      Load only when a term is tool/domain-specific or conflicts with core UI glossary usage.
```

The source CSV in Downloads is upstream terminology data for maintenance only. Do not treat the raw CSV as runtime instruction text.

## Maintenance Note

Keep these counts synchronized when editing this skill package:

- Workflows in `SKILL.md`: 3
- Workflow output format blocks in `SKILL.md`: 3
- Checklist items in `SKILL.md`: 7
- Companion runtime files: `references/reference.md`, `references/master-glossary-contexts.md`, `references/README.md` (3)

# Procore Content Design Standards

Apply these standards whenever creating or reviewing content that will appear in Procore’s product or that should align with Procore’s content design. For detailed tables and full lists, see [references/reference.md](references/reference.md).

## Workflow Router

Route to one workflow before using the standards reference sections.

| User Intent                             | Workflow                                                                                                  |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| "Write/draft/create [UI element]"       | **Generate Copy** — Phase 1: Gather context, Phase 2: Draft, Phase 3: Self-check, Phase 4: Finalize       |
| "Review/check/audit [copy or design]"   | **Review Copy** — Phase 1: Read content, Phase 2: Check against standards, Phase 3: Report                |
| "Write a chat flow / conversational AI" | **Conversation Design** — Phase 1: Define goal, Phase 2: Draft flow, Phase 3: Validate, Phase 4: Finalize |
| Ambiguous                               | Ask: "Are you writing new copy or reviewing existing content?"                                            |

---

## Rule Priority (when guidelines conflict)

1. **Clarity** — The user must understand the message. Never sacrifice clarity. Clarity **includes** using the **correct glossary action and UI terms** for the use case so language stays consistent across the product; that consistency is part of what makes copy clear for Procore users.
2. **Accuracy** — Use the correct glossary term. Never invent terminology. Do **not** replace approved glossary action words with colloquial or generic “plain English” synonyms “for readability” when the Action Glossary in `references/reference.md` or a context-matched Master term prescribes a specific verb or label.
3. **Brevity** — Shorter is better, but not at the cost of clarity or accuracy.
4. **Tone** — Match the context tone table. Tone yields to clarity.
5. **Formatting** — Apply capitalization, punctuation, and date rules last.

When two rules conflict, the higher-numbered rule yields to the lower-numbered rule.

**Principle:** Brevity and tone never justify replacing prescribed glossary terminology with ad hoc synonyms. When plain wording and standard terminology appear to conflict, rephrase around the approved term (add short context if needed) instead of abandoning it.

---

## Guardrails

1. **Never invent terminology.** If a term is not in the glossary, flag it:
   `[TERM NOT IN GLOSSARY: suggest "X" — verify with #terminology-management]`
2. **Never apply these standards to legal, compliance, or marketing copy.**
   These domains have their own guidelines. Flag and defer.
3. **Never silently override approved copy.**
   If reviewing content marked as "approved" or "final," flag violations but do not rewrite.
4. **Always cite the rule.** Every correction must reference which section/rule it's based on.
5. **When in doubt, ask.** If content doesn't clearly fit a category, ask the user rather than guessing.
6. **Never auto-substitute Master Glossary terms in unrelated UI contexts.**
   Use context matching first; if context does not match, keep core UI term and flag.
7. **Never use Master synonym variants unless that exact context is active.**
   If there is no explicit context match, do not swap terms.
8. **Always cite terminology source.**
   Mark each terminology correction as `Core` (SKILL/reference glossary) or `Master` (`references/master-glossary-contexts.md`).

---

## Terminology Routing (Core vs Master)

Use this router before applying terminology corrections:

1. Start with the **Core UI glossary** (`Terminology (Glossary)` + `references/reference.md`) for generic UI labels, actions, and component copy.
2. Use **Master Glossary contexts** (`references/master-glossary-contexts.md`) only when the requested term is explicitly tool/domain/functionality-bound.
3. If a core term and master term both exist:
   - Default to core term.
   - Use master term only when workflow context explicitly matches the master context.
4. If context is ambiguous, ask the user before applying a master term.
5. If context does not match, flag and keep the core term:
   `[CONTEXT MISMATCH: term "X" belongs to "Y" context; using core term "Z" unless you confirm override]`

Precedence:

1. Core UI glossary term (default)
2. Master Glossary term (only when explicit context match exists)
3. User-confirmed override when context is ambiguous

**Parallel construction:** The same user intent and surface pattern should use the **same** recommended glossary action (Core by default; Master when context matches). Different designers and product areas must not introduce alternate verbs for identical use cases; that fragments the experience and breaks alignment with the Action Glossary. Prefer the prescribed term and adjust surrounding copy if needed.

---

## Workflow: Generate Copy

**Entry:** write/draft/create UI content.

| Phase             | Steps                                                                                                                                                                   | Load                                                                                        | Exit                                               |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1. Gather context | Identify surface/action/location, audience/outcome/risk, constraints (limits, localization, accessibility, terminology). Ask only highest-impact clarifiers if missing. | `Voice and Tone`, `Terminology (Glossary)`, `Global and Inclusive Writing`, `Accessibility` | Enough context to draft at least one viable option |
| 2. Draft          | Draft 1-3 options; keep labels short (buttons <=2 words); use preferred terms; for errors include problem + next step + recovery if known.                              | `Voice and Tone`, `Terminology (Glossary)`, `Grammar and Formatting`                        | Draft aligns to intent and UI surface              |
| 3. Self-check     | Run `Content Review Checklist`; verify tone, terminology, grammar, inclusivity, accessibility; include conversation checks when relevant.                               | `Content Review Checklist`                                                                  | All relevant checklist items pass (else revise)    |
| 4. Finalize       | Deliver using `Generate Copy — Output Format`; include alternates only for meaningful trade-offs.                                                                       | `Output Format Standards`                                                                   | Output format-compliant and checklist-pass         |

---

## Workflow: Review Copy

**Entry:** review/check/audit existing copy or design.

| Phase              | Steps                                                                                                                                                                                       | Load                                                                                                                                                     | Exit                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1. Read content    | Restate scope/location; capture intent, risk, constraints; confirm UI vs conversational scope.                                                                                              | `Voice and Tone`, `Conversation Design (AI / Chat)`                                                                                                      | Scope is explicit                             |
| 2. Check standards | Evaluate tone, terminology, grammar/formatting, global/inclusive, accessibility, and conversation rules (if applicable).                                                                    | `Voice and Tone`, `Terminology (Glossary)`, `Grammar and Formatting`, `Global and Inclusive Writing`, `Accessibility`, `Conversation Design (AI / Chat)` | All relevant categories evaluated             |
| 3. Report          | Report findings in severity order; include failure, impact, and rewrite; state "no issues" explicitly when clean; include final recommendation. Format using `Review Copy — Output Format`. | `Content Review Checklist`, `Output Format Standards`                                                                                                    | Actionable decision + format-compliant output |

---

## Workflow: Conversation Design

**Entry:** design chat flow, assistant prompts, or conversational UX.

| Phase          | Steps                                                                                                                                       | Load                                                                 | Exit                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------ |
| 1. Define goal | Define user goal + success condition; map user states/transitions; capture channel constraints; identify actions requiring confirmation.    | `Conversation Design (AI / Chat)`, `Voice and Tone`, `Accessibility` | Goal/states/constraints defined            |
| 2. Draft flow  | Draft primary path and fallback paths (no input, no match, misrecognition, task failure); include confirmation patterns and guided choices. | `Conversation Design (AI / Chat)`, `Global and Inclusive Writing`    | Primary + fallback paths complete          |
| 3. Validate    | Check clarity, sequencing, terminology, grammar, accessibility labels, error handling, closure; run relevant checklist items.               | `Content Review Checklist`                                           | Relevant checklist items pass              |
| 4. Finalize    | Deliver final flow + sample transcript using `Conversation Design — Output Format`; include explicit closure language.                      | `Output Format Standards`                                            | Format-compliant output with clear closure |

---

## Output Format Standards

Use fixed section order for each workflow output.

### Generate Copy — Output Format

1. Ready-to-use copy (recommended option first; alternates optional)
2. Checklist compliance notes (`Pass/Fail` + reason per checklist item; revise if any fail)
3. Glossary terms used + source (`Terminology (Glossary)` or `references/reference.md`)
4. Terminology decision notes (`Term`, `Source`=`Core|Master`, `Context reason`)

### Review Copy — Output Format

Use this table schema:

| #   | Original | Issue | Rule Violated | Suggested Fix |
| --- | -------- | ----- | ------------- | ------------- |

Then include:

1. Final recommendation: `Approve` | `Approve with edits` | `Revise`
2. Checklist coverage confirmation
3. Terminology conflict notes when relevant (`Core|Master`, context result, mismatch flag)

### Conversation Design — Output Format

1. Final flow (primary + fallbacks: no input/no match/misrecognition/task failure)
2. Sample transcript (primary + one fallback)
3. Validation notes mapped to conversation/checklist rules
4. Closure confirmation (conversation complete + next step)

---

## 1. Voice and Tone

**Voice** (consistent): Human, helpful, clear. Never robotic, verbose, patronizing, dry, or overly friendly.

**Tone** (context-dependent):

| Context                     | Tone                                                                                                                                                                                                                                                                                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Empty states                | Active, benefits-focused                                                                                                                                                                                                                                                                                                                      |
| Success toasts              | Affirmative, brief, give the user credit without sounding sycophantic                                                                                                                                                                                                                                                                         |
| Confirmation modals         | Use for potentially destructive actions (e.g. permanent delete) or to clarify the outcome of an action when that outcome is otherwise unclear. Affirmative, next-step focused. Do not use for straightforward positive outcomes like "saved" or "created". Use toasts, banners, or inline success instead.                                    |
| Error messages              | Apologetic, solutions-oriented. Lead with **we’re sorry** or equivalent when space allows. **Never blame the user:** do not imply the failure was their fault (avoid “your connection,” “you may have,” “check your,” or similar). Frame setbacks as temporary or on our side when accurate; offer a clear next step without assigning fault. |
| Info banners                | Informative, actionable                                                                                                                                                                                                                                                                                                                       |
| Onboarding                  | Encouraging, action-oriented                                                                                                                                                                                                                                                                                                                  |
| Tooltips                    | Informative, neutral, concise                                                                                                                                                                                                                                                                                                                 |
| Placeholder text            | Example-driven, not instructional                                                                                                                                                                                                                                                                                                             |
| Loading states              | Reassuring, brief                                                                                                                                                                                                                                                                                                                             |
| Destructive-action warnings | Serious, outcome-focused, never casual                                                                                                                                                                                                                                                                                                        |

For negative messages, focus on what Procore is doing to fix the issue. For positive messages, offer encouragement and give the user credit.

**Button labels:** No longer than two words (e.g. **Delete Report**, **Cancel**). **Always use title case** on the visible label, using the same short-word rules as headers (see §3 Grammar and Formatting — Capitalization). Keep confirmation modal primary actions short and clear.

**AI-assisted actions (product UI):** Labels for actions that use Procore’s in-product AI must follow **`[Verb] with AI`**: title case on the visible string, a single strong verb first, then **with AI** (e.g. **Summarize with AI**, **Generate with AI**). Do not use alternate patterns (e.g. “AI summarize,” “Ask AI to…,” “Smart summarize”) for the same affordance. This pattern may be **three words** when it is the canonical control; it overrides the default two-word button limit for that surface only.

---

## 2. Terminology (Glossary)

Use Procore’s preferred terms. **Do not substitute colloquial or generic verbs** when the Action Glossary or a context-matched Master term specifies an action. The glossaries define parallel construction across the product.

### Avoid internal / engineering names (user-facing copy)

Do not use these in UI, errors, toasts, banners, or other customer-facing copy governed by this skill (match case-insensitively when reviewing): **Helix**, **Overflow menu**, **Tearsheet**, **MFE**. Rewrite with user-facing language (describe the action or UI pattern, not platform or engineering codenames). If the correct customer-facing replacement is ambiguous, flag for verification in the same spirit as `[TERM NOT IN GLOSSARY: suggest "X" — verify with #terminology-management]`, rather than inventing a new product name.

Common ones:

- **Actions:** Add (sub-items), Configure (admin/preferences), Create (new items), Delete (permanent) vs **Move to Recycle Bin**, Distribute (notify people) vs **Send** (email only), **Download** / **Upload** / **Export** / **Import** / **Edit** / **Bulk Edit**, **Generate** (automatic creation only), **Go** (navigate), **Grant Permission**, **Log in** / **Log out** (verb), **Login** / **Logout** (noun), **Mark up** (verb) / **Markup** (noun), **Publish**, **Respond**, **Retrieve** (from Recycle Bin), **Save**, **Update** (refresh), **View**
- **UI terms:** Checkbox (not check box), Dropdown menu (not “dropdown”), Email (noun; use “send”/“receive” as verbs), Field / Field set, **Got it** (confirming in non-permanent components only), Home screen (mobile) / Homepage (web), Icon (not symbol), **Jobsite** (one word), Mobile device (not mobile-device), Smartphone (one word), **in the browser** (not on the browser)
- **Field labels:** Use standard labels from the Field Label Glossary (e.g. Address Line 1/2, Due Date, Assignee, Cost Code). Prefer “[Noun]” for “person who…” (e.g. Receiver, Assignee) over “Received By,” “Assigned To” for translation.

---

## 3. Grammar and Formatting

- **Capitalization:** Title case for headers (short words lowercase unless first/last). **Button labels and primary modal action labels:** always title case, using the same short-word rule as headers. Sentence case for body, tooltips, sub-copy, subheadings (including descriptive modal body copy—not the primary action buttons). Capitalize: page/tab names, Project/Company (not “level”), product titles, tool names (not “tool”), permission levels, user roles only when referring to a specific user. Do not capitalize: features, components, items.
- **Punctuation:** Oxford comma. **User-facing copy:** do not use the **em dash** (—); use a comma, period, colon where grammatically appropriate, or parentheses instead. (The **en dash** in date/time and numeric ranges per approved formats is allowed; it is not an em dash.) **Exception (backward compatibility):** when outputting the terminology flag, use the exact spelling `[TERM NOT IN GLOSSARY: suggest "X" — verify with #terminology-management]` (em dash preserved in that template only; it is agent/review metadata, not product UI). No colon after headers or field names. Colons only after a complete sentence before a list. No exclamation points except pre-approved cases. Ellipses only for truncated text, not placeholders. No quotation marks for page names, buttons, or fields.
- **In-text:** Bold and capitalize a word only when instructing the user to use a specific UI element (e.g. "Select **Save** to save your changes" in step-by-step instructions). In body copy (e.g. confirmation modals, descriptions), do not bold or capitalize common actions like "edit," "view," or "save". Use normal sentence case. Underline links only. No italics in instructional text.
- **Dates/times:** Use approved presets (Short/Medium/Long/Full). AM/PM with space; include minutes when on the hour. Time range in text: “to”; in schedules: en dash, no spaces. Spell out time zones (e.g. Eastern Standard Time).
- **Numbers:** Spell out zero through nine; numerals for 10+. When space is limited, numerals for all.
- **Ampersands:** Only in buttons with two+ actions or when space is very limited; otherwise use “and.”
- **Acronyms:** First use in body: spell out then (acronym). Not needed if in American Heritage Dictionary. Don’t capitalize the spelled-out phrase unless it’s a proper noun.

---

## 4. Global and Inclusive Writing

> Load `references/reference.md` when you need exact date/time presets, translation-space guidance, or abbreviation details.

- **Clear language:** Short, simple sentences; active voice. Plan for ~130–300% character growth in translation; shorter English helps.
- **Avoid:** Buzzwords, slang, unexplained engineering or internal codenames, US-only references, gerunds where avoidable, negatives (“will not”), long sentences. **Approved Procore glossary terms** (Core UI and Master when context matches) are **not** “jargon”—do not replace them with looser plain-English synonyms. See **Avoid internal / engineering names** under `Terminology (Glossary)` for terms that must not appear in user-facing copy.
- **Acronyms/abbreviations:** Spell out at first use with acronym in parentheses. Prefer alternatives for symbols (e.g. “dollars” vs “$”) where it helps.
- **Inclusive language:** Write for all language levels. Use “they/them” as singular where possible. Prefer “Primary” over “Master,” “View all” over “See all,” “Select” over “Click,” “Enter” over “Type.” Avoid idioms, metaphors, and culturally specific references. Avoid wording that implies abilities (e.g. “see,” “click”) when a neutral alternative works.

---

## 5. Accessibility

> Load `references/reference.md` when accessibility wording intersects with exact field labels, date/time formatting, or measurement abbreviations shown to users.

- **Alt text:** Max 125 characters. Describe non-decorative images/icons by purpose, not appearance; keep it short and descriptive. Decorative images/icons must use empty alt (`alt=""`). Never use "image of" or "photo of." No images of text. Critical information must be in plain text on the page, not only in alt text.
- **ARIA labels:** One to two words; don’t repeat the element type (e.g. don’t add "button" to a button). Match the visible label when one exists. The label is the accessible name for screen readers.
- **Visible labels:** Use visible text for labels, buttons, links. Avoid directional language (“above,” “to the left”). Use 2–3 word link text, not raw URLs.
- **IA:** Logical structure, clear tab order, menus left-to-right/top-to-bottom, max ~3 navigation layers, proper heading hierarchy (H1/H2/H3).

---

## 6. Conversation Design (AI / Chat)

- **Personality:** Helpful, relatable, clear; same as product. Always identify as an AI assistant.
- **Goal-focused:** State how you’ll help; move to the goal quickly; no fluff. Be brief; only what’s needed to accomplish the goal.
- **Clear and direct:** One thing at a time; say what the user can and can’t do; explain what happens next without jumping ahead. For new users, use quick replies/buttons, “tap the button below,” “select from the following options,” suggested responses, and clear invalid-answer feedback.
- **Length:** ~140 characters per message; no more than 3 lines wrapping. 1–3 messages before asking for a response. Most important information at the **end** of the message.
- **Scannable:** Value-add first, numbers first, bullets, short sentences. Limit to three user actions; prefer buttons over hyperlinks in text.
- **Avoid:** Open-ended questions unless very simple (e.g. “What is your name?”). Handle: no input, no match, misrecognition, task failure, with specific prompts for each.
- **Closure:** Always have the last word; confirm the conversation is over and nothing more is expected. Follow up if no response (e.g. after 90 seconds). Confirm before major actions. Cap at about five questions before giving the requested outcome.

---

## Content Review Checklist

Use this when reviewing or generating content:

- [ ] Voice is human, helpful, clear; tone matches context. Confirmation modals for destructive actions or when clarifying an unclear outcome; button labels two words max and title case (except canonical **AI-assisted** controls per §1). No bold/caps for common actions in body copy. Error messages apologetic, solutions-oriented, and non-blaming.
      **Fails if:** tone does not match the context table; button label exceeds two words without the AI-assisted exception; button label is not title case; body copy in modals uses bold/caps on common actions; or an error message blames the user or lacks appropriate apology/next step for the context.
- [ ] Terminology matches Procore glossary (actions, UI terms, field labels); AI-assisted actions use **`[Verb] with AI`**
      **Fails if:** any action verb, UI term, or field label contradicts the glossary or uses an unapproved synonym; a colloquial or generic “plain English” verb is used where the Action Glossary or a context-matched Master term prescribes a specific term; or an in-product AI-assisted control does not follow **`[Verb] with AI`** (title case).
- [ ] Capitalization follows Title case (headers) / Sentence case (body); button and primary modal action labels title case; Procore-specific caps (tools, permission levels, etc.) correct
      **Fails if:** heading/body case is inconsistent with the rule set; a button or primary modal action label is not title case; or Procore-specific capitalization is incorrect.
- [ ] Oxford comma; no em dashes in user-facing copy (except the exact prescribed terminology flag); no colon after headers/field names; no exclamation points or quotation marks for UI refs
      **Fails if:** punctuation violates any listed convention (missing Oxford comma where needed, **em dash** (—) in user-facing copy other than the exact prescribed `[TERM NOT IN GLOSSARY: suggest "X" — verify with #terminology-management]` flag, colon after a header/field name, exclamation point, or quotation marks around UI references).
- [ ] Inclusive and global-friendly: active voice, no slang/jargon/idioms; acronyms spelled out at first use; ability-neutral language where applicable; no banned internal/engineering names (Helix, Overflow menu, Tearsheet, MFE)
      **Fails if:** copy includes idioms/slang/unexplained buzzwords, unexplained acronyms at first use, passive/complex phrasing that harms clarity, ability-biased wording where a neutral option exists, or any banned internal/engineering term from `Terminology (Glossary)`.
- [ ] Accessibility: alt text for meaningful images; short ARIA labels; no directional language; visible, descriptive labels and link text
      **Fails if:** meaningful visuals lack alt text, ARIA labels are verbose or include control type, directional language is used, or labels/links are vague or non-descriptive.
- [ ] If conversational: brief, one thing at a time, important info at end; 1–3 messages before response; error handling and clear closure
      **Fails if:** messages are overly long or multi-intent, key information is buried, response cadence exceeds guidance, error states are not handled, or closure is missing.

---

## Additional Resources

- Full glossary tables, field labels, measurement abbreviations, and date/time presets: [references/reference.md](references/reference.md)
- Source standards in this project: `Glossaries.md`, `Grammar Rules.md`, `Writing for AI.md`, `Writing Globally.md`, `Writing Accessibility.md`, `Inclusive Language.md`, `Product Personality.md`
