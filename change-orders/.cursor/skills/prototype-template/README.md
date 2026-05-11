# Bundled skills

This folder is copied into every scaffolded prototype as `skills/` (see `yarn build:template` / `prepack` in `@procore/prototype-template`).

Each subdirectory is a **Cursor Agent skill** (or skill-shaped bundle): start from `SKILL.md`. **`procore-content-design/`** is the full vendored bundle (companion files under `reference/`). The canonical upstream is the Procore AI Coding Gallery; refresh from there when the gallery skill is updated.

To install or refresh from the gallery with the AI Coding CLI:

```bash
ai-coding add procore/ai-coding --skill "procore-content-design"
```

List bundled skill ids from the package CLI:

```bash
npx @procore/prototype-template --skills
```
