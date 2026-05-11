import { useNavigation } from '../../lib/navigation-context';
import {
  COMPANY_TOOL_MENU_COLUMNS,
  PROJECT_TOOL_MENU_COLUMNS,
} from '../../lib/tool-menu-placeholders';
import { MegaMenuPlaceholder } from './mega-menu-placeholder';

interface JumboMenuProps {
  type: 'company' | 'project';
  /** @deprecated Reserved for future active-tool highlighting */
  activeTool?: string;
  onClose?: () => void;
  className?: string;
}

export function JumboMenu({ type, onClose, className }: JumboMenuProps) {
  const { mode, currentProject } = useNavigation();
  const hasProject = mode === 'project' && currentProject != null;

  const columns =
    type === 'company' ? COMPANY_TOOL_MENU_COLUMNS : PROJECT_TOOL_MENU_COLUMNS;

  return (
    <MegaMenuPlaceholder
      columns={columns}
      light={hasProject}
      onClose={onClose}
      className={className}
    />
  );
}

export function CompanyJumboMenu(props: Omit<JumboMenuProps, 'type'>) {
  return <JumboMenu type="company" {...props} />;
}

export function ProjectJumboMenu(props: Omit<JumboMenuProps, 'type'>) {
  return <JumboMenu type="project" {...props} />;
}
