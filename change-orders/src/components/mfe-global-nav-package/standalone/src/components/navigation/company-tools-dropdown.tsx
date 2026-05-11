import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Box } from '@procore/core-react';
import { useShellPathname } from '../../lib/prototypeToolPaths';
import { CompanyJumboMenu, ProjectJumboMenu } from './jumbo-menu';
import { useNavigation } from '../../lib/navigation-context';
import { PROJECT_TOOLS, COMPANY_TOOLS } from '../../lib/tool-registry';
import { PickerCaret } from './PickerCaret';
import styled from 'styled-components';

const PickerBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  min-height: 40px;
  width: 100%;
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
  &[aria-expanded='true'] {
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
  max-width: 100px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.3;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
`;

export function CompanyToolsDropdown() {
  const pathname = useShellPathname();
  const { mode } = useNavigation();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const tools = mode === 'company' ? COMPANY_TOOLS : PROJECT_TOOLS;
  const currentToolId = Object.values(tools).find(
    (tool) => pathname === tool.path || pathname.startsWith(tool.path + '/')
  )?.id;
  const currentToolName = currentToolId
    ? tools[currentToolId]?.name
    : undefined;

  const menuContent =
    open && mounted
      ? createPortal(
          <Box
            ref={menuRef}
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              top: 52,
              zIndex: 1000,
              width: '100vw',
              maxWidth: '100vw',
            }}
          >
            {mode === 'company' ? (
              <CompanyJumboMenu
                activeTool={currentToolId}
                onClose={() => setOpen(false)}
              />
            ) : (
              <ProjectJumboMenu
                activeTool={currentToolId}
                onClose={() => setOpen(false)}
              />
            )}
          </Box>,
          document.body
        )
      : null;

  return (
    <>
      <PickerBtn
        ref={triggerRef}
        type="button"
        data-legacy-picker
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(!open)}
      >
        <PickerLabel>
          {mode === 'company' ? 'Company Tools' : 'Project Tools'}
        </PickerLabel>
        <PickerValueRow>
          <PickerValue>{currentToolName ?? 'Select Tool'}</PickerValue>
          <PickerCaret open={open} />
        </PickerValueRow>
      </PickerBtn>
      {menuContent}
    </>
  );
}
