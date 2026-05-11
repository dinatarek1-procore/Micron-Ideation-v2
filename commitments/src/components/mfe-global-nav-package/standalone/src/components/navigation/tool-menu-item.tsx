import { shellNavigate } from '../../lib/prototypeToolPaths';
import { Star, StarOff } from '@procore/core-icons';
import styled from 'styled-components';
import { useNavigation } from '../../lib/navigation-context';
import type { ToolDefinition } from '../../lib/tool-registry';

interface ToolMenuItemProps {
  tool: ToolDefinition;
  isActive?: boolean;
  onClick?: () => void;
  hasProject?: boolean;
  className?: string;
}

const ItemRow = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-width: 0;
  max-width: 248px;
  margin-bottom: 8px;
`;

const StarBtn = styled.button<{ $visible: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  padding-top: 2px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.15s;
  ${ItemRow}:hover & {
    opacity: 1;
  }
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ToolLink = styled.button<{ $active: boolean; $hasProject: boolean }>`
  margin-left: 4px;
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
  font: inherit;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: 0.25px;
  cursor: pointer;
  color: ${({ $active, $hasProject }) =>
    $hasProject
      ? $active
        ? '#232729'
        : '#707070'
      : $active
        ? '#ffffff'
        : '#acb5b9'};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  &:hover {
    color: ${({ $hasProject }) => ($hasProject ? '#232729' : '#ffffff')};
  }
`;

export function ToolMenuItem({
  tool,
  isActive = false,
  onClick,
  hasProject = true,
  className,
}: ToolMenuItemProps) {
  const { isFavorite, toggleFavorite } = useNavigation();
  const favorited = isFavorite(tool.id);

  const handleRowNavigate = () => {
    onClick?.();
    shellNavigate(tool.path);
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(tool.id);
  };

  return (
    <ItemRow className={className}>
      <StarBtn
        type="button"
        $visible={favorited}
        onClick={handleStarClick}
        aria-label={
          favorited
            ? `Remove ${tool.name} from favorites`
            : `Add ${tool.name} to favorites`
        }
        aria-pressed={favorited}
      >
        {favorited ? (
          <Star style={{ color: '#fecd0b' }} aria-hidden />
        ) : (
          <StarOff style={{ color: '#acb5b9' }} aria-hidden />
        )}
      </StarBtn>
      <ToolLink
        type="button"
        $active={isActive}
        $hasProject={hasProject}
        onClick={handleRowNavigate}
      >
        <span style={{ wordBreak: 'break-word' }}>{tool.name}</span>
      </ToolLink>
    </ItemRow>
  );
}
