# Manager Meeting Notes — Jen Haddad + Dina
## Topics: Prototype Tooling + Design Direction for Micron

---

## 1. Prototype Tooling (Cursor + Artifactory)

### The Setup
- Use `@procore/prototype-template` (the kit Nick shared)
- **Key**: Artifactory must be installed properly — that's what gives you the Procore design system components (header, nav, cards, input fields, tables) out of the box
- When installed correctly, you get a landing hub page with pre-existing Procore-styled pages
- Jen's tip: it gave her the header, nav, and table basically for free just from a Figma screenshot + the design system in context

### Workflow Tips from Jen
- **Ask → Plan → Agent** (in that order)
  - Ask Mode = cheapest, use it for brainstorming and questions
  - Plan = review and align before building
  - Agent = only when you're ready to build
- Always specify which folder you're working in — it will default to whatever was last active
- Create a new folder explicitly per project ("create a new folder and work inside it")
- Give it context: support article link + Figma file = much better output
- Figma file to reference: **Commitments UI Modernization**

### Action Item
- Reinstall Artifactory properly (follow the slide deck steps from Nick)
- If stuck, Jen will share her working file as a fallback

---

## 2. Design Direction for Micron — What to Build

### MVP Scope (for regroup next week — happy path only)
> "Happy path, no budget change, no complications. Just one line item, unit quantity, simple change order."

**Do NOT include for now:**
- Markups
- Budget changes
- Pending/draft COs
- Unlike UOMs
- Tax code complications

### What to Focus On

#### A. The Change Order Tagging Experience
When a user creates a CO SOV line, they need to tag it to an original contract line (or mark it as new scope).

Design this flow:
1. User is creating a change order
2. They add a line item
3. They pick which original contract line to associate it with (or "new line")
4. **Smart pre-fill opportunity**: when they pick the original line, pre-fill:
   - Unit of measure (UOM)
   - Tax code
   - Accounting method
5. **Warning**: if UOM doesn't match, show a warning ("your unit of measure doesn't match, are you sure?")
6. **Key complexity to show**: contract has 2 lines with the same budget code → how does user pick which one? Answer: show description as a differentiator

#### B. The Unified SOV View on the Contract
After a CO is approved, the contract SOV should show:

- Original line items as the parent rows
- Approved CO lines nested/grouped beneath their associated original line
- Truly new scope (no association) shown as separate lines

**Decided: Only approved change orders for MVP**
- Not pending, not draft
- "True schedule of values = approved changes only"
- Start there, let customers react, then add other statuses

**Display options discussed:**
| Option | Description | Jen's note |
|--------|-------------|------------|
| Nested table | Expand original line to see CO lines beneath it | Preferred — lives on SOV tab only |
| Cell detail / link | Click a link on the line to open a panel with all detail | Also valid |

For nested table: only show columns that have values — use matrix approach (blank if not applicable). Group columns consistently.

#### C. Prime Contract Side
- Same treatment as commitments SOV
- For approved change orders: same nested/grouped view
- Budget changes: **not for MVP**, but eventually they'll also need the same association treatment (because budget changes tagged to owner invoice need to appear on prime contract)

---

## 3. Becca Coordination

- Becca will own the invoicing portion of this work
- She's been in the Pay world — needs onboarding on contracts + change orders
- **Dina's job**: bring Becca up to speed (can send recordings, don't need to always meet)
- Then: Becca will learn invoicing side from Jen
- Jen is available if either of you have questions
- Check in before the regroup: make sure Becca has the background

---

## 4. What to Prepare for the Regroup (Next Week)

A simple scenario to present:

**Scenario:**
- A contract/PO with 3 SOV lines — 2 of them share the same budget code
- User creates a change order and needs to tag it to one of those lines
- Show: how the user picks the right line when 2 have the same code (use description)
- Show: the contract SOV after the CO is approved — unified view with nesting

**Keep it minimal:**
- No markups
- No budget changes
- No unlike UOMs
- Just unit quantity, simple amounts, happy path
- Make it look Procore (use the prototype kit)

---

## 5. On Invoicing (Future Context)

- Invoicing will eventually need the same tagging experience
- Budget changes that are "add to owner invoice" tagged to a contract → need to appear on prime contract SOV
- That column on prime contract should be **conditional** (only appear if a value exists)
- For now: don't include in MVP design, but keep it in mind for the full solution
