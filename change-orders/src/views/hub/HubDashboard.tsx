import React from 'react';
import { Box } from '@procore/core-react';

import { HubsPageTemplate } from '@/components/templates/hub/HubsPageTemplate';

export function HubDashboard() {
  return (
    <Box data-testid="pbs-hub-root">
      <HubsPageTemplate />
    </Box>
  );
}
