import {
  Outlet,
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { UnifiedHeader } from '../components/mfe-global-nav-package/standalone/src/components/navigation/unified-header';

/**
 * Browser-history router for the global nav chrome only, beside json-toolinator's
 * RouterProvider (no nesting). Hash history was skipped: the tool resolves routes from
 * `window.location.pathname` (`document.baseURI`), so header `navigate()` must update pathname.
 */
function ShellHeaderLayout() {
  return (
    <>
      <UnifiedHeader />
      <Outlet />
    </>
  );
}

const shellHeaderRootRoute = createRootRoute({
  component: ShellHeaderLayout,
});

const shellHeaderCatchRoute = createRoute({
  getParentRoute: () => shellHeaderRootRoute,
  path: '$',
  component: () => null,
});

const shellHeaderRouteTree = shellHeaderRootRoute.addChildren([
  shellHeaderCatchRoute,
]);

export const shellHeaderRouter = createRouter({
  routeTree: shellHeaderRouteTree,
  history: createBrowserHistory(),
  defaultPreloadStaleTime: 0,
});
