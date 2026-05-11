/** Normalizes list/detail GET bodies that wrap the row in `{ data: ... }`. */
export function unwrapData<T = unknown>(body: unknown): T | undefined {
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as { data: T }).data;
  }
  return body as T | undefined;
}

export function itemBreadcrumbTitle(ctx: {
  queries?: { item?: { data?: unknown } };
}): string {
  const row = unwrapData<{ summary?: string }>(ctx.queries?.item?.data);
  return row?.summary ? String(row.summary) : 'Item';
}

/** Use with `queries: (ctx) => ({ item: createItemQueryOptions(ctx) })` so `queryKey` is a real array for TanStack Query. */
export function createItemQueryOptions(ctx: {
  params: { companyId?: string; itemId?: string };
}) {
  return {
    queryKey: ['item', ctx.params.companyId, ctx.params.itemId] as const,
    queryFn: async ({
      queryKey,
    }: {
      queryKey: readonly ['item', string | undefined, string | undefined];
    }) => {
      const [, companyId, itemId] = queryKey;
      if (!companyId || !itemId) throw new Error('Missing route params');
      const res = await fetch(
        `/rest/v1.0/companies/${companyId}/items/${encodeURIComponent(itemId)}`
      );
      if (!res.ok) throw new Error('Failed to load item');
      return res.json();
    },
  };
}

/** Use with `queries: (ctx) => ({ items: createItemsRowsQueryOptions(ctx) })` for list-style views. */
export function createItemsRowsQueryOptions(ctx: {
  params: { companyId?: string };
}) {
  return {
    queryKey: ['items', ctx.params.companyId] as const,
    queryFn: async ({
      queryKey,
    }: {
      queryKey: readonly ['items', string | undefined];
    }) => {
      const [, companyId] = queryKey;
      if (!companyId) throw new Error('Missing companyId');
      const qs = new URLSearchParams({ page: '1', per_page: '100' });
      const res = await fetch(
        `/rest/v1.0/companies/${companyId}/items?${qs.toString()}`
      );
      if (!res.ok) throw new Error('List failed');
      return res.json();
    },
  };
}
