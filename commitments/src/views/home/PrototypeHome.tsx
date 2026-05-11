import React, { type ReactNode } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { Box } from '@procore/core-react';

import { GUARDRAILS } from '@/shared/guardrails';

import {
  ItemDetailThumbnail,
  NewToolThumbnail,
  HubsDashboardThumbnail,
  SettingsPageThumbnail,
  ToolLandingThumbnail,
  RecycleBinThumbnail,
} from './LayoutThumbnail';

function prototypeToolBase(companyId: string | undefined): string {
  const id = String(companyId ?? GUARDRAILS.DEMO_ROUTE.COMPANY_ID);
  return GUARDRAILS.DEMO_ROUTE.BASE_PATH.replace('$companyId', id);
}

interface TemplateCard {
  name: string;
  hint: string;
  href: string;
  thumbnail: ReactNode;
}

function useTemplateCards(): TemplateCard[] {
  const { companyId } = useParams({ strict: false });
  const base = prototypeToolBase(companyId);
  return [
    {
      name: 'Hub Page',
      thumbnail: <HubsDashboardThumbnail />,
      hint: 'Project-level dashboard with multiple data cards in a flexible grid layout.',
      href: `${base}/hub`,
    },
    {
      name: 'Item Detail Record',
      thumbnail: <ItemDetailThumbnail />,
      hint: 'Single-record detail layout with tabs and actions, using sample content.',
      href: `${base}/sample-items/1`,
    },
    {
      name: 'Tool Landing',
      thumbnail: <ToolLandingThumbnail />,
      hint: 'Tool landing with a responsive grid, filters, and sample rows.',
      href: `${base}/tool-landing`,
    },
    {
      name: 'Settings Page',
      thumbnail: <SettingsPageThumbnail />,
      hint: 'Tabbed settings layout with header, card-style sections, and optional sticky save footer.',
      href: `${base}/settings`,
    },
    {
      name: 'Recycle Bin',
      thumbnail: <RecycleBinThumbnail />,
      hint: 'Recycle Bin uses the same columns as New tool and opens sample removed items. Reach it from the New tool or Tool landing tabs.',
      href: `${base}/new/recycle-bin`,
    },
    {
      name: 'New Tool Design',
      thumbnail: <NewToolThumbnail />,
      hint: 'Primary list and workspace for a new tool, including tabs, row actions, and filters.',
      href: `${base}/new`,
    },
  ];
}

const steps = [
  {
    n: '1',
    title: 'Pick a template',
    body: 'Choose the layout below that most closely matches the starting point of the user experience you want to design.',
  },
  {
    n: '2',
    title: 'Open and explore',
    body: 'Click through the live prototype to understand what interactions and components are already built in.',
  },
  {
    n: '3',
    title: 'Describe your changes to Cursor or Claude',
    body: 'Tell your AI agent what you want in plain English. Attach a screenshot or a Figma link for even faster, more accurate results.',
  },
];

function HowItWorks() {
  return (
    <Box
      style={{
        marginBottom: 40,
        padding: 'var(--spacing-xl, 24px)',
        background: 'var(--color-background-primary, #fff)',
        border: '1px solid var(--color-border-default, #d0d5dd)',
        borderRadius: 8,
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-secondary, #667085)',
          marginBottom: 'var(--spacing-md, 12px)',
        }}
      >
        How it works
      </p>
      <Box className="ppt-steps-grid">
        {steps.map((step) => (
          <Box key={step.n}>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md, 12px)',
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#111827',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {step.n}
              </span>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--color-text-primary, #101828)',
                }}
              >
                {step.title}
              </p>
            </Box>
            <p
              style={{
                fontSize: 13,
                color: 'var(--color-text-secondary, #667085)',
                lineHeight: 1.5,
                paddingLeft: 36,
              }}
            >
              {step.body}
            </p>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function Card({ name, hint, href, thumbnail }: Readonly<TemplateCard>) {
  return (
    <Link
      to={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-background-primary, #fff)',
        border: '1px solid var(--color-border-default, #d0d5dd)',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-1-center, 0 1px 4px rgba(0,0,0,.08))',
        textDecoration: 'none',
        transition: 'box-shadow 0.15s ease',
        color: 'inherit',
      }}
    >
      <Box
        style={{
          background: '#f4f5f6',
          borderBottom: '1px solid var(--color-border-default, #d0d5dd)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px 16px',
        }}
      >
        {thumbnail}
      </Box>

      <Box
        style={{
          padding: 'var(--spacing-lg, 16px) var(--spacing-xl, 24px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          flexGrow: 1,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-text-primary, #101828)',
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: 13,
            color: 'var(--color-text-secondary, #667085)',
            lineHeight: 1.5,
          }}
        >
          {hint}
        </span>
        <span
          style={{
            marginTop: 4,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-text-tinted, #f47b20)',
            alignSelf: 'flex-end',
          }}
        >
          Open →
        </span>
      </Box>
    </Link>
  );
}

function Section({
  label,
  cards,
}: Readonly<{ label: string; cards: TemplateCard[] }>) {
  return (
    <section style={{ marginBottom: 'var(--spacing-xxl, 32px)' }}>
      <h2
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-secondary, #667085)',
          marginBottom: 'var(--spacing-md, 12px)',
        }}
      >
        {label}
      </h2>
      <Box className="ppt-card-grid">
        {cards.map((card) => (
          <Card key={card.name + card.href} {...card} />
        ))}
      </Box>
    </section>
  );
}

export function PrototypeHome() {
  const fullPageTemplates = useTemplateCards();

  return (
    <>
      <style>{`
        .ppt-main {
          padding: 48px 40px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .ppt-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-xl, 24px);
        }
        .ppt-card-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-lg, 16px);
        }
        @media (max-width: 1024px) {
          .ppt-card-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 720px) {
          .ppt-main {
            padding: 32px 20px;
          }
          .ppt-steps-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .ppt-card-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .ppt-steps-grid {
            grid-template-columns: 1fr;
          }
          .ppt-card-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <main className="ppt-main" data-testid="pbs-prototype-home">
        <Box style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--color-text-primary, #101828)',
              marginBottom: 'var(--spacing-sm, 8px)',
            }}
          >
            Procore Prototype Kit
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--color-text-secondary, #667085)',
              maxWidth: 560,
              lineHeight: 1.6,
            }}
          >
            Build high-fidelity Procore screens in minutes. Pick a template,
            open it in your browser, then describe what you want to Cursor — no
            code required.
          </p>
        </Box>

        <HowItWorks />

        <Section label="Full-page templates" cards={fullPageTemplates} />
      </main>
    </>
  );
}
