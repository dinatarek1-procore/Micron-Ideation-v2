/**
 * Standalone prototype URLs — must match `app.config.ts` `basePath` company segment
 * (`/companies/$companyId/tools/...`) and mock nav (`DEFAULT_COMPANY.id`).
 */
/** Mock company ID — must be a numeric string to satisfy json-toolinator's `Number(companyId)`. */
export const PROTOTYPE_COMPANY_SEGMENT = '1';

export const PROTOTYPE_TOOL_BASE = `/companies/${PROTOTYPE_COMPANY_SEGMENT}/tools/prototype`;

/** Prototype Kit home (`path: '/'` on the tool). */
export const PROTOTYPE_TOOL_HOME_URL = `${PROTOTYPE_TOOL_BASE}/`;

/** Generic tool landing demo (`path: '/tool-landing'`) — client-side sample grid. */
export const PROTOTYPE_TOOL_TOOL_LANDING_URL = `${PROTOTYPE_TOOL_BASE}/tool-landing`;

/**
 * Item list / new-tool workspace (`path: '/new'`).
 * @deprecated Prefer {@link PROTOTYPE_TOOL_NEW_URL}; kept for existing imports.
 */
export const PROTOTYPE_TOOL_LIST_URL = `${PROTOTYPE_TOOL_BASE}/new`;

/** Same route as {@link PROTOTYPE_TOOL_LIST_URL}. */
export const PROTOTYPE_TOOL_NEW_URL = `${PROTOTYPE_TOOL_BASE}/new`;

/** Recycle Bin for the New tool workspace (`path: '/new/recycle-bin'`). */
export const PROTOTYPE_TOOL_NEW_RECYCLE_BIN_URL = `${PROTOTYPE_TOOL_BASE}/new/recycle-bin`;

/** Recycle Bin on Tool landing (`path: '/tool-landing/recycle-bin'`). */
export const PROTOTYPE_TOOL_TOOL_LANDING_RECYCLE_BIN_URL = `${PROTOTYPE_TOOL_BASE}/tool-landing/recycle-bin`;

/** Hub / “project home” dashboard. */
export const PROTOTYPE_TOOL_HUB_URL = `${PROTOTYPE_TOOL_BASE}/hub`;

/** Generic item detail demo (`path: '/sample-items/1'`) — not Mirage-backed. */
export const PROTOTYPE_TOOL_GENERIC_ITEM_DETAIL_URL = `${PROTOTYPE_TOOL_BASE}/sample-items/1`;

export const PROTOTYPE_TOOL_PERMISSIONS_URL = `${PROTOTYPE_TOOL_BASE}/settings/permissions`;

/** When dev server opens `/`, rewrite so the tool router lands on the prototype home view. */
export function replaceRootPathWithPrototypeHome(): void {
  if (typeof window === 'undefined') return;
  if (window.location.pathname !== '/') return;
  window.history.replaceState(null, '', PROTOTYPE_TOOL_HOME_URL);
}

/** @deprecated Use replaceRootPathWithPrototypeHome */
export function replaceRootPathWithPrototypeList(): void {
  replaceRootPathWithPrototypeHome();
}

/** Compare pathname to nav hrefs regardless of trailing slash. */
export function normalizeUrlPath(path: string): string {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

/**
 * Navigate without a TanStack RouterProvider in the shell.
 * The shell MUST NOT own a RouterProvider — json-toolinator already hosts one using
 * browser history. A second browser-history RouterProvider on the same page fights
 * over window.history popstate and creates an infinite render loop.
 */
export function shellNavigate(to: string): void {
  if (typeof window === 'undefined') return;
  window.history.pushState(null, '', to);
  // Dispatch so the toolinator router and any popstate listeners update.
  window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
}

/**
 * React hook that tracks window.location.pathname without a RouterProvider.
 * Uses popstate + a custom 'shellnavigate' event so in-app navigation also triggers.
 */
export function useShellPathname(): string {
  // Import inside function body so tree-shaking keeps this out of non-browser builds.
  const { useState, useEffect } =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react') as typeof import('react');

  const [pathname, setPathname] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  return pathname;
}
