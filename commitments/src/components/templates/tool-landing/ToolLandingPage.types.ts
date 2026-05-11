import type {
  ToolLandingPageProps,
  ToolLandingPageTitleProps,
} from '@procore/core-react';

export type { ToolLandingPageProps, ToolLandingPageTitleProps };

export interface ToolLandingPageViewProps {
  /** Page heading shown in the tool title row */
  heading?: string;
  /** Passed to `ToolLandingPage.Title` for the settings (cog) control */
  settingsLink?: ToolLandingPageTitleProps['settingsLink'];
}
