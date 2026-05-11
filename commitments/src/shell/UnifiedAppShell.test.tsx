/**
 * Shell tests. Scaffold template — runs in consumer project with Jest + RTL.
 */
import React from 'react';
import { Box } from '@procore/core-react';
import { render, screen } from '@testing-library/react';
import { UnifiedAppShell } from './UnifiedAppShell';

describe('UnifiedAppShell', () => {
  it('renders global header chrome', () => {
    render(
      <UnifiedAppShell>
        <Box>content</Box>
      </UnifiedAppShell>
    );
    expect(document.querySelector('[data-header="global"]')).toBeTruthy();
  });

  it('passes children to workspace', () => {
    render(
      <UnifiedAppShell>
        <span>test-child</span>
      </UnifiedAppShell>
    );
    expect(screen.getByText('test-child')).toBeTruthy();
  });
});
