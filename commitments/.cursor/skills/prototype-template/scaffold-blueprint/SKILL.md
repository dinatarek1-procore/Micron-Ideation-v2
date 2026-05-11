# Scaffold Blueprint

Author a **new** blueprint directory with the same seven JSON files as the bundled examples. The CLI documents the contract; authoring is manual or AI-assisted.

## Contract (7 files)

Use an existing bundle as a template:

```bash
prototype-template blueprints show prototype-tool
```

Each blueprint directory should contain:

- `blueprint.json` — name, version, toolName, basePath, views
- `data.schema.json`, `form.schema.json`, `form.uiSchema.json`, `list.uiSchema.json`, `tabs.json`, `seed.json`

Package-level validation (in CI for this repo) mirrors these rules — consumer projects can copy patterns from `blueprints/` after `pull`.

## Validate a consumer project

After wiring views to a new blueprint:

```bash
prototype-template validate
```

## Pull starter JSON

```bash
prototype-template pull prototype-tool
```

Then duplicate and edit under `blueprints/<your-id>/`.
