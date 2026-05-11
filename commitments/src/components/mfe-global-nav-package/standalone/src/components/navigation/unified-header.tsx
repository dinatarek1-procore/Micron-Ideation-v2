import { useState, useEffect } from 'react';
import {
  PROTOTYPE_TOOL_HOME_URL,
  shellNavigate,
} from '../../lib/prototypeToolPaths';
import {
  Home,
  Help,
  Comments,
  Person,
  Bell,
  FileListBulleted,
  PencilSignature,
  Comment,
  Phone,
  Megaphone,
  ArrowRight,
  Star,
  BookInfo,
} from '@procore/core-icons';
import { Box, Popover, Tooltip, Avatar } from '@procore/core-react';
import styled from 'styled-components';
import {
  useNavigation,
  DEFAULT_PROCORE_LOGO,
} from '../../lib/navigation-context';
import { ProcoreLogo } from '../ProcoreLogo/ProcoreLogo';
import { ProjectSelector } from './project-selector';
import { CompanyToolsDropdown } from './company-tools-dropdown';
import { FavoriteToolsDropdown } from './favorite-tools-dropdown';
import { AppsDropdown } from './apps-dropdown';
import { GlobalSearchBar } from './global-search-bar';
import { NotificationSlideout } from './notification-slideout';
import { CompanyEditSlideout } from './company-edit-slideout';
import { ProfilePopover, type ProfileData } from './profile-popover';

interface UnifiedHeaderProps {
  globalSearchOpen?: boolean;
  onGlobalSearchOpenChange?: (open: boolean) => void;
}

const HeaderRoot = styled.header`
  position: relative;
  z-index: 30;
  display: flex;
  align-items: center;
  height: 52px;
  min-height: 52px;
  width: 100%;
  min-width: 0;
  flex-shrink: 0;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  background-color: var(--legacy-header, #000000);
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const HomeTile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 52px;
  flex-shrink: 0;
  background: var(--color-brand-500, #ff5200);
`;

const HomeBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 0;
  color: #ffffff;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
  }
`;

const LogoBtn = styled.button`
  position: relative;
  display: none;
  align-items: center;
  justify-content: center;
  height: 52px;
  min-width: 106px;
  max-width: 120px;
  flex-shrink: 0;
  overflow: visible;
  border: none;
  border-radius: 0;
  background: transparent;
  padding: 0 8px;
  cursor: pointer;
  .procore-wordmark {
    height: 29px;
    width: 106px;
    flex-shrink: 0;
  }
  @media (min-width: 768px) {
    display: flex;
  }
`;

const LogoOverlay = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.15s;
  pointer-events: none;
  ${LogoBtn}:hover & {
    opacity: 1;
  }
  svg {
    width: 16px;
    height: 16px;
    color: #ffffff;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.15);
`;

const Spacer = styled.div`
  flex: 1;
  min-width: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
  }
  &:hover {
    color: #ffffff;
    background: var(--legacy-picker-hover, #464f53);
  }
`;

const NotifBtn = styled(IconBtn)<{ $active: boolean }>`
  position: relative;
  color: ${({ $active }) =>
    $active ? 'var(--color-brand-500, #ff5200)' : 'rgba(255,255,255,0.75)'};
  &:hover {
    color: ${({ $active }) =>
      $active ? 'var(--color-brand-500, #ff5200)' : '#ffffff'};
  }
`;

const NotifBadge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--color-brand-500, #ff5200);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
  pointer-events: none;
`;

const ProfileTile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 52px;
  flex-shrink: 0;
`;

const ProfileBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: none;
  background: transparent;
  border-radius: 50%;
  padding: 0;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  &:hover {
    color: #ffffff;
  }
`;

const HelpDropdownPanel = styled.div`
  width: 260px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  padding: 6px;
`;

const HelpItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  text-align: left;
  cursor: pointer;
  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: #6b7280;
  }
  &:hover {
    background: #f8fafc;
  }
`;

const SecondaryIconsWrap = styled.div`
  display: none;
  align-items: center;
  gap: 4px;
  @media (min-width: 480px) {
    display: flex;
  }
`;

const MdHiddenDivider = styled(Divider)`
  display: none;
  @media (min-width: 768px) {
    display: block;
  }
`;

const MdHiddenAppsWrap = styled.div`
  display: none;
  padding: 0 8px;
  @media (min-width: 768px) {
    display: block;
  }
`;

const LgHiddenSearchWrap = styled.div`
  display: none;
  padding: 0 8px;
  @media (min-width: 1024px) {
    display: block;
  }
`;

const HELP_ITEMS = [
  { icon: Comment, label: 'Live Chat' },
  { icon: Person, label: 'Support Center' },
  { icon: Comments, label: 'Procore Community' },
  { icon: Phone, label: 'Contact Support' },
  { icon: Megaphone, label: 'Live Webinars' },
  { icon: ArrowRight, label: 'Quick How-To Training Videos' },
  { icon: BookInfo, label: 'Post an Idea' },
  { icon: Star, label: 'Procore Certification' },
];

export function UnifiedHeader({
  globalSearchOpen,
  onGlobalSearchOpenChange,
}: UnifiedHeaderProps) {
  const { mode, currentCompany, setCurrentProject } = useNavigation();

  const [notifOpen, setNotifOpen] = useState(false);
  const [companyEditOpen, setCompanyEditOpen] = useState(false);
  const [slideoutPortalReady, setSlideoutPortalReady] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Peter Certullano',
    email: 'peter.certullano@procore.com',
    role: 'Project Manager',
    image: undefined,
  });

  useEffect(() => {
    setSlideoutPortalReady(true);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('ngx_user_profile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as typeof profileData;
        setProfileData((prev) => ({ ...prev, ...parsed }));
      } catch {}
    }
  }, []);

  const handleProfileSave = (data: ProfileData) => {
    setProfileData(data);
    localStorage.setItem('ngx_user_profile', JSON.stringify(data));
  };

  const initials = profileData.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleHomeClick = () => {
    setCurrentProject(null);
    shellNavigate(PROTOTYPE_TOOL_HOME_URL);
  };

  const companyLogo = currentCompany.logo;
  const showProcoreWordmark =
    !companyLogo ||
    companyLogo === DEFAULT_PROCORE_LOGO ||
    companyLogo === '/procore-logo-thumbnail.png';

  const helpPanelContent = (
    <HelpDropdownPanel>
      {HELP_ITEMS.map(({ icon: Icon, label }) => (
        <HelpItem key={label} type="button">
          <Icon aria-hidden />
          <span style={{ lineHeight: 1.4 }}>{label}</span>
        </HelpItem>
      ))}
    </HelpDropdownPanel>
  );

  return (
    <HeaderRoot data-header="global">
      {/* Left Section */}
      <HeaderSection>
        <HomeTile>
          <Tooltip
            overlay={
              <Tooltip.Content placement="bottom">Company Home</Tooltip.Content>
            }
            placement="bottom"
          >
            <HomeBtn
              type="button"
              onClick={handleHomeClick}
              data-home-context={mode === 'company' ? 'company' : 'project'}
              aria-label="Company Home"
            >
              <Home aria-hidden />
            </HomeBtn>
          </Tooltip>
        </HomeTile>

        <Tooltip
          overlay={
            <Tooltip.Content placement="bottom">
              Edit company branding
            </Tooltip.Content>
          }
          placement="bottom"
        >
          <LogoBtn
            type="button"
            onClick={() => setCompanyEditOpen(true)}
            aria-label="Edit company branding"
          >
            {showProcoreWordmark ? (
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.15s',
                  height: 29,
                  width: 106,
                }}
              >
                <ProcoreLogo color="#ffffff" className="procore-wordmark" />
              </Box>
            ) : (
              <img
                src={companyLogo}
                alt=""
                width={110}
                height={56}
                style={{
                  height: '100%',
                  maxHeight: 40,
                  width: '100%',
                  objectFit: 'contain',
                  transition: 'opacity 0.15s',
                }}
              />
            )}
            <LogoOverlay aria-hidden>
              <PencilSignature />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#ffffff',
                }}
              >
                Edit
              </span>
            </LogoOverlay>
          </LogoBtn>
        </Tooltip>

        <Divider />

        <Box style={{ padding: '0 8px', flexShrink: 0 }}>
          <ProjectSelector />
        </Box>

        <Divider />

        <Box style={{ padding: '0 8px', flexShrink: 0 }}>
          <CompanyToolsDropdown />
        </Box>

        <Divider />

        <Box style={{ padding: '0 8px', flexShrink: 0 }}>
          <FavoriteToolsDropdown />
        </Box>
      </HeaderSection>

      <Spacer />

      {/* Right Section */}
      <RightSection>
        {mode === 'project' && (
          <LgHiddenSearchWrap>
            <GlobalSearchBar
              open={globalSearchOpen}
              onOpenChange={onGlobalSearchOpenChange}
            />
          </LgHiddenSearchWrap>
        )}

        <MdHiddenAppsWrap>
          <AppsDropdown />
        </MdHiddenAppsWrap>

        <MdHiddenDivider />

        <SecondaryIconsWrap>
          <Popover
            overlay={
              <Popover.Content placement="bottom-right">
                {helpPanelContent}
              </Popover.Content>
            }
            placement="bottom-right"
            trigger="click"
          >
            <IconBtn
              type="button"
              className="header-icon-btn"
              aria-label="Help"
            >
              <Help aria-hidden />
            </IconBtn>
          </Popover>

          <Tooltip
            overlay={
              <Tooltip.Content placement="bottom">
                My Open Items
              </Tooltip.Content>
            }
            placement="bottom"
          >
            <IconBtn
              type="button"
              className="header-icon-btn"
              aria-label="My Open Items"
            >
              <FileListBulleted aria-hidden />
            </IconBtn>
          </Tooltip>
        </SecondaryIconsWrap>

        <Tooltip
          overlay={
            <Tooltip.Content placement="bottom">Notifications</Tooltip.Content>
          }
          placement="bottom"
        >
          <NotifBtn
            type="button"
            className={`header-icon-btn${notifOpen ? ' header-icon-btn--active' : ''}`}
            $active={notifOpen}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((o) => !o)}
          >
            <Bell aria-hidden />
            <NotifBadge aria-hidden />
          </NotifBtn>
        </Tooltip>

        <ProfileTile>
          <ProfilePopover
            trigger={
              <ProfileBtn type="button" aria-label="Account menu">
                <Avatar size="md" aria-label={profileData.name || 'User'}>
                  {profileData.image ? (
                    <Avatar.Portrait imageUrl={profileData.image} />
                  ) : (
                    <Avatar.Label>{initials}</Avatar.Label>
                  )}
                </Avatar>
              </ProfileBtn>
            }
            initialData={profileData}
            onSave={handleProfileSave}
          />
        </ProfileTile>
      </RightSection>

      {slideoutPortalReady && (
        <>
          <NotificationSlideout
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
          />
          <CompanyEditSlideout
            open={companyEditOpen}
            onClose={() => setCompanyEditOpen(false)}
            currentCompanyId={currentCompany.id}
          />
        </>
      )}
    </HeaderRoot>
  );
}
