import type { ReactNode } from 'react';

/**
 * @deprecated IX Model template that previously owned the 56px bar + Tool Nav overlay.
 * **Do not** add global navigation UI here. Use the standalone [`UnifiedHeader`](../../navigation/unified-header.tsx)
 * only. This file re-exports a passthrough for compatibility with ported views.
 */
export function GlobalNavigation({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
