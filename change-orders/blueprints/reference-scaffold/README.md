# Reference scaffold blueprint

This package is a **JSON extract** of the default blueprint-simulator tool:

- List + detail + create + edit + permissions + item extension tabs
- Same field model as [`src/views/list/list.schema.ts`](../../src/views/list/list.schema.ts) and [`src/shared/itemFormSchema.ts`](../../src/shared/itemFormSchema.ts)
- Seed rows aligned with [`src/mockServer/itemsStore.ts`](../../src/mockServer/itemsStore.ts)

## Notes

- **`list.uiSchema.json`**: `cell: "@TitleCellRenderer"` is a **codegen token**. Runtime TypeScript uses `TitleCellRenderer` from `titleCell.tsx`. Storybook Composition Playground strips unknown string cells and falls back to default rendering.
- **Tabs**: Production code uses `i18n.t(titleKey)`; this blueprint keeps both `title` (for demos) and `titleKey` (for `en.json` / codegen).
- **Not included**: Full `createView` wiring, Mirage route handlers, and OpenAPI — those remain in `src/` until you run the `load-blueprint` skill or hand-port.

See [`../README.md`](../README.md) and [`../../docs/BLUEPRINT_MAPPING.md`](../../docs/BLUEPRINT_MAPPING.md).
