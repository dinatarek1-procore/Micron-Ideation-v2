import type { ReactNode } from 'react';

/**
 * @deprecated IX Model / Next.js wrapper only. Global chrome (56px bar, Tool Nav) is **not**
 * rendered here — the standalone app supplies [`UnifiedHeader`](../../navigation/unified-header.tsx)
 * and `#mount-point`. This component is a **passthrough** so ported routes can keep the import
 * while a single shell remains the source of truth.
 */
export function GlobalChrome({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
