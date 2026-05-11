# Designer Workflow

AI-assisted iteration on prototypes. **Core workflow does not require installing these skill files** — use the CLI and yarn scripts first.

## CLI-first quick path

1. `prototype-template guide` — numbered steps (create → Artifactory → install → dev/storybook → validate).
2. `prototype-template blueprints list` — see bundled blueprint ids.
3. In the project: `yarn setup` (idempotent registry/Yarn root fix — safe to re-run), then `yarn install`.
4. `yarn dev` (full shell, :3000) or `yarn storybook` (isolated views, :6030).
5. Edit JSON under `blueprints/` and view configs under `src/views/`.
6. `prototype-template validate` before handoff.

## Optional: install Cursor skills

Skills are **additive** — they repeat the same flows with extra AI context:

```bash
prototype-template skills --install
```

Installed to `.cursor/skills/blueprint-simulator/` (when run from project root).

### Bundled skills (folder names under `blueprint-simulator/`)

| Skill                            | Use when                                                                                                                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build-full-demo`                | Full demo / integration-style build flows                                                                                                                              |
| `build-storybook`                | Storybook build and checks                                                                                                                                             |
| `load-blueprint`                 | Pulling or loading blueprint JSON into a project                                                                                                                       |
| `prepare-contribution`           | Preparing changes back to upstream repos                                                                                                                               |
| `scaffold-blueprint`             | Authoring a new blueprint directory (seven JSON files)                                                                                                                 |
| **`json-toolinator-extensions`** | Extending `@procore/json-toolinator` tools: views, layouts, features, **JSON Formulator** (forms), **JSON Tabulator** (common tables), **Smart Grid** (complex tables) |

## Architecture details

```bash
prototype-template guide --verbose
```

Appends the bundled Architecture Reference (dual surfaces: Storybook vs dev server, mock server, view registration).
