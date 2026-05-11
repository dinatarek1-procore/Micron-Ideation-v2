# Load Blueprint

Hydrate or replace blueprint JSON under `blueprints/` from the simulator bundle. **Primary mechanism: `pull` CLI** (no skills required).

## List what is bundled

```bash
prototype-template blueprints list
```

Inspect one id (metadata + required files):

```bash
prototype-template blueprints show prototype-tool
```

## Copy into your project

From the project root (same directory as `package.json`):

```bash
# All bundled blueprints → ./blueprints/<id>/
prototype-template pull
# or explicitly:
prototype-template pull all

# Single blueprint
prototype-template pull prototype-detail
```

Errors print **Available:** ids discovered on disk (no hardcoded list in docs).

## After pulling

- Adjust `src/views/*` and `src/app.config.ts` if you add views or change routes.
- Re-run `prototype-template validate` to see checklist status.
