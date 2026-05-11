/**
 * Build a stable `localStorageKey` for a `@procore/json-formulator` `<Form>`
 * inside a Tearsheet so client-side autosave recovery scopes drafts per-user /
 * per-entity. Use with `<Form localStorageKey={buildFormDraftKey(...)} />`.
 *
 * Example: `buildFormDraftKey('create-item', { companyId })` →
 *          `['prototype-template', 'create-item', { companyId: '42' }]`
 */
export function buildFormDraftKey(
  viewName: string,
  scope: Record<string, string | number | undefined>
): ReadonlyArray<unknown> {
  const normalized: Record<string, string> = {};
  for (const [k, v] of Object.entries(scope)) {
    if (v === undefined) continue;
    normalized[k] = String(v);
  }
  return ['prototype-template', viewName, normalized];
}
