import React from 'react';
import { Banner, Box, Typography } from '@procore/core-react';
import type { CommonProps } from '@procore/json-toolinator';

export type PromoCalloutVariant = 'default' | 'warning' | 'success';

const variantToBanner = {
  default: 'info' as const,
  warning: 'attention' as const,
  success: 'success' as const,
};

export type PromoCalloutProps = {
  title: string;
  body?: string;
  variant?: PromoCalloutVariant;
};

export function PromoCallout({
  title,
  body,
  variant = 'default',
}: Readonly<PromoCalloutProps>) {
  return (
    <Banner variant={variantToBanner[variant]}>
      <Banner.Content>
        <Banner.Title>{title}</Banner.Title>
        {body ? (
          <Box paddingTop="xs">
            <Typography intent="body">{body}</Typography>
          </Box>
        ) : null}
      </Banner.Content>
    </Banner>
  );
}

export function PromoCalloutToolFeature(props: Readonly<CommonProps>) {
  return (
    <PromoCallout
      title="Promotions"
      body={`Mounted as a Toolinator feature on "${props.viewName}". Vet this in isolated stories first.`}
      variant="success"
    />
  );
}

export function NotesPanelToolFeature(props: Readonly<CommonProps>) {
  return (
    <PromoCallout
      title="Notes"
      body={`Secondary custom feature mounted on "${props.viewName}".`}
      variant="warning"
    />
  );
}
