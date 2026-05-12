import React from 'react';
import { useParams } from '@tanstack/react-router';
import { Typography, colors } from '@procore/core-react';
import { Home } from '@procore/core-icons';
import { GUARDRAILS } from '@/shared/guardrails';

export interface ProtoTab {
  label: string;
  active?: boolean;
  /** Path relative to /items/$itemId — e.g. '' for General, '/schedule-of-values'.
   *  Omit or set null for tabs that have no prototype route (renders non-clickable). */
  path?: string | null;
}

interface ProtoPageHeaderProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  actions?: React.ReactNode;
  tabs: ProtoTab[];
}

export function ProtoPageHeader({ title, subtitle, actions, tabs }: ProtoPageHeaderProps) {
  const { companyId, itemId } = useParams({ strict: false });
  const base = GUARDRAILS.DEMO_ROUTE.BASE_PATH.replace(
    '$companyId',
    String(companyId ?? GUARDRAILS.DEMO_ROUTE.COMPANY_ID)
  );
  const itemBase = itemId ? `${base}/items/${itemId}` : null;
  const homeHref = window.location.hostname === 'localhost' ? 'http://localhost:3002/' : '/';

  return (
    <div style={{ background: '#fff', marginBottom: 24 }}>

      {/* Page title zone */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '16px 24px 8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {/* Home icon */}
          <a
            href={homeHref}
            title="All prototypes"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 4,
              color: colors.gray50,
              flexShrink: 0,
              textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = colors.gray15)}
            onMouseLeave={e => (e.currentTarget.style.color = colors.gray50)}
          >
            <Home size="md" />
          </a>

          <div>
            <div style={{ marginBottom: 4 }}>
              <Typography intent="h1">{title}</Typography>
            </div>
            <Typography intent="body" color="gray50">{subtitle}</Typography>
          </div>
        </div>

        {actions && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingTop: 2 }}>
            {actions}
          </div>
        )}
      </div>

      {/* Tab strip */}
      <div style={{ display: 'flex', paddingLeft: 24, borderBottom: `1px solid ${colors.gray90}` }}>
        {tabs.map((tab) => {
          const href = tab.path != null && itemBase ? `${itemBase}${tab.path}` : null;
          const isClickable = !!href && !tab.active;

          const baseStyle: React.CSSProperties = {
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: tab.active ? 600 : 400,
            color: tab.active ? colors.gray15 : colors.gray50,
            borderBottom: tab.active ? `2px solid ${colors.gray15}` : '2px solid transparent',
            marginBottom: -1,
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            cursor: isClickable ? 'pointer' : 'default',
            display: 'block',
          };

          if (href && !tab.active) {
            return (
              <a
                key={tab.label}
                href={href}
                style={baseStyle}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = colors.gray30;
                  (e.currentTarget as HTMLElement).style.borderBottomColor = colors.gray70;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = colors.gray50;
                  (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent';
                }}
              >
                {tab.label}
              </a>
            );
          }

          return (
            <div key={tab.label} style={baseStyle}>
              {tab.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
