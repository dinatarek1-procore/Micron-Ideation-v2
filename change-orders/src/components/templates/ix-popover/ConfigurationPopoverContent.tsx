/**
 * Generic popover body: header, scrollable toggle list, Save/Cancel footer.
 * Supply a `ConfigurationPopoverConfig`; optional callbacks run before the overlay closes.
 */

import {
  Box,
  Button,
  Switch,
  Typography,
  UNSAFE_useOverlayTriggerContext,
  colors,
  spacing,
} from '@procore/core-react';
import { useMemo, useState, type MouseEvent } from 'react';
import styled from 'styled-components';

const SwitchList = styled.div<{ $maxHeight?: number }>`
  margin-top: ${spacing.sm}px;
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding-right: ${spacing.xs}px;
  ${({ $maxHeight }) =>
    $maxHeight != null ? `max-height: ${$maxHeight}px;` : ''}

  & > label {
    border: none !important;
    box-shadow: none !important;
  }
`;

export type ConfigurationToggleItem = {
  /** Stable key for state and React `key` */
  id: string;
  /** Row label */
  label: string;
  /** Initial checked state (default true) */
  defaultChecked?: boolean;
};

export type ConfigurationPopoverConfig = {
  title: string;
  subtitle?: string;
  items: ConfigurationToggleItem[];
  cancelLabel?: string;
  saveLabel?: string;
  /** Optional cap on scroll region height (px); omit to fill space above footer */
  listMaxHeight?: number;
};

export type ConfigurationPopoverContentProps = {
  config: ConfigurationPopoverConfig;
  /** Fired with current toggle map when Save is clicked, before close */
  onSave?: (values: Record<string, boolean>) => void;
  /** Fired when Cancel is clicked, after state reset, before close */
  onCancel?: () => void;
};

function buildDefaultState(
  items: ConfigurationToggleItem[]
): Record<string, boolean> {
  return Object.fromEntries(
    items.map(({ id, defaultChecked }) => [id, defaultChecked !== false])
  );
}

export function ConfigurationPopoverContent({
  config,
  onSave,
  onCancel,
}: ConfigurationPopoverContentProps) {
  const { hide } = UNSAFE_useOverlayTriggerContext();
  const defaults = useMemo(
    () => buildDefaultState(config.items),
    [config.items]
  );
  const [values, setValues] = useState<Record<string, boolean>>(defaults);

  const cancelLabel = config.cancelLabel ?? 'Cancel';
  const saveLabel = config.saveLabel ?? 'Save';
  const listMaxHeight = config.listMaxHeight;

  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    setValues(buildDefaultState(config.items));
    onCancel?.();
    hide(e);
  };

  const handleSave = (e: MouseEvent<HTMLButtonElement>) => {
    onSave?.(values);
    hide(e);
  };

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        width: '100%',
        padding: spacing.md,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          paddingBottom: spacing.sm,
          borderBottom: `1px solid ${colors.gray94}`,
          flexShrink: 0,
        }}
      >
        <Typography as="div" intent="body" weight="bold">
          {config.title}
        </Typography>
        {config.subtitle ? (
          <Typography
            as="div"
            intent="small"
            style={{ color: colors.gray45, marginTop: spacing.xs }}
          >
            {config.subtitle}
          </Typography>
        ) : null}
      </header>

      <SwitchList $maxHeight={listMaxHeight ?? undefined}>
        {config.items.map(({ id, label }) => (
          <Switch
            key={id}
            checked={values[id] ?? false}
            onChange={(e) => {
              const checked = e.target.checked;
              setValues((prev) => ({ ...prev, [id]: checked }));
            }}
          >
            {label}
          </Switch>
        ))}
      </SwitchList>

      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: spacing.xs,
          flexShrink: 0,
          marginTop: spacing.sm,
          paddingTop: spacing.sm,
          borderTop: `1px solid ${colors.gray94}`,
          backgroundColor: colors.white,
        }}
      >
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          onClick={handleCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleSave}
        >
          {saveLabel}
        </Button>
      </footer>
    </Box>
  );
}
