import React, { useEffect, useState } from 'react';
import { Typography, colors } from '@procore/core-react';
import type { AutosaveStatus } from '@/shared/useDebouncedAutosave';

/**
 * IX-compliant footer indicator for data-entry slide-outs. Replaces Save /
 * Cancel with a "Saving / Saved Ns ago / Couldn't save" status line. Pair
 * with `useDebouncedAutosave` + `<TearsheetShell>` (pass as the `footer`
 * prop) to satisfy REFERENCE.md's "Data Entry → NO Save/Cancel" rule.
 */

export interface TearsheetAutosaveIndicatorProps {
  status: AutosaveStatus;
  lastSavedAt: Date | null;
  error?: Error | null;
  onRetry?: () => void;
}

function formatRelative(when: Date, now: Date): string {
  const diffMs = now.getTime() - when.getTime();
  const diffSec = Math.max(0, Math.round(diffMs / 1000));
  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  return `${diffHr}h ago`;
}

export function TearsheetAutosaveIndicator({
  status,
  lastSavedAt,
  error,
  onRetry,
}: TearsheetAutosaveIndicatorProps) {
  // Tick every 15s so "Saved Ns ago" stays accurate while the tearsheet is open.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'saving') {
    return (
      <Typography intent="small" color="gray45">
        Saving…
      </Typography>
    );
  }

  if (status === 'error') {
    return (
      <Typography intent="small" color="gray45">
        <span style={{ color: colors.red50, marginRight: 8 }}>
          Couldn&apos;t save.
        </span>
        {error?.message}
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            style={{
              marginLeft: 8,
              background: 'transparent',
              border: 'none',
              color: colors.blue40,
              cursor: 'pointer',
              font: 'inherit',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            Retry
          </button>
        ) : null}
      </Typography>
    );
  }

  if (status === 'saved' && lastSavedAt) {
    return (
      <Typography intent="small" color="gray45">
        Saved {formatRelative(lastSavedAt, now)}
      </Typography>
    );
  }

  return (
    <Typography intent="small" color="gray60">
      Changes save automatically.
    </Typography>
  );
}
