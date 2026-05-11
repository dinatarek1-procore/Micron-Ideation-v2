import { RiSettings3Line } from 'react-icons/ri';
import { Box } from '@procore/core-react';
import { cn } from '@/lib/utils';

const BRAND = '#ff5200';

/** Demo page header matching zonal reference: breadcrumbs, title + verb, tabs */
export function PageHeaderDemo({
  title,
  breadcrumbs = ['Tool Name', 'Child Page Title', 'Active Child Page Title'],
  tabs = ['Tab 1', 'Tab 2', 'Tab 3'],
}: {
  title: string;
  breadcrumbs?: string[];
  tabs?: string[];
}) {
  return (
    <Box className="px-4 py-3">
      <nav aria-label="Breadcrumb" className="mb-2 text-xs text-neutral-500">
        <ol className="flex flex-wrap items-center gap-1">
          {breadcrumbs.map((crumb, i) => (
            <li key={crumb} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-neutral-300" aria-hidden>
                  /
                </span>
              )}
              <span
                className={cn(
                  i === breadcrumbs.length - 1 && 'font-medium text-neutral-800'
                )}
              >
                {crumb}
              </span>
            </li>
          ))}
        </ol>
      </nav>
      <Box className="flex flex-wrap items-center justify-between gap-3">
        <Box className="flex min-w-0 items-center gap-2">
          <RiSettings3Line
            className="h-5 w-5 shrink-0 text-neutral-400"
            aria-hidden
          />
          <h1 className="truncate text-lg font-semibold text-neutral-900">
            {title}
          </h1>
        </Box>
        <button
          type="button"
          className="shrink-0 rounded-md px-3 py-1.5 text-sm font-medium text-white"
          style={{ backgroundColor: BRAND }}
        >
          Verb
        </button>
      </Box>
      <Box
        role="tablist"
        className="mt-4 flex gap-1 border-b border-neutral-200"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={i === 0}
            className={cn(
              '-mb-px border-b-2 px-3 py-2 text-sm font-medium',
              i === 0
                ? 'border-[#ff5200] text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            )}
          >
            {tab}
          </button>
        ))}
      </Box>
    </Box>
  );
}

/** Demo sticky page action bar — aligns visually with sidepanel PanelActionsZone */
export function PageActionBarDemo() {
  return (
    <Box className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
      >
        Cancel
      </button>
      <button
        type="button"
        className="rounded-md px-4 py-2 text-sm font-medium text-white"
        style={{ backgroundColor: BRAND }}
      >
        Save Changes
      </button>
    </Box>
  );
}
