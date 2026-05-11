import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Search } from '@procore/core-icons';
import { Box, Popover } from '@procore/core-react';
import styled from 'styled-components';

interface OverlayTriggerRef {
  show: () => void;
  hide: () => void;
}

export interface GlobalSearchBarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SearchBarWrap = styled.div`
  display: flex;
  flex: 1.4;
  min-width: 0;
  max-width: 500px;
  margin: 0 4px;
`;

const SearchTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 180px;
  height: 32px;
  min-height: 32px;
  cursor: pointer;
  user-select: none;
  outline: none;
  border-radius: var(--border-radius-md, 6px);
  padding: 0 12px;
  font: inherit;
  font-size: 14px;
  font-weight: 400;
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    opacity: 0.9;
  }
`;

const KbdGroup = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 2px;
`;

const Kbd = styled.kbd`
  display: inline-flex;
  align-items: center;
  height: 22px;
  border: 0;
  background: transparent;
  padding: 0 4px;
  font-family: sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  box-shadow: none;
  pointer-events: none;
  user-select: none;
`;

const DropdownPanel = styled.div`
  width: min(500px, calc(100vw - 2rem));
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
`;

const SearchInputRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #9ca3af;
  svg {
    width: 16px;
    height: 16px;
    display: block;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 12px 8px 36px;
  font: inherit;
  font-size: 14px;
  color: #111827;
  outline: none;
  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    border-color: var(--color-border-input-focus, #4c85e6);
    box-shadow: 0 0 0 2px rgba(76, 133, 230, 0.15);
  }
`;

export function GlobalSearchBar({
  open: controlledOpen,
  onOpenChange,
}: GlobalSearchBarProps) {
  const overlayRef = useRef<OverlayTriggerRef>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchId = useId();

  const [isApple, setIsApple] = useState(false);
  useEffect(() => {
    setIsApple(
      typeof navigator !== 'undefined' &&
        /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent)
    );
  }, []);

  const handleOpen = useCallback(() => {
    overlayRef.current?.show();
    onOpenChange?.(true);
  }, [onOpenChange]);

  useEffect(() => {
    if (controlledOpen !== undefined) {
      if (controlledOpen) {
        overlayRef.current?.show();
      } else {
        overlayRef.current?.hide();
      }
    }
  }, [controlledOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleOpen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleOpen]);

  const panelContent = (
    <DropdownPanel>
      <SearchInputRow>
        <SearchIcon aria-hidden>
          <Search />
        </SearchIcon>
        <label
          htmlFor={`${searchId}-input`}
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
          }}
        >
          Global search
        </label>
        <SearchInput
          ref={inputRef}
          id={`${searchId}-input`}
          type="search"
          placeholder="Search projects, tools, and help…"
          autoComplete="off"
        />
      </SearchInputRow>
      <Box style={{ maxHeight: 256, overflowY: 'auto', padding: 8 }}>
        <p
          style={{
            margin: 0,
            padding: '12px 8px',
            textAlign: 'center',
            fontSize: 12,
            color: '#9ca3af',
          }}
        >
          Connect{' '}
          <code
            style={{
              borderRadius: 4,
              background: '#f3f4f6',
              padding: '1px 4px',
              fontSize: 11,
            }}
          >
            @procore/labs-procore-search
          </code>{' '}
          in the host app for full global search results.
        </p>
      </Box>
    </DropdownPanel>
  );

  return (
    <SearchBarWrap data-qa-id="navbar-global-search-bar">
      <Popover
        overlay={
          <Popover.Content placement="bottom">{panelContent}</Popover.Content>
        }
        placement="bottom"
        trigger="click"
        overlayRef={overlayRef}
      >
        <SearchTrigger
          type="button"
          data-global-search
          aria-expanded={controlledOpen ?? false}
          aria-controls={searchId}
          aria-label="Search across Procore"
        >
          <Search aria-hidden />
          <span
            className="global-search-placeholder"
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'left',
            }}
          >
            Search
          </span>
          <KbdGroup>
            <Kbd>{isApple ? '⌘' : 'Ctrl'}</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </SearchTrigger>
      </Popover>
    </SearchBarWrap>
  );
}
