import { useRef } from 'react';
import { shellNavigate, useShellPathname } from '../../lib/prototypeToolPaths';
import { Star } from '@procore/core-icons';
import { Popover } from '@procore/core-react';
import styled from 'styled-components';
import { useNavigation } from '../../lib/navigation-context';
import { getToolById } from '../../lib/tool-registry';
import { PickerCaret } from './PickerCaret';

interface OverlayTriggerRef {
  show: () => void;
  hide: () => void;
}

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
  max-width: 100px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DropdownPanel = styled.div`
  width: 256px;
  max-height: min(70vh, 360px);
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

const EmptyPanel = styled.div`
  padding: 16px;
  text-align: center;
  color: #6b7280;
  svg {
    width: 32px;
    height: 32px;
    color: #d1d5db;
    display: block;
    margin: 0 auto 8px;
  }
`;

const ToolList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px;
`;

const ToolRow = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: ${({ $active }) => ($active ? '#f3f4f6' : 'transparent')};
  color: ${({ $active }) => ($active ? '#111827' : '#4b5563')};
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  &:hover {
    background: #f9fafb;
    color: #111827;
  }
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const StarRemoveBtn = styled.button`
  display: flex;
  align-items: center;
  margin-left: auto;
  border: none;
  background: transparent;
  padding: 2px;
  border-radius: 4px;
  cursor: pointer;
  svg {
    width: 14px;
    height: 14px;
    color: #111827;
  }
  &:hover {
    background: #f3f4f6;
  }
`;

export function FavoriteToolsDropdown() {
  const pathname = useShellPathname();
  const overlayRef = useRef<OverlayTriggerRef>(null);
  const { favoriteTools, toggleFavorite, mode } = useNavigation();

  const favorites = favoriteTools
    .map((id) => getToolById(id))
    .filter(
      (t): t is NonNullable<ReturnType<typeof getToolById>> => t !== undefined
    )
    .filter((t) => t.context === mode);

  const currentFavorite = favorites.find(
    (t) => pathname === t.path || pathname.startsWith(t.path + '/')
  );

  const panelContent = (
    <DropdownPanel>
      {favorites.length === 0 ? (
        <EmptyPanel>
          <Star />
          <p style={{ margin: 0, fontSize: 14, color: '#4b5563' }}>
            No favorite tools yet
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9ca3af' }}>
            Star tools from the Tools menu to add them here
          </p>
        </EmptyPanel>
      ) : (
        <ToolList>
          {favorites.map((tool) => {
            const Icon = tool.icon;
            const isActive =
              pathname === tool.path || pathname.startsWith(tool.path + '/');
            return (
              <ToolRow
                key={tool.id}
                $active={isActive}
                onClick={() => {
                  shellNavigate(tool.path);
                  overlayRef.current?.hide();
                }}
              >
                <Icon
                  style={{ color: isActive ? '#111827' : '#9ca3af' }}
                  aria-hidden
                />
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tool.name}
                </span>
                <StarRemoveBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(tool.id);
                  }}
                  aria-label={`Remove ${tool.name} from favorites`}
                >
                  <Star />
                </StarRemoveBtn>
              </ToolRow>
            );
          })}
        </ToolList>
      )}
    </DropdownPanel>
  );

  return (
    <Popover
      overlay={
        <Popover.Content placement="bottom-left">
          {panelContent}
        </Popover.Content>
      }
      placement="bottom-left"
      trigger="click"
      overlayRef={overlayRef}
    >
      <PickerBtn type="button" data-legacy-picker>
        <PickerLabel>Favorite Tools</PickerLabel>
        <PickerValueRow>
          <PickerValue>{currentFavorite?.name ?? 'Select Tool'}</PickerValue>
          <PickerCaret open={false} />
        </PickerValueRow>
      </PickerBtn>
    </Popover>
  );
}
