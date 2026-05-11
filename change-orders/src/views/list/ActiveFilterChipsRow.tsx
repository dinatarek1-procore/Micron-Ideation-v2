import { Box, Button, Flex, Pill } from '@procore/core-react';
import { Clear } from '@procore/core-icons';

import type { SmartGridFilterChip } from './smartGridFilterMapping';

export type ActiveFilterChipsRowProps = {
  chips: SmartGridFilterChip[];
  onRemove: (field: SmartGridFilterChip['field']) => void;
};

/**
 * Renders applied toolbar filters as removable pills under the Smart Grid toolbar.
 */
export function ActiveFilterChipsRow({
  chips,
  onRemove,
}: Readonly<ActiveFilterChipsRowProps>) {
  if (chips.length === 0) return null;

  return (
    <Box
      style={{
        padding: '0 24px 8px',
        borderBottom: '1px solid var(--color-border-default, #d0d5dd)',
      }}
    >
      <Flex
        gap="xs"
        alignItems="center"
        wrap="wrap"
        data-testid="active-filter-chips"
      >
        {chips.map((c) => (
          <Flex key={c.field} gap="xxs" alignItems="center">
            <Pill color="gray">{c.label}</Pill>
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              icon={<Clear />}
              aria-label={`Remove filter ${c.label}`}
              onClick={() => onRemove(c.field)}
            />
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
