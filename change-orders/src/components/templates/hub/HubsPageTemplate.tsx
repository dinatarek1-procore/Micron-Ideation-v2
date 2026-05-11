/**
 * Hubs Page template — all five hub cards in a responsive 12-column grid.
 * Drop `HubsPageTemplate` into any shell's content area.
 * Self-contained: no cross-file imports beyond @procore/core-react and @procore/core-icons.
 */

import type { CSSProperties, ReactNode } from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Pill,
  Table,
  TextInput,
  Typography,
  colors,
  spacing,
} from '@procore/core-react';
import {
  Building,
  EllipsisVertical,
  ExternalLink,
  Location,
  Plus,
} from '@procore/core-icons';
import styled from 'styled-components';
import { HubDashboardGrid, HubGridCell } from './HubDashboardGrid';

// ─── Layout ──────────────────────────────────────────────────────────────────

const WorkspaceRoot = styled.div<{ $className?: string }>`
  padding: 24px;
  color: ${colors.gray45};
`;

// ─── GenericHubCard ───────────────────────────────────────────────────────────

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  min-height: 0;
  padding: ${spacing.lg}px;
`;

const HeaderActionsCluster = styled(Flex)`
  flex-shrink: 0;
  align-items: center;
`;

const HeaderRow = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.md}px;
  margin-bottom: ${spacing.sm}px;
  flex-shrink: 0;
  min-width: 0;
`;

const TitleCluster = styled(Flex)`
  align-items: center;
  gap: ${spacing.sm}px;
  min-width: 0;
  flex: 1 1 0;
`;

const BodyBox = styled(Box)`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
`;

const SubHeaderWrap = styled.div`
  margin-bottom: ${spacing.sm}px;
`;

const FooterRow = styled.div`
  flex-shrink: 0;
  margin-top: ${spacing.md}px;
  padding-top: ${spacing.sm}px;
  border-top: 1px solid ${colors.gray94};
`;

type GenericHubCardProps = {
  title: string;
  titleAddon?: ReactNode;
  headerActions?: ReactNode;
  subHeader?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

function GenericHubCard({
  title,
  titleAddon,
  headerActions,
  subHeader,
  footer,
  children,
}: GenericHubCardProps) {
  return (
    <StyledCard>
      <HeaderRow>
        <TitleCluster>
          {titleAddon}
          <Typography
            as="h2"
            intent="h3"
            weight="semibold"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
        </TitleCluster>
        {headerActions != null ? (
          <HeaderActionsCluster>{headerActions}</HeaderActionsCluster>
        ) : null}
      </HeaderRow>
      {subHeader != null ? <SubHeaderWrap>{subHeader}</SubHeaderWrap> : null}
      <BodyBox>{children}</BodyBox>
      {footer != null ? <FooterRow>{footer}</FooterRow> : null}
    </StyledCard>
  );
}

// ─── Card styled primitives ───────────────────────────────────────────────────

const Hero = styled.div`
  display: flex;
  gap: ${spacing.md}px;
  align-items: flex-start;
  margin-bottom: ${spacing.md}px;
`;

const HeroIcon = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${colors.gray96};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.gray45};
  svg {
    width: 28px;
    height: 28px;
  }
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: ${spacing.md}px;
`;

const MetaBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LinkRow = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.sm}px;
  padding: 10px 0;
  border-bottom: 1px solid ${colors.gray94};
  color: ${colors.blue50};
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const Toolbar = styled(Flex)`
  align-items: center;
  gap: ${spacing.sm}px;
  flex-wrap: wrap;
`;

const FilterChip = styled.span`
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid ${colors.gray85};
  background: ${colors.white};
  font-size: 12px;
  color: ${colors.gray45};
`;

const TableScrollWrap = styled.div`
  width: 100%;
  min-width: 0;
  overflow-x: auto;
`;

const SquareTableContainer = styled(Table.Container)`
  && {
    border-radius: 0;
  }
`;

const LegendRow = styled(Flex)`
  flex-wrap: wrap;
  gap: ${spacing.md}px;
  align-items: center;
  margin-bottom: ${spacing.md}px;
`;

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${colors.gray45};
`;

const Dot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => p.$color};
`;

const CategoryRow = styled.div`
  margin-bottom: ${spacing.md}px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryHeader = styled(Flex)`
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${spacing.sm}px;
`;

const BarTrack = styled.div`
  display: flex;
  height: 10px;
  border-radius: 4px;
  overflow: hidden;
  background: ${colors.gray94};
`;

const BarSeg = styled.div<{ $flex: number; $bg: string }>`
  flex: ${(p) => p.$flex} 0 0;
  min-width: 0;
  background: ${(p) => p.$bg};
`;

const RichList = styled.ul`
  margin: 8px 0 0;
  padding-left: 1.25rem;
  color: ${colors.gray45};
  line-height: 1.5;
`;

// ─── Shared header action cluster ─────────────────────────────────────────────

function HeaderActionCluster() {
  return (
    <>
      <Button type="button" variant="tertiary">
        View All
      </Button>
      <Button type="button" variant="tertiary" aria-label="Add">
        <Plus />
      </Button>
      <button
        type="button"
        aria-label="More options"
        style={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: 4,
          color: colors.gray45,
          display: 'inline-flex',
        }}
      >
        <EllipsisVertical />
      </button>
    </>
  );
}

// ─── Individual cards ─────────────────────────────────────────────────────────

function ProjectInformationCard() {
  return (
    <GenericHubCard
      title="Project Information"
      headerActions={
        <Flex alignItems="center" gap={`${spacing.sm}px`}>
          <Button type="button" variant="tertiary">
            Notes
          </Button>
          <button
            type="button"
            aria-label="More options"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 4,
              color: colors.gray45,
            }}
          >
            <EllipsisVertical />
          </button>
        </Flex>
      }
    >
      <Hero>
        <HeroIcon>
          <Building aria-hidden />
        </HeroIcon>
        <Box style={{ minWidth: 0 }}>
          <Typography intent="h3" weight="bold" style={{ marginBottom: 4 }}>
            Miller Design
          </Typography>
          <Typography
            intent="body"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: colors.gray45,
            }}
          >
            <Location aria-hidden width={16} height={16} />
            123 Example Ave, Portland, OR
          </Typography>
        </Box>
      </Hero>
      <MetaGrid>
        <MetaBlock>
          <Typography intent="label">Stage</Typography>
          <Typography weight="semibold">Construction</Typography>
        </MetaBlock>
        <MetaBlock>
          <Typography intent="label">Type</Typography>
          <Typography weight="semibold">Commercial</Typography>
        </MetaBlock>
        <MetaBlock>
          <Typography intent="label">Start</Typography>
          <Typography weight="semibold">Jan 2025</Typography>
        </MetaBlock>
      </MetaGrid>
    </GenericHubCard>
  );
}

function ProjectLinksCard() {
  return (
    <GenericHubCard
      title="Project Links"
      headerActions={<HeaderActionCluster />}
    >
      <nav aria-label="Project links">
        <LinkRow href="#">
          <span>Drawing log</span>
          <ExternalLink aria-hidden width={16} height={16} />
        </LinkRow>
        <LinkRow href="#">
          <span>Submittal package (SharePoint)</span>
          <ExternalLink aria-hidden width={16} height={16} />
        </LinkRow>
        <LinkRow href="#">
          <span>Jobsite Wi‑Fi instructions</span>
          <ExternalLink aria-hidden width={16} height={16} />
        </LinkRow>
      </nav>
    </GenericHubCard>
  );
}

const OPEN_ITEMS = [
  {
    id: '1',
    type: 'RFI',
    title: 'Ceiling plenum access — Level 3',
    due: 'Apr 18, 2026',
    status: 'open' as const,
  },
  {
    id: '2',
    type: 'Submittal',
    title: 'Acoustical ceilings — shop drawings',
    due: 'Apr 22, 2026',
    status: 'pending' as const,
  },
  {
    id: '3',
    type: 'Punch',
    title: 'Corridor CE-3A — finish touch-ups',
    due: 'Apr 10, 2026',
    status: 'initiated' as const,
  },
];

function OpenItemsTableCard() {
  return (
    <GenericHubCard
      title="My Open Items"
      headerActions={<HeaderActionCluster />}
      subHeader={
        <Toolbar>
          <TextInput aria-label="Search items" placeholder="Search" />
          <FilterChip>Item Type</FilterChip>
          <FilterChip>Due Date</FilterChip>
        </Toolbar>
      }
      footer={
        <Flex
          justifyContent="flex-end"
          alignItems="center"
          gap={`${spacing.sm}px`}
        >
          <Typography intent="small">1–3 of 22</Typography>
          <Button type="button" variant="tertiary">
            Next
          </Button>
        </Flex>
      }
    >
      <TableScrollWrap>
        <SquareTableContainer>
          <Table>
            <Table.Header>
              <Table.HeaderRow>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Due</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.HeaderRow>
            </Table.Header>
            <Table.Body>
              {OPEN_ITEMS.map((row) => (
                <Table.BodyRow key={row.id}>
                  <Table.BodyCell>
                    <Table.TextCell>{row.type}</Table.TextCell>
                  </Table.BodyCell>
                  <Table.BodyCell>
                    <Table.TextCell>{row.title}</Table.TextCell>
                  </Table.BodyCell>
                  <Table.BodyCell>
                    <Table.TextCell>{row.due}</Table.TextCell>
                  </Table.BodyCell>
                  <Table.BodyCell>
                    <Table.TextCell>
                      {row.status === 'open' ? (
                        <Pill color="blue">{row.status}</Pill>
                      ) : row.status === 'pending' ? (
                        <Pill color="gray">{row.status}</Pill>
                      ) : (
                        <Pill color="cyan">{row.status}</Pill>
                      )}
                    </Table.TextCell>
                  </Table.BodyCell>
                </Table.BodyRow>
              ))}
            </Table.Body>
          </Table>
        </SquareTableContainer>
      </TableScrollWrap>
    </GenericHubCard>
  );
}

function AnalyticsSummaryCard() {
  return (
    <GenericHubCard
      title="All Open Items"
      headerActions={
        <Button type="button" variant="tertiary">
          Refresh
        </Button>
      }
      footer={
        <Flex
          justifyContent="space-between"
          alignItems="center"
          gap={`${spacing.sm}px`}
          style={{ flexWrap: 'wrap' }}
        >
          <Typography intent="small">
            Last updated Apr 15, 2026 · 9:42 AM
          </Typography>
          <Flex gap={`${spacing.sm}px`}>
            <Button type="button" variant="tertiary">
              Previous
            </Button>
            <Button type="button" variant="tertiary">
              Next
            </Button>
          </Flex>
        </Flex>
      }
    >
      <LegendRow>
        <LegendItem>
          <Dot $color={colors.red50} />
          Overdue
        </LegendItem>
        <LegendItem>
          <Dot $color={colors.yellow50} />
          Due &lt; 4 days
        </LegendItem>
        <LegendItem>
          <Dot $color={colors.blue50} />
          Open
        </LegendItem>
        <LegendItem>
          <Dot $color={colors.gray60} />
          Pending
        </LegendItem>
      </LegendRow>
      <CategoryRow>
        <CategoryHeader>
          <Typography weight="semibold">RFIs</Typography>
          <Button type="button" variant="tertiary">
            View all (12)
          </Button>
        </CategoryHeader>
        <BarTrack>
          <BarSeg $flex={3} $bg={colors.red50} />
          <BarSeg $flex={4} $bg={colors.yellow50} />
          <BarSeg $flex={3} $bg={colors.blue50} />
          <BarSeg $flex={2} $bg={colors.gray60} />
        </BarTrack>
      </CategoryRow>
      <CategoryRow>
        <CategoryHeader>
          <Typography weight="semibold">Submittals</Typography>
          <Button type="button" variant="tertiary">
            View all (7)
          </Button>
        </CategoryHeader>
        <BarTrack>
          <BarSeg $flex={2} $bg={colors.red50} />
          <BarSeg $flex={2} $bg={colors.yellow50} />
          <BarSeg $flex={5} $bg={colors.blue50} />
          <BarSeg $flex={3} $bg={colors.gray60} />
        </BarTrack>
      </CategoryRow>
    </GenericHubCard>
  );
}

function SiteSafetyCard() {
  return (
    <GenericHubCard
      title="Site Safety and Information"
      headerActions={
        <Flex alignItems="center" gap={`${spacing.sm}px`}>
          <Pill color="UNSAFE_orange">New</Pill>
          <button
            type="button"
            aria-label="More options"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 4,
              color: colors.gray45,
            }}
          >
            <EllipsisVertical />
          </button>
        </Flex>
      }
    >
      <Typography intent="body" weight="semibold" style={{ marginBottom: 8 }}>
        Weekly stand-down
      </Typography>
      <Typography intent="body" style={{ marginBottom: 8 }}>
        All trade partners must attend the Tuesday 7:00 AM stand-down at the
        south gate. PPE required: hard hat, vest, safety glasses.
      </Typography>
      <Typography intent="label">Reminders</Typography>
      <RichList>
        <li>Fall protection required above 6 ft.</li>
        <li>Report near-misses in Procore Safety Quality.</li>
      </RichList>
    </GenericHubCard>
  );
}

// ─── Exported template ────────────────────────────────────────────────────────

export type HubsPageTemplateProps = {
  /** Passed to the outer wrapper (e.g. `flex: 1` in a column shell). */
  className?: string;
  style?: CSSProperties;
};

/** Full 12-col hub card grid — drop into any shell's content area. */
export function HubsPageTemplate({ className, style }: HubsPageTemplateProps) {
  return (
    <WorkspaceRoot className={className} style={style}>
      <HubDashboardGrid>
        <HubGridCell span={6}>
          <ProjectInformationCard />
        </HubGridCell>
        <HubGridCell span={6}>
          <ProjectLinksCard />
        </HubGridCell>
        <HubGridCell span={4}>
          <SiteSafetyCard />
        </HubGridCell>
        <HubGridCell span={8}>
          <OpenItemsTableCard />
        </HubGridCell>
        <HubGridCell span={12}>
          <AnalyticsSummaryCard />
        </HubGridCell>
      </HubDashboardGrid>
    </WorkspaceRoot>
  );
}
