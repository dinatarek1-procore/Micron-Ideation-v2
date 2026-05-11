# Build Storybook

Iterate on Storybook stories for prototype views. **Uses normal yarn scripts**; the CLI is optional for discovery.

## Run Storybook

From the scaffolded project root (after `yarn install`):

```bash
yarn storybook
```

Default port: **6030** (see `package.json` `scripts.storybook`).

## Production build

CI or static hosting:

```bash
yarn build-storybook
```

Output: `storybook-static/`.

## Where stories live

- `stories/builder/VisualBuilder.stories.tsx` — per-view routes with memory router.
- `stories/composition/Playground.stories.tsx` — composition playground.

## CLI helpers (optional)

```bash
prototype-template guide
prototype-template validate
```

`validate` checks that `storybook` / `dev` scripts exist in `package.json` (among other steps).
