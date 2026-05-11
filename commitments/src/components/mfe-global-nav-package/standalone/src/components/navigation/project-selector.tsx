import { useState, useRef } from 'react';
import {
  PROTOTYPE_TOOL_HUB_URL,
  PROTOTYPE_TOOL_HOME_URL,
  shellNavigate,
} from '../../lib/prototypeToolPaths';
import { Search, Building, Home } from '@procore/core-icons';
import { Box, Popover } from '@procore/core-react';
import styled from 'styled-components';
import { useNavigation } from '../../lib/navigation-context';
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
  max-width: 236px;
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
  max-width: 160px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DropdownPanel = styled.div`
  width: min(368px, calc(100vw - 2rem));
  max-height: min(70vh, 440px);
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

const SearchSection = styled.div`
  flex-shrink: 0;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px;
`;

const SearchInputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
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

const CompanySection = styled.div`
  flex-shrink: 0;
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
`;

const ProjectList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px;
`;

const ListItemBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
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
`;

const ItemIcon = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #f3f4f6;
  svg {
    width: 16px;
    height: 16px;
    color: #6b7280;
  }
`;

const StatusDot = styled.span<{ $color?: string }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1.5px solid #ffffff;
  background: ${({ $color }) => $color ?? '#111827'};
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export function ProjectSelector() {
  const overlayRef = useRef<OverlayTriggerRef>(null);
  const { mode, currentCompany, currentProject, projects, setCurrentProject } =
    useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectProject = (project: (typeof projects)[0]) => {
    setCurrentProject(project);
    setSearchQuery('');
    overlayRef.current?.hide();
    shellNavigate(PROTOTYPE_TOOL_HUB_URL);
  };

  const handleSelectCompany = () => {
    setCurrentProject(null);
    setSearchQuery('');
    overlayRef.current?.hide();
    shellNavigate(PROTOTYPE_TOOL_HOME_URL);
  };

  const displayLabel = currentCompany.name;
  const displayValue =
    mode === 'company'
      ? 'Select a Project'
      : (currentProject?.name ?? 'Select a Project');

  const panelContent = (
    <DropdownPanel>
      <SearchSection>
        <SearchInputWrap>
          <SearchIcon aria-hidden>
            <Search />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchInputWrap>
      </SearchSection>

      <CompanySection>
        <ListItemBtn
          $active={mode === 'company' && !currentProject}
          onClick={handleSelectCompany}
        >
          <ItemIcon>
            <Home />
            <StatusDot aria-hidden />
          </ItemIcon>
          <ItemInfo>
            <span style={{ fontWeight: 500 }}>{currentCompany.name}</span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              Company Level
            </span>
          </ItemInfo>
        </ListItemBtn>
      </CompanySection>

      <ProjectList>
        {filteredProjects.length === 0 ? (
          <Box
            style={{
              padding: '16px 12px',
              fontSize: 14,
              color: '#9ca3af',
              textAlign: 'center',
            }}
          >
            No projects found
          </Box>
        ) : (
          filteredProjects.map((project) => (
            <ListItemBtn
              key={project.id}
              $active={currentProject?.id === project.id}
              onClick={() => handleSelectProject(project)}
            >
              <ItemIcon>
                <Building />
                <StatusDot $color={project.statusColor} aria-hidden />
              </ItemIcon>
              <ItemInfo>
                <span
                  style={{
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {project.name}
                </span>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>
                  {project.status} • {project.location}
                </span>
              </ItemInfo>
            </ListItemBtn>
          ))
        )}
      </ProjectList>
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
        <PickerLabel>{displayLabel}</PickerLabel>
        <PickerValueRow>
          <PickerValue>{displayValue}</PickerValue>
          <PickerCaret open={false} />
        </PickerValueRow>
      </PickerBtn>
    </Popover>
  );
}
