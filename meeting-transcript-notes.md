# Micron Escalation — Meeting Notes
## Participants
- **Jeanine Chiu** — PM leading the initiative
- **Matt Riley** — PM / product, demoed the current state
- **Jennifer Haddad** — domain expert, invoicing/commitments edge cases
- **Dina Tarek** — taking over from Billy
- **Rebecca (Becca) Pacewicz** — invoicing team
- **Anna Telesco** — invoicing team

---

## The Core Problem

Micron (owner-customer) is unhappy with Procore's change order architecture. Their complaint:

> "There is no place in Procore today where you can see all SOV line items — original PO SOV + change order SOV — in one place. Except on an invoice. And it seems silly to have to create an invoice just to see it all."

### Why it's broken today
- The **contract/PO SOV** only shows original contract lines
- **Change order lines are invisible** on the contract — amounts roll up but individual lines don't appear
- To see a CO's SOV, you navigate into each individual change order (5+ clicks per CO)
- This is **historical, not intentional** — change orders predate contracts in early Procore; separate SOVs were easier technically at the time

---

## What Micron Wants

1. **Unified SOV view on the contract** — all original lines + all change order lines visible in one place
2. **Grouping by original line item association**, not by budget code:
   - If a CO line amends an original PO SOV line → group/collapse it with that original line
   - If a CO line is truly new scope → show it separately
   - Micron has **multiple lines with the same budget code**, so budget-code grouping is too broad
3. **Hundreds to thousands of CO line items** expected — scale matters
4. **Status question open**: show all COs regardless of status, or only approved? TBD

---

## Existing Mechanism (ERP Line Item Association)

There's already a feature for ERP customers:
- When creating a CO SOV line, you can **associate it to an existing contract line** OR create a new line
- Today this is **ERP-only** (needed because ERPs don't have a change order concept, only contract SOVs)
- **Plan**: open this up to non-ERP customers like Micron (they have a custom ERP integration)
- **Gap**: no bulk association today — you associate one line at a time

---

## Key Open Questions / Complexities

| Topic | Detail |
|-------|--------|
| **Unit quantity / UOM** | POs default to unit quantity. If a CO line and original line have different UOMs, you can't sum quantity — only amounts. Same issue exists on invoicing today (blank quantity shown when unlike UOMs). |
| **Unit cost display** | Can't show a true unit cost when multiple CO lines roll up to one original line (it's an average, not a sum). |
| **Tax codes** | CO lines may have different tax codes than the original — no current enforcement. |
| **Default association behavior** | Current default = blank (user manually picks). Options discussed: default to new line, default to same budget code if only one match, or allow bulk edit/configure. |
| **Bulk association** | Micron will have thousands of lines — one-at-a-time is not viable. Future improvement needed. |
| **Validation on association** | If a CO line is tagged to an original, should we enforce same UOM? Probably yes — surfaces errors earlier. |

---

## Dina's Assignment

**Billy is handing this off to Dina.** Dina + Matt + Becca are the core team moving it forward.

### What Jeanine asked for:
1. **Think conceptually first** — don't get bogged down in edge cases immediately
2. **Draft initial concepts/ideas** for how this could work
3. **Regroup in ~2 weeks** with initial ideas
4. Jen Haddad is available as the edge-case/domain expert
5. Regular Micron touchpoint will be set up — can use it to validate designs directly with the customer

### Scope:
- Solve for **all contracts** (POs + subcontracts), not just POs
- Invoicing impact is real — Anna and Becca involved for that thread
- Longer-term project, no committed timeline with Micron yet (except making the line item association column available)

---

## Other Customers with Similar Feedback
- **Burns & Mac** — similar feedback raised recently
- **iLab participants (3 years ago)** — "this is not my schedule of values, my SOV includes changes"
- ERP-integrated customers — already benefiting from line item association on the backend

---

## Related Artifacts (to be shared in Slack channel)
- Matt's prototype (from AI onsite)
- Jeanine's Claude-generated analysis docs
- PRD: `Micron Escalations Change Events PRD` (Confluence, FF space)
