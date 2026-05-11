# Build Full Demo

Post-install sequence for the complete Toolinator prototype demo. **Everything below uses the CLI or standard yarn scripts** — no Cursor skills required.

## Prerequisites

1. **Registry files** — from the project root:

   ```bash
   prototype-template doctor --check
   ```

   If needed: `prototype-template doctor --fix` (writes project `.npmrc` / `.yarnrc.yml` URLs only).

2. **Yarn 4 + Artifactory auth (home config)** — if `yarn install` fails with **YN0082** (“No candidates found”), project URLs are not enough. Use Artifactory **Set Me Up → npm**, then **once per machine** (writes `~/.yarnrc.yml`; replace `YOUR_EMAIL` / `YOUR_REFERENCE_TOKEN`):

   ```bash
   yarn config set -H 'npmRegistries["//artifacts.procoretech.com/artifactory/api/npm/npm"].npmAuthIdent' "$(echo -n 'YOUR_EMAIL:YOUR_REFERENCE_TOKEN' | base64)"
   yarn config set -H 'npmRegistries["//artifacts.procoretech.com/artifactory/api/npm/npm"].npmAlwaysAuth' true
   ```

   Check: `yarn npm info @procore/core-css` (from the project directory).

3. **Install dependencies:** `yarn setup && yarn install` (`yarn setup` is idempotent — normalizes Yarn root and `.npmrc`; re-run after `doctor --fix`).

## Steps

1. **Checklist** — run the 9-step validation (file wiring, scripts, placeholders, optional `blueprints/`):

   ```bash
   prototype-template validate
   ```

   Optional machine-readable output: `prototype-template validate --json` or `--md`.

2. **Fix failures** — the CLI prints which step failed and why (e.g. missing `node_modules/@procore/json-toolinator`, placeholder tokens).

3. **Full app** — MFE-style shell + routing:

   ```bash
   yarn dev
   ```

   Open `http://localhost:3000`.

4. **Isolated views** — Storybook per view:

   ```bash
   yarn storybook
   ```

   Open `http://localhost:6030`.

## If something fails

```bash
prototype-template validate --md
```

Use `src/shared/failureReport.ts` in the scaffold to capture a structured report for bugs or PRs.

## Discovery (CLI)

- `prototype-template guide` — numbered getting-started steps.
- `prototype-template blueprints list` — bundled blueprint ids.
- `prototype-template --help` — all subcommands.
