import styled from 'styled-components';
import { spacing } from '@procore/core-react';

export const StyledToolLandingPageBodyContent = styled.div`
  > * + * {
    margin-top: ${spacing.sm}px;
  }
`;
