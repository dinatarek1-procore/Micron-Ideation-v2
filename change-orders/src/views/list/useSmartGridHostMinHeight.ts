import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const SHELL_WORKSPACE_ID = 'shell-workspace';
const MIN_HOST_PX = 280;
const VIEWPORT_BOTTOM_PAD = 16;

/**
 * Pixels from the grid host top edge to the bottom of the window. AG Grid's
 * SmartGridServer uses height: 100%; when any ancestor in the shell or Tool
 * layout fails to pass a definite height, percentage height collapses. A
 * viewport-based min-height keeps the row viewport visible anyway.
 */
export function useSmartGridHostMinHeight() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [minHeightPx, setMinHeightPx] = useState<number | undefined>();

  const measure = useCallback(() => {
    const el = hostRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    const next = Math.floor(window.innerHeight - top - VIEWPORT_BOTTOM_PAD);
    setMinHeightPx(Math.max(MIN_HOST_PX, next));
  }, []);

  useLayoutEffect(() => {
    measure();
    const ws = document.getElementById(SHELL_WORKSPACE_ID);
    const ro = new ResizeObserver(() => {
      measure();
    });
    if (ws) {
      ro.observe(ws);
    }
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  return { hostRef, minHeightPx, remeasure: measure };
}
