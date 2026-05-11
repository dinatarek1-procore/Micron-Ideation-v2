import React, {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

export type PersonOption = {
  id: string;
  label: string;
};

export type StatusOption = {
  id: string;
  label: string;
  color: string;
};

export type ItemGeneralSnapshot = {
  number: string;
  dueDate?: Date;
  rfiManager: PersonOption | null;
  status: StatusOption | null;
  receivedFrom: PersonOption | null;
  assignees: PersonOption[];
  distribution: PersonOption[];
  ballInCourtLabel: string;
  responsibleContractor: PersonOption | null;
  specSection: PersonOption | null;
  location: PersonOption | null;
  createdBy: string;
  subJob: PersonOption | null;
  dateInitiated?: Date;
  costCode: PersonOption | null;
  scheduleImpact: PersonOption | null;
  costImpact: PersonOption | null;
  reference: string;
  privateChecked: boolean;
};

export function formatSnapshotDate(date?: Date): string {
  if (!date) return '--';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const DEFAULT_SNAPSHOT: ItemGeneralSnapshot = {
  number: 'RFI-001',
  dueDate: new Date('2025-01-15'),
  rfiManager: { id: 'melissa', label: 'Melissa McCarthy' },
  status: { id: 'open', label: 'Open', color: 'blue' },
  receivedFrom: null,
  assignees: [
    {
      id: 'arthur',
      label: 'Arthur Vandelay (Art Vandelay Architecture & Planning)',
    },
  ],
  distribution: [],
  ballInCourtLabel: 'Assignees',
  responsibleContractor: null,
  specSection: null,
  location: null,
  createdBy: 'Tony Van Groningen',
  subJob: null,
  dateInitiated: new Date('2024-12-16'),
  costCode: null,
  scheduleImpact: null,
  costImpact: null,
  reference: '',
  privateChecked: false,
};

function clonePersonOption(option: PersonOption | null): PersonOption | null {
  return option ? { ...option } : null;
}

/** Deep-enough clone for default snapshot (Dates + nested option objects). */
function cloneItemGeneralSnapshot(
  source: ItemGeneralSnapshot
): ItemGeneralSnapshot {
  return {
    ...source,
    dueDate: source.dueDate ? new Date(source.dueDate.getTime()) : undefined,
    dateInitiated: source.dateInitiated
      ? new Date(source.dateInitiated.getTime())
      : undefined,
    rfiManager: clonePersonOption(source.rfiManager),
    status: source.status ? { ...source.status } : null,
    receivedFrom: clonePersonOption(source.receivedFrom),
    assignees: source.assignees.map((a) => ({ ...a })),
    distribution: source.distribution.map((a) => ({ ...a })),
    responsibleContractor: clonePersonOption(source.responsibleContractor),
    specSection: clonePersonOption(source.specSection),
    location: clonePersonOption(source.location),
    subJob: clonePersonOption(source.subJob),
    costCode: clonePersonOption(source.costCode),
    scheduleImpact: clonePersonOption(source.scheduleImpact),
    costImpact: clonePersonOption(source.costImpact),
  };
}

type ItemSnapshotContextValue = {
  snapshot: ItemGeneralSnapshot;
  setSnapshot: Dispatch<SetStateAction<ItemGeneralSnapshot>>;
};

const ItemSnapshotContext = createContext<ItemSnapshotContextValue | null>(
  null
);

export function ItemSnapshotProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [snapshot, setSnapshot] = useState<ItemGeneralSnapshot>(() =>
    cloneItemGeneralSnapshot(DEFAULT_SNAPSHOT)
  );
  return (
    <ItemSnapshotContext.Provider value={{ snapshot, setSnapshot }}>
      {children}
    </ItemSnapshotContext.Provider>
  );
}

export function useItemSnapshot(): ItemSnapshotContextValue {
  const ctx = useContext(ItemSnapshotContext);
  if (!ctx)
    throw new Error('useItemSnapshot must be used within ItemSnapshotProvider');
  return ctx;
}
