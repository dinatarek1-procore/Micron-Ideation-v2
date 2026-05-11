import { useEffect, useState, type ReactNode } from 'react';
import {
  Clear,
  EllipsisVertical,
  Plus,
  Clock,
  Megaphone,
  PaperAirplane,
  ChevronDown,
} from '@procore/core-icons';
import { Box } from '@procore/core-react';
import styled from 'styled-components';
import { ProcoreAIIcon } from './ProcoreAIIcon';

const BRAND = '#ff5200';
const DEFAULT_DOCK_Z = 10;

const SUGGESTED = [
  'How do I create a Submittal package?',
  'How can I change or reset a password?',
  'How do I publish an RFI in the Drawings tool?',
];

const DockContainer = styled.div`
  position: sticky;
  top: 0;
  order: 2;
  display: none;
  flex-shrink: 0;
  min-height: 0;
  align-self: stretch;
  transform: translateX(-1px);
  background: #ffffff;
  @media (min-width: 1024px) {
    display: flex;
  }
`;

const PanelSlide = styled.div<{ $open: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border-left: 1px solid #e5e7eb;
  background: #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.06);
  transition:
    width 0.2s ease-out,
    opacity 0.2s ease-out;
  width: ${({ $open }) => ($open ? 'min(420px, calc(100vw - 3.5rem))' : '0')};
  max-width: 420px;
  flex-shrink: 0;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  ${({ $open }) => !$open && 'border: 0; padding: 0;'}
`;

const DockNav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 56px;
  flex-shrink: 0;
  height: 100%;
  border-left: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 12px 0;
`;

const RailButton = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 8px 4px;
  border: none;
  border-radius: 0;
  background: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#111827' : '#6b7280')};
  font: inherit;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.3;
  cursor: pointer;
  text-align: center;
`;

const ActiveBar = styled.span`
  position: absolute;
  left: 0;
  top: 50%;
  width: 2px;
  height: 32px;
  border-radius: 0 2px 2px 0;
  transform: translateY(-50%);
  background-color: ${BRAND};
`;

const PanelHeader = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid #e5e7eb;
  padding: 10px 12px;
`;

const PanelHeaderLeft = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
`;

const PanelHeaderRight = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 2px;
`;

const IconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 4px;
  padding: 6px;
  color: #6b7280;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
  svg {
    width: 20px;
    height: 20px;
  }
`;

const PanelToolbar = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
  padding: 8px;
`;

const ToolbarBtn = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  border: ${({ $primary }) =>
    $primary ? '1px solid transparent' : '1px solid #e5e7eb'};
  background: ${({ $primary }) => ($primary ? 'transparent' : '#ffffff')};
  padding: 6px 10px;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $primary }) => ($primary ? '#4b5563' : '#1f2937')};
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    background: #f3f4f6;
  }
`;

const ScopeBar = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: #f1f5f9;
  padding: 8px 12px;
`;

const ScopeLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #374151;
`;

const ScopeBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  padding: 4px 8px;
  font: inherit;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  svg {
    width: 14px;
    height: 14px;
  }
`;

const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 12px;
`;

const WelcomeCard = styled.div`
  position: relative;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

const DismissBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 4px;
  padding: 4px;
  color: #9ca3af;
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    background: #f3f4f6;
  }
`;

const SuggestedSection = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SuggestedLabel = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
`;

const SuggestedBtn = styled.button`
  width: 100%;
  border-radius: 9999px;
  border: 1px solid ${BRAND};
  background: transparent;
  padding: 8px 12px;
  text-align: left;
  font: inherit;
  font-size: 12px;
  line-height: 1.4;
  color: #1f2937;
  cursor: pointer;
  &:hover {
    background: #fff3ee;
  }
`;

const PanelFooter = styled.footer`
  flex-shrink: 0;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
  padding: var(--shell-action-bar-py, 0.75rem) var(--shell-action-bar-px, 1rem);
`;

const FooterActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 12px;
`;

const FooterActionBtn = styled.button<{ $brand?: boolean }>`
  border-radius: 6px;
  border: ${({ $brand }) => ($brand ? 'none' : '1px solid #d1d5db')};
  background: ${({ $brand }) => ($brand ? BRAND : '#ffffff')};
  padding: 6px 12px;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $brand }) => ($brand ? '#ffffff' : '#1f2937')};
  cursor: pointer;
  &:hover {
    opacity: 0.85;
  }
`;

const ChatInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 4px 4px 4px 12px;
`;

const ChatInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 14px;
  color: #111827;
  outline: none;
  &::placeholder {
    color: #9ca3af;
  }
`;

const SendBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: none;
  border-radius: 6px;
  background: ${BRAND};
  color: #ffffff;
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;
  }
`;

const DisclaimerText = styled.p`
  margin: 8px 0 0;
  font-size: 10px;
  line-height: 1.4;
  color: #9ca3af;
`;

export function Sidepanel() {
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--global-layout-dock-z-index',
      String(DEFAULT_DOCK_Z)
    );
    return () => {
      document.documentElement.style.removeProperty(
        '--global-layout-dock-z-index'
      );
    };
  }, []);

  return (
    <DockContainer
      id="sidepanel-container"
      style={{ zIndex: `clamp(10, var(--global-layout-dock-z-index, 10), 10)` }}
    >
      <PanelSlide $open={panelOpen} aria-hidden={!panelOpen}>
        {panelOpen && (
          <AssistPanelContent onClose={() => setPanelOpen(false)} />
        )}
      </PanelSlide>

      <DockNav aria-label="Ask AI">
        <RailButton
          type="button"
          $active={panelOpen}
          onClick={() => setPanelOpen((o) => !o)}
          aria-pressed={panelOpen}
          aria-expanded={panelOpen}
        >
          {panelOpen && <ActiveBar aria-hidden />}
          <span
            style={{
              display: 'flex',
              width: 24,
              height: 24,
              flexShrink: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ProcoreAIIcon />
          </span>
          <span
            style={{ maxWidth: '4rem', textAlign: 'center', lineHeight: 1.3 }}
          >
            Ask AI
          </span>
        </RailButton>
      </DockNav>
    </DockContainer>
  );
}

function AssistPanelContent({ onClose }: { onClose: () => void }) {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      <PanelHeader>
        <PanelHeaderLeft>
          <span
            style={{
              display: 'flex',
              width: 20,
              height: 20,
              flexShrink: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ProcoreAIIcon />
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#111827',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Ask AI
          </span>
        </PanelHeaderLeft>
        <PanelHeaderRight>
          <IconBtn type="button" aria-label="More options">
            <EllipsisVertical />
          </IconBtn>
          <IconBtn type="button" aria-label="Close Ask AI" onClick={onClose}>
            <Clear />
          </IconBtn>
        </PanelHeaderRight>
      </PanelHeader>

      <PanelToolbar>
        <ToolbarBtn type="button" $primary>
          <Plus />
          New
        </ToolbarBtn>
        <ToolbarBtn type="button">
          <Clock />
          History
        </ToolbarBtn>
        <ToolbarBtn type="button">
          <Megaphone />
          Feedback
        </ToolbarBtn>
      </PanelToolbar>

      <ScopeBar>
        <ScopeLabel>Procore help only</ScopeLabel>
        <ScopeBtn type="button">
          Details
          <ChevronDown />
        </ScopeBtn>
      </ScopeBar>

      <PanelBody>
        <WelcomeCard>
          <DismissBtn type="button" aria-label="Dismiss">
            <Clear />
          </DismissBtn>
          <h2
            style={{
              paddingRight: 24,
              margin: '0 0 8px',
              fontSize: 14,
              fontWeight: 600,
              color: '#111827',
            }}
          >
            How can I help you?
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.5,
              color: '#4b5563',
            }}
          >
            Ask about Procore tools, workflows, and settings. Responses are
            AI-assisted—verify important steps.
          </p>
          <button
            type="button"
            style={{
              marginTop: 8,
              background: 'none',
              border: 'none',
              padding: 0,
              font: 'inherit',
              fontSize: 12,
              fontWeight: 500,
              color: BRAND,
              cursor: 'pointer',
            }}
          >
            Learn more about Assist
          </button>
        </WelcomeCard>

        <SuggestedSection>
          <SuggestedLabel>Suggested questions</SuggestedLabel>
          {SUGGESTED.map((q) => (
            <SuggestedBtn key={q} type="button">
              {q}
            </SuggestedBtn>
          ))}
        </SuggestedSection>
      </PanelBody>

      <PanelFooter id="shell-panel-actions">
        <FooterActions>
          <FooterActionBtn type="button">Verb</FooterActionBtn>
          <FooterActionBtn type="button">Verb</FooterActionBtn>
          <FooterActionBtn type="button" $brand>
            Verb
          </FooterActionBtn>
        </FooterActions>
        <ChatInputRow>
          <ChatInput
            type="text"
            placeholder="Ask a question"
            aria-label="Ask a question"
          />
          <SendBtn type="button" aria-label="Send">
            <PaperAirplane />
          </SendBtn>
        </ChatInputRow>
        <DisclaimerText>
          AI-generated responses should be checked for accuracy.
        </DisclaimerText>
      </PanelFooter>
    </Box>
  );
}
