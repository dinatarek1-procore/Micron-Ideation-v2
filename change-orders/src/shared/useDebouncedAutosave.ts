import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Scaffold-level debounced autosave hook for IX data-entry slide-outs.
 *
 * Satisfies REFERENCE.md's "Data Entry → NO Save/Cancel — autosave only" rule
 * for prototype Creates wired directly in the scaffold (outside Toolinator's
 * `FormFeature`). For Toolinator-wired Creates, an equivalent
 * `onChangeDebounced` prop on `FormFeature` is tracked as a Toolinator proposal
 * in `skills/ds-cheat-sheet/TOOLINATOR-EXTENSIONS.md`.
 *
 * Typical wiring with `@procore/json-formulator` `<Form>`:
 *
 *     const autosave = useDebouncedAutosave<FormData>({
 *       onSave: async (data) => { await fetch(...); },
 *     });
 *     ...
 *     <Form onChange={(ev) => autosave.onChange(ev.formData as FormData)} />
 *
 * Then render `autosave.status` / `autosave.lastSavedAt` as an IX-compliant
 * "Saved Ns ago" indicator where a Save button used to live.
 */

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface UseDebouncedAutosaveOptions<T> {
  onSave: (data: T) => Promise<void>;
  /** Milliseconds of inactivity before a save fires. Defaults to 800ms. */
  debounceMs?: number;
}

export interface UseDebouncedAutosaveResult<T> {
  /** Call from the form's `onChange` with the current form data. */
  onChange: (data: T) => void;
  /** Current autosave state, for rendering a "Saved / Saving / Error" indicator. */
  status: AutosaveStatus;
  /** Timestamp of the last successful save, or null. */
  lastSavedAt: Date | null;
  /** The error from the last failed save, or null. */
  error: Error | null;
  /**
   * Force any pending save to run now. Useful before closing the tearsheet so
   * the final in-flight edit is persisted even if the debounce hasn't elapsed.
   */
  flush: () => Promise<void>;
}

export function useDebouncedAutosave<T>({
  onSave,
  debounceMs = 800,
}: UseDebouncedAutosaveOptions<T>): UseDebouncedAutosaveResult<T> {
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDataRef = useRef<T | null>(null);
  const inFlightRef = useRef<Promise<void> | null>(null);

  const [status, setStatus] = useState<AutosaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const runSave = useCallback(async (): Promise<void> => {
    const data = pendingDataRef.current;
    if (data === null) return;
    pendingDataRef.current = null;

    setStatus('saving');
    setError(null);

    const promise = (async () => {
      try {
        await onSaveRef.current(data);
        setStatus('saved');
        setLastSavedAt(new Date());
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        inFlightRef.current = null;
      }
    })();

    inFlightRef.current = promise;
    await promise;
  }, []);

  const onChange = useCallback(
    (data: T) => {
      pendingDataRef.current = data;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        void runSave();
      }, debounceMs);
    },
    [debounceMs, runSave]
  );

  const flush = useCallback(async (): Promise<void> => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (inFlightRef.current) {
      await inFlightRef.current;
    }
    if (pendingDataRef.current !== null) {
      await runSave();
    }
  }, [runSave]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { onChange, status, lastSavedAt, error, flush };
}
