# Master Glossary Context Map (Runtime)

Runtime-safe terminology map derived from the Procore Master Glossary CSV.

- Scope: English source terms + context metadata only
- Purpose: prevent context drift and conflicting double-use in UI copy
- Upstream authority: `___ GL001_Procore Master Glossary - Last updated March 31st, 2026 .xlsx - 1. Procore Master Glossary - Please do not edit.csv`
- Runtime rule: use this file only for context-bound terminology decisions; default to core UI glossary for generic UI copy

## How to Use

1. Resolve term with core glossary first (`../SKILL.md` + `reference.md`).
2. Check this file only if the requested term appears tool/domain-specific.
3. Apply master term only when context is an explicit match.
4. If context is ambiguous, ask user.
5. If context mismatches, use the standard flag:
   `[CONTEXT MISMATCH: term "X" belongs to "Y" context; using core term "Z" unless you confirm override]`

## Context-Mapped Terms (Starter Set)

| Canonical term (English)          | Part of speech | Context domain/tool/functionality      | Allowed usage note                                   | Disallowed contexts                                                | Preferred short form |
| --------------------------------- | -------------- | -------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------ | -------------------- |
| Change Management                 | Noun           | Procore tool                           | Use when naming the tool/module                      | Generic "change process" copy outside tool naming                  | None                 |
| change order                      | Noun           | Financial Management                   | Use for contract modification records                | Generic "change" requests in non-financial UI contexts             | CO                   |
| Change Order Association          | Noun           | Financial Management                   | Use for linking change orders                        | Generic relation wording outside Change Orders workflows           | None                 |
| Change Order Package              | Noun           | Financial Management                   | Use for packaged change orders                       | Generic package/bundle labels outside this feature                 | COP                  |
| Change Order Request              | Noun           | Financial Management                   | Use for formal grouped request term                  | Generic "request changes" phrasing outside financial context       | COR                  |
| Change Orders by Line Item        | Noun           | Financial Management                   | Use for specific billing/markup feature label        | Generic line-item wording outside this feature                     | COBLI                |
| change request                    | Noun           | Correspondence tool communication type | Use when referencing this communication type         | Replace generic user "request a change" language                   | None                 |
| checkbox                          | Noun           | Generic UI term                        | Use as canonical UI control term                     | "check box" spacing variant                                        | None                 |
| checklist                         | Noun           | Generic UI/content term                | Use for lists of items to verify                     | Substitute for unrelated approval workflow terms                   | None                 |
| checkmark                         | Noun           | Generic UI/content term                | Use for mark indicating selected/completed           | Replace "status" or "approval" terms                               | None                 |
| client contract                   | Noun           | Financial Management                   | Use when referencing contract type                   | Generic client agreement language in non-tool context              | None                 |
| Client Contract Change Order      | Noun           | Financial Management                   | Use for change order affecting client contract       | Generic change order references when contract type is unknown      | CCCO                 |
| Client Contracts                  | Noun           | Procore tool                           | Use for tool name                                    | Generic "contracts" wording when tool name is not intended         | None                 |
| client ID                         | Noun           | Auth/integration context               | Use for credential identifier                        | Generic user/customer identifiers in UI labels                     | None                 |
| client secret                     | Noun           | Auth/integration context               | Use for credential secret field                      | Generic security copy outside integration setup                    | None                 |
| commitment                        | Noun           | Financial Management                   | Use for purchase order/subcontract contract term     | Generic commitment language (e.g. promises)                        | None                 |
| Commitment Change Order           | Noun           | Financial Management                   | Use for commitment change order entity               | Generic change order use where object type is not commitment       | CCO                  |
| commitment change order request   | Noun           | Financial Management                   | Use for request object linked to commitment          | Generic "request" labels in other tools                            | CCOR                 |
| Commitment Potential Change Order | Noun           | Financial Management                   | Use for potential commitment change order entity     | Generic potential-change wording outside this entity               | CPCO                 |
| Commitment Schedule of Values     | Noun           | Financial Management                   | Use for SOV term in commitment workflows             | Generic cost breakdown language outside this entity                | Commitment SOV       |
| Commitments                       | Noun           | Procore tool                           | Use when naming the tool/module                      | Generic commitments wording not referring to tool                  | None                 |
| Connected App                     | Noun           | Integrations/platform                  | Use for third-party app connected to Procore account | Generic app connection wording unrelated to Procore connected apps | None                 |
| Connection Manager                | Noun           | Project-level tool                     | Use when naming this specific tool                   | Generic connection settings copy                                   | None                 |

## Maintenance and Refresh Procedure

1. Use the latest approved Master Glossary CSV as source of truth.
2. Update or add entries when new context-bound terms are introduced.
3. Keep this file runtime-focused: English term + context + usage guardrails only.
4. Do not add locale translation columns to this file.
5. Preserve canonical term casing exactly as in source.
