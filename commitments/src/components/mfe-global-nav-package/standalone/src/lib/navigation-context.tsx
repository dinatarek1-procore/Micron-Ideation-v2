import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

export type NavigationMode = 'company' | 'project';

export interface Project {
  id: string;
  name: string;
  status: 'Planning' | 'Pre-Construction' | 'Construction' | 'Closeout';
  location: string;
  statusColor: string;
  companyName?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
}

export interface NavigationContextType {
  mode: NavigationMode;
  currentCompany: Company;
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  projects: Project[];
  favoriteTools: string[];
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  hasPermission: (toolId: string) => boolean;
}

export const DEFAULT_PROCORE_LOGO = '/procore-logo-thumbnail.png';

const DEFAULT_COMPANY: Company = {
  id: '1',
  name: 'Miller Design',
  logo: DEFAULT_PROCORE_LOGO,
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'burnham-park-dc',
    name: 'Burnham Park Data Center',
    status: 'Construction',
    location: 'Austin, TX',
    statusColor: '#f97316',
    companyName: 'Miller Design',
  },
  {
    id: 'gateway-office',
    name: 'Gateway Office Complex',
    status: 'Pre-Construction',
    location: 'Dallas, TX',
    statusColor: '#eab308',
    companyName: 'Miller Design',
  },
  {
    id: 'riverside-medical',
    name: 'Riverside Medical Center',
    status: 'Construction',
    location: 'Austin, TX',
    statusColor: '#f97316',
    companyName: 'Miller Design',
  },
  {
    id: 'burnham-park-planning',
    name: 'Burnham Park Phase 2',
    status: 'Planning',
    location: 'Houston, TX',
    statusColor: '#6366f1',
    companyName: 'Miller Design',
  },
  {
    id: 'metro-transit',
    name: 'Metro Transit Hub',
    status: 'Construction',
    location: 'San Antonio, TX',
    statusColor: '#f97316',
    companyName: 'Miller Design',
  },
];

const defaultNavigationValue: NavigationContextType = {
  mode: 'company',
  currentCompany: {
    id: 'default',
    name: 'Company',
    logo: DEFAULT_PROCORE_LOGO,
  },
  currentProject: null,
  setCurrentProject: () => {},
  projects: [],
  favoriteTools: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
  hasPermission: () => true,
};

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);
const SESSION_KEY_PROJECT = 'ngx_current_project';

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProjectState] = useState<Project | null>(
    null
  );
  const [favoriteTools, setFavoriteTools] = useState<string[]>([]);
  const mode: NavigationMode = currentProject ? 'project' : 'company';

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY_PROJECT);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Project;
        const match = DEFAULT_PROJECTS.find((p) => p.id === parsed.id);
        if (match) setCurrentProjectState(match);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('ngx_tool_favorites');
    if (stored) {
      try {
        setFavoriteTools(JSON.parse(stored));
      } catch {
        setFavoriteTools([]);
      }
    }
  }, []);

  const setCurrentProject = (project: Project | null) => {
    if (project) {
      sessionStorage.setItem(SESSION_KEY_PROJECT, JSON.stringify(project));
    } else {
      sessionStorage.removeItem(SESSION_KEY_PROJECT);
    }
    setCurrentProjectState(project);
  };

  const toggleFavorite = (toolId: string) => {
    setFavoriteTools((prev) => {
      const next = prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId];
      localStorage.setItem('ngx_tool_favorites', JSON.stringify(next));
      return next;
    });
  };

  return (
    <NavigationContext.Provider
      value={{
        mode,
        currentCompany: DEFAULT_COMPANY,
        currentProject,
        setCurrentProject,
        projects: DEFAULT_PROJECTS,
        favoriteTools,
        toggleFavorite,
        isFavorite: (toolId) => favoriteTools.includes(toolId),
        hasPermission: () => true,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextType {
  return useContext(NavigationContext) ?? defaultNavigationValue;
}
