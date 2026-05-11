import type { CSSProperties } from 'react';
import styled from 'styled-components';
import { ToolMenuItem } from './tool-menu-item';
import type {
  MenuSection as MenuSectionType,
  ToolDefinition,
} from '../../lib/tool-registry';

const MIN_WIDTH_TOOL_COLUMN = 248;

interface MenuSectionProps {
  section: MenuSectionType;
  tools: ToolDefinition[];
  activeTool?: string;
  onToolClick?: () => void;
  hasProject?: boolean;
  style?: CSSProperties;
  className?: string;
}

const SectionRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-bottom: 16px;
`;

const SectionLabel = styled.span<{ $hasProject: boolean }>`
  display: block;
  margin-bottom: 8px;
  margin-left: 28px;
  padding-bottom: 8px;
  white-space: nowrap;
  border-bottom: 1px solid
    ${({ $hasProject }) => ($hasProject ? '#dfdfde' : 'rgba(255,255,255,0.25)')};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: 0.15px;
  color: ${({ $hasProject }) => ($hasProject ? '#232729' : '#ffffff')};
`;

const ToolsGrid = styled.div<{ $multiCol: boolean }>`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  ${({ $multiCol }) => $multiCol && 'max-height: 320px;'}
`;

export function MenuSection({
  section,
  tools,
  activeTool,
  onToolClick,
  hasProject = true,
  style,
  className,
}: MenuSectionProps) {
  const columns = Math.ceil(tools.length / 10) || 1;
  const groupWidth = columns * MIN_WIDTH_TOOL_COLUMN;

  return (
    <SectionRoot className={className} style={style}>
      <SectionLabel $hasProject={hasProject}>{section.label}</SectionLabel>
      <ToolsGrid
        $multiCol={columns > 1}
        style={{ width: groupWidth, maxWidth: '100%' }}
      >
        {tools.map((tool) => (
          <ToolMenuItem
            key={tool.id}
            tool={tool}
            isActive={activeTool === tool.id}
            onClick={onToolClick}
            hasProject={hasProject}
          />
        ))}
      </ToolsGrid>
    </SectionRoot>
  );
}
