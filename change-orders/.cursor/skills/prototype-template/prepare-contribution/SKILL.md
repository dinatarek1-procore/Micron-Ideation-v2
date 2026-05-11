# Prepare Contribution

Hand off a prototype or blueprint work to another team with a clear checklist and optional failure report.

## Before opening a PR

1. **Registry / install sanity** (if others must install):

   ```bash
   prototype-template doctor --check
   ```

2. **Demo checklist** (9 steps):

   ```bash
   prototype-template validate
   ```

3. **Tests + builds** (from scaffold root):

   ```bash
   yarn test
   yarn build-storybook
   yarn build
   ```

## Evidence bundle

Generate markdown checklist output:

```bash
prototype-template validate --md
```

Attach `validate-result.md` or paste into the PR. For deeper context, fill in `src/shared/failureReport.ts` / `formatFailureReport`.

## Blueprint payload

List and show what you are contributing:

```bash
prototype-template blueprints list
prototype-template blueprints show <id>
```

Ensure `blueprints/<id>/` is committed or documented if reviewers need to reproduce.
