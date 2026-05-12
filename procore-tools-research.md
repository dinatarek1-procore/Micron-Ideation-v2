# Procore Financial Tools Research
## Commitments Tool & Change Orders Tool

---

## 1. Commitments Tool

### What It Does
Tracks and manages all financial commitments on a project — a centralized view of all contracts, purchase orders, and subcontracts with their current values and statuses.

### Document Types
- **Subcontracts** — agreements with subcontractors for scoped work
- **Purchase Orders (POs)** — vendor agreements for materials/equipment
- **Commitment Change Orders (CCOs)** — modifications to existing commitments (1-tier or 2-tier approval workflows)

### Key Workflows
1. **Create a commitment** (subcontract or PO) with a Schedule of Values (SOV) breaking work into billable line items
2. **Invite subcontractors** to build their own SOV
3. **Manage invoices** — vendors submit invoices against the SOV; admins can create invoices on behalf of subs
4. **Retainage** — percentage holdback with sliding scale support
5. **Change management** — create CCOs to modify contract values, with optional approval workflows

### Key Features
- Customizable numbering systems
- Privacy controls (public/private visibility)
- CSV import for SOV line items
- DocuSign® integration for e-signatures
- ERP sync for accounting systems
- Custom fields and configurable fieldsets

### Permission Levels
| Level | Access |
|-------|--------|
| None | No access |
| Read Only | View only |
| Standard | Create and edit commitments |
| Admin | Full management + settings |

### Statuses
Draft → Pending Approval → Approved / Rejected

### Integrates With
- Invoicing Tool
- Change Events Tool
- DocuSign®
- ERP / Accounting systems
- Prime Contracts

---

## 2. Change Orders Tool

### What It Does
Manages cost changes throughout a project — from unapproved scope changes to fully executed change orders. Connects subcontractor-level changes (CCOs) to owner-level changes (PCCOs).

### Document Types
| Type | Description |
|------|-------------|
| **CCO** (Commitment Change Order) | Changes to subcontractor/vendor contracts |
| **PCCO** (Prime Contract Change Order) | Changes to the prime contract with the owner |
| **Client Contract Change Orders** | For specialty contractors managing their own client contracts |
| **Funding Change Orders** | Changes to project funding sources |

### Key Workflows
**With Change Events enabled (recommended):**
1. Create a **Change Event** to document the scope change
2. Send **RFQs** (Requests for Quotation) to affected subs
3. Subs respond with pricing
4. Generate **CCO** from approved pricing
5. Roll up to **PCCO** for owner approval

**Without Change Events:**
- Create CCOs or PCCOs directly

### Key Features
- **Claimable Variations** (new): "Pending - Billable" status lets contractors invoice for unapproved changes (compliance with ANZ, CAN, UKI payment law)
- **Signature Tracking**: DocuSign® status visible inline
- **Bulk CCO creation** from change events
- Tiered approval configuration (1-tier vs 2-tier)

### Permission Levels
| Action | Read Only | Standard | Admin |
|--------|-----------|----------|-------|
| View change orders | ✓ | ✓ | ✓ |
| Create/approve CCOs | | ✓ | ✓ |
| Edit change orders | | | ✓ |
| Configure settings | | | ✓ |

### Integrates With
- Commitments Tool (CCOs)
- Prime Contracts Tool (PCCOs)
- Change Events Tool (workflow source)
- Client Contracts Tool
- Funding Tool
- DocuSign®
- Budget / Cost Codes

---

## How They Work Together

```
Change Event (scope change identified)
    ↓
RFQ sent to subs → Subs price the work
    ↓
CCO created (Commitments Tool) → Sub contract updated
    ↓
PCCO created (Prime Contracts) → Owner billed
    ↓
Budget updated with approved change
```

---

## Training Resources
- Commitments (GC): 28 min course
- Change Management (GC): 58 min course
- PM Financial Management Certification: 3-4 hrs (covers Budget, Change Events, Change Orders, Commitments, Direct Costs, Invoicing, Prime Contracts)
