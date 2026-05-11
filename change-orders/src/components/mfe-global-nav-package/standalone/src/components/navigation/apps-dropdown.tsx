import { useRef } from 'react';
import { ExternalLink, AppAssemble } from '@procore/core-icons';
import { Popover } from '@procore/core-react';
import styled from 'styled-components';
import { PickerCaret } from './PickerCaret';

interface OverlayTriggerRef {
  show: () => void;
  hide: () => void;
}

const THIRD_PARTY_APPS = [
  {
    id: 'docusign',
    name: 'DocuSign',
    description: 'Electronic signatures',
    url: 'https://docusign.com',
  },
  {
    id: 'bluebeam',
    name: 'Bluebeam',
    description: 'PDF markup',
    url: 'https://bluebeam.com',
  },
  {
    id: 'ms-teams',
    name: 'Microsoft Teams',
    description: 'Team communication',
    url: 'https://teams.microsoft.com',
  },
  {
    id: 'power-bi',
    name: 'Power BI',
    description: 'Business analytics',
    url: 'https://powerbi.microsoft.com',
  },
  {
    id: 'sage',
    name: 'Sage Intacct',
    description: 'Accounting & ERP',
    url: 'https://sage.com',
  },
  {
    id: 'viewpoint',
    name: 'Viewpoint',
    description: 'Construction ERP',
    url: 'https://viewpoint.com',
  },
];

const PickerBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  min-height: 40px;
  min-width: 0;
  max-width: 140px;
  padding: 4px 8px;
  text-align: left;
  outline: none;
  background-color: var(--legacy-picker, #2f3437);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: var(--legacy-picker-hover, #464f53);
  }
`;

const PickerLabel = styled.span`
  font-size: 12px;
  font-weight: 300;
  line-height: 1.3;
  letter-spacing: 0.4px;
  color: rgba(255, 255, 255, 0.7);
`;

const PickerValueRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

const PickerValue = styled.span`
  flex: 1;
  min-width: 0;
  max-width: 120px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DropdownPanel = styled.div`
  width: 320px;
  max-height: min(70vh, 480px);
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const DropdownHeader = styled.div`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const DropdownGrid = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const AppCard = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f3f4f6;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  &:hover {
    background: #f9fafb;
  }
`;

const AppIconWrap = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 20px;
    height: 20px;
    color: #9ca3af;
  }
`;

const AppInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const AppNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DropdownFooter = styled.div`
  flex-shrink: 0;
  border-top: 1px solid #e5e7eb;
  background: var(--legacy-menu-footer, #e7e7e7);
  padding: 12px;
`;

export function AppsDropdown() {
  const overlayRef = useRef<OverlayTriggerRef>(null);

  const panelContent = (
    <DropdownPanel>
      <DropdownHeader>
        <p
          style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#111827' }}
        >
          Third-Party Apps
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9ca3af' }}>
          Connected integrations
        </p>
      </DropdownHeader>
      <DropdownGrid>
        {THIRD_PARTY_APPS.map((app) => (
          <AppCard
            key={app.id}
            onClick={() => {
              window.open(app.url, '_blank', 'noopener,noreferrer');
              overlayRef.current?.hide();
            }}
          >
            <AppIconWrap>
              <AppAssemble />
            </AppIconWrap>
            <AppInfo>
              <AppNameRow>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#111827',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {app.name}
                </span>
                <ExternalLink
                  style={{
                    width: 12,
                    height: 12,
                    color: '#9ca3af',
                    flexShrink: 0,
                  }}
                />
              </AppNameRow>
              <span
                style={{
                  fontSize: 12,
                  color: '#9ca3af',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {app.description}
              </span>
            </AppInfo>
          </AppCard>
        ))}
      </DropdownGrid>
      <DropdownFooter>
        <button
          type="button"
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: 14,
            color: '#4b5563',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Browse App Marketplace
        </button>
      </DropdownFooter>
    </DropdownPanel>
  );

  return (
    <Popover
      overlay={
        <Popover.Content placement="bottom-right">
          {panelContent}
        </Popover.Content>
      }
      placement="bottom-right"
      trigger="click"
      overlayRef={overlayRef}
    >
      <PickerBtn type="button" data-legacy-picker>
        <PickerLabel>Apps</PickerLabel>
        <PickerValueRow>
          <PickerValue>Select App</PickerValue>
          <PickerCaret open={false} />
        </PickerValueRow>
      </PickerBtn>
    </Popover>
  );
}
